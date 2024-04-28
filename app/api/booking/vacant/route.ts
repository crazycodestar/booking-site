import { NextResponse } from "next/server";
import { getAvaliableBooking } from "@/server/booking";

export async function GET() {
	try {
		const vacancies = await getAvaliableBooking();
		//      ^?

		return NextResponse.json({
			vacancies,
		});
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
