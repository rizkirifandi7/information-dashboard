import { useEffect, useState } from "react";
import { Routes, Route, useLocation, Link } from "react-router-dom";
import Home from "./pages/home/Home";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "./components/ui/separator";
import Berita from "./pages/berita/Berita";
import Piket from "./pages/piket/Piket";
import JadwalKegiatan from "./pages/jadwal/JadwalKegiatan";
import Undangan from "./pages/undangan/Undangan";
import User from "./pages/user/User";
import Login from "./pages/auth/Login";
import SidebarApp from "./components/sidebar/Sidebar";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut } from "lucide-react";
import Cookies from "js-cookie";
import PrivateRoute from "./lib/PrivateRoute";
import { jwtDecode } from "jwt-decode";

const Layout = () => {
	const location = useLocation();
	const isLoginPage = location.pathname === "/login";
	const [user, setUser] = useState(null);

	useEffect(() => {
		const token = Cookies.get("token");
		if (token) {
			const decodedUser = jwtDecode(token);
			setUser(decodedUser);
		} else {
			setUser(null);
		}
	}, [location.pathname]); // Re-run effect when the pathname changes

	const RemoveCookies = () => {
		Cookies.remove("token");
		setUser(null); // Update user state when logging out
	};

	return (
		<>
			{!isLoginPage && (
				<>
					<SidebarApp />
					<SidebarInset className="h-full w-full">
						<header className="flex justify-between sticky top-0 bg-background h-16 shrink-0 items-center gap-2 border-b px-4">
							<div className="flex items-center gap-2">
								<SidebarTrigger className="-ml-1 text-2xl" />
								<Separator orientation="vertical" className="mr-2 h-8" />
							</div>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button variant="outline" className="capitalize">
										{user ? user.nama : "Guest"}
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent className="w-auto me-8">
									<DropdownMenuLabel>Akun Saya</DropdownMenuLabel>
									<DropdownMenuSeparator />
									<Link to="/login" onClick={() => RemoveCookies()}>
										<DropdownMenuItem>
											<LogOut />
											<span>Keluar</span>
										</DropdownMenuItem>
									</Link>
								</DropdownMenuContent>
							</DropdownMenu>
						</header>
						<main className="p-8">
							<Routes>
								<Route path="/" element={<PrivateRoute element={Home} />} />
								<Route
									path="/berita"
									element={<PrivateRoute element={Berita} />}
								/>
								<Route
									path="/piket"
									element={<PrivateRoute element={Piket} />}
								/>
								<Route
									path="/jadwal-kegiatan"
									element={<PrivateRoute element={JadwalKegiatan} />}
								/>
								<Route
									path="/undangan"
									element={<PrivateRoute element={Undangan} />}
								/>
								<Route
									path="/user"
									element={<PrivateRoute element={User} userRole="admin" />}
								/>
							</Routes>
						</main>
					</SidebarInset>
				</>
			)}
			{isLoginPage && (
				<>
					<Routes>
						<Route path="/login" element={<Login />} />
					</Routes>
				</>
			)}
		</>
	);
};

export default Layout;
