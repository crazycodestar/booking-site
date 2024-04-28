"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { GetBookingResponseSchema } from "../lib/validations/booking";
import { DataTable } from "./ui/data-table";
import { bookingColumns } from "../app/(dashboard)/dashboard/booking-columns";

export const BookingTablePreview = () => {
	const { data, isLoading } = useQuery({
		queryKey: ["bookings"],
		queryFn: async () => (await axios.get("api/booking")).data,
	});

	if (isLoading) return <p>loading...</p>;

	const parsedData = GetBookingResponseSchema.parse(data);
	// return <pre>{JSON.stringify(data, null, 2)}</pre>;
	return <DataTable columns={bookingColumns} data={parsedData} />;
};
