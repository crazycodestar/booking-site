"use client";

import { BookingForm } from "@/components/booking-form";
import { Card } from "@/components/ui/card";
import { UserPopOverBookingForm } from "@/components/user-popover-booking-form";
import {
	findCurrentOrNextBooking,
	findCurrenttBooking,
	findNextBooking,
	formatTime,
} from "@/lib/time-functions";
import { GetUserResponseSchema } from "@/lib/validations/auth";
import { GetRoomsResponseSchema } from "@/lib/validations/room";
import { GetSeatsResponseSchema } from "@/lib/validations/seat";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Page() {
	const router = useRouter();
	const { data: userData, isLoading: isUserLoading } = useQuery({
		queryKey: ["user"],
		queryFn: async () => (await axios.get("api/account")).data,
	});
	const { data, isLoading } = useQuery({
		//TODO: add react suspense
		queryKey: ["rooms"],
		queryFn: async () => (await axios.get("/api/room")).data,
	});

	if (isLoading) return <p>loading...</p>; //TODO: Pretty Loading states

	const formattedData = GetRoomsResponseSchema.parse(data);
	const formattedUser = userData ? GetUserResponseSchema.parse(userData) : null;
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
			{formattedData
				.sort((a, b) => parseInt(a.name) - parseInt(b.name))
				.map((room, index) => {
					const closestBooking = findCurrentOrNextBooking(room.seats);

					const getClosestBookingBadgeColor = (status: string) => {
						let badgeColor: string;
						switch (status) {
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
						return badgeColor;
					};

					return (
						<Card key={index} className="col-span-1 shadow-md overflow-hidden">
							<img
								alt="Product 1"
								className="w-full h-48 object-cover p-4"
								height="200"
								src={room.image || "https://picsum.photos/200"}
								style={{
									aspectRatio: "300/200",
									objectFit: "cover",
								}}
								width="300"
							/>
							<div className="p-4">
								<div className="flex justify-between items-center">
									<h3 className="text-lg font-semibold text-secondary-foreground group-hover:text-primary">
										{room.name}
									</h3>
									<p>4 out of 10 booked</p>
								</div>
								{closestBooking ? (
									<div className="flex gap-3">
										<div className="flex items-center gap-1">
											<p className="text-sm text-foreground line-clamp-2">
												{formatTime(closestBooking.entryTime)}
											</p>
											<span>-</span>
											<p className="text-sm text-foreground line-clamp-2">
												{closestBooking.exitTime &&
													formatTime(closestBooking.exitTime)}
											</p>
										</div>
										<span
											className={`px-2 flex items-center rounded-sm text-xs ${getClosestBookingBadgeColor(
												closestBooking.status
											)}`}
										>
											{closestBooking.status}
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
										{formattedUser && (
											<BookingForm
												roomNumber={room.name}
												className="w-full"
												isAdmin={false}
												userId={formattedUser.id}
											/>
										)}
										{/* <UserPopOverBookingForm user={userData} seat={room.name} /> */}
									</div>
								)}
							</div>
						</Card>
					);
				})}
		</div>
	);
}
