import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

const generateRoomNumber = (index: number) => "00" + index;

async function main() {
	let AdminRoleId: string | undefined;
	// create roles
	const roles = ["ADMIN", "USER"];
	roles.forEach(async (role) => {
		const result = await prisma.role.upsert({
			where: {
				role: role,
			},
			update: {},
			create: {
				role: role,
			},
		});
		if (role === "ADMIN") AdminRoleId = result.id;
	});

	if (!AdminRoleId) throw new Error("Admin Role Failed");

	// create User

	const password = await hash("password123", 12);
	const user = await prisma.user.upsert({
		where: { email: "admin@admin.com" },
		update: {},
		create: {
			email: "admin@admin.com",
			name: "Admin",
			password,
			roleId: AdminRoleId,
		},
	});

	// create booking status

	const bookingStatus = ["PENDING", "ACTIVE", "USED", "EXPIRED", "CANCELLED"];
	bookingStatus.forEach(async (bookingStatus) => {
		await prisma.bookingStatus.upsert({
			where: {
				status: bookingStatus,
			},
			update: {},
			create: {
				status: bookingStatus,
			},
		});
	});

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

	for (let i = 1; i <= 10; i++) {
		const roomNumber = generateRoomNumber(i);
		const room = await prisma.room.create({
			data: {
				roomNumber: roomNumber,
				image: images[i - 1],
			},
		});
		if (!room) throw new Error("room not created room: " + roomNumber);

		for (let j = 1; j <= 10; j++) {
			const seatNumber = generateRoomNumber(j);
			const seat = await prisma.seat.create({
				data: {
					name: seatNumber,
					roomId: room.id,
				},
			});

			if (!seat) throw new Error("seat not created seat: " + seatNumber);
		}
	}
}
main()
	.then(() => prisma.$disconnect())
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
