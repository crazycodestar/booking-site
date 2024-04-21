import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";
import type { userRegistrationSchema } from "@/lib/validations/auth";

const createUser = async ({
	email,
	password,
	name,
}: userRegistrationSchema) => {
	const hashPassword = await hash(password, 12);

	try {
		return await prisma.user.create({
			data: {
				name,
				email: email.toLocaleLowerCase(),
				password: hashPassword,
			},
		});
	} catch (err) {
		throw err;
	}
};

export { createUser };
