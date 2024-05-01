import { redirect } from "next/navigation";

import { authOptions } from "@/server/auth"; // FIXME: I don't like this
import { getCurrentUser } from "@/lib/session";
import { DashboardHeader } from "@/components/header";
import { DashboardShell } from "@/components/shell";
import { RoomTablePreview } from "@/components/rooms-table-preview";
import { BookingTablePreview } from "@/components/booking-table-preview";
import { BookingForm } from "@/components/booking-form";
import { ActivateBookingForm } from "@/components/activate-booking-form";

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
			<DashboardHeader
				heading="Booking Dashboard"
				text="Create and manage bookings."
			>
				<div className="flex flex-col sm:flex-row gap-4">
					<BookingForm isAdminPage isAdmin={isAdmin} userId={user.id} />
					{isAdmin && (
						<>
							{/* <SeatForm /> */}
							<ActivateBookingForm />
						</>
					)}
				</div>
			</DashboardHeader>
			<BookingTablePreview />
			{isAdmin && <RoomTablePreview />}
		</DashboardShell>
	);
}
