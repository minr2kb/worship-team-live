import React from "react";
import {
	Box,
	Grid,
	SxProps,
	Theme,
	Typography,
	useMediaQuery,
	useTheme,
} from "@mui/material";

interface CardProps {
	children?: React.ReactNode;
	sx?: SxProps<Theme>;
	centered?: boolean;
}

const Card: React.VFC<CardProps> = ({ children, sx, centered = false }) => {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("mobile"));
	return (
		<Grid
			container
			sx={{
				backgroundColor: "white",
				boxShadow: "4px 4px 10px rgba(0,0,0,0.1)",
				borderRadius: "7px",
				p: 2,

				...sx,
			}}
			alignItems={centered ? "center" : "unset"}
			flexDirection={"column"}
		>
			{children}
		</Grid>
	);
};

export default Card;
