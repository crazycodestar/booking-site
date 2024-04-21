"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { cn } from "@/lib/utils";
import { userRegistrationSchema } from "@/lib/validations/auth";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { Loader } from "lucide-react";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

type FormData = z.infer<typeof userRegistrationSchema>;

export function UserRegistrationForm({
	className,
	...props
}: UserAuthFormProps) {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormData>({
		resolver: zodResolver(userRegistrationSchema),
	});
	const [isLoading, setIsLoading] = React.useState<boolean>(false);
	const searchParams = useSearchParams();

	async function onSubmit(data: FormData) {
		setIsLoading(true);

		// const signInResult = await signIn("credentials", {
		// 	name: data.name,
		// 	email: data.email.toLowerCase(),
		// 	password: data.password,
		// 	redirect: false,
		// 	callbackUrl: searchParams?.get("from") || "/dashboard",
		// });

		try {
			// TODO: clean up fetch setup
			type Temp = {
				ok: boolean;
				json: () => Promise<{ message: string }>;
			};
			const signInResult = (await fetch("/api/account", {
				method: "POST",
				body: JSON.stringify(data),
				headers: {
					"Content-Type": "application/json",
				},
			})) as unknown as Temp;

			setIsLoading(false);

			if (!signInResult?.ok) {
				return toast({
					title: "Something went wrong.",
					description: "Your sign in request failed. Please try again.",
					variant: "destructive",
				});
			}

			return toast({
				title: "Successful",
				description: "Your account as been created successfully",
			});

			// await signIn(undefined, { callbackUrl: "/dashboard" });
		} catch (err) {
			console.log(err);
		}
	}

	return (
		<div className={cn("grid gap-6", className)} {...props}>
			<form onSubmit={handleSubmit(onSubmit)}>
				<div className="grid gap-4">
					<div className="flex gap-2 flex-col">
						<div className="grid gap-1">
							<Label htmlFor="name">Name</Label>
							<Input
								id="name"
								placeholder="John Doe"
								type="text"
								autoCapitalize="none"
								autoComplete="off"
								autoCorrect="off"
								disabled={isLoading}
								{...register("name")}
							/>
							{errors?.name && (
								<p className="px-1 text-xs text-red-600">
									{errors.name.message}
								</p>
							)}
						</div>
						<div className="grid gap-1">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								placeholder="name@example.com"
								type="email"
								autoCapitalize="none"
								autoComplete="email"
								autoCorrect="off"
								disabled={isLoading}
								{...register("email")}
							/>
							{errors?.email && (
								<p className="px-1 text-xs text-red-600">
									{errors.email.message}
								</p>
							)}
						</div>
						<div className="grid gap-1">
							<Label htmlFor="password">Password</Label>
							<Input
								id="password"
								placeholder="********"
								type="password"
								autoCapitalize="none"
								autoComplete="password"
								autoCorrect="off"
								disabled={isLoading}
								{...register("password")}
							/>
						</div>
						{errors?.password && (
							<p className="px-1 text-xs text-red-600">
								{errors.password.message}
							</p>
						)}
					</div>
					<button className={cn(buttonVariants())} disabled={isLoading}>
						{isLoading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
						Sign In
					</button>
				</div>
			</form>
		</div>
	);
}
