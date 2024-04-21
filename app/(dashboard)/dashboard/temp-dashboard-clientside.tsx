"use client";
import { Button } from "@/components/ui/button";

const DashboardButton = () => {
	const handleClick = async () => {
		console.log("getting booking clientside");
		try {
			const res = await fetch("/api/booking");
			console.log("result", res);
		} catch (err) {
			console.log("final error", err);
		}
	};

	return <Button onClick={handleClick}>Create Post</Button>;
};
export { DashboardButton };
