"use client";

import { User } from "next-auth";
import { signOut } from "next-auth/react";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserAvatar } from "@/components/user-avatar";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "./ui/dialog";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Prisma } from "@prisma/client";
import { Badge } from "./ui/badge";

interface UserAccountNavProps extends React.HTMLAttributes<HTMLDivElement> {
	user: Pick<User, "name" | "image" | "email">;
}

export function UserAccountNav({ user }: UserAccountNavProps) {
	const { data, isLoading } = useQuery({
		queryKey: ["role"],
		queryFn: async () =>
			(await axios.get("api/account")).data as { role: { role: string } },
	});

	const isAdmin = data?.role.role === "ADMIN";

	return (
		<Dialog>
			<DropdownMenu>
				<DropdownMenuTrigger>
					<UserAvatar
						user={{ name: user.name || null, image: user.image || null }}
						className="h-8 w-8"
					/>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<div className="flex items-center justify-start gap-2 p-2">
						<div className="flex flex-col space-y-1 leading-none">
							{user.name && <p className="font-medium">{user.name}</p>}
							{user.email && (
								<p className="w-[200px] truncate text-sm text-muted-foreground">
									{user.email}
								</p>
							)}
						</div>
					</div>
					<DropdownMenuSeparator />
					{/* profile */}
					<DialogTrigger asChild>
						<DropdownMenuItem>Profile</DropdownMenuItem>
					</DialogTrigger>
					<DropdownMenuSeparator />
					<DropdownMenuItem
						className="cursor-pointer"
						onSelect={(event) => {
							event.preventDefault();
							signOut({
								callbackUrl: `${window.location.origin}/login`,
							});
						}}
					>
						Sign out
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			<DialogContent>
				<DialogHeader>
					<DialogTitle>Profile</DialogTitle>
					<DialogDescription>
						This is how others will see you on the site.
					</DialogDescription>
				</DialogHeader>
				<div className="flex">
					<UserAvatar
						user={{ name: user.name || null, image: user.image || null }}
						className="h-8 w-8"
					/>

					<div className="flex items-center justify-start gap-2 p-2">
						<div className="flex flex-col space-y-1 leading-none">
							{user.name && <p className="font-medium">{user.name}</p>}
							{user.email && (
								<p className="truncate text-sm text-muted-foreground">
									{user.email}
								</p>
							)}
							{isAdmin ? (
								<div>
									<Badge variant={"destructive"}>ADMIN</Badge>
								</div>
							) : null}
						</div>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
