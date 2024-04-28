"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {
	InputOTP,
	InputOTPGroup,
	InputOTPSeparator,
	InputOTPSlot,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import { toast } from "@/components/ui/use-toast";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "./ui/dialog";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { GetOneBookingResponseSchema } from "@/lib/validations/booking";
import { formatCode } from "@/lib/format-number";
import { useCallback, useEffect, useState } from "react";

const FormSchema = z.object({
	code: z.string().min(6, {
		message: "Your booking code must be 6 characters.",
	}),
});

export const ActivateBookingForm = () => {
	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			code: "",
		},
	});

	const code = useWatch({
		control: form.control,
		name: "code", // without supply name will watch the entire form, or ['firstName', 'lastName'] to watch both
		defaultValue: "", // default value before the render
	});

	const queryClient = useQueryClient();
	const mutate = useMutation({
		mutationFn: ({ code }: z.infer<typeof FormSchema>) =>
			axios.post("api/booking/activate", {
				data: { code: formatCode(code).toUpperCase() },
			}),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["bookings"] });
			toast({
				title: "Successful",
				description: code + " Booking as been activated",
			});
		},
		onError: () => {
			toast({
				title: "Failed",
				description: "Invalid booking code entered",
			});
		},
	});

	return (
		<Dialog>
			<DialogTrigger>Activate Booking</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Activate a booking</DialogTitle>
					<DialogDescription>
						This will activate your booking to use a seat.
					</DialogDescription>
				</DialogHeader>
				<div>
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit((values) => mutate.mutate(values))}
							className="space-y-6"
						>
							<FormField
								control={form.control}
								name="code"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Booking Code</FormLabel>
										<FormControl>
											<InputOTP
												pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
												maxLength={6}
												{...field}
											>
												<InputOTPGroup>
													<InputOTPSlot index={0} />
													<InputOTPSlot index={1} />
													<InputOTPSlot index={2} />
												</InputOTPGroup>
												<InputOTPSeparator />
												<InputOTPGroup>
													<InputOTPSlot index={3} />
													<InputOTPSlot index={4} />
													<InputOTPSlot index={5} />
												</InputOTPGroup>
											</InputOTP>
										</FormControl>
										<FormDescription>
											Please enter the booking code for your booking.
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>

							{code.length === 6 && <BookingTicket code={code} />}
							<Button className="w-full" type="submit">
								Activate Booking
							</Button>
						</form>
					</Form>
				</div>
			</DialogContent>
		</Dialog>
	);
};

const BookingTicket = ({ code }: { code: string }) => {
	const [booking, setBooking] = useState();

	const getbooking = useCallback(async (code: string) => {
		try {
			const result = (
				await axios.get("api/booking/" + formatCode(code.toUpperCase()))
			).data;
			setBooking(result);
		} catch (err: any) {
			toast({
				title: "Error",
				description: "Booking not found",
			});
		}
	}, []);

	useEffect(() => {
		getbooking(code);
	}, [code, getbooking]);

	if (!booking) return <p>loading...</p>;
	const formattedBooking = GetOneBookingResponseSchema.parse(booking);

	return (
		<Card>
			<CardHeader className="flex p-6">
				<div className="grid gap-1.5">
					<CardTitle>Ticket</CardTitle>
					<CardDescription>Thank you for choosing Bookonomy</CardDescription>
				</div>
			</CardHeader>
			<CardContent className="grid gap-4">
				{/* TODO: isLoading ? loading */}
				<div className="grid grid-cols-2 gap-1.5 text-sm">
					<div className="grid gap-0.5">
						<div className="text-muted-foreground">User</div>
						<div className="font-medium">{formattedBooking.name}</div>
					</div>
					<div className="grid gap-0.5">
						<div className="text-muted-foreground">Seat</div>
						<div className="font-medium">{formattedBooking.seat}</div>
					</div>
				</div>
				<div className="grid grid-cols-2 gap-1.5 text-sm">
					<div className="grid gap-0.5">
						<div className="text-muted-foreground">Entry time</div>
						<div className="font-medium">
							{formattedBooking.entryTime.toString()}
						</div>
					</div>
					<div className="grid gap-0.5">
						<div className="text-muted-foreground">Exit time</div>
						<div className="font-medium">
							{formattedBooking.exitTime.toString()}
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};
