import { NextRequest, NextResponse } from "next/server";
import { cancelBooking } from "../../../../server/booking";

export async function PATCH(req: NextRequest) {
	try {
		const { code } = (await req.json()).data as { code: string };
		const result = await cancelBooking(code);

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
