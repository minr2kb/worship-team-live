import React from "react";
import { Grid, Typography } from "@mui/material";

interface MainLayoutProps {
	children: React.ReactNode;
}

const MainLayout: React.VFC<MainLayoutProps> = ({ children }) => {
	return (
		<Grid
			container
			flexDirection={"column"}
			alignItems={"center"}
			justifyContent={"center"}
			height={"100vh"}
			minHeight="500px"
		>
			<Grid
				container
				width={"100vw"}
				height={"100vh"}
				justifyContent={"center"}
				alignItems={"flex-end"}
				position={"absolute"}
				zIndex={-1}
			>
				<Typography variant="body2" mb={1} color="text.primary">
					© 2021. (Kyungbae Min) all rights reserved
				</Typography>
			</Grid>
			{children}
		</Grid>
	);
};

export default MainLayout;
