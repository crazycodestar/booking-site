import * as z from "zod";
import { GetSeatsResponseSchema } from "./seat";

export const GetRoomsResponseSchema = z.array(
	z.object({
		name: z.string(),
		image: z.string().nullable(),
		seats: GetSeatsResponseSchema,
	})
);

export type GetRoomsResponseSchema = z.infer<typeof GetRoomsResponseSchema>;
