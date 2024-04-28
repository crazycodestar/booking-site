import * as z from "zod";
import { BookingReturnData } from "@/lib/validations/booking";
import _ from "lodash";

export const createSeatSchema = z.object({
	name: z
		.string()
		.min(3, "name must be atleat 3 characters")
		.max(8, "Name cannot be more than 8 characters"),
});

export type createSeatSchema = z.infer<typeof createSeatSchema>;

export const GetSeatsResponseSchema = z.array(
	z.object({
		name: z.string(),
		bookings: z.array(z.object(BookingReturnData)),
	})
);

export type GetSeatsResponseSchema = z.infer<typeof GetSeatsResponseSchema>;
