import CalendarHeader from "@/components/calender/CalendarHeader";
import EventModal from "@/components/calender/EventModal";
import Month from "@/components/calender/Month";
import Sidebar from "@/components/calender/Sidebar";
import GlobalContext from "@/context/GlobalContext";
import { getMonth } from "@/lib/formatDate";
import React, { useState, useContext, useEffect } from "react";

const JadwalKegiatan = () => {
	const [currentMonth, setCurrentMonth] = useState(getMonth()); // Perbaikan nama variabel
	const { monthIndex, showEventModal } = useContext(GlobalContext);

	useEffect(() => {
		setCurrentMonth(getMonth(monthIndex)); // Setel bulan berdasarkan index
	}, [monthIndex]);

	return (
		<React.Fragment>
			{showEventModal && <EventModal />}
			<div className="h-screen flex flex-col">
				<CalendarHeader />
				<div className="flex flex-1">
					<Sidebar />
					<Month month={currentMonth} />
				</div>
			</div>
		</React.Fragment>
	);
};

export default JadwalKegiatan;
