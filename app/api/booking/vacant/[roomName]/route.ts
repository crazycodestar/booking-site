import { NextResponse } from "next/server";
import { getAvaliableBooking } from "@/server/booking";

export async function GET(
	_: Request,
	{ params }: { params: { roomName: string } }
) {
	try {
		const roomName = params.roomName;

		const vacancies = await getAvaliableBooking(roomName);
		//      ^?

		return NextResponse.json(vacancies);
		// eslint-disable-next-line
	} catch (error: any) {
		console.log("error", error);
		return new NextResponse(
			JSON.stringify({
				status: "error",
				// eslint-disable-next-line
				message: error.message,
			}),
			{ status: 500 }
		);
	}
}
