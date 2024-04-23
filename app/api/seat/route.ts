import { NextResponse } from "next/server";
import { getAvaliableBooking } from "../../../server/booking";
import { createSeat, getAllSeats } from "../../../server/seat";

export async function GET(req: Request) {
	// TODO: validate authority of request
	try {
		const seats = await getAllSeats();

		return NextResponse.json({
			seats,
		});
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
		const seat = await createSeat();

		return NextResponse.json({
			seat,
		});
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
