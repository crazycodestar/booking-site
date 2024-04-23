function generateTimeSlots(startTime: Date, endTime: Date) {
	// const startTime = new Date();
	// startTime.setHours(8, 0, 0, 0); // Set start time to 8:00AM
	// const endTime = new Date();
	// endTime.setHours(21, 0, 0, 0); // Set end time to 9:00PM

	const timeSlots = [];
	let currentTime = startTime;

	while (currentTime <= endTime) {
		timeSlots.push(new Date(currentTime)); // Push a copy of current time to avoid mutating the original
		currentTime.setMinutes(currentTime.getMinutes() + 30); // Move to next 30-minute slot
	}

	return timeSlots;
}

function isTimeWithinRange(startTime: Date, endTime: Date, checkTime: Date) {
	// Check if checkTime is within the range
	return checkTime >= startTime && checkTime <= endTime;
}

function compareDates(d1: Date, d2: Date) {
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

function findVacantTimes(bookings: [Date, Date][]): [Date, Date][] {
	const sortedBookings = bookings.sort((a, b) => compareDates(a[0], b[0]));

	const openingHour = new Date();
	openingHour.setHours(8, 0, 0, 0); // Set opening hour to 8:00AM
	const closingHour = new Date();
	closingHour.setHours(21, 0, 0, 0); // Set closing hour to 9:00PM

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

export { generateTimeSlots, findVacantTimes };
