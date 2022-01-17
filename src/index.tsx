import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider } from "@mui/material";
import { theme } from "./theme";
import { RecoilRoot } from "recoil";

ReactDOM.render(
	<React.StrictMode>
		<RecoilRoot>
			<Router>
				<ThemeProvider theme={theme}>
					<App />
				</ThemeProvider>
			</Router>
		</RecoilRoot>
	</React.StrictMode>,
	document.getElementById("root")
);
