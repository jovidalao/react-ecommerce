"use client";

import { usePathname } from "next/navigation";
import { Poppins } from "next/font/google";
import Link from "next/link";
import { useState } from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { NavbarSidebar } from "./navbar-sidebar";
import { MenuIcon } from "lucide-react";

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["700"]
})

interface NavbarItemProps {
    href: string;
    children: React.ReactNode;
    isActive?: boolean;
}

const NavbarItem = ({
    href,
    children,
    isActive,
}: NavbarItemProps) => {
    return (
        <Button asChild variant="outline"
            className={cn(
                "bg-transparent hover:bg-transparent rounded-full hover:border-primary border-transparent px-3.5 text-lg",
                isActive && "bg-black text-white hover:bg-black hover:text-white",
            )}
        >
            <Link href={href}>
                {children}
            </Link>
        </Button>

    );
};

const navbarItems = [
    { href: "/", children: "Home", isActive: true },
    { href: "/about", children: "About" },
    { href: "/features", children: "Features" },
    { href: "/pricing", children: "Pricing" },
    { href: "/contact", children: "Contact" },
];

export const Navbar = () => {
    const pathname = usePathname();
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    return (
        <nav className="flex justify-between bg-white h-20 border-b font-medium">
            <NavbarSidebar open={isSidebarOpen}
                onOpenChange={setSidebarOpen} items={navbarItems} />
            <Link href="/" className="pl-6 flex items-center">
                <span className={cn("text-5xl font-semibold", poppins.className)}>
                    Shopping
                </span>
            </Link>

            <div className="hidden lg:flex ml-5 items-center gap-4 pr-6">
                {navbarItems.map((item) => (
                    <NavbarItem
                        key={item.href}
                        href={item.href}
                        isActive={pathname === item.href}
                    >{item.children}</NavbarItem>
                ))}
            </div>
            <div className="flex lg:flex">
                <Button
                    asChild
                    variant={"secondary"}
                    className="hidden lg:flex border-l border-t-0 border-b-0 px-12 h-full rounded-none bg-white hover:bg-pink-400 transition-colors text-lg text-black">
                    <Link href="/login">
                        Login
                    </Link>
                </Button>
                <Button
                    variant={"secondary"} className="hidden lg:flex border-l border-t-0 border-b-0 px-12 h-full rounded-none bg-black hover:bg-pink-400 transition-colors text-lg hover:text-black text-white">
                    <Link href="/selling">
                        Start Selling
                    </Link>
                </Button>
                <div className="flex lg:hidden items-center justify-center">
                    <Button
                        variant="ghost"
                        className="size-12 border-transparent bg-white"
                        onClick={() => setSidebarOpen(!isSidebarOpen)}
                    >
                        <MenuIcon />
                    </Button>
                </div>
            </div>

        </nav>

    );
}