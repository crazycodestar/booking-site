import { prisma } from "@/lib/prisma";
import { compare } from "bcryptjs";
import type { NextAuthOptions, DefaultUser, DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma as PrismaConfig } from "@/server/db";
import { Session } from "inspector";

declare module "next-auth" {
	interface User extends DefaultUser {
		id: string;
		role: string;
	}
	interface Session {
		user: {
			id: string;
			role: string;
		} & DefaultSession["user"];
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
					include: {
						role: true,
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
					role: user.role.role,
				};
			},
		}),
	],
	callbacks: {
		session: async ({ session }) => {
			if (!session.user?.email) return;

			const user = await prisma.user.findUnique({
				where: {
					email: session.user?.email,
				},
				include: {
					role: true,
				},
			});
			if (!user) return session;

			session.user.id = user.id;
			session.user.role = user?.role.role;
			return session;
		},
		jwt: ({ token, user }) => {
			// console.log("JWT Callback", { token, user });
			if (user) {
				// TODO: figure out how to get rid of eslint errors here
				const u = user;
				return {
					...token,
					id: u.id,
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
