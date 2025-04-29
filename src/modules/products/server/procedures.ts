// 导入 Category 类型定义，用于类型转换和类型安全
// 该类型定义来自于 payload-types，包含了分类模型的所有字段和关系
import { Category } from "@/payload-types";

// 导入 tRPC 基础工具
// - baseProcedure: 基础过程定义，提供了输入验证和上下文处理的能力
// - createTRPCRouter: 创建 tRPC 路由器的工厂函数，用于组织相关的查询和变更
import { baseProcedure, createTRPCRouter } from "@/trpc/init";

// 导入 Payload CMS 的 Where 类型
// 用于构建数据库查询条件，支持复杂的过滤逻辑
import type { Where } from "payload";

// 导入 Zod 库，用于运行时数据验证
// 提供类型安全的输入验证，确保传入的参数符合预期格式
import { z } from "zod";

// 产品相关的 tRPC 路由定义
// 包含了与产品数据获取相关的所有查询和操作
export const productsRouter = createTRPCRouter({
  // getMany 查询 - 获取多个产品
  // 
  // 该查询支持按分类筛选产品，可以返回指定分类及其子分类下的所有产品
  getMany: baseProcedure
    // 定义输入参数的验证规则
    // 使用 Zod 库验证输入对象：
    // - category: 可选的字符串参数，可以为 null，用于按分类筛选产品
    .input(
      z.object({
        category: z.string().nullable().optional(),
      }),
    )
    // 实现查询逻辑
    // @param ctx - tRPC 上下文，包含数据库访问对象等
    // @param input - 经过验证的输入参数
    // @returns 产品数据列表 Promise
    .query(async ({ ctx, input }) => {
      // 初始化查询条件对象，默认为空（不设限制条件）
      const where: Where = {};
      
      // 如果提供了分类参数，则构建基于分类的筛选条件
      if (input.category) {
        // 查询指定 slug 的分类数据
        // - collection: 指定查询的集合为"categories"
        // - limit: 1，仅返回一个结果，因为 slug 应该是唯一的
        // - depth: 1，填充一级关联数据，这里是为了获取子分类信息
        // - where: 查询条件，基于 slug 精确匹配
        const categoriesData = await ctx.db.find({
          collection: "categories",
          limit: 1,
          depth: 1, // 填充"subcategories"关联数据
          where: {
            slug: {
              equals: input.category,
            },
          },
        });
        // 处理查询结果，格式化分类数据
        // 将原始查询结果转换为更易处理的格式：
        // 1. 保留分类的所有原始属性
        // 2. 处理子分类数据，移除不必要的嵌套子分类
        const formattedData = categoriesData.docs.map((doc) => ({
          ...doc,
          subcategories: (doc.subcategories?.docs ?? []).map((doc) => ({
            ...(doc as Category), // 将文档转换为 Category 类型
            subcategories: undefined, // 清除更深层级的子分类，防止数据过于复杂
          })),
        }));

        // 初始化子分类 slug 数组，用于后续构建查询条件
        const subcategoriesSlugs = [];
        // 获取父分类（假设只有一个匹配结果）
        const parentCategory = formattedData[0];

        // 如果找到了匹配的父分类
        if (parentCategory) {
          // 提取所有子分类的 slug 并添加到数组中
          subcategoriesSlugs.push(
            ...parentCategory.subcategories.map(
              (subcategory) => subcategory.slug,
            ),
          );
        }
        
        // 构建产品查询条件
        // 
        // 通过 "category.slug" 字段匹配：
        // 1. 父分类的 slug
        // 2. 所有子分类的 slug
        // 
        // 这样可以同时查询到直接属于该分类的产品和属于其子分类的产品
        where["category.slug"] = {
          in: [parentCategory.slug, ...subcategoriesSlugs],
        };
      }

      // 执行产品查询
      // 
      // - collection: 指定查询的集合为"products"
      // - where: 应用之前构建的查询条件
      // - depth: 1，填充一级关联数据，包括分类和图片信息
      const data = await ctx.db.find({
        collection: "products",
        where,
        depth: 1, // 填充"category"和"image"关联数据
      });

      // 返回查询到的产品数据
      return data;
    }),
});
