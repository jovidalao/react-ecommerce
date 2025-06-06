"use client"
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { BookmarkCheckIcon, ListFilterIcon, SearchIcon } from "lucide-react";
import { CategoriesSidebar } from "./categories-sidebar";
import { Button } from "@/components/ui/button";
import { useSession } from "@/hooks/use-session";
import Link from "next/link";

interface Props {
    disable?: boolean;
};

export const SearchInput = ({ disable }: Props) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const session = useSession();

    return (
        <div className="flex items-center gap-2 w-full">
            <CategoriesSidebar open={isSidebarOpen} onOpenChange={setIsSidebarOpen} />
            <div className="relative w-full">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-500" />
                <Input className="pl-8" placeholder="Search Products" disabled={disable} />
            </div>
            {/* TODO: Add categories view all button */}
            <Button variant={"elevated"}
                className="size-12 shrink-0 flex lg:hidden"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                <ListFilterIcon className="size-4" />
            </Button>
            {session.data?.user && (
                <Button
                    asChild
                    variant={"elevated"}>
                    <Link href={"/library"}>
                        <BookmarkCheckIcon />
                        Library
                    </Link>
                </Button>
            )}
        </div>
    )
}