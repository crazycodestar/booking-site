import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { GetSearchAccountResponseSchema } from "../../../../lib/validations/account";

export const GET = async (req: NextRequest) => {
	try {
		const searchParams = req.nextUrl.searchParams;
		const query = searchParams.get("q");

		if (!query) throw new Error("no query provided");

		const accounts = (await prisma.user.findMany({
			where: { name: { contains: query.toLocaleLowerCase() } },
		})) as GetSearchAccountResponseSchema;
		return NextResponse.json(accounts);
	} catch (err: any) {
		//FIXME: change any => Error type
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
