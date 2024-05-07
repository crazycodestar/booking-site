import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

const generateRoomNumber = (index: number) => "00" + index;

async function main() {
	// // create roles
	// const roleNames = ["ADMIN", "USER"];
	// const roles = await Promise.all(
	// 	roleNames.map(async (role) => {
	// 		const result = await prisma.role.upsert({
	// 			where: {
	// 				role,
	// 			},
	// 			update: {},
	// 			create: {
	// 				role: role,
	// 			},
	// 		});

	// 		return result;
	// 	})
	// );

	// if (!roles.length) throw new Error("No roles created");

	// // create User

	// const adminRole = roles.find((role) => role.role === "ADMIN");
	// if (!adminRole) throw new Error("No Admin role found");

	// const email = "admin@admin.com";
	// const password = await hash("password123", 12);
	// const user = await prisma.user.upsert({
	// 	where: {
	// 		email,
	// 	},
	// 	update: {},
	// 	create: {
	// 		email,
	// 		name: "Admin",
	// 		password,
	// 		roleId: adminRole.id,
	// 	},
	// });

	// // create booking status

	// const bookingStatusNames = [
	// 	"PENDING",
	// 	"ACTIVE",
	// 	"USED",
	// 	"EXPIRED",
	// 	"CANCELLED",
	// ];
	// const bookingStatusPending = await prisma.bookingStatus.upsert({
	// 	where: {
	// 		status: "PENDING",
	// 	},
	// 	update: {},
	// 	create: {
	// 		status: "PENDING",
	// 	},
	// });

	// if (!bookingStatusPending)
	// 	throw new Error("bookstatus not created. status: " + "PENDING");

	// const bookingStatusActive = await prisma.bookingStatus.upsert({
	// 	where: {
	// 		status: "ACTIVE",
	// 	},
	// 	update: {},
	// 	create: {
	// 		status: "ACTIVE",
	// 	},
	// });

	// if (!bookingStatusActive)
	// 	throw new Error("bookstatus not created. status: " + "ACTIVE");

	// const bookingStatusUsed = await prisma.bookingStatus.upsert({
	// 	where: {
	// 		status: "USED",
	// 	},
	// 	update: {},
	// 	create: {
	// 		status: "USED",
	// 	},
	// });

	// if (!bookingStatusUsed)
	// 	throw new Error("bookstatus not created. status: " + "USED");

	// const bookingStatusCancelled = await prisma.bookingStatus.upsert({
	// 	where: {
	// 		status: "CANCELLED",
	// 	},
	// 	update: {},
	// 	create: {
	// 		status: "CANCELLED",
	// 	},
	// });

	// if (!bookingStatusCancelled)
	// 	throw new Error("bookstatus not created. status: " + "CANCELLED");

	// const bookingStatusExpired = await prisma.bookingStatus.upsert({
	// 	where: {
	// 		status: "EXPIRED",
	// 	},
	// 	update: {},
	// 	create: {
	// 		status: "EXPIRED",
	// 	},
	// });

	// if (!bookingStatusExpired)
	// 	throw new Error("bookstatus not created. status: " + "EXPIRED");

	// create Rooms and seats
	const images = [
		"https://images.pexels.com/photos/3747299/pexels-photo-3747299.jpeg?auto=compress&cs=tinysrgb&w=600",
		"https://images.pexels.com/photos/3747293/pexels-photo-3747293.jpeg?auto=compress&cs=tinysrgb&w=600",
		"https://images.pexels.com/photos/1370296/pexels-photo-1370296.jpeg?auto=compress&cs=tinysrgb&w=600",
		"https://images.pexels.com/photos/3747416/pexels-photo-3747416.jpeg?auto=compress&cs=tinysrgb&w=600",
		"https://images.pexels.com/photos/3747443/pexels-photo-3747443.jpeg?auto=compress&cs=tinysrgb&w=600",
		"https://images.pexels.com/photos/927022/pexels-photo-927022.jpeg?auto=compress&cs=tinysrgb&w=600",
		"https://images.pexels.com/photos/3975569/pexels-photo-3975569.jpeg?auto=compress&cs=tinysrgb&w=600",
		"https://images.pexels.com/photos/19328775/pexels-photo-19328775/free-photo-of-laptop-standing-on-the-desk-in-a-modern-interior.jpeg?auto=compress&cs=tinysrgb&w=600",
		"https://images.pexels.com/photos/2319419/pexels-photo-2319419.jpeg?auto=compress&cs=tinysrgb&w=600",
		"https://images.pexels.com/photos/6183137/pexels-photo-6183137.jpeg?auto=compress&cs=tinysrgb&w=600",
	];

	const room = await prisma.room.createMany({
		data: [
			{
				roomNumber: "001",
				image:
					"https://images.pexels.com/photos/3747299/pexels-photo-3747299.jpeg?auto=compress&cs=tinysrgb&w=600",
			},
			{
				roomNumber: "002",
				image:
					"https://images.pexels.com/photos/3747293/pexels-photo-3747293.jpeg?auto=compress&cs=tinysrgb&w=600",
			},
			{
				roomNumber: "003",
				image:
					"https://images.pexels.com/photos/1370296/pexels-photo-1370296.jpeg?auto=compress&cs=tinysrgb&w=600",
			},
			{
				roomNumber: "004",
				image:
					"https://images.pexels.com/photos/3747416/pexels-photo-3747416.jpeg?auto=compress&cs=tinysrgb&w=600",
			},
			{
				roomNumber: "005",
				image:
					"https://images.pexels.com/photos/3747443/pexels-photo-3747443.jpeg?auto=compress&cs=tinysrgb&w=600",
			},
			{
				roomNumber: "006",
				image:
					"https://images.pexels.com/photos/927022/pexels-photo-927022.jpeg?auto=compress&cs=tinysrgb&w=600",
			},
			{
				roomNumber: "007",
				image:
					"https://images.pexels.com/photos/3975569/pexels-photo-3975569.jpeg?auto=compress&cs=tinysrgb&w=600",
			},
			{
				roomNumber: "008",
				image:
					"https://images.pexels.com/photos/19328775/pexels-photo-19328775/free-photo-of-laptop-standing-on-the-desk-in-a-modern-interior.jpeg?auto=compress&cs=tinysrgb&w=600",
			},
			{
				roomNumber: "009",
				image:
					"https://images.pexels.com/photos/2319419/pexels-photo-2319419.jpeg?auto=compress&cs=tinysrgb&w=600",
			},
			{
				roomNumber: "0010",
				image:
					"https://images.pexels.com/photos/6183137/pexels-photo-6183137.jpeg?auto=compress&cs=tinysrgb&w=600",
			},
		],
	});

	// 	const seat = await prisma.seat.createMany({
	// 		data: [
	// 			{
	// 				name: "001",
	// 				roomId: room.id,
	// 			},
	// 		],
	// 	});
	// });
}
main()
	.then(() => prisma.$disconnect())
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});

// "prisma": {
// 	"seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
// }
