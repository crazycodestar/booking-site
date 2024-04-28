import { expect, test } from "vitest";
import { generateTimeSlots, findVacantTimes } from "../lib/time-functions";

test("Page", () => {
	const startTime = new Date();
	startTime.setHours(8, 0, 0, 0);
	const endTime = new Date();
	endTime.setHours(21, 0, 0, 0);

	const occupiedTime: [Date, Date][] = [
		[
			new Date("2024-04-21T11:00:00.000Z"),
			new Date("2024-04-21T12:30:00.000Z"),
		],
		[
			new Date("2024-04-21T01:30:00.000Z"),
			new Date("2024-04-21T02:30:00.000Z"),
		],
	];
	const slots = generateTimeSlots(startTime, endTime);
	const vacantTime = findVacantTimes(occupiedTime);

	expect(slots).toBeDefined();
});
