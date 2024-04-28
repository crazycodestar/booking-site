import { prisma } from "@/lib/prisma";
import { formatNumber } from "../lib/format-number";
import { convertToNumber, incrementNumber } from "../lib/decrementNumber";

const createSeat = async () => {
	let seatName = "#001";
	const seats = await prisma.seat.findMany();
	const orderedSeats = seats.sort(
		(a, b) => convertToNumber(a.name) - convertToNumber(b.name)
	);

	const lastSeat = orderedSeats.at(-1);
	if (lastSeat) seatName = incrementNumber(lastSeat.name);
	// const seatName = formatNumber((await getAllSeats()).length + 1); //FIXME: could go wrong in logs of ways
	return await prisma.seat.create({
		data: {
			name: seatName,
		},
	});
};

const getAllSeats = async () =>
	await prisma.seat.findMany({
		include: {
			bookings: {
				include: {
					customer: true,
					status: true,
				},
			},
		},
	});

export const deleteSeat = async (seatName: string) => {
	try {
		const seat = await prisma.seat.findFirst({ where: { name: seatName } });
		if (!seat) throw new Error("seat does not exist");

		const deleteBookings = prisma.booking.deleteMany({
			where: {
				seatId: seat.id,
			},
		});

		const deleteSeat = prisma.seat.delete({
			where: {
				id: seat.id,
			},
		});

		return await prisma.$transaction([deleteBookings, deleteSeat]);
	} catch (err: any) {
		throw err;
	}
};

export { createSeat, getAllSeats };
