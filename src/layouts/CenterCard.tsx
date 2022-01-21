import React from "react";
import { Box, Grid, Typography, useMediaQuery, useTheme } from "@mui/material";
import { use100vh } from "react-div-100vh";

interface CenterCardProps {
	children?: React.ReactNode;
}

const CenterCard: React.VFC<CenterCardProps> = ({ children }) => {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("mobile"));
	const height = use100vh();
	return (
		<Grid container justifyContent={"center"}>
			<Grid
				container
				sx={{
					maxWidth: "400px",
					width: "400px",
					height: isMobile ? (height ? height : "100vh") : "auto",
					backgroundColor: "rgba(255,255,255,0.8)",
					borderRadius: isMobile ? 0 : "20px",
					pl: 2,
					pr: 2,
				}}
				alignItems={"center"}
				flexDirection={"column"}
				justifyContent={"space-between"}
			>
				{children}
			</Grid>
		</Grid>
	);
};

export default CenterCard;
