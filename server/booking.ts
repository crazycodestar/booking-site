import { prisma } from "@/lib/prisma";
import {
	findVacantTimes,
	findSeatWithStartTimeAndDuration,
	generateRandomCode,
} from "../lib/time-functions";
import { BookingSchema } from "../lib/validations/booking";

const getSeatBookings = async () =>
	await prisma.seat.findMany({
		include: {
			bookings: {
				select: {
					entryTime: true,
					exitTime: true,
					status: true,
				},
			},
		},
	});

export type SeatBookingType = Awaited<ReturnType<typeof getSeatBookings>>;

export const getBookings = () =>
	prisma.booking.findMany({
		include: {
			customer: true,
			status: true,
			seat: true,
		},
	});

export const getUserBookings = (userId: string) =>
	prisma.booking.findMany({
		where: {
			customerId: userId,
		},
		include: {
			customer: true,
			status: true,
			seat: true,
		},
	});

export const getAvaliableBooking = async () => {
	// FIXME: change to variable opening and closing times
	const startTime = new Date();
	startTime.setHours(8, 0, 0, 0);
	const endTime = new Date();
	endTime.setHours(21, 0, 0, 0);

	// const slots = generateTimeSlots(startTime, endTime);

	const seats = (await getSeatBookings()).map((seat) => ({
		...seat,
		bookings: seat.bookings.filter(
			(booking) =>
				booking.status.status === "PENDING" ||
				booking.status.status === "ACTIVE"
		),
	}));

	return seats.map((seat) => {
		const bookings = seat.bookings.map(
			(booking) => [booking.entryTime, booking.exitTime] as [Date, Date]
		);
		return findVacantTimes(bookings);
	});
};

export const createBooking = async (
	booking: Omit<BookingSchema, "time"> & {
		time: { hour: number; minute: number };
	}
) => {
	try {
		// get random customer FIXME: proper customer
		const userId = (await prisma.user.findMany())[0].id;
		const pendingStatus = await prisma.bookingStatus.findFirst({
			where: { status: "PENDING" },
		});
		if (!pendingStatus) throw new Error("no Pending status");

		// find seat with particular vacancy
		const seats = await getSeatBookings();
		const vacancies = seats.map((seat) => ({
			seatId: seat.id,
			seatVacancies: findVacantTimes(
				seat.bookings
					.filter(
						(booking) =>
							booking.status.status === "PENDING" ||
							booking.status.status === "ACTIVE"
					)
					.map((booking) => [booking.entryTime, booking.exitTime])
			),
		}));

		console.log(
			"vacnacies",
			vacancies.forEach((vacancy) => console.log(vacancy.seatVacancies))
		);

		const startTime = new Date();
		startTime.setHours(booking.time.hour, booking.time.minute);

		const bookingData = findSeatWithStartTimeAndDuration(
			vacancies,
			startTime,
			booking.duration
		);

		if (!bookingData) throw new Error("Something Went Wrong");

		const code = generateRandomCode();

		return await prisma.booking.create({
			data: {
				customerId: userId,
				statusId: pendingStatus.id,
				code,
				...bookingData,
			},
		});
	} catch (err) {
		throw err;
	}

	// TODO:
};

export const getBooking = async (code: string) => {
	console.log("code: ", code);
	const result = await prisma.booking.findFirst({
		where: {
			code: code,
		},
		include: {
			seat: true,
			customer: true,
		},
	});

	if (!result) throw new Error("booking not found");
	return result;
};

export const activateBooking = async (code: string) => {
	try {
		console.log("code here: ", code);
		const booking = await getBooking(code);
		const active = await prisma.bookingStatus.findFirst({
			where: {
				status: "ACTIVE",
			},
		});
		if (!active) throw new Error("ACTIVE doesn't exist");

		const result = await prisma.booking.update({
			where: {
				id: booking.id,
			},
			data: {
				statusId: active.id,
			},
		});
		return result;
	} catch (err: any) {
		throw err;
	}
};

export const cancelBooking = async (code: string) => {
	try {
		console.log("code here: ", code);
		const booking = await getBooking(code);
		const active = await prisma.bookingStatus.findFirst({
			where: {
				status: "CANCELLED",
			},
		});
		if (!active) throw new Error("CANCELLED doesn't exist");

		const result = await prisma.booking.update({
			where: {
				id: booking.id,
			},
			data: {
				statusId: active.id,
			},
		});
		return result;
	} catch (err: any) {
		throw err;
	}
};
