export function formatNumber(number: number) {
	return "#" + number.toString().padStart(3, "0");
}

export function formatCode(input: string) {
	// Extract the letter part (first three characters)
	const letters = input.slice(0, 3);
	// Extract the number part (last three characters)
	const numbers = input.slice(3);
	// Combine them with a hyphen
	return letters + "-" + numbers;
}
