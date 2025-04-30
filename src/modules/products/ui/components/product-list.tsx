"use client" // 标记为客户端组件，允许使用React hooks和客户端交互功能

import { useTRPC } from "@/trpc/client"
import { useSuspenseQuery } from "@tanstack/react-query";

// 产品列表组件的Props接口
// @interface Props
// @property {string} [category] - 可选的分类筛选参数
interface Props {
    category?: string;
}

// 产品列表组件
// 
// 负责从API获取并展示产品数据，可根据分类进行筛选
// 使用tRPC进行类型安全的API调用，结合React Query管理数据获取状态
// 
// @param {Props} props - 组件属性，包含可选的分类参数
// @returns {JSX.Element} 渲染的产品列表
export const ProductList = ({ category }: Props) => {
    // 获取tRPC客户端实例，用于调用后端API
    const trpc = useTRPC();

    // 使用Suspense模式的React Query钩子获取产品数据
    // 当数据加载时会自动挂起组件，配合外层Suspense组件显示加载状态
    const { data } = useSuspenseQuery(trpc.products.getMany.queryOptions({ category }));

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
            {data?.docs.map((product) => (
                <div key={product.id} className="border rounded-md bg-white">
                    <h2 className="text-xl font-medium">{product.name}</h2>
                    <p className="">${product.price}</p>
                </div>
            ))}
        </div>
    )
}

// 产品列表加载骨架屏组件
// 
// 在数据加载过程中显示，提供更好的用户体验
// 
// @returns {JSX.Element} 加载状态的UI展示
export const ProductListSkeleton = () => {
    return (
        <div>
            loading...
        </div>
    )
}