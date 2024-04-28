import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";
import type { userRegistrationSchema } from "@/lib/validations/auth";

const createUser = async ({
	email,
	password,
	name,
}: userRegistrationSchema) => {
	const hashPassword = await hash(password, 12);
	const role = await prisma.role.findFirst({ where: { role: "USER" } });

	if (!role) return;

	try {
		return await prisma.user.create({
			data: {
				name,
				email: email.toLocaleLowerCase(),
				password: hashPassword,
				roleId: role.id,
			},
		});
	} catch (err) {
		throw err;
	}
};

export const getUser = async (userId: string) => {
	const user = await prisma.user.findFirst({
		where: { id: userId },
		include: { role: true },
	});
	if (!user) throw new Error("no user found");

	return user;
};

export { createUser };
