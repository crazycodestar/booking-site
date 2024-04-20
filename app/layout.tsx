import type { Metadata } from "next";
import { Inter as FontSans, Roboto as FontHeading } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { TailwindIndicator } from "@/components/tailwind-indicator";
import { Toaster } from "@/components/ui/toaster";

const fontSans = FontSans({ subsets: ["latin"], variable: "--font-sans" });
const fontHeading = FontHeading({
	subsets: ["latin"],
	weight: "700",
	variable: "--font-heading",
});

export const metadata: Metadata = {
	title: "Create Next App",
	description: "Generated by create next app",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={cn(
					"min-h-screen bg-background font-sans antialiased",
					fontSans.variable,
					fontHeading.variable
				)}
			>
				<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
					{children}
					<TailwindIndicator />
					<Toaster />
				</ThemeProvider>
			</body>
		</html>
	);
}
