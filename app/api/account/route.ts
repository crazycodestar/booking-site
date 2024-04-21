import { NextResponse } from "next/server";
import { userRegistrationSchema } from "@/lib/validations/auth";
import { createUser } from "@/server/user";

export async function POST(req: Request) {
	console.log("first");
	try {
		console.log("here POST");
		const { email, password, name } = userRegistrationSchema.parse(
			await req.json()
		);
		const user = await createUser({ email, password, name });
		return NextResponse.json({
			user: {
				// name: user.name,
				email: user.email,
			},
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
