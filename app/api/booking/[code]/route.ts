import { NextResponse } from "next/server";
import { getBooking } from "@/server/booking";
import { GetOneBookingResponseSchema } from "../../../../lib/validations/booking";

export const GET = async (
	_: Request,
	{ params }: { params: { code: string } }
) => {
	const code = params.code;

	try {
		const booking = await getBooking(code);

		const data: GetOneBookingResponseSchema = {
			code: booking.code,
			entryTime: booking.entryTime,
			exitTime: booking.exitTime,
			name: booking.customer.name as string,
			seat: booking.seat.name,
		};

		return NextResponse.json(data);
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
};
