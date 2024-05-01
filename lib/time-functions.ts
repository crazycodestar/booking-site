import { Time } from "@internationalized/date";
import { GetRoomsResponseSchema } from "./validations/room";

export function generateTimeSlots() {
	const startTime = new Date();
	startTime.setUTCHours(8, 0, 0, 0); // Set start time to 8:00AM
	const endTime = new Date();
	endTime.setUTCHours(21, 0, 0, 0); // Set end time to 9:00PM

	const timeSlots = [];
	let currentTime = startTime;

	while (currentTime <= endTime) {
		timeSlots.push(new Date(currentTime)); // Push a copy of current time to avoid mutating the original
		currentTime.setMinutes(currentTime.getUTCMinutes() + 30); // Move to next 30-minute slot
	}

	return timeSlots;
}

const generateStartTimeArray = (vacancies: [Date, Date][]): Date[] => {
	return generateTimeSlots().filter((timeSlot) =>
		Boolean(
			vacancies.find(
				(vacancyRange) =>
					isFirstTimeEarlier(vacancyRange[0], timeSlot) &&
					isFirstTimeEarlier(timeSlot, vacancyRange[1])
			)
		)
	);
};

function mergeAndRemoveDuplicates(arr1: Date[], arr2: Date[]) {
	// Merge the arrays
	const mergedArray = arr1.concat(arr2);

	// Create an empty object to store unique values
	const uniqueValues: Record<string, boolean> = {};

	// Loop through the merged array
	for (let i = 0; i < mergedArray.length; i++) {
		// Add each element as a key to the object
		const timeAsString = formatTime(mergedArray[i]);
		uniqueValues[timeAsString] = true;
	}

	// Get the keys (unique values) from the object
	const resultArray = Object.keys(uniqueValues)
		.map(
			(key) =>
				arr1.find((element) => formatTime(element) === key) ||
				arr2.find((element) => formatTime(element) === key)
		)
		.filter((element) => element !== undefined);

	return resultArray as Date[];
}

export const getAvaliableTimeSlots = (roomVacancies: [Date, Date][][]) => {
	return roomVacancies.reduce(
		(accumulatedStartTimeArray, currentSeatVacancies) => {
			const currentStartTimeArray =
				generateStartTimeArray(currentSeatVacancies);
			if (!accumulatedStartTimeArray.length) return currentStartTimeArray;

			const toSortedStartTimeArray = mergeAndRemoveDuplicates(
				accumulatedStartTimeArray,
				currentStartTimeArray
			);
			toSortedStartTimeArray.sort((a, b) => compareDates(a, b));

			return toSortedStartTimeArray;
		},
		[] as Date[]
	);
};

function isTimeWithinRange(startTime: Date, endTime: Date, checkTime: Date) {
	// Check if checkTime is within the range
	return checkTime >= startTime && checkTime <= endTime;
}

export function compareDates(d1: Date, d2: Date) {
	// // Convert dates to Date objects for comparison
	// var d1 = new Date(date1);
	// var d2 = new Date(date2);

	// Compare the dates
	if (d1 < d2) {
		return -1; // date1 comes before date2
	} else if (d1 > d2) {
		return 1; // date1 comes after date2
	} else {
		return 0; // dates are equal
	}
}

export function findVacantTimes(bookings: [Date, Date][]): [Date, Date][] {
	const sortedBookings = bookings.sort((a, b) => compareDates(a[0], b[0]));

	//FIXME: setting booking for 8:00AM not working

	const openingHour = new Date();
	openingHour.setUTCHours(8, 0, 0, 0); // Set opening hour to 8:00AM
	const closingHour = new Date();
	closingHour.setUTCHours(21, 0, 0, 0); // Set closing hour to 9:00PM

	const vacantPeriods: [Date, Date][] = [];

	if (!bookings.length) return [[openingHour, closingHour]];

	const firstBookingStartTime = sortedBookings[0][0];
	if (firstBookingStartTime !== openingHour)
		vacantPeriods.push([openingHour, firstBookingStartTime]);

	for (let i = 1; i < sortedBookings.length; i++) {
		const perviousBookingEndTime = sortedBookings[i - 1][1];
		const currentBookingStartTime = sortedBookings[i][0];

		if (perviousBookingEndTime !== currentBookingStartTime)
			vacantPeriods.push([perviousBookingEndTime, currentBookingStartTime]);
	}

	const lastBookingEndTime = sortedBookings[sortedBookings.length - 1][1];
	if (lastBookingEndTime !== closingHour)
		vacantPeriods.push([lastBookingEndTime, closingHour]);

	return vacantPeriods;
}

export function isFirstTimeEarlier(firstDate: Date, secondDate: Date) {
	// Extract hours and minutes from the first date
	const hours1 = firstDate.getUTCHours();
	const minutes1 = firstDate.getUTCMinutes();

	// Extract hours and minutes from the second date
	const hours2 = secondDate.getUTCHours();
	const minutes2 = secondDate.getUTCMinutes();

	// Compare hours first
	if (hours1 <= hours2) {
		return true;
	} else if (hours1 > hours2) {
		return false;
	}

	// If hours are the same, compare minutes
	return minutes1 <= minutes2;
}

export const findAvaliableDuration = (
	//FIXME: 8:00 - 9:00 seat 1 8:00 - 8:30 seat 2 not showing 30 minutes
	seatVacancies: [Date, Date][][],
	startTime: Date
) => {
	let avaliableTimeInMinutes: number = 0;
	seatVacancies.forEach((vacancies) => {
		const vacancy = vacancies.find(
			(vacancy) =>
				isFirstTimeEarlier(vacancy[0], startTime) &&
				isFirstTimeEarlier(startTime, vacancy[1])
		); // TODO: make this "&&" comparison into one function
		if (!vacancy) return;

		const endTime = vacancy[1];
		const vacancyAvaliableTimeInMinutes =
			(endTime.getUTCHours() - startTime.getUTCHours()) * 60 +
			(endTime.getUTCMinutes() - startTime.getUTCMinutes());

		if (avaliableTimeInMinutes < vacancyAvaliableTimeInMinutes)
			avaliableTimeInMinutes = vacancyAvaliableTimeInMinutes;
	});

	return avaliableTimeInMinutes;
};

export type Option = { name: string; value: number };

export function minutesToHoursAndMinutes(minutes: number) {
	var hours = Math.floor(minutes / 60);
	var remainingMinutes = minutes % 60;

	let hoursString = "";
	let remainingMinutesString = "";
	if (hours && hours > 1) hoursString = `${hours}hrs`;
	else if (hours === 1) hoursString = `${hours}hr`;

	if (remainingMinutes) remainingMinutesString = remainingMinutes + "mins";

	return hoursString + (remainingMinutesString && " ") + remainingMinutesString;
}

export const generateListings = (
	durationLimitinMinutes: number,
	durationInMinutes: number,
	stepsInMinutes: number
) => {
	const options: Option[] = [];
	const noOfSteps =
		durationLimitinMinutes > durationInMinutes
			? Math.floor(durationInMinutes / stepsInMinutes)
			: Math.floor(durationLimitinMinutes / stepsInMinutes);

	for (let i = 0; i < noOfSteps; i++)
		options.push({
			name: minutesToHoursAndMinutes(stepsInMinutes * (i + 1)),
			value: stepsInMinutes * (i + 1),
		});

	return options;
};

export const findSeatWithStartTimeAndDuration = (
	seatVacancies: { seatId: string; seatVacancies: [Date, Date][] }[],
	startTime: Date,
	duration: number
) => {
	let booking: { seatId: string; duration: number } | undefined;

	seatVacancies.forEach(({ seatId, seatVacancies: vacancies }) => {
		const vacancy = vacancies.find((vacancy) => {
			return (
				isFirstTimeEarlier(vacancy[0], startTime) &&
				isFirstTimeEarlier(startTime, vacancy[1])
			);
		}); // TODO: make this "&&" comparison into one function

		if (!vacancy) return;

		const endTime = vacancy[1];
		const vacancyAvaliableTimeInMinutes =
			(endTime.getUTCHours() - startTime.getUTCHours()) * 60 +
			(endTime.getUTCMinutes() - startTime.getUTCMinutes());

		if (vacancyAvaliableTimeInMinutes < duration) return;

		if (!booking || vacancyAvaliableTimeInMinutes < booking.duration)
			return (booking = { seatId, duration: vacancyAvaliableTimeInMinutes });
	});

	// polish return
	if (!booking) return;

	const endTimeAsTimeType = new Time(
		startTime.getUTCHours(),
		startTime.getUTCMinutes()
	).add({ minutes: duration });
	const endTime = new Date();
	endTime.setUTCHours(endTimeAsTimeType.hour, endTimeAsTimeType.minute);

	return {
		seatId: booking.seatId,
		entryTime: startTime,
		exitTime: endTime,
	};
};

export function generateRandomCode() {
	// Helper function to generate a random letter from A-Z
	function getRandomLetter() {
		const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
		return letters[Math.floor(Math.random() * letters.length)];
	}

	// Helper function to generate a random digit from 0-9
	function getRandomDigit() {
		return Math.floor(Math.random() * 10);
	}

	// Generate three random letters
	let lettersPart = "";
	for (let i = 0; i < 3; i++) {
		lettersPart += getRandomLetter();
	}

	// Generate three random digits
	let digitsPart = "";
	for (let i = 0; i < 3; i++) {
		digitsPart += getRandomDigit();
	}

	// Combine the parts with a dash
	return lettersPart + "-" + digitsPart;
}

export const findCurrenttBooking = (
	bookings: { entryTime: Date; exitTime: Date; status: string }[] // TODO: use variable type
) => {
	return bookings.find((booking) => {
		const currentTime = new Date(Date.now());
		const startTime = new Date(booking.entryTime);
		const endTime = new Date(booking.exitTime);

		return (
			isFirstTimeEarlier(startTime, currentTime) &&
			isFirstTimeEarlier(currentTime, endTime) &&
			(booking.status === "ACTIVE" || booking.status === "PENDING")
		);
	});
};

export const findNextBooking = (
	bookings: { entryTime: Date; exitTime: Date; status: string }[] // TODO: use variable type
) => {
	return bookings.find((booking) => {
		const currentTime = new Date(Date.now());
		const startTime = new Date(booking.entryTime);

		return (
			isFirstTimeEarlier(currentTime, startTime) &&
			(booking.status === "ACTIVE" || booking.status === "PENDING")
		);
	});
};

export function formatTime(date: Date) {
	// Get hours and minutes from the Date object
	const hours = date.getUTCHours();
	const minutes = date.getUTCMinutes();

	// Format hours and minutes with leading zeros if necessary
	const formattedHours = String(hours).padStart(2, "0");
	const formattedMinutes = String(minutes).padStart(2, "0");

	// Combine hours and minutes with a colon
	return formattedHours + ":" + formattedMinutes;
}

type RoomSeats = GetRoomsResponseSchema[number]["seats"];
type ClosestBooking = { entryTime: Date; exitTime: Date; status: string };

const formatBookingInSeat = (
	bookingInSeat: Exclude<ReturnType<typeof findCurrenttBooking>, undefined>
) => {
	return {
		entryTime: bookingInSeat.entryTime,
		exitTime: bookingInSeat.exitTime,
		status: bookingInSeat.status,
	};
};

export const findCurrentOrNextBooking = (seats: RoomSeats) => {
	let closestBooking: ClosestBooking | undefined;

	seats.forEach((seat) => {
		const currentBookingInSeat = findCurrenttBooking(seat.bookings);
		const nextBookingInSeat = findNextBooking(seat.bookings);

		let currentOrNextBookingInSeat: ClosestBooking | undefined;

		if (currentBookingInSeat)
			currentOrNextBookingInSeat = formatBookingInSeat(currentBookingInSeat);
		else if (nextBookingInSeat)
			currentOrNextBookingInSeat = formatBookingInSeat(nextBookingInSeat);

		if (!currentOrNextBookingInSeat) return;
		if (!closestBooking) return (closestBooking = currentOrNextBookingInSeat);
		if (
			isFirstTimeEarlier(
				currentOrNextBookingInSeat?.entryTime,
				closestBooking?.entryTime
			)
		)
			return (closestBooking = currentOrNextBookingInSeat);
	});

	return closestBooking;
};
