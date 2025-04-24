import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { CustomCategory } from "../types";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { set } from "date-fns";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    data: CustomCategory[];
}

export const CategoriesSidebar = ({
    open,
    onOpenChange,
    data,
}: Props) => {
    const router = useRouter();
    const [parentCategories, setParentCategories] = useState<CustomCategory[] | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<CustomCategory | null>(null);
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

    const handleCategoryClick = (category: CustomCategory) => {
        if (category.subcategories && category.subcategories.length > 0) {
            setParentCategories(category.subcategories as CustomCategory[]);
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