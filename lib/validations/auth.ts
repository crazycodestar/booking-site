import * as z from "zod";

export const userAuthSchema = z.object({
	email: z.string().email(),
	password: z
		.string()
		.min(8, "Password must be atleast 8 characters")
		.max(16, "Password cannot be more than 16 characters"),
});

export type userAuthSchema = z.infer<typeof userAuthSchema>;

export const userRegistrationSchema = z.object({
	name: z.string().min(3, "name must be atleast 3 characters"),
	email: z.string().email(),
	password: z
		.string()
		.min(8, "Password must be atleast 8 characters")
		.max(16, "Password cannot be more than 16 characters"),
});

export type userRegistrationSchema = z.infer<typeof userRegistrationSchema>;
