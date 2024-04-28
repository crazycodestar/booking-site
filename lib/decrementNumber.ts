export function incrementNumber(input: string) {
	// Extract the number part (remove leading zeros if any)
	const numberPart = input.slice(1);
	// Convert the number part to a number and increment it
	let number = parseInt(numberPart, 10) + 1;
	// Ensure the number is within bounds (>= 0)
	if (number < 0) {
		number = 0;
	}
	// Convert the number back to a string and pad with leading zeros if necessary
	const formattedNumber = String(number).padStart(numberPart.length, "0");
	// Combine the formatted number with the rest of the input
	return "#" + formattedNumber;
}

export function decrementNumber(input: string) {
	// Extract the number part (remove leading zeros if any)
	const numberPart = input.slice(1);
	// Convert the number part to a number and decrement it
	let number = parseInt(numberPart, 10) - 1;
	// Ensure the number is within bounds (>= 0)
	if (number < 0) {
		number = 0;
	}
	// Convert the number back to a string and pad with leading zeros if necessary
	const formattedNumber = String(number).padStart(numberPart.length, "0");
	// Combine the formatted number with the rest of the input
	return "#" + formattedNumber;
}

export function convertToNumber(input: string) {
	// Extract the number part (remove leading zeros if any)
	const numberPart = input.replace(/^0+/, "");
	// Convert the number part to a number
	const number = parseInt(numberPart, 10);
	return number;
}
