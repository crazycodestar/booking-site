"use client";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { MoreHorizontal } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "@/components/ui/use-toast";

export function RemoveSeatButton({ seatName }: { seatName: string }) {
	const queryClient = useQueryClient();
	const mutation = useMutation({
		mutationFn: (seatName: string) =>
			axios.delete("api/seat", { data: { seatName } }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["seats"] });
			toast({
				title: "successful",
				description: "Seat was deleted successfully",
			});
		},
	});

	return (
		<AlertDialog>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" className="h-8 w-8 p-0">
						<span className="sr-only">Open menu</span>
						<MoreHorizontal className="h-4 w-4" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<AlertDialogTrigger asChild>
						<Button type="button" variant="outline">
							Delete Seat
						</Button>
					</AlertDialogTrigger>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
							<AlertDialogDescription>
								This action cannot be undone. This will permanently delete the
								seat and remove all pending bookings
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel>Cancel</AlertDialogCancel>
							<AlertDialogAction onClick={() => mutation.mutate(seatName)}>
								Delete Seat
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</DropdownMenuContent>
			</DropdownMenu>
		</AlertDialog>
	);
}
