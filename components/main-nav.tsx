"use client";

import * as React from "react";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/logo";

export type NavItem = {
	title: string;
	href: string;
	disabled?: boolean;
};

interface MainNavProps {
	items?: NavItem[];
}

export function MainNav({ items }: MainNavProps) {
	const segment = useSelectedLayoutSegment();

	return (
		<div className="flex gap-6 md:gap-10">
			<Link href="/" className="items-center space-x-2 flex">
				<Logo />
				<span className="font-bold inline-block">{siteConfig.name}</span>
			</Link>
			{items?.length ? (
				<nav className="gap-6 flex">
					{items?.map((item, index) => (
						<Link
							key={index}
							href={item.disabled ? "#" : item.href}
							className={cn(
								"flex items-center text-lg font-medium transition-colors hover:text-foreground/80 sm:text-sm",
								item.href.startsWith(`/${segment}`)
									? "text-foreground"
									: "text-foreground/60",
								item.disabled && "cursor-not-allowed opacity-80"
							)}
						>
							{item.title}
						</Link>
					))}
				</nav>
			) : null}
		</div>
	);
}
