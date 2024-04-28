"use client";

import { ColumnDef } from "@tanstack/react-table";
import { GetBookingResponseSchema } from "@/lib/validations/booking";
import { CancelBookingButton } from "@/components/cancel-booking-button";

export const bookingColumns: ColumnDef<GetBookingResponseSchema[number]>[] = [
	{
		accessorKey: "name",
		header: "Name",
	},
	{
		accessorKey: "code",
		header: "Code",
	},
	{
		accessorKey: "entryTime",
		header: "Entry Time",
	},
	{
		accessorKey: "exitTime",
		header: "Exit Time",
	},
	{
		accessorKey: "seat",
		header: "Seat No",
	},
	{
		accessorKey: "status",
		header: "Status",
	},
	{
		id: "actions",
		cell: ({ row }) => {
			const bookingCode = row.getValue("name") as string;

			return <CancelBookingButton bookingCode={bookingCode} />;
		},
	},
];
