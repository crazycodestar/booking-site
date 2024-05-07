"use client";

import { ColumnDef } from "@tanstack/react-table";
import { GetBookingResponseSchema } from "@/lib/validations/booking";
import { CancelBookingButton } from "@/components/cancel-booking-button";
import { formatTime } from "@/lib/time-functions";

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

		cell: ({ cell }) => formatTime(new Date(cell.getValue() as string)),
	},
	{
		accessorKey: "exitTime",
		header: "Exit Time",
		cell: ({ cell }) => formatTime(new Date(cell.getValue() as string)),
	},
	{
		accessorKey: "room",
		header: "Room No",
	},
	{
		accessorKey: "status",
		header: "Status",
	},
	{
		id: "actions",
		cell: ({ row }) => {
			const bookingCode = row.getValue("code") as string;
			return <CancelBookingButton bookingCode={bookingCode} />;
		},
	},
];
