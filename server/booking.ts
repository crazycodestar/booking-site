import { prisma } from "@/lib/prisma";
import { generateTimeSlots } from "../lib/time-functions";

export const getAvaliableBooking = () => {
	console.log("made it here :yay");
	const startTime = new Date();
	startTime.setHours(8, 0, 0, 0);
	const endTime = new Date();
	endTime.setHours(21, 0, 0, 0);

	const slots = generateTimeSlots(startTime, endTime);
	console.log(slots);

	const seats = prisma.seat.findMany({
		include: {
			bookings: {
				select: {
					entryTime: true,
					exitTime: true,
				},
			},
		},
	});
};

const createBooking = (time: Date) => {
	// TODO:
};

const markBookingAsUsed = (bookingId: string) => {
	// TODO:
};
