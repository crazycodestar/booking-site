import { Command } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogoProps {
	className?: string;
}

const Logo = ({ className }: LogoProps) => {
	return <Command className={cn("w-[18px] h-[18px]", className)} />;
};

export { Logo };
