import React from "react";
import ReactPlayer from "react-player";
import { use100vh } from "react-div-100vh";
import { Box, Grid, Typography } from "@mui/material";

interface VideoLayoutProps {
	url: string;
	children: JSX.Element;
}

const VideoLayout: React.FC<VideoLayoutProps> = ({ url, children }) => {
	const height = use100vh();
	return (
		<>
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
			{/* <Box
				style={{
					position: "fixed",
					left: "-150vw",
					top: 0,
					zIndex: -1,
					overflow: "hidden",
					height: "120vh",
					backgroundColor: "rgba(0,0,0, 20%)",
					width: "400vw",
				}}
			></Box> */}
			<ReactPlayer
				loop
				style={{
					position: "fixed",
					left: "-175vw",
					top: "-10vh",
					zIndex: -2,
					overflow: "hidden",
					height: "100vh",
					// filter: "blur(7px)",
				}}
				muted
				playing
				width="450vw"
				height="120vh"
				url={url}
			></ReactPlayer>
		</>
	);
};

export default VideoLayout;
