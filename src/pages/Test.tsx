import React, { useState } from "react";
import { Theme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Switch from "@mui/material/Switch";
import Paper from "@mui/material/Paper";
import Slide from "@mui/material/Slide";
import { Grid, TextField, IconButton, Button, Typography } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import FormControlLabel from "@mui/material/FormControlLabel";
import HostingPage from "./HostingPage";
import CenterCard from "../layouts/CenterCard";
import MainLayout from "../layouts/MainLayout";
const icon = (
	// <Paper sx={{ m: 1 }} elevation={4}>
	<Box>
		<CenterCard>
			<Box component="svg" sx={{ width: 100, height: 100 }}>
				<Box
					component="polygon"
					sx={{
						fill: (theme: Theme) => theme.palette.common.white,
						stroke: theme => theme.palette.divider,
						strokeWidth: 1,
					}}
					points="0,100 50,00, 100,100"
				/>
			</Box>
		</CenterCard>
	</Box>
	//{" "}
	// </Paper>
);

export default function Test() {
	const [checked, setChecked] = React.useState(false);

	const handleChange = () => {
		setChecked(prev => !prev);
	};

	return (
		<Box sx={{ height: 180 }}>
			<Box sx={{ width: `calc(100px + 16px)` }}>
				<FormControlLabel
					control={
						<Switch checked={checked} onChange={handleChange} />
					}
					label="Show"
				/>

				<Slide direction="left" in={checked} mountOnEnter unmountOnExit>
					<Box width={"100vw"}>
						<MainLayout>테스트</MainLayout>
					</Box>
				</Slide>
			</Box>
		</Box>
	);
}
