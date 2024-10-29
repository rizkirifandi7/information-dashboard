import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import axios from "axios";
import dayjs from "dayjs";
import { ChevronLeft, ChevronRight, RefreshCcw } from "lucide-react";
import { useState, useEffect } from "react";
import TambahJadwal from "./TambahJadwal";

const JadwalKegiatan = () => {
	const [date, setDate] = useState(new Date());
	const [currentDate, setCurrentDate] = useState(new Date());
	const [dates, setDates] = useState([]);
	const [jadwalData, setJadwalData] = useState([]);
	const [selectedTitles, setSelectedTitles] = useState([]);

	const fetchJadwalData = async () => {
		try {
			const response = await axios.get("http://localhost:8000/jadwal");
			const data = await response.data.data.jadwalData;
			setJadwalData(data);
			setSelectedTitles(
				Array.from(new Set(data.map((schedule) => schedule.title)))
			);
		} catch (error) {
			console.error("Error fetching jadwal data:", error);
		}
	};

	useEffect(() => {
		fetchJadwalData();
	}, []);

	useEffect(() => {
		const daysInMonth = dayjs(currentDate).daysInMonth();
		const firstDayOfMonth = dayjs(currentDate).startOf("month").day();
		const calendarDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);
		const emptyDays = Array.from({ length: firstDayOfMonth }, () => null);
		const fullCalendarDays = [...emptyDays, ...calendarDays];

		setDates(fullCalendarDays);
	}, [currentDate]);

	const handlePreviousMonth = () => {
		setCurrentDate(dayjs(currentDate).subtract(1, "month").toDate());
	};

	const handleNextMonth = () => {
		setCurrentDate(dayjs(currentDate).add(1, "month").toDate());
	};

	const handleReset = () => {
		setCurrentDate(new Date());
	};

	const toggleTitleSelection = (title) => {
		setSelectedTitles((prev) =>
			prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
		);
	};

	const todayDate = dayjs().format("YYYY-MM-DD");

	return (
		<>
			<div className="flex gap-4 h-full">
				<div className="flex flex-col gap-2 h-full">
					<h1 className="text-2xl font-bold">Jadwal Kegiatan</h1>
					<div className="flex flex-col gap-4 border p-2 rounded-md mt-1">
						<TambahJadwal fetchJadwalData={fetchJadwalData} />
						<Calendar
							mode="range"
							selected={date}
							onSelect={(date) => setDate(date)}
							className=""
						/>
					</div>
					<div className="flex flex-col gap-2 mt-4">
						<h2 className="text-lg font-semibold">Filter Judul:</h2>
						{Array.from(
							new Set(jadwalData.map((schedule) => schedule.title))
						).map((title) => (
							<label key={title} className="flex items-center">
								<input
									type="checkbox"
									checked={selectedTitles.includes(title)}
									onChange={() => toggleTitleSelection(title)}
								/>
								<span className="ml-2">{title}</span>
							</label>
						))}
					</div>
				</div>
				<div className="w-full h-full">
					<div className="flex items-center justify-between gap-4 mb-2 rounded-md">
						<Button onClick={handleReset} variant="outline">
							<RefreshCcw className="mr-2" />
							Hari ini
						</Button>
						<div className="flex items-center gap-4">
							<Button onClick={handlePreviousMonth} variant="secondary">
								<ChevronLeft />
							</Button>
							<div className="w-[180px]">
								<p className="text-xl font-bold text-center">
									{dayjs(currentDate).format("MMMM YYYY")}
								</p>
							</div>
							<Button onClick={handleNextMonth} variant="secondary">
								<ChevronRight />
							</Button>
						</div>
					</div>
					<div className="grid grid-cols-7">
						{[
							"Minggu",
							"Senin",
							"Selasa",
							"Rabu",
							"Kamis",
							"Jumat",
							"Sabtu",
						].map((day) => (
							<p
								key={day}
								className={`border rounded-md p-4 text-center font-medium ${
									day ? "bg-gray-300 text-black mb-1" : ""
								}`}
							>
								{day}
							</p>
						))}
						{dates.map((day, index) => {
							const fullDate = dayjs(currentDate)
								.date(day)
								.format("YYYY-MM-DD");

							const schedulesInRange = jadwalData.filter((schedule) => {
								const start = dayjs(schedule.schedule_start);
								const end = dayjs(schedule.schedule_end);
								return (
									day >= parseInt(start.format("D"), 10) &&
									day <= parseInt(end.format("D"), 10) &&
									start.month() === dayjs(currentDate).month() &&
									start.year() === dayjs(currentDate).year() &&
									selectedTitles.includes(schedule.title)
								);
							});

							return (
								<div key={index} className="border rounded-md p-4 h-40">
									<p
										className={`flex flex-col text-center ${
											fullDate === todayDate
												? "w-fit mx-auto bg-black text-white text-center py-1 px-2 rounded-md"
												: ""
										}`}
									>
										{day}
									</p>
									{schedulesInRange.map((schedule, idx) => (
										<span
											key={idx}
											className="flex flex-col text-xs text-start bg-yellow-200 mt-1 p-0.5 rounded-md"
										>
											{schedule.title}
										</span>
									))}
								</div>
							);
						})}
					</div>
				</div>
			</div>
		</>
	);
};

export default JadwalKegiatan;
