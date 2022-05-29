import React from "react";
import { Grid, Typography } from "@mui/material";
import { use100vh } from "react-div-100vh";

interface MainLayoutProps {
	children: React.ReactNode;
}

const MainLayout: React.VFC<MainLayoutProps> = ({ children }) => {
	const height = use100vh();
	return (
		<Grid
			container
			flexDirection={"column"}
			alignItems={"center"}
			justifyContent={"center"}
			height={height ? height : "100vh"}
			minHeight="500px"
		>
			<Grid
				sx={{
					position: "fixed",
					bottom: 0,
					mb: 1,
					width: "100%",
					textAlign: "center",
				}}
			>
				<Typography variant="body2" color="text.primary">
					© 2021. (Kyungbae Min) all rights reserved
				</Typography>
			</Grid>
			{children}
		</Grid>
	);
};

export default MainLayout;
