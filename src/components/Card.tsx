import React from "react";
import { Grid, SxProps, Theme } from "@mui/material";

interface CardProps {
	children?: React.ReactNode;
	sx?: SxProps<Theme>;
	centered?: boolean;
}

const Card: React.VFC<CardProps> = ({ children, sx, centered = false }) => {
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
