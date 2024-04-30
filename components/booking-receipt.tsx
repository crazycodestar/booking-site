import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
	BookingSchema,
	GetBookingResponseSchema,
	PostBookingResponseSChema,
} from "@/lib/validations/booking";
import { Dispatch, SetStateAction } from "react";
import { BookingTicket } from "./booking-ticket";
import { useRouter } from "next/navigation";

interface BookingReceiptProps {
	onChange: Dispatch<SetStateAction<boolean>>;
	alertState: boolean;
	bookingDetails: GetBookingResponseSchema[number];
	clickAction?: () => void;
}

export const BookingReceipt = ({
	onChange,
	alertState,
	bookingDetails,
	clickAction,
}: BookingReceiptProps) => {
	const router = useRouter();

	return (
		<AlertDialog open={alertState} onOpenChange={onChange}>
			{/* <AlertDialogTrigger>Open</AlertDialogTrigger> */}
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Booking Ticket</AlertDialogTitle>
					<AlertDialogDescription>
						These are the details for your booking. Do not share with anyone
					</AlertDialogDescription>
				</AlertDialogHeader>
				<div>
					<BookingTicket bookingDetails={bookingDetails} />
				</div>
				<AlertDialogFooter>
					<AlertDialogAction onClick={clickAction}>Continue</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};
