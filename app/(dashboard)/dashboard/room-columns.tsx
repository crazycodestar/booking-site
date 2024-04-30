"use client";

import { ColumnDef } from "@tanstack/react-table";
import { findCurrentOrNextBooking, formatTime } from "@/lib/time-functions";
import { GetRoomsResponseSchema } from "@/lib/validations/room";

export const roomColumns: ColumnDef<GetRoomsResponseSchema[number]>[] = [
	{
		accessorKey: "name",
		header: "Name",
	},
	{
		id: "entryTime",
		header: "Entry Time",
		accessorFn: (row) => {
			const entryTime = findCurrentOrNextBooking(row.seats)?.entryTime;
			return entryTime ? formatTime(entryTime) : "--:--";
		},
	},
	{
		id: "exitTime",
		header: "Exit Time",
		accessorFn: (row) => {
			const exitTime = findCurrentOrNextBooking(row.seats)?.exitTime;
			return exitTime ? formatTime(exitTime) : "--:--";
		},
	},
	{
		id: "status",
		header: "Status",
		accessorFn: (row) => {
			const status = findCurrentOrNextBooking(row.seats)?.status;
			return status ? status : "-";
		},
	},
];
// TODO: add user?
