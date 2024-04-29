"use client";

import { Card } from "@/components/ui/card";
import { UserPopOverBookingForm } from "@/components/user-popover-booking-form";
import {
	findCurrenttBooking,
	findNextBooking,
	formatTime,
} from "@/lib/time-functions";
import { GetSeatsResponseSchema } from "@/lib/validations/seat";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";

export default function Page() {
	const { data: userData, isLoading: isUserLoading } = useQuery({
		queryKey: ["user"],
		queryFn: async () => (await axios.get("api/account")).data,
	});
	const { data, isLoading } = useQuery({
		//TODO: add react suspense
		queryKey: ["seats"],
		queryFn: async () => (await axios.get("/api/seat")).data,
	});

	if (isLoading) return <p>loading...</p>; //TODO: Pretty Loading states

	const formattedData = GetSeatsResponseSchema.parse(data);
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
			{formattedData.map((seat, index) => {
				const formattedSeat = {
					name: seat.name,
					entryTime:
						findCurrenttBooking(seat.bookings)?.entryTime ||
						findNextBooking(seat.bookings)?.entryTime,
					exitTime:
						findCurrenttBooking(seat.bookings)?.exitTime ||
						findNextBooking(seat.bookings)?.exitTime,
					status:
						findCurrenttBooking(seat.bookings)?.status ||
						findNextBooking(seat.bookings)?.status,
				};

				let badgeColor: string;
				switch (formattedSeat.status) {
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
						<Image
							alt="Product 1"
							className="w-full h-48 object-cover p-4"
							height="200"
							src="/placeholder.svg"
							style={{
								aspectRatio: "300/200",
								objectFit: "cover",
							}}
							width="300"
						/>
						<div className="p-4">
							<h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary">
								{formattedSeat.name}
							</h3>
							{formattedSeat.entryTime ? (
								<div className="flex gap-3">
									<div className="flex items-center gap-1">
										<p className="text-sm text-gray-500 line-clamp-2">
											{formatTime(formattedSeat.entryTime)}
										</p>
										<span>-</span>
										<p className="text-sm text-gray-500 line-clamp-2">
											{formattedSeat.exitTime &&
												formatTime(formattedSeat.exitTime)}
										</p>
									</div>
									<span
										className={`px-2 flex items-center rounded-sm text-xs ${badgeColor}`}
									>
										{formattedSeat.status}
									</span>
								</div>
							) : (
								<p className="text-sm text-muted-foreground line-clamp-2">
									No Pending Bookings
								</p>
							)}
							{isUserLoading ? (
								<p>loading...</p>
							) : (
								<div className="mt-4 w-full">
									<UserPopOverBookingForm
										user={userData}
										seat={formattedSeat.name}
									/>
								</div>
							)}
						</div>
					</Card>
				);
			})}
		</div>
	);
}
