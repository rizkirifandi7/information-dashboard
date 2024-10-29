import { jwtDecode } from "jwt-decode";
import Piket from "../piket/Piket";
import Undangan from "../undangan/Undangan";
import axios from "axios";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

const Home = () => {
	const [users, setUsers] = useState([]);
	const [news, setNews] = useState([]);
	const [piket, setPiket] = useState([]);
	const [undangan, setUndangan] = useState([]);
	const [jadwalKegiatan, setJadwalKegiatan] = useState([]);

	const token = Cookies.get("token");
	const user = token ? jwtDecode(token) : null;

	const fetchUsers = async () => {
		try {
			const response = await axios.get("http://localhost:8000/user");
			setUsers(response.data.data.users);
		} catch (error) {
			console.error("Error fetching users:", error);
		}
	};

	const fetchNews = async () => {
		try {
			const response = await axios.get("http://localhost:8000/post");
			setNews(response.data.data.postData);
		} catch (error) {
			console.error("Error fetching news:", error);
		}
	};

	const fetchPiket = async () => {
		try {
			const response = await axios.get("http://localhost:8000/piket");
			if (user.role === "pegawai") {
				const piketData = response.data.data.piketData;
				const filteredPiket = piketData.filter(
					(piket) => piket.nama === user.nama
				);
				setPiket(filteredPiket);
				return;
			} else if (user.role === "admin") {
				setPiket(response.data.data.piketData);
			}
		} catch (error) {
			console.error("Error fetching piket:", error);
		}
	};

	const fetchUndangan = async () => {
		try {
			const response = await axios.get("http://localhost:8000/undangan");
			setUndangan(response.data.data.postData);
		} catch (error) {
			console.error("Error fetching undangan:", error);
		}
	};

	const fetchJadwalKegiatan = async () => {
		try {
			const response = await axios.get("http://localhost:8000/jadwal");
			setJadwalKegiatan(response.data.data.jadwalData);
		} catch (error) {
			console.error("Error fetching jadwal kegiatan:", error);
		}
	};

	useEffect(() => {
		fetchUsers();
		fetchNews();
		fetchPiket();
		fetchUndangan();
		fetchJadwalKegiatan();
	}, []);

	return (
		<>
			<h1 className="text-xl font-bold">Dashboard Home</h1>
			<div className="flex flex-col gap-4 pt-6 h-full">
				<div className="grid auto-rows-min gap-4 md:grid-cols-4">
					{user.role === "admin" ? (
						<div className="flex flex-col items-start justify-center gap-2 w-full h-32 p-4 rounded-xl border border-gray-300">
							<p className="font-bold text-sm text-gray-600">Total User</p>
							<p className="text-3xl font-bold">{users.length}</p>
						</div>
					) : (
						<div className="flex flex-col items-start justify-center gap-2 w-full h-32 p-4 rounded-xl border border-gray-300">
							<p className="font-bold text-sm text-gray-600">
								Total Jadwal Kegiatan
							</p>
							<p className="text-3xl font-bold">{jadwalKegiatan.length}</p>
						</div>
					)}
					<div className="flex flex-col items-start justify-center gap-2 w-full h-32 p-4 rounded-xl border border-gray-300">
						<p className="font-bold text-sm text-gray-600">Total Berita</p>
						<p className="text-3xl font-bold">{news.length}</p>
					</div>
					<div className="flex flex-col items-start justify-center gap-2 w-full h-32 p-4 rounded-xl border border-gray-300">
						<p className="font-bold text-sm text-gray-600">Total Piket</p>
						<p className="text-3xl font-bold">{piket.length}</p>
					</div>
					<div className="flex flex-col items-start justify-center gap-2 w-full h-32 p-4 rounded-xl border border-gray-300">
						<p className="font-bold text-sm text-gray-600">Total Undangan</p>
						<p className="text-3xl font-bold">{undangan.length}</p>
					</div>
				</div>
				<div className="flex flex-row gap-4 w-full h-full">
					<div className="basis-7/12 h-full rounded-xl border border-gray-300 p-4">
						<Piket />
					</div>
					<div className="basis-5/12 h-full rounded-xl border border-gray-300 p-4">
						<Undangan />
					</div>
				</div>
			</div>
		</>
	);
};

export default Home;
