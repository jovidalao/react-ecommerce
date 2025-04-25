import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useQueries, useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { CategoriesGetManyOutput } from "@/modules/categories/types";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    //data: CustomCategory[];
}

export const CategoriesSidebar = ({
    open,
    onOpenChange,
    // data,
}: Props) => {

    const trpc = useTRPC();
    const {data} = useQuery(trpc.categories.getMany.queryOptions());

    const router = useRouter();
    const [parentCategories, setParentCategories] = useState<CategoriesGetManyOutput | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<CategoriesGetManyOutput[1] | null>(null);
    const handleOpenChange = (change: boolean) => {
        setParentCategories(null);
        setSelectedCategory(null);
        onOpenChange(change);
    }

    // If we have parent categories, show those, otherwise show root categories
    const currentCategories = parentCategories ?? data ?? [];
    const handleBackClick = () => {
        setParentCategories(null);
        setSelectedCategory(null);
    }

    const handleCategoryClick = (category: CategoriesGetManyOutput[1]) => {
        if (category.subcategories && category.subcategories.length > 0) {
            setParentCategories(category.subcategories as CategoriesGetManyOutput);
            setSelectedCategory(category);
        } else {
            // This is a leaf category (no subcategories)
            if (parentCategories && selectedCategory) {
                // This is a subcategory - navigate to /category/subcategory
                router.push(`/${selectedCategory.slug}/${category.slug}`);
            } else if (category.slug === "all") {
                // This is the root category - navigate to /
                router.push("/");
            } else {
                router.push(`/${category.slug}`);
            }
            handleOpenChange(false);
        }
    }

    const backgroundColor = selectedCategory?.color || "white";

    return (
        <Sheet open={open} onOpenChange={handleOpenChange}>
            <SheetContent
                side="left"
                className="p-0 transition-none"
                
            >
                <SheetHeader className="p-6 border-b" style={{ backgroundColor }}>
                    <SheetTitle>
                        Categories
                    </SheetTitle>
                </SheetHeader>
                <ScrollArea className="flex flex-col overflow-y-auto h-full"
                >
                    {
                        parentCategories && (
                            <button
                                onClick={() => handleBackClick()
                                }
                                className="w-full text-left p-4 hover:bg-black hover:text-white flex items-center text-base font-medium">
                                <ChevronLeftIcon
                                    className="size-4 mr-2" />
                                Back
                            </button>
                        )
                    }
                    {currentCategories.map((category) => (
                        <button
                            onClick={() => handleCategoryClick(category)}
                            key={category.slug}
                            className="w-full text-left p-4 hover:bg-black hover:text-white flex 
                        justify-between items-center text-base font-medium">
                            {category.name}
                            {category.subcategories && category.subcategories.length > 0 && (
                                <ChevronRightIcon className="size-4" />
                            )}
                        </button>
                    ))}
                </ScrollArea>

            </SheetContent>
        </Sheet>
    )
}