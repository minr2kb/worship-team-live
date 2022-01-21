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

export const theme = createTheme({
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
					color: "#505050",
					boxShadow: "4px 4px 10px rgba(0,0,0,0.1)",
					fontWeight: "bolder",
					fontSize: "15px",
					paddingTop: 18,
					paddingBottom: 18,
				},
			},
		},
		MuiBottomNavigationAction: {
			styleOverrides: {
				root: {
					"&.Mui-selected": {
						color: "#007AFF",
					},
				},
			},
		},
		MuiTextField: {
			styleOverrides: {
				root: {
					border: "none",
				},
			},
		},
	},

	palette: {
		primary: {
			main: "#FFF",
		},

		secondary: {
			main: "#505050",
			light: "#C1C1C1",
		},
		error: {
			main: "#FF3B30",
			light: "#FE8686",
		},
		text: {
			primary: "#505050",
			secondary: "#5C5C5C",
			disabled: "#C1C1C1",
		},
		info: {
			main: "#007AFF",
		},
		success: {
			main: "#34C759",
			light: "#86F4A2",
		},
		background: {
			default: "#F0F0F0",
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
			color: "#505050",
		},
		h2: {
			fontWeight: "bold",
			fontSize: "20px",
			color: "#505050",
		},
		h3: {
			fontWeight: "bold",
			fontSize: "18px",
			color: "#505050",
		},
		h4: {
			fontWeight: "bold",
			fontSize: "15px",
			color: "#505050",
		},
		h5: {
			fontWeight: "bold",
			fontSize: "14px",
			color: "#505050",
		},
		h6: {
			fontWeight: "bold",
			fontSize: "12px",
			color: "#505050",
		},

		body1: {
			fontSize: "15px",
			color: "#505050",
		},
		body2: {
			fontSize: "13px",
			color: "#505050",
		},
	},
});
