import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { isFirstTimeEarlier } from "../../../lib/time-functions";

function getDate30MinutesAgo(date: Date) {
	// Get the timestamp of the provided date
	const timestamp = date.getTime();

	// Subtract 30 minutes in milliseconds (1 minute = 60,000 milliseconds)
	const timestamp30MinutesAgo = timestamp - 30 * 60 * 1000;

	// Create a new Date object using the updated timestamp
	const date30MinutesAgo = new Date(timestamp30MinutesAgo);

	return date30MinutesAgo;
}

export const GET = async (req: Request) => {
	try {
		const used = await prisma.bookingStatus.findFirst({
			where: {
				status: "USED",
			},
		});
		if (!used) throw new Error("used status not found");

		const expired = await prisma.bookingStatus.findFirst({
			where: {
				status: "EXPIRED",
			},
		});
		if (!expired) throw new Error("expired status not found");

		const result = await prisma.booking.findMany({
			where: {
				createdAt: {
					gt: getDate30MinutesAgo(new Date()),
				},
			},
			include: {
				customer: true,
				status: true,
			},
		});
		if (!result) return NextResponse.json("done");

		result.forEach(async (booking) => {
			const status = booking.status.status;
			if (status === "USED" || status === "EXPIRED" || status === "CANCELLED")
				return;

			const isEnded = isFirstTimeEarlier(booking.exitTime, new Date());
			if (!isEnded) return;

			if (status === "PENDING") {
				await prisma.user.update({
					where: {
						id: booking.customerId,
					},
					data: {
						score: booking.customer.score - 2,
					},
				});

				await prisma.booking.update({
					where: {
						id: booking.id,
					},
					data: {
						statusId: expired.id,
					},
				});
				return;
			}

			if (status === "ACTIVE") {
				await prisma.user.update({
					where: {
						id: booking.customerId,
					},
					data: {
						score: booking.customer.score + 4,
					},
				});

				await prisma.booking.update({
					where: {
						id: booking.id,
					},
					data: {
						statusId: used.id,
					},
				});
				return;
			}
		});

		return NextResponse.json("scores audited");
	} catch (err: any) {
		console.log("error: ", err);
		return new NextResponse(
			JSON.stringify({
				status: "error",
				message: err.message,
			}),
			{ status: 500 }
		);
	}
};
