import { createTheme } from "@mui/material/styles";
import "./index.css";

declare module "@mui/material/styles" {
	interface BreakpointOverrides {
		xs: true; // removes the `xs` breakpoint
		sm: false;
		md: false;
		lg: false;
		xl: false;
		mobile: true; // adds the `mobile` breakpoint
		tablet: true;
	}

	interface Palette {
		// lightBlue: Palette["primary"];
	}
	interface PaletteOptions {
		// lightBlue: PaletteOptions["primary"];
	}
}

declare module "@mui/material/Button" {
	interface ButtonPropsColorOverrides {
		// lightBlue: true;
	}
}

export const getTheme = (mode: "light" | "dark" | string) =>
	createTheme({
		breakpoints: {
			values: {
				xs: 0,
				mobile: 425,
				tablet: 600,
			},
		},
		components: {
			MuiButton: {
				styleOverrides: {
					root: {
						borderRadius: "7px",
						color: mode === "light" ? "#505050" : "#F0F0F0",
						boxShadow: "4px 4px 10px rgba(0,0,0,0.1)",
						fontWeight: "bolder",
						fontSize: "15px",
						paddingTop: 18,
						paddingBottom: 18,
					},
				},
			},
			MuiDialog: {
				styleOverrides: {
					paper: {
						backgroundColor: mode === "light" ? "#fff" : "#505050",
					},
				},
			},
			MuiBottomNavigation: {
				styleOverrides: {
					root: {
						backgroundColor: mode === "light" ? "#fff" : "#505050",
					},
				},
			},
			MuiBottomNavigationAction: {
				styleOverrides: {
					root: {
						color: mode === "light" ? "#505050" : "#A0A0A0",
						"&.Mui-selected": {
							color: mode === "light" ? "#007DFF" : "#fff",
						},
					},
				},
			},
			MuiTextField: {
				styleOverrides: {
					root: {
						border: "none",
						backgroundColor: mode === "light" ? "#fff" : "#505050",
					},
				},
			},
		},

		palette: {
			primary: {
				main: mode === "light" ? "#FFF" : "#505050",
			},

			secondary: {
				main: mode === "light" ? "#505050" : "#fff",
				light: "#C1C1C1",
			},
			error: {
				main: mode === "light" ? "#FF3B30" : "#EF2B20",
				light: "#FE8686",
			},
			text: {
				primary: mode === "light" ? "#505050" : "#fff",
				secondary: mode === "light" ? "#505050" : "#F0F0F0",
				disabled: mode === "light" ? "#C1C1C1" : "#3A3A3A",
			},
			info: {
				main: mode === "light" ? "#007AFF" : "#006ADF",
			},
			success: {
				main: mode === "light" ? "#34C759" : "#24B749",
				light: "#86F4A2",
			},
			background: {
				default: mode === "light" ? "#F0F0F0" : "#1C1C1C",
			},
		},

		typography: {
			fontFamily: [
				"Roboto",
				"AppleSDGothicNeo",
				"-apple-system",
				"BlinkMacSystemFont",
				'"Segoe UI"',
				'"Helvetica Neue"',
				"Arial",
				"sans-serif",
				'"Apple Color Emoji"',
				'"Segoe UI Emoji"',
				'"Segoe UI Symbol"',
			].join(","),
			h1: {
				fontWeight: "bold",
				fontSize: "24px",
				color: mode === "light" ? "#505050" : "#F0F0F0",
			},
			h2: {
				fontWeight: "bold",
				fontSize: "20px",
				color: mode === "light" ? "#505050" : "#F0F0F0",
			},
			h3: {
				fontWeight: "bold",
				fontSize: "18px",
				color: mode === "light" ? "#505050" : "#F0F0F0",
			},
			h4: {
				fontWeight: "bold",
				fontSize: "15px",
				color: mode === "light" ? "#505050" : "#F0F0F0",
			},
			h5: {
				fontWeight: "bold",
				fontSize: "14px",
				color: mode === "light" ? "#505050" : "#F0F0F0",
			},
			h6: {
				fontWeight: "bold",
				fontSize: "12px",
				color: mode === "light" ? "#505050" : "#F0F0F0",
			},

			body1: {
				fontSize: "15px",
				color: mode === "light" ? "#505050" : "#F0F0F0",
			},
			body2: {
				fontSize: "13px",
				color: mode === "light" ? "#505050" : "#F0F0F0",
			},
		},
	});
