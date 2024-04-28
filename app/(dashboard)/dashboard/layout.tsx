import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { MainNav } from "@/components/main-nav";
import { DashboardNav } from "@/components/nav";
import { SiteFooter } from "@/components/site-footer";
import { UserAccountNav } from "@/components/user-account-nav";

export type NavItem = {
	title: string;
	href: string;
	disabled?: boolean;
};

export type MainNavItem = NavItem;

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

export type DashboardConfig = {
	mainNav: MainNavItem[];
	sidebarNav: SidebarNavItem[];
};

export const dashboardConfig: DashboardConfig = {
	mainNav: [
		{
			title: "Documentation",
			href: "/docs",
		},
		{
			title: "Support",
			href: "/support",
			disabled: true,
		},
	],
	sidebarNav: [
		{
			title: "Posts",
			href: "/dashboard",
			// icon: "post",
		},
		{
			title: "Billing",
			href: "/dashboard/billing",
			// icon: "billing",
		},
		{
			title: "Settings",
			href: "/dashboard/settings",
			// icon: "settings",
		},
	],
};

interface DashboardLayoutProps {
	children?: React.ReactNode;
}

export default async function DashboardLayout({
	children,
}: DashboardLayoutProps) {
	const user = await getCurrentUser();

	if (!user) {
		return notFound();
	}

	return (
		<div className="flex min-h-screen flex-col space-y-6">
			<header className="sticky top-0 z-40 border-b bg-background">
				<div className="container flex h-16 items-center justify-between py-4">
					<MainNav />
					<UserAccountNav
						user={{
							name: user.name,
							image: user.image,
							email: user.email,
						}}
					/>
				</div>
			</header>
			<div className="container max-w-[1024px]">
				<main className="flex w-full flex-1 flex-col overflow-hidden">
					{children}
				</main>
			</div>
			<SiteFooter className="border-t" />
		</div>
	);
}
