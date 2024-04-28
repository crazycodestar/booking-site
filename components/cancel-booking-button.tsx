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

export function CancelBookingButton({ bookingCode }: { bookingCode: string }) {
	const queryClient = useQueryClient();
	const mutation = useMutation({
		mutationFn: (bookingCode: string) =>
			axios.patch("api/booking/cancel", { data: { bookingCode } }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["bookings"] });
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
							Cancel Booking
						</Button>
					</AlertDialogTrigger>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
							<AlertDialogDescription>
								This action cannot be undone. This will be Cancelled but you can
								always re-book
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel>Cancel</AlertDialogCancel>
							<AlertDialogAction onClick={() => mutation.mutate(bookingCode)}>
								Cancel Booking
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</DropdownMenuContent>
			</DropdownMenu>
		</AlertDialog>
	);
}
