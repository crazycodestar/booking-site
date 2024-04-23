import * as z from "zod";

export const createSeatSchema = z.object({
	name: z
		.string()
		.min(3, "name must be atleat 3 characters")
		.max(8, "Name cannot be more than 8 characters"),
});

export type createSeatSchema = z.infer<typeof createSeatSchema>;
