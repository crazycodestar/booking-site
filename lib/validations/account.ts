import * as z from "zod";

export const GetSearchAccountResponseSchema = z.array(
	z.object({
		id: z.string(),
		name: z.string(),
		email: z.string(),
	})
);

export type GetSearchAccountResponseSchema = z.infer<
	typeof GetSearchAccountResponseSchema
>;
