"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { GetUserResponseSchema } from "@/lib/validations/auth";

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
	const { data, isLoading } = useQuery({
		queryKey: ["account"],
		queryFn: async () =>
			await fetch("../api/account").then((res) => res.json()),
	});

	const formattedUserScore = data
		? GetUserResponseSchema.parse(data).score
		: "loading";

	const path = usePathname();

	if (!items?.length) {
		return null;
	}

	return (
		<nav className="border rounded-md w-full lg:h-full lg:min-h-[600px] p-4">
			<div className="flex lg:grid gap-2 items-center">
				<div className="flex justify-between py-4 px-2 gap-2">
					<h3 className="text-primary text-medium font-bold">
						Booking Credit Score
					</h3>
					<p>{formattedUserScore}</p>
				</div>
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
