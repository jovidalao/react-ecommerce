"use client"
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Category } from "@/payload-types";
import { use, useRef, useState } from "react";
import { useDropdownPosition } from "./use-dropdown-position";
import { SubcategoryMenu } from "./subcategory-menu";

interface Props {
    category: Category;
    isActive?: boolean;
    isNavigationHover?: boolean;
};

export const CategoryDropdown = ({
    category,
    isActive,
    isNavigationHover
}: Props
) => {

    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { getDropdownPosition } = useDropdownPosition(dropdownRef);

    const dropdownPosition = getDropdownPosition();

    const onMouseEnter = () => {
        if (category.subcategories) {
            setIsOpen(true);
        }
    }
    const onMouseLeave = () => {
        setIsOpen(false);
    }
    return (
        <div className="relative"
            ref={dropdownRef}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}>
            <div className="relative mx-2">
                <Button variant={'elevated'}
                    className={cn(
                        "h-11 bg-transparent border-transparent rounded-full hover:bg-white hover:border-primary text-black",
                        isActive && !isNavigationHover && "bg-white border-primary"
                    )}>
                    {category.name}
                </Button>
                {category.subcategories && category.subcategories.length > 0 && (
                    <div className={cn(
                        "opacity-0 absolute -bottom-3 w-0 h-0 border-l-[10px] border-r-[10px] border-l-transparent  border-r-transparent border-b-[10px] border-b-black left-1/2 -translate-x-1/2",
                        isOpen && "opacity-100"
                    )}
                    />
                )}
                <SubcategoryMenu
                    isOpen={isOpen}
                    position={dropdownPosition}
                    category={category}
                />

            </div>
        </div>
    )

}