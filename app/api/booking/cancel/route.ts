import { NextRequest, NextResponse } from "next/server";
import { cancelBooking } from "../../../../server/booking";

export async function PATCH(req: NextRequest) {
	try {
		const { bookingCode } = (await req.json()).data as { bookingCode: string };
		const result = await cancelBooking(bookingCode);

		return NextResponse.json(result);
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
