import React from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import Card from "../components/Card";
import { useParams } from "react-router-dom";
import {
	Grid,
	Box,
	Typography,
	Button,
	Link,
	useMediaQuery,
	useTheme,
	Divider,
} from "@mui/material";
import { ContentCopy, Edit, Check, Close } from "@mui/icons-material";
import { Request } from "../interfaces/types";
import { height } from "@mui/system";

const myInfo = {
	role: "🎛 음향팀",
};

const sampleRequests: Request[] = [
	{
		_id: "0",
		text: "🔈 소리가 안나와요",
		from: "🎸 베이스",
		to: "🎛 음향팀",
		status: "unchecked", // "unchecked", "accepted", "rejected"
	},
	{
		_id: "1",
		text: "👍 볼륨 올려주세요",
		from: "🎹 메인건반",
		to: "🎛 음향팀",
		status: "rejected", // "unchecked", "accepted", "rejected"
	},
	{
		_id: "2",
		text: "✋ 한명만 와주세요",
		from: "🥁 드럼",
		to: "ALL",
		status: "accepted", // "unchecked", "accepted", "rejected"
	},
	{
		_id: "3",
		text: "💬️ 자막이 안나와요",
		from: "🎛 음향팀",
		to: "🖥 방송팀",
		status: "unchecked", // "unchecked", "accepted", "rejected"
	},
	{
		_id: "4",
		text: "⚠️ 여기 좀 봐주세요",
		from: "🎛 음향팀",
		to: "⭐ ️인도자",
		status: "rejected", // "unchecked", "accepted", "rejected"
	},
	{
		_id: "5",
		text: "⚠️ 여기 좀 봐주세요",
		from: "🎛 음향팀",
		to: "⭐ ️인도자",
		status: "rejected", // "unchecked", "accepted", "rejected"
	},
	{
		_id: "6",
		text: "⚠️ 여기 좀 봐주세요",
		from: "🎛 음향팀",
		to: "⭐ ️인도자",
		status: "rejected", // "unchecked", "accepted", "rejected"
	},
];

const LiveDashboard = () => {
	let params = useParams(); //{params.id}
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("mobile"));
	const isTablet = useMediaQuery(theme.breakpoints.up("tablet"));

	const requestCardColor = (
		status: "unchecked" | "accepted" | "rejected",
		fromMe: boolean
	): string => {
		if (status === "unchecked") return "white";
		else if (status === "accepted") {
			return fromMe
				? theme.palette.success.light
				: theme.palette.text.disabled;
		} else if (status == "rejected") {
			return fromMe
				? theme.palette.error.light
				: theme.palette.text.disabled;
		}
		return "white";
	};

	const requestStatus = (
		status: "unchecked" | "accepted" | "rejected",
		fromMe: boolean
	): string => {
		if (status === "unchecked") return fromMe ? "확인중" : "";
		else if (status === "accepted") {
			return fromMe ? "수락됨" : "수락함";
		} else if (status == "rejected") {
			return fromMe ? "거절됨" : "거절함";
		}
		return "";
	};

	return (
		<DashboardLayout>
			<Grid
				container
				item
				xs={6}
				height={"100vh"}
				sx={{ overflowY: "scroll" }}
			>
				{/* <Box height={"100%"}> */}
				<Grid width={"100%"} sx={{ p: 3, pb: 0 }}>
					<Grid container justifyContent={"space-between"} mb={2}>
						<Typography variant="h1">대시보드</Typography>
						<Button
							color={"error"}
							variant="contained"
							sx={{
								fontWeight: "normal",
								// fontSize: "14px",
								color: "white",
								p: "3px",
								pl: 2,
								pr: 2,
							}}
						>
							종료하기
						</Button>
					</Grid>
					<Card>
						<Grid container justifyContent={"space-between"}>
							<Typography variant="h4">라이브 정보</Typography>
							<div
								style={{
									display: "flex",
									alignItems: "center",
									cursor: "pointer",
								}}
								onClick={() => {
									//수정하기 코드
								}}
							>
								<Edit color="secondary" sx={{ fontSize: 14 }} />
								<Typography variant="body2">
									수정하기
								</Typography>
							</div>
						</Grid>
						<Typography variant="body1">
							제목: 청남교회 금요철야
						</Typography>
						<Grid container alignItems="center">
							<Typography variant="body1">
								{"라이브 코드: "}
							</Typography>
							<div
								style={{
									display: "flex",
									alignItems: "center",
									cursor: "pointer",
									marginLeft: "5px",
								}}
								onClick={() => {
									//복사하기 코드
								}}
							>
								<ContentCopy
									color="secondary"
									sx={{ fontSize: 15 }}
								/>
								<Typography
									variant="body1"
									sx={{
										fontWeight: "bold",
										textDecoration: "underline",
									}}
								>
									{"273836"}
								</Typography>
							</div>
						</Grid>
					</Card>
					<Grid container columnSpacing={1} mt={1}>
						<Grid container item xs={6}>
							<Card centered>
								<Typography variant="h4">내 포지션</Typography>
								<Typography variant="body1" m={1}>
									🎛 음향팀
								</Typography>
							</Card>
						</Grid>
						<Grid container item xs={6}>
							<Card centered>
								<Typography variant="h4">진행 시간</Typography>
								<Typography variant="body1" m={1}>
									00:32:17
								</Typography>
							</Card>
						</Grid>
					</Grid>
					<Typography variant="h1" sx={{ mt: 4, mb: 2 }}>
						주고 받은 요청
					</Typography>
				</Grid>
				<Grid
					container
					sx={{
						overflowY: "scroll",

						pl: 3,
						pr: 3,
						pb: 4,
					}}
				>
					{/* 요청 하나 */}
					{sampleRequests.map((request: Request) => (
						<Card
							sx={{
								mb: 1,
								backgroundColor: requestCardColor(
									request.status,
									request.from == myInfo.role
								),
							}}
						>
							<Grid
								container
								justifyContent={"space-between"}
								alignItems="center"
								sx={{ flexWrap: "nowrap" }}
							>
								<Grid container alignItems={"center"}>
									<Typography variant="h4">
										{request.text}
									</Typography>
									{request.from !== myInfo.role && (
										<Typography
											variant="body1"
											sx={{
												ml: 1,
												mr: 1,
												wordWrap: "normal",
											}}
										>
											{"-"}&nbsp;{request.from}
										</Typography>
									)}
								</Grid>
								<Box
									sx={{
										display: "flex",
										alignItems: "center",
										flexWrap: "nowrap",
									}}
								>
									{requestStatus(
										request.status,
										request.from == myInfo.role
									) ? (
										<Typography
											variant="body1"
											sx={{ whiteSpace: "nowrap" }}
										>
											{requestStatus(
												request.status,
												request.from == myInfo.role
											)}
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
					))}
					{/* 요청 하나 */}
				</Grid>
				{/* </Box> */}
			</Grid>
			{/* <Divider flexItem orientation="vertical" /> */}
			<Grid container item xs={6} p={3} pb={4}>
				<Grid container item width={"100%"} height={"100%"}>
					2
				</Grid>
			</Grid>
		</DashboardLayout>
	);
};

export default LiveDashboard;
