import React from "react";
import { ArrowRightAlt, Check, Close, ContentCopy } from "@mui/icons-material";
import { Button, Grid, Typography, useTheme } from "@mui/material";
import CopyToClipboard from "react-copy-to-clipboard";
import toast from "react-hot-toast";
import Card from "./Card";
import { Box } from "@mui/system";

interface RequestBoxProps {
	spacing?: number;
	backgroundColor: string;
	requestText: string;
	from: string | JSX.Element;
	to: string | JSX.Element;
	status: string;
	onAccept: () => void;
	onReject: () => void;
}

const RequestBox: React.VFC<RequestBoxProps> = ({
	spacing = 2,
	backgroundColor,
	requestText,
	from,
	to,
	status,
	onAccept,
	onReject,
}) => {
	return (
		<Box mr={3}>
			<Card
				sx={{
					mb: spacing,
					backgroundColor: backgroundColor,
				}}
			>
				<Grid
					container
					justifyContent={"space-between"}
					alignItems="center"
					sx={{
						flexWrap: "nowrap",
					}}
				>
					<Grid
						// container
						alignItems={"center"}
					>
						<Typography variant="h4">{requestText}</Typography>

						<Grid container alignItems={"center"} mt="2px" mr={1}>
							<Typography
								variant="body2"
								sx={{
									wordWrap: "normal",
									mr: 1,
								}}
							>
								{from}
							</Typography>
							<ArrowRightAlt
								sx={{
									fontSize: 15,
								}}
								color="secondary"
							/>
							<Typography
								variant="body2"
								sx={{
									wordWrap: "normal",
									ml: 1,
								}}
							>
								{to}
							</Typography>
						</Grid>
					</Grid>
					<Box
						sx={{
							display: "flex",
							alignItems: "center",
							flexWrap: "nowrap",
						}}
					>
						{status ? (
							<Typography
								variant="body1"
								sx={{
									whiteSpace: "nowrap",
									ml: 1,
								}}
							>
								{status}
							</Typography>
						) : (
							<>
								<Button
									color={"success"}
									variant="contained"
									sx={{
										color: "white",
										p: 1,
										minWidth: 0,
										mr: 1,
									}}
									onClick={onAccept}
								>
									<Check
										sx={{
											fontSize: 18,
										}}
									/>
								</Button>
								<Button
									color={"error"}
									variant="contained"
									sx={{
										color: "white",
										p: 1,
										minWidth: 0,
									}}
									onClick={onReject}
								>
									<Close
										sx={{
											fontSize: 18,
										}}
									/>
								</Button>
							</>
						)}
					</Box>
				</Grid>
			</Card>
		</Box>
	);
};

export default RequestBox;
