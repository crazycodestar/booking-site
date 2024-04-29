import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { MainNav } from "@/components/main-nav";
import { DashboardNav } from "@/components/nav";
import { SiteFooter } from "@/components/site-footer";
import { UserAccountNav } from "@/components/user-account-nav";
import { UserBookingForm } from "@/components/user-booking-form";
import { Card } from "@/components/ui/card";

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
			title: "Create Booking",
			href: "/home",
			// icon: "post",
		},
		{
			title: "My Bookings",
			href: "/home/mybookings",
			// icon: "billing",
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
			<header className="sticky top-0 z-40 bg-background">
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
			<div className="py-6">
				<h1 className="text-3xl font-bold text-center text-foreground">
					Let&apos;s help you find a room. <br /> Choose a room that suites your
					taste
				</h1>
			</div>

			<div className="container hidden md:block">
				<UserBookingForm user={user} />
			</div>
			<div className="container flex flex-col lg:grid lg:grid-cols-5 gap-4">
				<aside className="lg:col-span-1 lg:block">
					<DashboardNav items={dashboardConfig.sidebarNav} />
				</aside>
				<main className="w-full col-span-5 lg:col-span-4">{children}</main>
			</div>
			<SiteFooter className="border-t" />
		</div>
	);
}
