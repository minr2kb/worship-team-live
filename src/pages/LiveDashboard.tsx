import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
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
	InputBase,
	Input,
	TextField,
	Paper,
	BottomNavigation,
	BottomNavigationAction,
} from "@mui/material";
import {
	ContentCopy,
	Edit,
	Check,
	Close,
	ArrowRightAlt,
	Send,
	Restore,
	Favorite,
	Archive,
	Assignment,
	Announcement,
} from "@mui/icons-material";
import { RequestPacket, Live, Request, RequestSet } from "../interfaces/types";
import { use100vh } from "react-div-100vh";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useRecoilState } from "recoil";
import { userRecoil, userAuthRecoil, isLoadingRecoil } from "../states/recoil";
import {
	collection,
	doc,
	getDoc,
	setDoc,
	addDoc,
	updateDoc,
	increment,
	serverTimestamp,
	onSnapshot,
} from "firebase/firestore";
import { db } from "../firebase";
import { Bars } from "react-loader-spinner";
import MainLayout from "../layouts/MainLayout";

const spacing = 1;

const defaultRequestSet = {
	name: "기본 요청 리스트",
	list: [
		{
			id: "1",
			text: "🔈 소리가 안나와요",
		},
		{
			id: "2",
			text: "🔇 뮤트 해주세요",
		},
		{
			id: "3",
			text: "👍 볼륨 올려주세요",
		},
		{
			id: "4",
			text: "👎 볼륨 내려주세요",
		},
		{
			id: "5",
			text: "🚗 템포 높여주세요",
		},
		{
			id: "6",
			text: "🐢 템포 내려주세요",
		},
		{
			id: "7",
			text: "💬 자막이 안나와요",
		},
		{
			id: "8",
			text: "⚠️ 여기 좀 봐주세요",
		},
		{
			id: "9",
			text: "✋ 한명만 와주세요",
		},
	],
};

const LiveDashboard = () => {
	const { id } = useParams();
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("mobile"));
	const isTablet = useMediaQuery(theme.breakpoints.down("tablet"));
	const [user, setUser] = useRecoilState(userRecoil);
	const [userAuth, setUserAuth] = useRecoilState(userAuthRecoil);
	const [isLoading, setIsLoading] = useState(true);
	const [liveData, setLiveData] = useState<Live | null>(null);
	const [receiver, setReceiver] = useState<string | null>(null);
	const [page, setPage] = useState(0);
	const [myRequests, setMyRequests] = useState<Request[]>([]);
	const [notFound, setNotFound] = useState(false);

	const height = use100vh();

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

	useEffect(() => {
		const unsub = onSnapshot(
			doc(collection(db, "Live"), id),
			doc => {
				console.log(doc.data());
				if (doc.exists()) {
					setLiveData(doc.data() as Live);
					setIsLoading(false);
				} else {
					console.log("Not Found");
					setNotFound(true);
					setIsLoading(false);
				}
			},
			err => console.log(err)
		);

		return () => {
			unsub();
		};
	}, []);

	useEffect(() => {
		if (liveData) {
			setMyRequests(
				user?.requestList[
					liveData?.participants[userAuth?.uid || ""]?.requestSet || 0
				].list || defaultRequestSet.list
			);
		}
	}, [user, userAuth, liveData]);

	return (
		<>
			<Toaster position="bottom-center" />
			{isLoading ? (
				<MainLayout>
					<Bars color="#505050" height={40} width={50} />
				</MainLayout>
			) : notFound ? (
				<MainLayout>
					<p>종료되었거나 없는 라이브 입니다.</p>
				</MainLayout>
			) : (
				<DashboardLayout>
					{(!isTablet || page == 0) && (
						<Grid
							container
							item
							xs={isTablet ? 12 : 6}
							height={height ? height : "100vh"}
							flexDirection={"column"}
						>
							<Box
								style={{
									display: "flex",
									flexDirection: "column",
									alignItems: "stretch",
									minHeight: 0,
								}}
							>
								<Grid width={"100%"} sx={{ p: 3, pb: 0 }}>
									<Grid
										container
										justifyContent={"space-between"}
										mb={2}
									>
										<Typography variant="h1">
											대시보드
										</Typography>
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
										<Grid
											container
											justifyContent={"space-between"}
										>
											<Typography variant="h4">
												라이브 정보
											</Typography>
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
												<Edit
													color="secondary"
													sx={{ fontSize: 14 }}
												/>
												<Typography variant="body2">
													수정하기
												</Typography>
											</div>
										</Grid>
										<Typography variant="body1">
											제목: {liveData?.title}
										</Typography>
										<Grid container alignItems="center">
											<Typography variant="body1">
												{"라이브 코드: "}
											</Typography>
											<CopyToClipboard
												text={id || ""}
												onCopy={result =>
													toast.success(
														"클립보드에 복사되었습니다"
													)
												}
											>
												<div
													style={{
														display: "flex",
														alignItems: "center",
														cursor: "pointer",
														marginLeft: "5px",
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
															textDecoration:
																"underline",
														}}
													>
														{id}
													</Typography>
												</div>
											</CopyToClipboard>
										</Grid>
									</Card>
									<Grid
										container
										columnSpacing={spacing}
										mt={spacing}
									>
										<Grid container item xs={6}>
											<Card centered>
												<Typography variant="h4">
													내 포지션
												</Typography>
												<Typography
													variant="body1"
													m={1}
												>
													{
														liveData?.participants[
															userAuth?.uid || ""
														]?.position
													}
												</Typography>
											</Card>
										</Grid>
										<Grid container item xs={6}>
											<Card centered>
												<Typography variant="h4">
													시작 시간
												</Typography>
												<Typography
													variant="body1"
													m={1}
												>
													{liveData?.createdTime
														.toDate()
														.toTimeString()}
												</Typography>
											</Card>
										</Grid>
									</Grid>

									<Grid
										container
										sx={{ mt: 4, mb: 2 }}
										alignItems="center"
									>
										<Typography variant="h1">
											주고 받은 요청
										</Typography>
										<Box
											sx={{
												display: "flex",
												justifyContent: "center",
												textAlign: "center",
												width: 22,
												height: 22,
												borderRadius: 11,
												color: "white",
												backgroundColor: "#FF3B30",
											}}
										>
											{
												liveData?.requests.filter(
													request =>
														request.status ==
														"unchecked"
												).length
											}
										</Box>
									</Grid>
								</Grid>
								<Grid
									container
									sx={{
										pl: 3,
										pb: isTablet ? 7 : 4,
										alignItems: "stretch",
										minHeight: 0,
									}}
									flexDirection="column"
								>
									<Box
										sx={{
											display: "flex",
											flexDirection: "column",
											overflow: "auto",
										}}
									>
										<Box
											sx={{
												overflow: "auto",
											}}
										>
											{liveData?.requests.map(
												(request: RequestPacket) => (
													<Box
														mr={3}
														key={request._id}
													>
														<Card
															sx={{
																mb: spacing,
																backgroundColor:
																	requestCardColor(
																		request.status,
																		request.from ==
																			userAuth?.uid
																	),
															}}
														>
															<Grid
																container
																justifyContent={
																	"space-between"
																}
																alignItems="center"
																sx={{
																	flexWrap:
																		"nowrap",
																}}
															>
																<Grid
																	// container
																	alignItems={
																		"center"
																	}
																>
																	<Typography variant="h4">
																		{
																			request.text
																		}
																	</Typography>

																	<Grid
																		container
																		alignItems={
																			"center"
																		}
																		mt="2px"
																		mr={1}
																	>
																		<Typography
																			variant="body2"
																			sx={{
																				wordWrap:
																					"normal",
																				mr: 1,
																			}}
																		>
																			{request.from ==
																			userAuth?.uid ? (
																				<b>
																					나
																				</b>
																			) : request.from ==
																			  "ALL" ? (
																				<b>
																					ALL
																				</b>
																			) : (
																				request.from
																			)}
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
																				wordWrap:
																					"normal",
																				ml: 1,
																			}}
																		>
																			{" "}
																			{request.to ==
																			userAuth?.uid ? (
																				<b>
																					나
																				</b>
																			) : request.to ==
																			  "ALL" ? (
																				<b>
																					ALL
																				</b>
																			) : (
																				request.to
																			)}
																		</Typography>
																	</Grid>
																</Grid>
																<Box
																	sx={{
																		display:
																			"flex",
																		alignItems:
																			"center",
																		flexWrap:
																			"nowrap",
																	}}
																>
																	{requestStatus(
																		request.status,
																		request.from ==
																			userAuth?.uid
																	) ? (
																		<Typography
																			variant="body1"
																			sx={{
																				whiteSpace:
																					"nowrap",
																			}}
																		>
																			{requestStatus(
																				request.status,
																				request.from ==
																					userAuth?.uid
																			)}
																		</Typography>
																	) : (
																		<>
																			<Button
																				color={
																					"success"
																				}
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
																				color={
																					"error"
																				}
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
													</Box>
												)
											)}
										</Box>
									</Box>
								</Grid>
							</Box>
						</Grid>
					)}

					{/* 오른쪽 #fff*/}
					{(!isTablet || page == 1) && (
						<Grid
							container
							item
							xs={isTablet ? 12 : 6}
							height={height ? height : "100vh"}
							flexDirection={"column"}
						>
							<Box
								style={{
									display: "flex",
									flexDirection: "column",
									alignItems: "stretch",
									minHeight: 0,
								}}
							>
								<Grid width={"100%"} sx={{ p: 3, pb: 0 }}>
									<Grid
										container
										justifyContent={"space-between"}
										mb={2}
									>
										<Typography variant="h1">
											요청하기
										</Typography>
										{/* <Button
								// color={"error"}
								variant="contained"
								sx={{
									fontWeight: "normal",
									// color: "white",
									p: "3px",
									pl: 2,
									pr: 2,
								}}
							>
								편집모드
							</Button> */}
									</Grid>
									<Grid
										container
										maxHeight={"20vh"}
										sx={{ overflowY: "auto", mb: 1 }}
									>
										<Button
											key={"ALL"}
											onClick={() => setReceiver("ALL")}
											color={
												receiver == "ALL"
													? "info"
													: "primary"
											}
											variant="contained"
											sx={{
												fontWeight: "normal",
												color:
													receiver == "ALL"
														? "white"
														: "#505050",
												p: "8px",
												pl: 2,
												pr: 2,
												mr: spacing,
												mb: spacing,
											}}
										>
											{"ALL"}
										</Button>
										{Object.keys(
											liveData?.participants || {}
										).map(
											participant =>
												participant !==
													userAuth?.uid && (
													<Button
														key={participant}
														onClick={() =>
															setReceiver(
																participant
															)
														}
														color={
															participant ==
															receiver
																? "info"
																: "primary"
														}
														variant="contained"
														sx={{
															fontWeight:
																"normal",
															color:
																participant ==
																receiver
																	? "white"
																	: "#505050",
															p: "8px",
															pl: 2,
															pr: 2,
															mr: spacing,
															mb: spacing,
														}}
													>
														{
															liveData
																?.participants[
																participant
															].position
														}
													</Button>
												)
										)}
									</Grid>
									<Divider flexItem />
								</Grid>
								<Box
									sx={{
										display: "flex",
										flexDirection: "column",
										pl: 3,
										pb: isTablet ? 7 : 4,
										mt: 2,
										alignItems: "stretch",
										minHeight: 0,
									}}
								>
									<Grid
										item
										container
										pr={3}
										mb={2}
										width="100%"
									>
										<TextField
											color="info"
											placeholder="상세 요청 사항"
											sx={{
												flex: 1,
												mr: 2,
												backgroundColor: "white",
												boxShadow:
													"4px 4px 10px rgba(0,0,0,0.1)",
												borderRadius: "7px",
											}}
										/>

										<Button
											color={"info"}
											variant="contained"
											sx={{
												color: "white",
												p: 2,
												minWidth: 0,
											}}
										>
											<Send
												sx={{
													fontSize: 18,
												}}
											/>
										</Button>
									</Grid>

									<Grid
										item
										container
										xs={12}
										pr={3}
										sx={{
											overflow: "auto",
										}}
										columnSpacing={1}
									>
										{myRequests.map((request: Request) => (
											<Grid item xs={6} key={request.id}>
												<Button
													variant="contained"
													sx={{
														width: "100%",
														mb: 1,
														pt: 3,
														pb: 3,
													}}
													onClick={() =>
														toast(request.text)
													}
												>
													{request.text}
												</Button>
											</Grid>
										))}
									</Grid>
								</Box>
							</Box>
						</Grid>
					)}
					{isTablet && (
						<Paper
							sx={{
								position: "fixed",
								bottom: 0,
								left: 0,
								right: 0,
							}}
							elevation={3}
						>
							<BottomNavigation
								showLabels
								value={page}
								onChange={(event, newValue) => {
									console.log(newValue);
									setPage(newValue);
								}}
							>
								<BottomNavigationAction
									label="대시보드"
									icon={<Assignment />}
								/>
								<BottomNavigationAction
									label="요청하기"
									icon={<Announcement />}
								/>
							</BottomNavigation>
						</Paper>
					)}
				</DashboardLayout>
			)}
		</>
	);
};

export default LiveDashboard;
