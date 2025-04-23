import { Category } from "@/payload-types";
import { CategoryDropdown } from "./category-dropdown";
interface Props {
    data: any;
}

export const Categories = ({ data }: Props) => {
    // 添加空数据或无效数据检查
    if (!Array.isArray(data)) {
        console.error("Categories component received invalid data:", data);
        return null; // 或者显示错误/空状态
    }

    return (
        <div className="relative w-full">
            <div className="flex flex-nowrap items-center">
                {data.map((category: Category) => (
                    <div key={category.id}>
                        <CategoryDropdown
                            category={category}
                            isActive={false}
                            isNavigationHover={false}
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}