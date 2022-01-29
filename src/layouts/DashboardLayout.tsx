import React from "react";
import { Grid, Typography } from "@mui/material";
import { use100vh } from "react-div-100vh";

interface DashboardLayoutProps {
	children: React.ReactNode;
}

const DashboardLayout: React.VFC<DashboardLayoutProps> = ({ children }) => {
	const height = use100vh();

	return (
		<Grid container height={height ? height : "100vh"}>
			<Grid
				container
				width={"100vw"}
				height={height ? height : "100vh"}
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

export default DashboardLayout;
