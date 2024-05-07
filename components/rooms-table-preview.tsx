"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Suspense } from "react";
import { DataTable } from "./ui/data-table";
import { roomColumns } from "@/app/(dashboard)/dashboard/room-columns";
import { GetRoomsResponseSchema } from "@/lib/validations/room";

export const RoomTablePreview = () => {
	const { data, isLoading } = useQuery({
		//TODO: add react suspense
		queryKey: ["rooms"],
		queryFn: async () => (await axios.get("/api/room")).data,
	});

	// TODO: deal with empty list of seats

	if (isLoading) return <p>loading...</p>; //TODO: Pretty Loading states

	const formattedData = GetRoomsResponseSchema.parse(data);
	return (
		<div>
			<Suspense fallback="loading...">
				<DataTable
					data={formattedData.sort(
						(a, b) => parseInt(a.name) - parseInt(b.name)
					)}
					columns={roomColumns}
				/>
			</Suspense>
		</div>
	);
};
