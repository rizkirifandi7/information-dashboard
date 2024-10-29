import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupLabel,
	SidebarHeader,
} from "@/components/ui/sidebar";

import {
	Calendar,
	CalendarDays,
	LayoutDashboard,
	Mail,
	Mailbox,
	User,
} from "lucide-react";

import { Collapsible } from "../ui/collapsible";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const data = {
	versions: ["1.0.1", "1.1.0-alpha", "2.0.0-beta1"],
	navMain: [
		{
			title: "Dashboard",
			url: "/",
			iconMenu: <LayoutDashboard className="w-5 h-5" />,
		},
		{
			title: "Berita",
			url: "/berita",
			iconMenu: <Mailbox className="w-5 h-5" />,
		},
		{
			title: "Piket",
			url: "/piket",
			iconMenu: <Calendar className="w-5 h-5" />,
		},
		{
			title: "Jadwal Kegiatan",
			url: "/jadwal-kegiatan",
			iconMenu: <CalendarDays className="w-5 h-5" />,
		},
		{
			title: "Undangan",
			url: "/undangan",
			iconMenu: <Mail className="w-5 h-5" />,
		},
	],
};

const token = Cookies.get("token");
const user = token ? jwtDecode(token) : null;

if (user && user.role === "admin") {
	data.navMain.push({
		title: "Kelola User",
		url: "/user",
		iconMenu: <User className="w-5 h-5" />,
	});
}

const SidebarApp = () => (
	<Sidebar className="bg-[#025148] text-white">
		<SidebarHeader className="flex flex-row items-center gap-2 bg-[#025148] text-white  px-3 pt-5">
			<img src="./logo.svg" alt="Logo" className="w-9 h-9" />
			<div className="flex flex-col">
				<p className="text-sm font-bold uppercase">Kejari-Tojo Una-Una</p>
				<p className="text-xs">Sistem Informasi</p>
			</div>
		</SidebarHeader>
		<SidebarContent className="gap-0 bg-[#025148] text-white pt-5 px-3">
			{data.navMain.map((item) => (
				<Collapsible
					key={item.title}
					title={item.title}
					defaultOpen
					className="group/collapsible"
				>
					<SidebarGroup>
						<Link to={item.url} className="text-sm">
							<SidebarGroupLabel
								asChild
								className="group/label text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
							>
								<div className="flex justify-between items-center w-full text-white">
									<div className="flex gap-2 items-center text-sm">
										{item.iconMenu}
										{item.title}
									</div>
									<div className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90">
										{item.iconDropdown}
									</div>
								</div>
							</SidebarGroupLabel>
						</Link>
					</SidebarGroup>
				</Collapsible>
			))}
		</SidebarContent>
		<SidebarFooter className="bg-[#025148]">
			<p className="text-xs text-center text-muted-foreground text-white">
				&copy; 2023 Kejari-Tojo Una-Una Sistem Informasi. All rights reserved.
			</p>
		</SidebarFooter>
	</Sidebar>
);

export default SidebarApp;
