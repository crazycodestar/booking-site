import { redirect } from "next/navigation";

import { authOptions } from "@/server/auth"; // FIXME: I don't like this
import { getCurrentUser } from "@/lib/session";
import { DashboardHeader } from "@/components/header";
import { DashboardShell } from "@/components/shell";
import { SeatForm } from "@/components/seat-form";
import { SeatTablePreview } from "@/components/seats-table-preview";
import { BookingTablePreview } from "@/components/booking-table-preview";
import { BookingForm } from "@/components/booking-form";
import { ActivateBookingForm } from "@/components/activate-booking-form";
import axios, { AxiosError } from "axios";

export const metadata = {
	title: "Dashboard",
};

export default async function DashboardPage() {
	const user = await getCurrentUser();

	if (!user) {
		redirect(authOptions?.pages?.signIn || "/login");
	}

	const isAdmin = user.role === "ADMIN";

	return (
		<DashboardShell>
			<DashboardHeader heading="Posts" text="Create and manage posts.">
				<div className="flex flex-col sm:flex-row gap-4 sm:gap-2">
					<BookingForm isAdmin={isAdmin} userId={user.id} />
					{isAdmin && (
						<>
							<SeatForm />
							<ActivateBookingForm />
						</>
					)}
				</div>
			</DashboardHeader>
			<BookingTablePreview />
			{isAdmin && <SeatTablePreview />}
		</DashboardShell>
	);
}
