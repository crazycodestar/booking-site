import { prisma } from "@/lib/prisma";
import { formatNumber } from "../lib/format-number";

const createSeat = async () => {
	const seatName = formatNumber((await getAllSeats()).length + 1); //FIXME: could go wrong in logs of ways
	return await prisma.seat.create({
		data: {
			name: seatName,
		},
	});
};

const getAllSeats = async () => await prisma.seat.findMany();

const deleteSeats = async () => {
	//TODO: delete seats and cancel all pending reservations
};

export { createSeat, getAllSeats };
