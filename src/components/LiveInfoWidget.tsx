import { ContentCopy } from "@mui/icons-material";
import { Grid, Typography, useTheme } from "@mui/material";
import React from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import toast from "react-hot-toast";
import Card from "./Card";

interface LiveInfoWidgetProps {
	title: string;
	id: string;
	password: string | null;
}

const LiveInfoWidget: React.VFC<LiveInfoWidgetProps> = ({
	title,
	id,
	password,
}) => {
	const theme = useTheme();
	return (
		<Card
			sx={{
				backgroundColor: theme.palette.primary.main,
			}}
		>
			<Grid container justifyContent={"space-between"}>
				<Typography variant="h4">라이브 정보</Typography>
			</Grid>
			<Typography variant="body1">제목: {title}</Typography>
			<Grid container alignItems="center">
				<Typography variant="body1">{"라이브 코드: "}</Typography>
				<CopyToClipboard
					text={
						id
							? `https://worship-team-live.web.app?code=${id}${
									password ? `&pw=${password}` : ""
							  }`
							: ""
					}
					onCopy={res => toast.success("클립보드에 복사되었습니다")}
				>
					<div
						style={{
							display: "flex",
							alignItems: "center",
							cursor: "pointer",
							marginLeft: "5px",
						}}
					>
						<ContentCopy color="secondary" sx={{ fontSize: 15 }} />
						<Typography
							variant="body1"
							sx={{
								fontWeight: "bold",
								textDecoration: "underline",
							}}
						>
							{id}
						</Typography>
					</div>
				</CopyToClipboard>
			</Grid>
		</Card>
	);
};

export default LiveInfoWidget;
