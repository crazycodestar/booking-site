"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { HelpCircle, LucideIcon } from "lucide-react";
import { Card } from "@nextui-org/react";
import { ReactElement, ReactNode } from "react";

export type SidebarNavItem = {
	title: string;
	disabled?: boolean;
	external?: boolean;
} & (
	| {
			href: string;
			items?: never;
	  }
	| {
			href?: string;
	  }
);

interface DashboardNavProps {
	items: SidebarNavItem[];
}

export function DashboardNav({ items }: DashboardNavProps) {
	const path = usePathname();

	if (!items?.length) {
		return null;
	}

	return (
		<nav className="border rounded-md w-full lg:h-full lg:min-h-[600px] p-4">
			<div className="flex lg:grid items-start gap-2">
				{items.map((item, index) => {
					item;
					// const Icon = item.Icon;
					return (
						item.href && (
							<Link key={index} href={item.disabled ? "/" : item.href}>
								<span
									className={cn(
										"group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
										path === item.href ? "bg-accent" : "transparent",
										item.disabled && "cursor-not-allowed opacity-80"
									)}
								>
									{/* <Icon className="mr-2 h-4 w-4" /> */}
									<span>{item.title}</span>
								</span>
							</Link>
						)
					);
				})}
			</div>
		</nav>
	);
}
