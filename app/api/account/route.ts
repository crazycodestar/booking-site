import { NextRequest, NextResponse } from "next/server";
import { userRegistrationSchema } from "@/lib/validations/auth";
import { createUser, getUser } from "@/server/user";
import { getToken } from "next-auth/jwt";

export async function POST(req: Request) {
	console.log("first");
	try {
		console.log("here POST");
		const { email, password, name } = userRegistrationSchema.parse(
			await req.json()
		);
		const user = await createUser({ email, password, name });
		return NextResponse.json(user);
		// eslint-disable-next-line
	} catch (error: any) {
		console.log("error", error);
		return new NextResponse(
			JSON.stringify({
				status: "error",
				message: error.message,
			}),
			{ status: 500 }
		);
	}
}

export async function GET(req: NextRequest) {
	const token = await getToken({ req });
	if (!token) {
		console.log("failed to authenticate");
		return new NextResponse("unauthorized", { status: 402 });
	}
	const userId = token.id as string;
	try {
		const user = await getUser(userId);
		return NextResponse.json(user);
	} catch (err: any) {
		return new NextResponse(
			JSON.stringify({
				status: "error",
				message: err.message,
			}),
			{ status: 500 }
		);
	}
}
