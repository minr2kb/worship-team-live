import React from "react";
import { Box, Grid, Typography, useMediaQuery, useTheme } from "@mui/material";

interface CenterCardProps {
	children?: React.ReactNode;
}

const CenterCard: React.VFC<CenterCardProps> = ({ children }) => {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("mobile"));
	return (
		<Grid container justifyContent={"center"}>
			<Grid
				container
				sx={{
					maxWidth: "400px",
					width: "400px",
					height: isMobile ? "100vh" : "auto",
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
