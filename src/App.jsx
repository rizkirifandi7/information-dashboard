import { Toaster } from "sonner";
import { SidebarProvider } from "./components/ui/sidebar";
import Layout from "./Layout";

function App() {
	return (
		<>
			<Toaster />
			<SidebarProvider>
				<Layout />
			</SidebarProvider>
		</>
	);
}

export default App;

