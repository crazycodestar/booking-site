"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Suspense } from "react";

export const SeatTablePreview = () => {
	const { data, isLoading, isError } = useQuery({
		//TODO: add react suspense
		queryKey: ["seats"],
		queryFn: () => axios.get("/api/seat"),
	});

	// TODO: deal with empty list of seats

	return (
		<div>
			<Suspense fallback="loading...">
				<pre>{JSON.stringify(data?.data, null, 2)}</pre>
			</Suspense>
		</div>
	);
};
