"use client"
import { CategoryDropdown } from "./category-dropdown";
import { use, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ListFilterIcon } from "lucide-react";
import { CategoriesSidebar } from "./categories-sidebar";
import { CategoriesGetManyOutput } from "@/modules/categories/types";
interface Props {
    data: CategoriesGetManyOutput;
}

export const Categories = ({ data }: Props) => {

    const containerRef = useRef<HTMLDivElement>(null);
    const measureRef = useRef<HTMLDivElement>(null);
    const viewAllRef = useRef<HTMLButtonElement>(null);
    const [visibleCount, setVisibleCount] = useState(data.length);
    const [isAnyHoverd, setIsAnyHovered] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const activeCategory = "all";
    const activeCategoryIndex = data.findIndex((category) => category.slug === activeCategory);
    const isActiveCategoryHidden = activeCategoryIndex >= visibleCount && activeCategoryIndex !== -1;

    useEffect(() => {
        const calculateVisible = () => {
            if (!containerRef.current || !measureRef.current || !viewAllRef.current) {
                return;
            }
            const containerWidth = containerRef.current.offsetWidth;
            const viewAllWidth = viewAllRef.current.offsetWidth;
            const availableWidth = containerWidth - viewAllWidth;

            const items = Array.from(measureRef.current.children);
            let totalWidth = 0;
            let visible = 0;

            for (const item of items) {
                const width = item.getBoundingClientRect().width;
                totalWidth += width;
                if (totalWidth > availableWidth) {
                    break;
                }
                visible++;
            }
            setVisibleCount(visible);
        };

        const resizeObserver = new ResizeObserver(calculateVisible);
        resizeObserver.observe(containerRef.current!);

        return () => resizeObserver.disconnect();
    }, [data]);

    // 添加空数据或无效数据检查
    if (!Array.isArray(data)) {
        console.error("Categories component received invalid data:", data);
        return null; // 或者显示错误/空状态
    }

    return (
        <div className="relative w-full">
            {/* Categories sidebar */}
            <CategoriesSidebar open={isSidebarOpen} onOpenChange={setIsSidebarOpen}
            />

            {/* Hidden div to measure all items */}
            <div ref={measureRef} className="absolute opacity-0 pointer-events-none flex" style={{ position: "fixed", top: -9999, left: -9999 }}>
                {data.map((category) => (
                    <div key={category.id}>
                        <CategoryDropdown
                            category={category}
                            isActive={activeCategory === category.slug}
                            isNavigationHover={false}
                        />
                    </div>
                ))}
            </div>
            {/* Visible items */}
            <div className="flex flex-nowrap items-center"
                ref={containerRef}
                onMouseEnter={() => setIsAnyHovered(true)}
                onMouseLeave={() => setIsAnyHovered(false)}>
                {data.slice(0, visibleCount).map((category) => (
                    <div key={category.id}>
                        <CategoryDropdown
                            category={category}
                            isActive={activeCategory === category.slug}
                            isNavigationHover={false}
                        />
                    </div>
                ))}
                <div>
                    <Button
                        ref={viewAllRef}
                        className={cn(
                            "h-11 bg-transparent border-transparent rounded-full hover:bg-white hover:border-primary text-black mr-0",
                            isActiveCategoryHidden && !isAnyHoverd && "bg-white border-primary")}
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                        View All
                        <ListFilterIcon className="ml-2" />
                    </Button>
                </div>
            </div>
        </div>
    )
}