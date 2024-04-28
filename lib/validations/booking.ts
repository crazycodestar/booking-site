import { Time } from "@internationalized/date";
import * as z from "zod";

export const BookingSchema = z.object({
	userId: z.string(),
	time: z.any().refine((time: Time) => time), //FIXME: make allowed time be only 5 minutes from current time
	duration: z.number().min(30, "Duration must be atleat 30mins"),
});

export type BookingSchema = z.infer<typeof BookingSchema>;

export const BookingReturnData = {
	name: z.string(),
	code: z.string(),
	entryTime: z.coerce.date(),
	exitTime: z.coerce.date(),
	status: z.union([
		z.literal("PENDING"),
		z.literal("ACTIVE"),
		z.literal("USED"),
		z.literal("EXPIRED"),
		z.literal("CANCELLED"),
	]),
};

export const GetBookingResponseSchema = z.array(
	z.object({
		...BookingReturnData,
		seat: z.string(),
	})
);

export type GetBookingResponseSchema = z.infer<typeof GetBookingResponseSchema>;

export const GetOneBookingResponseSchema = z.object({
	name: z.string(),
	code: z.string(),
	entryTime: z.coerce.date(),
	exitTime: z.coerce.date(),
	seat: z.string(),
});

export type GetOneBookingResponseSchema = z.infer<
	typeof GetOneBookingResponseSchema
>;
