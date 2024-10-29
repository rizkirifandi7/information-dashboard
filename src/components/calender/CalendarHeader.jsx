import GlobalContext from "@/context/GlobalContext";
import dayjs from "dayjs";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useContext } from "react";
import { Button } from "../ui/button";

export default function CalendarHeader() {
	const { monthIndex, setMonthIndex } = useContext(GlobalContext);
	function handlePrevMonth() {
		setMonthIndex(monthIndex - 1);
	}
	function handleNextMonth() {
		setMonthIndex(monthIndex + 1);
	}
	function handleReset() {
		setMonthIndex(dayjs().month());
	}
	return (
		<header className="flex items-center">
			<Button onClick={handleReset} className="border rounded py-2 px-4 mr-5">
				Today
			</Button>
			<button onClick={handlePrevMonth}>
				<span className="material-icons-outlined cursor-pointer text-gray-600 mx-2">
					<ChevronLeft />
				</span>
			</button>
			<button onClick={handleNextMonth}>
				<span className="material-icons-outlined cursor-pointer text-gray-600 mx-2">
					<ChevronRight />
				</span>
			</button>
			<h2 className="ml-4 text-xl text-gray-500 font-bold">
				{dayjs(new Date(dayjs().year(), monthIndex)).format("MMMM YYYY")}
			</h2>
		</header>
	);
}
