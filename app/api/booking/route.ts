import { NextRequest, NextResponse } from "next/server";
import { getBookings, getUserBookings } from "../../../server/booking";
import {
	BookingSchema,
	GetBookingResponseSchema,
	PostBookingResponseSChema,
} from "@/lib/validations/booking";
import { createBooking } from "@/server/booking";
import _ from "lodash"; //TODO: change from lodash to smth more typesafe
import { getToken } from "next-auth/jwt";
import { prisma } from "../../../lib/prisma";

export async function GET(req: NextRequest) {
	const token = await getToken({ req });
	if (!token) {
		console.log("failed to authenticate");
		return new NextResponse("unauthorized", { status: 402 });
	}
	const userId = token.id as string;

	try {
		const user = await prisma.user.findFirst({
			where: { id: userId },
			include: { role: true },
		});
		if (!user) throw Error("no user found");

		const bookings =
			user.role.role === "ADMIN"
				? await getBookings()
				: await getUserBookings(user.id);

		const formattedBookings: GetBookingResponseSchema = bookings.map(
			(booking) => ({
				name: booking.customer.name as string,
				status: booking.status
					.status as GetBookingResponseSchema[number]["status"],
				room: booking.seat.room.roomNumber,
				seat: booking.seat.name,
				code: booking.code,
				entryTime: new Date(booking.entryTime),
				exitTime: new Date(booking.exitTime),
			})
		);

		return NextResponse.json(formattedBookings);
		// eslint-disable-next-line
	} catch (err: any) {
		console.log("error", err);
		return new NextResponse(
			JSON.stringify({
				status: "error",
				// eslint-disable-next-line
				message: err.message,
			}),
			{ status: 500 }
		);
	}
}

export async function POST(req: Request) {
	try {
		const data = await req.json();
		console.log("data: ", data);
		const booking = BookingSchema.parse(data.data);

		const res = await createBooking(
			booking as Omit<BookingSchema, "time"> & {
				time: { hour: number; minute: number };
			}
		);

		return NextResponse.json(res as PostBookingResponseSChema);
	} catch (err: any) {
		console.log(err.message);
		return new NextResponse(
			JSON.stringify({
				status: "error",
				// eslint-disable-next-line
				message: err.message,
			}),
			{ status: 500 }
		);
	}
}
