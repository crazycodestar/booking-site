"use client";

import { formatTime } from "@/lib/time-functions";
import { GetBookingResponseSchema } from "@/lib/validations/booking";

interface BookingTicketProps {
	bookingDetails: GetBookingResponseSchema[number];
}

export const BookingTicket = ({ bookingDetails }: BookingTicketProps) => {
	return (
		<div className="grid gap-4">
			{/* TODO: isLoading ? loading */}
			<div className="grid grid-cols-2 gap-1.5 text-sm">
				<div className="grid gap-0.5">
					<div className="text-muted-foreground">Code</div>
					<div className="font-medium">{bookingDetails.code}</div>
				</div>
				<div className="grid gap-0.5">
					<div className="text-muted-foreground">Room No</div>
					<div className="font-medium">{bookingDetails.room}</div>
				</div>
			</div>
			<div className="grid grid-cols-2 gap-1.5 text-sm">
				<div className="grid gap-0.5">
					<div className="text-muted-foreground">Entry time</div>
					<div className="font-medium">
						{formatTime(bookingDetails.entryTime)}
					</div>
				</div>
				<div className="grid gap-0.5">
					<div className="text-muted-foreground">Exit time</div>
					<div className="font-medium">
						{formatTime(bookingDetails.exitTime)}
					</div>
				</div>
			</div>
		</div>
	);
};
