import GlobalContext from "@/context/GlobalContext";
import { Plus } from "lucide-react";
import { useContext } from "react";
import { Button } from "../ui/button";

export default function CreateEventButton() {
	const { setShowEventModal } = useContext(GlobalContext);
	return (
		<Button onClick={() => setShowEventModal(true)} className="">
			<Plus className="text-white" />
			<span className="pl-3 pr-7"> Create</span>
		</Button>
	);
}
