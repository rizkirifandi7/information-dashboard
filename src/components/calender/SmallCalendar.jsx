import GlobalContext from "@/context/GlobalContext";
import { getMonth } from "@/lib/formatDate";
import dayjs from "dayjs";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";

export default function SmallCalendar() {
	const [currentMonthIdx, setCurrentMonthIdx] = useState(dayjs().month());
	const [currentMonth, setCurrentMonth] = useState(getMonth());
	useEffect(() => {
		setCurrentMonth(getMonth(currentMonthIdx));
	}, [currentMonthIdx]);

	const { monthIndex, setSmallCalendarMonth, setDaySelected, daySelected } =
		useContext(GlobalContext);

	useEffect(() => {
		setCurrentMonthIdx(monthIndex);
	}, [monthIndex]);

	function handlePrevMonth() {
		setCurrentMonthIdx(currentMonthIdx - 1);
	}
	function handleNextMonth() {
		setCurrentMonthIdx(currentMonthIdx + 1);
	}
	function getDayClass(day) {
		const format = "DD-MM-YY";
		const nowDay = dayjs().format(format);
		const currDay = day.format(format);
		const slcDay = daySelected && daySelected.format(format);
		if (nowDay === currDay) {
			return "bg-gray-500 rounded-md text-white";
		} else if (currDay === slcDay) {
			return "bg-gray-100 rounded-md text-blue-600 font-bold";
		} else {
			return "";
		}
	}
	return (
		<div className="">
			<header className="flex items-center justify-between">
				<p className="text-gray-500 font-bold">
					{dayjs(new Date(dayjs().year(), currentMonthIdx)).format("MMMM YYYY")}
				</p>
				<div>
					<button onClick={handlePrevMonth}>
						<span className="cursor-pointer text-gray-600 mx-2">
							<ChevronLeft />
						</span>
					</button>
					<button onClick={handleNextMonth}>
						<span className="cursor-pointer text-gray-600 mx-2">
							<ChevronRight />
						</span>
					</button>
				</div>
			</header>
			<div className="grid grid-cols-7 grid-rows-6 gap-1">
				{currentMonth[0].map((day, i) => (
					<span key={i} className="text-sm py-1 text-center">
						{day.format("dd").charAt(0)}
					</span>
				))}
				{currentMonth.map((row, i) => (
					<React.Fragment key={i}>
						{row.map((day, idx) => (
							<button
								key={idx}
								onClick={() => {
									setSmallCalendarMonth(currentMonthIdx);
									setDaySelected(day);
								}}
								className={`py-1 w-full ${getDayClass(day)}`}
							>
								<span className="text-sm ">{day.format("D")}</span>
							</button>
						))}
					</React.Fragment>
				))}
			</div>
		</div>
	);
}
