import { Button } from "@/components/ui/button";
import type { Dispatch, SetStateAction } from "react";
import type { Option } from "@/lib/time-functions";
import { Time } from "@internationalized/date";

interface ToggleButtonProps {
	options: Option[]; //TODO: make this more dynamic with typescript
	active?: Option["value"];
	setActive: Dispatch<SetStateAction<number | undefined>>;
	startTime: Time;
}

export const ToggleButtons = ({
	options,
	active,
	setActive,
}: ToggleButtonProps) => {
	//TODO: make options just be children with react children
	return (
		<div className="flex items-center justify-center gap-4">
			{options.map((option, index) => (
				<Button
					onClick={() => setActive(option.value)}
					variant={active === option.value ? "default" : "outline"}
					key={index}
				>
					{option.name}
				</Button>
			))}
		</div>
	);
};
