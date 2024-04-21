import { redirect } from "next/navigation";

import { authOptions } from "@/server/auth"; // FIXME: I don't like this
import { getCurrentUser } from "@/lib/session";
import { DashboardHeader } from "@/components/header";
import { DashboardShell } from "@/components/shell";
import { DashboardButton } from "./temp-dashboard-clientside";

export const metadata = {
	title: "Dashboard",
};

export default async function DashboardPage() {
	const user = await getCurrentUser();

	if (!user) {
		redirect(authOptions?.pages?.signIn || "/login");
	}

	return (
		<DashboardShell>
			<DashboardHeader heading="Posts" text="Create and manage posts.">
				<DashboardButton />
			</DashboardHeader>
			<div>Lekan</div>
		</DashboardShell>
	);
}
