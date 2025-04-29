import { ProductList, ProductListSkeleton } from "@/modules/products/ui/components/product-list";
import { getQueryClient, trpc } from "@/trpc/server";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { Suspense } from "react";

// 页面组件的Props接口
// @interface Props
// @property {Promise<{subcategory: string}>} params - 路由参数，包含子分类名称
interface Props {
    params: Promise<{
        subcategory: string;
    }>
}

// 子分类产品页面组件
// 
// 这是一个Next.js的服务端组件，负责展示特定子分类下的所有产品
// 通过动态路由参数获取子分类信息，并预取相关产品数据
// 
// @param {Props} props - 包含路由参数的属性对象
// @returns {JSX.Element} 渲染的页面内容
const Page = async ({ params }: Props) => {
    // 解构并等待异步params对象，获取subcategory参数
    const { subcategory } = await params;

    // 获取查询客户端实例
    const queryClient = getQueryClient();
    
    // 在服务端预取产品数据，提高页面加载性能
    // void操作符表示我们不关心Promise的返回值
    void queryClient.prefetchQuery(trpc.products.getMany.queryOptions({
        category: subcategory,
    }));

    return (
        // HydrationBoundary组件确保服务端预取的数据能在客户端被正确"水合"(hydrate)
        // dehydrate函数将查询客户端的缓存状态序列化，以便传递到客户端
        <HydrationBoundary state={dehydrate(queryClient)}>
            {/* Suspense组件提供加载状态的优雅处理 */}
            <Suspense fallback={<ProductListSkeleton />}>
                {/* 产品列表组件，传入当前子分类作为筛选条件 */}
                <ProductList category={subcategory} />
            </Suspense>
        </HydrationBoundary>
    )
}

export default Page;