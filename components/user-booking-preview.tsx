"use client";

import { GetBookingResponseSchema } from "@/lib/validations/booking";
import { useQuery } from "@tanstack/react-query";
import { Card } from "./ui/card";
import Image from "next/image";
import { formatTime } from "@/lib/time-functions";
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
import { InfoIcon } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "@/components/ui/use-toast";
import { Button } from "./ui/button";
import { BookingTicket } from "./booking-ticket";

export function UserBookingPreview() {
	const { data, isLoading } = useQuery({
		queryKey: ["bookings"],
		queryFn: async () =>
			await fetch("../api/booking").then((res) => res.json()),
	});

	if (isLoading) return <p>loading...</p>;

	const parsedData = GetBookingResponseSchema.parse(data); //TODO: supposed to only show today's bookings not everything

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
			{parsedData.length ? (
				parsedData.map((booking, index) => {
					let badgeColor: string;
					switch (booking.status) {
						case "ACTIVE":
							badgeColor = "bg-green-400";
							break;

						case "EXPIRED":
							badgeColor = "bg-red-400";
							break;
						case "USED":
							badgeColor = "bg-gray-400";
							break;

						case "PENDING":
						case "CANCELLED":
							badgeColor = "bg-yellow-400";
							break;
						default:
							badgeColor = "bg-yellow-400";
					}

					return (
						<Card key={index} className="col-span-1 shadow-md overflow-hidden">
							<div className="p-4">
								<div className="flex w-full justify-between items-center">
									<h3 className="text-lg font-semibold text-secondary-foreground group-hover:text-primary">
										{booking.code}
									</h3>
									<p>{booking.room}</p>
								</div>

								<div className="flex gap-3">
									<div className="flex items-center gap-1">
										<p className="text-sm text-foreground line-clamp-2">
											{formatTime(booking.entryTime)}
										</p>
										<span>-</span>
										<p className="text-sm text-foreground line-clamp-2">
											{booking.exitTime && formatTime(booking.exitTime)}
										</p>
									</div>
									<span
										className={`px-2 flex items-center rounded-sm text-xs ${badgeColor}`}
									>
										{booking.status}
									</span>
								</div>
								<div className="mt-4 w-full flex flex-col gap-2">
									<CancelBookingButton
										bookingCode={booking.code}
										disabled={booking.status === "CANCELLED"}
									/>
									<AlertDialog>
										<AlertDialogTrigger asChild>
											<Button variant="outline">
												<InfoIcon className="w-4 h-4 mr-2" />
												<p>More Details</p>
											</Button>
										</AlertDialogTrigger>
										<AlertDialogContent>
											<AlertDialogHeader>
												<AlertDialogTitle>
													Booking Ticket details
												</AlertDialogTitle>
												<AlertDialogDescription>
													This is the booking information. Do not share this
													with anyone
												</AlertDialogDescription>
											</AlertDialogHeader>
											<div>
												<BookingTicket bookingDetails={booking} />
											</div>
											<AlertDialogFooter>
												<AlertDialogCancel>Close</AlertDialogCancel>
											</AlertDialogFooter>
										</AlertDialogContent>
									</AlertDialog>
								</div>
							</div>
						</Card>
					);
				})
			) : (
				<p>No bookings</p>
			)}
		</div>
	);
}

export function CancelBookingButton({
	bookingCode,
	disabled = false,
}: {
	bookingCode: string;
	disabled?: boolean;
}) {
	const queryClient = useQueryClient();
	const mutation = useMutation({
		mutationFn: (bookingCode: string) =>
			axios.patch("../api/booking/cancel", { data: { bookingCode } }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["bookings"] });
			toast({
				title: "successful",
				description: "Seat was cancelled successfully",
			});
		},
	});

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button
					type="button"
					variant="default"
					className="w-full"
					disabled={disabled}
				>
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
		</AlertDialog>
	);
}
