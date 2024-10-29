import Piket from "../piket/Piket";
import Undangan from "../undangan/Undangan";
import axios from "axios";
import { useEffect, useState } from "react";

const Home = () => {
	const [users, setUsers] = useState([]);
	const [news, setNews] = useState([]);
	const [piket, setPiket] = useState([]);
	const [undangan, setUndangan] = useState([]);

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
			setPiket(response.data.data.piketData);
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

	useEffect(() => {
		fetchUsers();
		fetchNews();
		fetchPiket();
		fetchUndangan();
	}, []);

	return (
		<>
			<h1 className="text-xl font-bold">Dashboard Home</h1>
			<div className="flex flex-col gap-4 pt-6 h-full">
				<div className="grid auto-rows-min gap-4 md:grid-cols-4">
					<div className="flex flex-col items-start justify-center gap-2 w-full h-32 p-4 rounded-xl border border-gray-300">
						<p className="font-bold text-sm text-gray-600">Total User</p>
						<p className="text-3xl font-bold">{users.length}</p>
					</div>
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
