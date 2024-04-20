import * as z from "zod";

export const userAuthSchema = z.object({
	email: z.string().email(),
	password: z
		.string()
		.min(8, "Password must be atleast 8 characters")
		.max(16, "Password cannot be more than 16 characters"),
});
