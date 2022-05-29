import { Edit } from "@mui/icons-material";
import { Typography, useTheme } from "@mui/material";
import React from "react";
import Card from "./Card";
import ParticipantButton from "./ParticipantButton";

interface MyPositionWidgetProps {
	position: string;
	onClick: () => void;
}

const MyPositionWidget: React.VFC<MyPositionWidgetProps> = ({
	position,
	onClick,
}) => {
	const theme = useTheme();
	return (
		<Card
			centered
			sx={{
				backgroundColor: theme.palette.primary.main,
			}}
		>
			<Typography variant="h4">내 포지션</Typography>
			<Typography
				variant="body1"
				m={1}
				sx={
					{
						// textDecoration: "underline",
					}
				}
			>
				{/* <ParticipantButton
					spacing={0}
					participant={position}
					participantPosition={position}
					receiver={""}
					setReceiver={onClick}
				/> */}
				<div
					style={{
						display: "flex",
						alignItems: "center",
						cursor: "pointer",
					}}
					onClick={onClick}
				>
					<Typography variant="body1">{position}</Typography>
					<Edit
						color="secondary"
						sx={{
							fontSize: 14,
							ml: 0.3,
						}}
					/>
				</div>
			</Typography>
		</Card>
	);
};

export default MyPositionWidget;
