"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { cn } from "@/lib/utils";
import { userAuthSchema } from "@/lib/validations/auth";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { Loader } from "lucide-react";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

type FormData = z.infer<typeof userAuthSchema>;

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormData>({
		resolver: zodResolver(userAuthSchema),
	});
	const [isLoading, setIsLoading] = React.useState<boolean>(false);
	const searchParams = useSearchParams();

	async function onSubmit(data: FormData) {
		setIsLoading(true);

		const signInResult = await signIn("credentials", {
			email: data.email.toLowerCase(),
			password: data.password,
			callbackUrl: searchParams?.get("from") || "/home",
		});

		setIsLoading(false);

		if (!signInResult?.ok) {
			return toast({
				title: "Something went wrong.",
				description: "Your sign in request failed. Please try again.",
				variant: "destructive",
			});
		}
	}

	return (
		<div className={cn("grid gap-6", className)} {...props}>
			<form onSubmit={handleSubmit(onSubmit)}>
				<div className="grid gap-4">
					<div className="flex gap-2 flex-col">
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
