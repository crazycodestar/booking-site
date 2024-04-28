"use client";

import { ColumnDef } from "@tanstack/react-table";
import { GetSeatsResponseSchema } from "@/lib/validations/seat";
import { findCurrenttBooking, findNextBooking } from "@/lib/time-functions";
import { RemoveSeatButton } from "@/components/remove-seat-button";

export const seatColumns: ColumnDef<GetSeatsResponseSchema[number]>[] = [
	{
		accessorKey: "name",
		header: "Name",
	},
	{
		id: "entryTime",
		header: "Entry Time",
		accessorFn: (row) => {
			const bookings = row.bookings.filter(
				(booking) => booking.status === "ACTIVE" || booking.status === "PENDING"
			);
			return (
				findCurrenttBooking(bookings)?.entryTime ||
				findNextBooking(bookings)?.entryTime
			);
		},
	},
	{
		id: "exitTime",
		header: "Exit Time",
		accessorFn: (row) => {
			const bookings = row.bookings.filter(
				(booking) => booking.status === "ACTIVE" || booking.status === "PENDING"
			);
			return (
				findCurrenttBooking(bookings)?.exitTime ||
				findNextBooking(bookings)?.exitTime
			);
		},
	},
	{
		id: "status",
		header: "Status",
		accessorFn: (row) => {
			const bookings = row.bookings.filter(
				(booking) => booking.status === "ACTIVE" || booking.status === "PENDING"
			);
			return (
				findCurrenttBooking(bookings)?.status ||
				findNextBooking(bookings)?.status
			);
		},
	},
	{
		id: "actions",
		cell: ({ row }) => {
			const seatName = row.getValue("name") as string;

			return <RemoveSeatButton seatName={seatName} />;
		},
	},
];
// TODO: add user?
