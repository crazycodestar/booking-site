"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function BookingForm() {
	const [time, setTime] = useState("10:00");

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
				<div className="grid gap-4 py-4">
					<div className="grid gap-1">
						<Label htmlFor="email">Name</Label>
						<Input
							id="name"
							placeholder="John Doe"
							type="text"
							autoCapitalize="none"
							autoComplete="name"
							autoCorrect="off"
							// disabled={isLoading}
							// {...register("email")}
						/>
						{/* {errors?.email && (
								<p className="px-1 text-xs text-red-600">
									{errors.email.message}
								</p>
							)} */}
					</div>
					{/* TODO: add a "right now" time option */}
				</div>
				<DialogFooter>
					<Button type="submit">Create Booking</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
