"use client";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const SeatForm = () => {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: () => axios.post("/api/seat"),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["seats"] });
			return toast({
				title: "Successful",
				description: "Seat created successfully",
			});
		},
	});

	return (
		<Button variant="outline" onClick={() => mutation.mutate()}>
			Add Seat
		</Button>
	);
};
export { SeatForm };
