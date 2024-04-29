"use client";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { TimeInput } from "@nextui-org/react";
import { Time } from "@internationalized/date";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { findAvaliableDuration, generateListings } from "@/lib/time-functions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { BookingSchema, UserBookingSchema } from "@/lib/validations/booking";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SearchIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "./ui/avatar";
import useDebounce from "@/hooks/useDebounce";
import { useState } from "react";
import { GetSearchAccountResponseSchema } from "@/lib/validations/account";
import { getInitials } from "@/lib/getInitials";
import { GetSeatsResponseSchema } from "@/lib/validations/seat";
import { Label } from "./ui/label";

interface UserBookingFormProps {
	seat: string;
	user: {
		id: string;
		name?: string | null;
		email?: string | null;
	};
}

export const UserPopOverBookingForm = ({
	user,
	seat,
}: UserBookingFormProps) => {
	const form = useForm<UserBookingSchema>({
		resolver: zodResolver(UserBookingSchema),
		defaultValues: {
			userId: user.id,
			seatName: seat,
			// time: new Time(currentTime.getHours(), currentTime.getMinutes()),
			time: new Time(20, 0), //FIXME: reset to original time
			duration: 0,
		},
	});

	const queryClient = useQueryClient();
	const mutation = useMutation({
		mutationFn: (values: BookingSchema) =>
			axios.post("api/booking", { data: values }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["bookings", "vacancies"] });
			toast({
				//FIXME: change toast
				title: "information",
				description: "successful",
			});
		},
	});

	const { data } = useQuery({
		queryKey: ["vacancies"],
		queryFn: () => axios.get("/api/booking/vacant"),
	});

	const {
		data: seats,
		isLoading,
		isError,
	} = useQuery({
		//TODO: add react suspense
		queryKey: ["seats"],
		queryFn: async () => (await axios.get("/api/seat")).data,
	});

	const formattedseats = seats ? GetSeatsResponseSchema.parse(seats) : [];

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button className="w-full" variant="default">
					Create Booking
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Create Booking</DialogTitle>
					<DialogDescription>
						Create researvations for a seat. Click save when you&apos;re done.
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
					>
						<div className="grid gap-4 py-4">
							<div className="flex items-center gap-3 rounded-md px-3 py-2">
								<Avatar className="h-9 w-9">
									<AvatarFallback>
										{getInitials(user?.name || "")}
									</AvatarFallback>
								</Avatar>
								<div className="grid gap-0.5 text-sm">
									<div className="font-medium">{user?.name}</div>
									<div className="text-gray-500 dark:text-gray-400">
										{user?.email}
									</div>
								</div>
							</div>
							<FormField
								control={form.control}
								name="seatName"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Room No</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<FormControl>
												<SelectTrigger className="w-full">
													<SelectValue placeholder="Select Seat" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{formattedseats.map((seat, index) => (
													<SelectItem key={index} value={seat.name}>
														{seat.name}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="time"
								render={({ field }) => {
									return (
										<FormItem>
											<FormLabel>Event Time</FormLabel>
											<FormControl>
												<TimeInput
													aria-label="Event Time"
													defaultValue={field.value}
													onChange={field.onChange}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									);
								}}
							/>
							<FormField
								control={form.control}
								name="duration"
								render={({ field }) => {
									const startTime = form.watch("time");

									// TODO: proper skeleton loading
									if (!data)
										return (
											<div>
												<Label>Duration</Label>
												<div className="px-4 py-2 rounded-md border-1 border-border">
													loading...
												</div>
											</div>
										);

									const vacancies: [string, string][][] = data.data.vacancies; //FIXME: add types;
									const formattedVacancies = vacancies.map((vacancy) =>
										vacancy.map(
											(vacant) =>
												[new Date(vacant[0]), new Date(vacant[1])] as [
													Date,
													Date
												]
										)
									);
									const DateTimeTimeValue = new Date();
									DateTimeTimeValue.setHours(
										startTime.hour,
										startTime.minute,
										0,
										0
									);

									const duration = findAvaliableDuration(
										formattedVacancies,
										DateTimeTimeValue
									);

									const listings = generateListings(120, duration, 30);

									return (
										<FormItem>
											<FormLabel>Duration</FormLabel>
											<Select
												onValueChange={field.onChange}
												defaultValue={field.value.toString()}
											>
												<FormControl>
													<SelectTrigger className="w-full">
														<SelectValue placeholder="Select Duration" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													{listings.map((listing, index) => (
														<SelectItem
															key={index}
															value={listing.value.toString()}
														>
															{listing.name}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
											<FormMessage />
										</FormItem>
									);
								}}
							/>
							<DialogFooter>
								<Button className="mt-8" type="submit">
									Create Booking
								</Button>
							</DialogFooter>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};
