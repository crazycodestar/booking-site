import { prisma } from "@/lib/prisma";
import { compare } from "bcryptjs";
import type { NextAuthOptions, DefaultUser } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma as PrismaConfig } from "@/server/db";

declare module "next-auth" {
	interface User extends DefaultUser {
		id: string;
		randomKey: string;
	}
}

export const authOptions: NextAuthOptions = {
	pages: {
		signIn: "/signIn",
	},
	adapter: PrismaAdapter(PrismaConfig),
	session: {
		strategy: "jwt",
	},
	providers: [
		CredentialsProvider({
			name: "Sign in",
			credentials: {
				email: {
					label: "Email",
					type: "email",
					placeholder: "example@example.com",
				},
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				if (!credentials?.email || !credentials.password) {
					return null;
				}

				const user = await prisma.user.findUnique({
					where: {
						email: credentials.email,
					},
				});

				if (!user) return null;
				if (!user.password) return null;
				const isSame = await compare(credentials.password, user.password);

				if (!user || !isSame) {
					return null;
				}

				return {
					id: user.id,
					email: user.email,
					name: user.name,
					randomKey: "Hey cool",
				};
			},
		}),
	],
	callbacks: {
		session: ({ session, token }) => {
			// console.log("Session Callback", { session, token });
			return {
				...session,
				user: {
					...session.user,
					id: token.id,
					randomKey: token.randomKey,
				},
			};
		},
		jwt: ({ token, user }) => {
			// console.log("JWT Callback", { token, user });
			if (user) {
				// TODO: figure out how to get rid of eslint errors here
				const u = user;
				return {
					...token,
					id: u.id,
					randomKey: u.randomKey,
				};
			}
			return token;
		},
		redirect: ({ url, baseUrl }) => {
			// Allows relative callback URLs
			if (url.startsWith("/")) return `${baseUrl}${url}`;
			// Allows callback URLs on the same origin
			else if (new URL(url).origin === baseUrl) return url;
			return baseUrl;
		},
	},
};
