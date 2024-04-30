import { prisma } from "@/lib/prisma";

export const getAllRooms = async () => {
	try {
		const rooms = await prisma.room.findMany({
			include: {
				seats: {
					include: {
						bookings: {
							include: {
								status: true,
								customer: true,
							},
						},
					},
				},
			},
		});
		if (!rooms) throw new Error("no rooms found");

		return rooms;
	} catch (err: any) {
		throw err;
	}
};
