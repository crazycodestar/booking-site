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

export { generateTimeSlots };
