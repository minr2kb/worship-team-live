import { Edit } from "@mui/icons-material";
import { Typography, useTheme } from "@mui/material";
import React from "react";
import Card from "./Card";

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
							fontSize: 15,
						}}
					/>
				</div>
			</Typography>
		</Card>
	);
};

export default MyPositionWidget;
