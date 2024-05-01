import { Time } from "@internationalized/date";
import * as z from "zod";

export const BookingSchema = z.object({
	userId: z.string().min(3, "user is required"),
	roomNumber: z.string().min(3, "room is required"),
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
		room: z.string(),
	})
);

export type GetBookingResponseSchema = z.infer<typeof GetBookingResponseSchema>;

export const PostBookingResponseSChema = z.object({
	code: z.string(),
	entryTime: z.coerce.date(),
	exitTime: z.coerce.date(),
	seat: z.object({ name: z.string() }),
});

export type PostBookingResponseSChema = z.infer<
	typeof PostBookingResponseSChema
>;

export const GetOneBookingResponseSchema = z.object({
	name: z.string(),
	code: z.string(),
	entryTime: z.coerce.date(),
	exitTime: z.coerce.date(),
	roomNumber: z.string(),
});

export type GetOneBookingResponseSchema = z.infer<
	typeof GetOneBookingResponseSchema
>;

export const UserBookingSchema = z.object({
	userId: z.string(),
	seatName: z.string(),
	time: z.any().refine((time: Time) => time), //FIXME: make allowed time be only 5 minutes from current time
	duration: z.coerce.number().min(30, "Duration must be atleat 30mins"),
});

export type UserBookingSchema = z.infer<typeof UserBookingSchema>;
