// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import ContextWrapper from "./context/ContextWrapper";

createRoot(document.getElementById("root")).render(
	<BrowserRouter>
		<ContextWrapper>
			<App />
		</ContextWrapper>
	</BrowserRouter>
);

