export function formatNumber(number: number) {
	return "#" + number.toString().padStart(3, "0");
}
