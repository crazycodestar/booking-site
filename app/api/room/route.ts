import { NextRequest, NextResponse } from "next/server";
import { createSeat, deleteSeat, getAllSeats } from "@/server/seat";
import { GetSeatsResponseSchema } from "@/lib/validations/seat";
import { GetBookingResponseSchema } from "@/lib/validations/booking";
import { GetRoomsResponseSchema } from "../../../lib/validations/room";
import { getAllRooms } from "../../../server/room";

export async function GET(req: Request) {
	// TODO: validate authority of request
	try {
		const seats: GetRoomsResponseSchema = (await getAllRooms()).map((room) => ({
			name: room.roomNumber,
			image: room.image,
			seats: room.seats.map((seat) => ({
				name: seat.name,
				bookings: seat.bookings.map((booking) => ({
					name: booking.customer.name as string,
					status: booking.status
						.status as GetBookingResponseSchema[number]["status"],
					code: booking.code,
					entryTime: new Date(booking.entryTime),
					exitTime: new Date(booking.exitTime),
				})),
			})),
		}));

		return NextResponse.json(seats);
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

// FIXME: vvvv

// export async function POST(req: Request) {
// 	try {
// 		const seat = await createSeat();

// 		return NextResponse.json({
// 			seat,
// 		});
// 	} catch (err: any) {
// 		console.log("error", err);
// 		return new NextResponse(
// 			JSON.stringify({
// 				status: "error",
// 				// eslint-disable-next-line
// 				message: err.message,
// 			}),
// 			{ status: 500 }
// 		);
// 	}
// }

// export async function DELETE(req: NextRequest) {
// 	try {
// 		const { seatName } = (await req.json()) as { seatName: string };

// 		const result = await deleteSeat(seatName);

// 		return NextResponse.json("successful");
// 	} catch (err: any) {
// 		console.log("error", err);
// 		return new NextResponse(
// 			JSON.stringify({
// 				status: "error",
// 				// eslint-disable-next-line
// 				message: err.message,
// 			}),
// 			{ status: 500 }
// 		);
// 	}
// }
