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
import { BookingSchema } from "@/lib/validations/booking";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SearchIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "./ui/avatar";
import useDebounce from "@/hooks/useDebounce";
import { useState } from "react";
import { GetSearchAccountResponseSchema } from "@/lib/validations/account";
import { getInitials } from "@/lib/getInitials";

interface BookingFormProps {
	isAdmin: boolean;
	userId?: string;
}

export function BookingForm({ userId, isAdmin }: BookingFormProps) {
	const form = useForm<BookingSchema>({
		resolver: zodResolver(BookingSchema),
		defaultValues: {
			userId: isAdmin ? "" : userId,
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

	const [details, setDetails] =
		useState<GetSearchAccountResponseSchema[number]>();
	const [search, setSearch] = useState("");

	const debouncedSearch = useDebounce(search, 500);

	const { data: accounts, isLoading } = useQuery({
		queryKey: ["accountSearch", debouncedSearch],
		queryFn: async () =>
			(await axios.get("/api/account/search?q=" + debouncedSearch)).data,
		enabled: Boolean(debouncedSearch.length),
	});

	const formattedAccounts = accounts
		? GetSearchAccountResponseSchema.parse(accounts)
		: [];

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant="default">Create Booking</Button>
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
							{isAdmin && (
								<FormField
									control={form.control}
									name="userId"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Name</FormLabel>
											<FormControl>
												<div className="space-y-4">
													<div className="w-full max-w-md relative">
														<div className="relative">
															<Input
																className="w-full rounded-md border border-gray-300 px-4 py-2 pr-10 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-800 dark:text-gray-50"
																placeholder="Search..."
																type="search"
																value={search}
																onChange={(e) =>
																	setSearch(e.currentTarget.value)
																}
															/>
															<SearchIcon className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
														</div>
														{search && (
															<div className="absolute z-50 w-full mt-2 overflow-hidden rounded-md border border-gray-300 bg-white shadow-sm dark:border-gray-600 dark:bg-gray-800">
																<div className="max-h-[300px] overflow-y-auto">
																	<div className="space-y-2 p-2">
																		{isLoading ? (
																			<p>loading...</p>
																		) : formattedAccounts.length ? (
																			formattedAccounts.map(
																				(account, index) => {
																					return (
																						<div
																							key={index}
																							className="flex items-center gap-3 rounded-md px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
																							onClick={() => {
																								form.setValue(
																									"userId",
																									account.id
																								);
																								setDetails(account);
																								setSearch("");
																							}}
																						>
																							<Avatar className="h-9 w-9">
																								<AvatarFallback>
																									{getInitials(account.name)}
																								</AvatarFallback>
																							</Avatar>
																							<div className="grid gap-0.5 text-sm">
																								<div className="font-medium">
																									{account.name}
																								</div>
																								<div className="text-gray-500 dark:text-gray-400">
																									{account.email}
																								</div>
																							</div>
																						</div>
																					);
																				}
																			)
																		) : (
																			<p>no accounts found</p>
																		)}
																	</div>
																</div>
															</div>
														)}
													</div>

													{form.watch("userId") && (
														<div className="flex items-center gap-3 rounded-md px-3 py-2">
															<Avatar className="h-9 w-9">
																<AvatarFallback>
																	{getInitials(details?.name || "")}
																</AvatarFallback>
															</Avatar>
															<div className="grid gap-0.5 text-sm">
																<div className="font-medium">
																	{details?.name}
																</div>
																<div className="text-gray-500 dark:text-gray-400">
																	{details?.email}
																</div>
															</div>
														</div>
													)}
												</div>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							)}
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
									if (!data) return <div>loading...</div>;

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
											<FormControl>
												{/* TODO: add a "right now" time option */}
												{/* <div className="flex flex-col gap-2 justify-start items-start"> */}
												<div className="flex items-center gap-4">
													{listings.map((option, index) => (
														<Button
															type="button"
															onClick={() => field.onChange(option.value)}
															variant={
																field.value === option.value
																	? "default"
																	: "outline"
															}
															key={index}
														>
															{option.name}
														</Button>
													))}
												</div>
												{/* </div> */}
											</FormControl>
											<FormMessage />
										</FormItem>
									);
								}}
							/>
						</div>
						<DialogFooter>
							<Button type="submit">Create Booking</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
