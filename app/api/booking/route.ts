import { NextResponse } from "next/server";
import { userRegistrationSchema } from "@/lib/validations/auth";
import { createUser } from "@/server/user";
import { getAvaliableBooking } from "../../../server/booking";

export async function GET(req: Request) {
	console.log("first");
	try {
		console.log("getting bookings");
		getAvaliableBooking();

		return NextResponse.json({
			status: "successful",
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
