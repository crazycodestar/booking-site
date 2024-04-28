import { NextRequest, NextResponse } from "next/server";
import { activateBooking } from "../../../../server/booking";

export async function POST(req: NextRequest) {
	try {
		const { code } = (await req.json()).data as { code: string };
		const result = await activateBooking(code);

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
