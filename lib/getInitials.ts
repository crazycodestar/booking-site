export function getInitials(name: string) {
	const parts = name.split(" ") as [string] | [string, string];
	const firstNameInitial = parts[0][0] as string;
	if (parts.length === 1) {
		return firstNameInitial;
	}
	const lastNameInitial = (parts[parts.length - 1] as string)[0] as string;
	return firstNameInitial + lastNameInitial;
}
