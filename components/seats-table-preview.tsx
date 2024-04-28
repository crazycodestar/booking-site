"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Suspense } from "react";
import { DataTable } from "./ui/data-table";
import { seatColumns } from "@/app/(dashboard)/dashboard/seat-columns";
import { GetSeatsResponseSchema } from "@/lib/validations/seat";

export const SeatTablePreview = () => {
	const { data, isLoading, isError } = useQuery({
		//TODO: add react suspense
		queryKey: ["seats"],
		queryFn: async () => (await axios.get("/api/seat")).data,
	});

	// TODO: deal with empty list of seats

	if (isLoading) return <p>loading...</p>; //TODO: Pretty Loading states

	const formattedData = GetSeatsResponseSchema.parse(data);
	return (
		<div>
			<Suspense fallback="loading...">
				<DataTable data={formattedData} columns={seatColumns} />
			</Suspense>
		</div>
	);
};
