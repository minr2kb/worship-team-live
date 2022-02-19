import { useEffect, useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { defaultRequestSets } from "../consts";
import { useParams, useNavigate } from "react-router-dom";
import {
	Grid,
	Box,
	Typography,
	Button,
	Link,
	useMediaQuery,
	useTheme,
	Divider,
	TextField,
	Paper,
	BottomNavigation,
	BottomNavigationAction,
	Dialog,
	DialogContent,
	DialogActions,
	Switch,
	NativeSelect,
} from "@mui/material";
import {
	ContentCopy,
	Edit,
	Check,
	Close,
	ArrowRightAlt,
	Send,
	Assignment,
	Announcement,
} from "@mui/icons-material";
import { RequestPacket, Live, Request, RequestSet } from "../interfaces/types";
import { use100vh } from "react-div-100vh";
import { useRecoilState } from "recoil";
import { userRecoil, userAuthRecoil, themeModeRecoil } from "../states/recoil";
import {
	collection,
	doc,
	updateDoc,
	onSnapshot,
	arrayUnion,
	deleteDoc,
	deleteField,
	Timestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import { Bars } from "react-loader-spinner";
import DashboardLayout from "../layouts/DashboardLayout";
import MainLayout from "../layouts/MainLayout";
import LiveInfoWidget from "../components/LiveInfoWidget";
import MyPositionWidget from "../components/MyPositionWidget";
import MyRequestSetWidget from "../components/MyRequestSetWidget";
import RequestBox from "../components/RequestBox";
import ParticipantButton from "../components/ParticipantButton";

const spacing = 1;

const LiveDashboard = () => {
	const { id } = useParams();
	const theme = useTheme();
	const navigate = useNavigate();

	const isMobile = useMediaQuery(theme.breakpoints.down("mobile"));
	const isTablet = useMediaQuery(theme.breakpoints.down("tablet"));
	const [themeMode, setThemeMode] = useRecoilState(themeModeRecoil);
	const [user, setUser] = useRecoilState(userRecoil);
	const [userAuth, setUserAuth] = useRecoilState(userAuthRecoil);
	const [isLoading, setIsLoading] = useState(true);
	const [liveData, setLiveData] = useState<Live | null>(null);
	const [receiver, setReceiver] = useState<string | null>(null);
	const [page, setPage] = useState(0);
	const [myRequests, setMyRequests] = useState<Request[]>([]);
	const [pageLoadError, setPageLoadError] = useState<string | null>(null);
	const [alertCount, setAlertCount] = useState(0);
	const [detailedRequest, setDetailedRequest] = useState("");
	const [open, setOpen] = useState(false);
	const [positionText, setPositionText] = useState("");
	const alertCountRef = useRef(0);

	const height = use100vh();

	const requestCardColor = (
		status: "unchecked" | "accepted" | "rejected",
		fromMe: boolean
	): string => {
		if (status === "unchecked") return theme.palette.primary.main;
		else if (status === "accepted") {
			return fromMe
				? themeMode === "light"
					? theme.palette.success.light
					: theme.palette.success.main
				: theme.palette.text.disabled;
		} else if (status === "rejected") {
			return fromMe
				? themeMode === "light"
					? theme.palette.error.light
					: theme.palette.error.main
				: theme.palette.text.disabled;
		}
		return theme.palette.primary.main;
	};

	const requestStatus = (
		status: "unchecked" | "accepted" | "rejected",
		fromMe: boolean
	): string => {
		if (status === "unchecked") return fromMe ? "확인중" : "";
		else if (status === "accepted") {
			return fromMe ? "수락됨" : "수락함";
		} else if (status === "rejected") {
			return fromMe ? "거절됨" : "거절함";
		}
		return "";
	};

	const sendRequest = (text: string) => {
		if (receiver) {
			const toastId = toast.loading("요청 전송중...");
			updateDoc(doc(collection(db, "Live"), id), {
				requests: arrayUnion({
					id: new Date().getTime().toString(),
					text: text,
					from: userAuth?.uid,
					to: receiver,
					status: "unchecked",
				}),
			})
				.then(res => {
					setDetailedRequest("");
					toast.dismiss(toastId);
					toast.success("요청이 전송되었습니다");
				})
				.catch(err => toast.error("요청 전송에 실패했습니다"));
		} else {
			toast.error("수신자를 선택해주세요");
		}
	};

	const changeRequestStatus = (
		reqId: string,
		status: "unchecked" | "accepted" | "rejected"
	) => {
		const toastId = toast.loading("응답 전송중...");
		updateDoc(doc(collection(db, "Live"), id), {
			requests: liveData?.requests.map((request: RequestPacket) =>
				request.id === reqId ? { ...request, status: status } : request
			),
		})
			.then(res => {
				toast.dismiss(toastId);
				toast.success("응답이 전송되었습니다");
			})
			.catch(err => {
				console.log(err);
				toast.dismiss(toastId);
				toast.error("응답 전송에 실패했습니다");
			});
	};

	const changeRequestSet = (newIndex: number) => {
		// let toastId = toast.loading("변경중...");
		updateDoc(doc(collection(db, "Live"), id), {
			participants: {
				...liveData?.participants,
				[userAuth?.uid || ""]: {
					...liveData?.participants[userAuth?.uid || ""],
					requestSet: newIndex,
				},
			},
		})
			.then(res => {
				// toast.dismiss(toastId);
				// toast.success("변경되었습니다");
				setOpen(false);
			})
			.catch(err => {
				console.log(err);
				// toast.dismiss(toastId);
				// toast.error("변경에 실패했습니다");
				setOpen(false);
			});
	};

	const changePosition = () => {
		let toastId = toast.loading("변경중...");
		updateDoc(doc(collection(db, "Live"), id), {
			participants: {
				...liveData?.participants,
				[userAuth?.uid || ""]: {
					...liveData?.participants[userAuth?.uid || ""],
					position: positionText,
				},
			},
		})
			.then(res => {
				toast.dismiss(toastId);
				toast.success("변경되었습니다");
				setOpen(false);
			})
			.catch(err => {
				console.log(err);
				toast.dismiss(toastId);
				toast.error("변경에 실패했습니다");
				setOpen(false);
			});
	};

	const deleteLive = () => {
		//TODO
		if (window.confirm("정말로 라이브를 종료하시겠습니까?")) {
			updateDoc(doc(collection(db, "User"), userAuth?.uid), {
				currentLive: null,
			})
				.then(res => {
					deleteDoc(doc(collection(db, "Live"), id)).then(res =>
						navigate("/")
					);
				})
				.catch(err => {
					console.log(err);
				});
		}
	};

	const exitLive = () => {
		if (window.confirm("정말로 라이브를 나가시겠습니까?")) {
			updateDoc(doc(collection(db, "User"), userAuth?.uid), {
				currentLive: null,
			})
				.then(res => {
					updateDoc(doc(collection(db, "Live"), id), {
						[`participants.${userAuth?.uid}`]: deleteField(),
					})
						.then(res => {
							navigate("/");
						})
						.catch(err => {
							console.log(err);
						});
				})
				.catch(err => {
					console.log(err);
				});
		}
	};

	const updateAlertCount = (newAlertCount: number) => {
		alertCountRef.current = newAlertCount;
		setAlertCount(newAlertCount);
	};

	useEffect(() => {
		const unsub = onSnapshot(
			doc(collection(db, "Live"), id),
			doc => {
				if (window.navigator.onLine) {
					if (doc.exists()) {
						setLiveData(doc.data() as Live);
						const newAlertCount = doc
							.data()
							?.requests.filter(
								(request: RequestPacket) =>
									request.status === "unchecked" &&
									request.from !== userAuth?.uid &&
									(request.to === userAuth?.uid ||
										request.to === "ALL")
							).length;

						if (newAlertCount - alertCountRef.current > 0) {
							// window.navigator.vibrate(1);
							toast("🚨 새로운 요청이 있습니다!");
						}
						updateAlertCount(newAlertCount);
					} else {
						console.log("Live Not Found");
						setPageLoadError(
							"종료되었거나 존재하지 않는 라이브입니다"
						);
						setIsLoading(false);
					}
				} else {
					setPageLoadError("인터넷에 연결되어 있지 않습니다.");
					// toast.error("인터넷 연결이 필요합니다");
					setIsLoading(false);
				}
			},
			err => {
				console.log(err);
				setPageLoadError("라이브 로드 중 문제가 발생했습니다");
				setIsLoading(false);
			}
		);

		return () => {
			unsub();
		};
	}, []);

	useEffect(() => {
		if (user && liveData && userAuth) {
			if (
				liveData.participants[userAuth?.uid || ""] &&
				liveData.participants[userAuth?.uid || ""]?.isVerified
			) {
				setMyRequests(
					user?.requestList[
						liveData?.participants[userAuth?.uid || ""]
							?.requestSet || 0
					].list || defaultRequestSets[0].list
				);
			} else {
				setPageLoadError("라이브 참여 권한이 없습니다");
			}
			setIsLoading(false);
		}
	}, [user, userAuth, liveData]);

	return (
		<>
			<Toaster position="bottom-center" />
			{isLoading ? (
				<MainLayout>
					<Bars color="#505050" height={40} width={50} />
				</MainLayout>
			) : pageLoadError ? (
				<MainLayout>
					<p>{pageLoadError || ""}</p>
					<Link href="/" color={"secondary"} fontWeight="bold">
						메인페이지로
					</Link>
				</MainLayout>
			) : (
				<DashboardLayout>
					{(!isTablet || page === 0) && (
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
												color: "white",
												p: "3px",
												pl: 2,
												pr: 2,
											}}
											onClick={
												liveData?.host === userAuth?.uid
													? deleteLive
													: exitLive
											}
										>
											{liveData?.host === userAuth?.uid
												? "종료하기"
												: "나가기"}
										</Button>
									</Grid>
									<LiveInfoWidget
										title={liveData?.title || ""}
										id={id || ""}
										password={liveData?.password || null}
									/>
									<Grid
										container
										columnSpacing={spacing}
										mt={spacing}
									>
										<Grid container item xs={6}>
											<MyPositionWidget
												position={
													liveData?.participants[
														userAuth?.uid || ""
													]?.position || ""
												}
												onClick={() => {
													setPositionText(
														liveData?.participants[
															userAuth?.uid || ""
														]?.position || ""
													);
													setOpen(true);
												}}
											/>
										</Grid>
										<Grid container item xs={6}>
											<MyRequestSetWidget>
												<NativeSelect
													variant="filled"
													value={
														liveData?.participants[
															userAuth?.uid || ""
														].requestSet || 0
													}
													onChange={e =>
														changeRequestSet(
															Number(
																e.target.value
															)
														)
													}
												>
													{user?.requestList.map(
														(
															requestSet: RequestSet,
															idx: number
														) => (
															<option
																key={`reqset-${idx}`}
																value={idx}
															>
																{
																	requestSet.name
																}
															</option>
														)
													)}
												</NativeSelect>
											</MyRequestSetWidget>
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
												alignItems: "center",
												width: 28,
												height: 28,
												borderRadius: 14,
												color: "white",
												backgroundColor: "#FF3B30",
												ml: 0.5,
											}}
										>
											{alertCount}
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
											{[...(liveData?.requests || [])]
												.reverse()
												.map(
													(
														request: RequestPacket,
														idx: number
													) =>
														(request.from ===
															userAuth?.uid ||
															request.to ===
																userAuth?.uid ||
															request.to ===
																"ALL") && (
															<RequestBox
																key={`req-${idx}`}
																spacing={
																	spacing
																}
																backgroundColor={requestCardColor(
																	request.status,
																	request.from ===
																		userAuth?.uid
																)}
																requestText={
																	request.text
																}
																from={
																	request.from ===
																	userAuth?.uid ? (
																		<b>
																			나
																		</b>
																	) : request.from ===
																	  "ALL" ? (
																		<b>
																			ALL
																		</b>
																	) : (
																		liveData
																			?.participants[
																			request
																				.from
																		]
																			?.position ||
																		"(없음)"
																	)
																}
																to={
																	request.to ===
																	userAuth?.uid ? (
																		<b>
																			나
																		</b>
																	) : request.to ===
																	  "ALL" ? (
																		<b>
																			ALL
																		</b>
																	) : (
																		liveData
																			?.participants[
																			request
																				.to
																		]
																			?.position ||
																		"(없음)"
																	)
																}
																status={requestStatus(
																	request.status,
																	request.from ===
																		userAuth?.uid
																)}
																onAccept={() =>
																	changeRequestStatus(
																		request.id,
																		"accepted"
																	)
																}
																onReject={() =>
																	changeRequestStatus(
																		request.id,
																		"rejected"
																	)
																}
															/>
														)
												)}
										</Box>
									</Box>
								</Grid>
							</Box>
						</Grid>
					)}

					{/* 오른쪽 #fff*/}
					{(!isTablet || page === 1) && (
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
										<Box
											sx={{
												display: "flex",
												alignItems: "center",
											}}
										>
											<Typography variant="body1">
												다크모드
											</Typography>
											<Switch
												checked={themeMode === "dark"}
												onChange={e =>
													setThemeMode(
														e.target.checked
															? "dark"
															: "light"
													)
												}
												color={"secondary"}
											/>
										</Box>
									</Grid>
									<Grid
										container
										maxHeight={"15vh"}
										sx={{ overflowY: "auto", mb: 1 }}
									>
										<ParticipantButton
											spacing={spacing}
											participant={"ALL"}
											participantPosition={"ALL"}
											receiver={receiver}
											setReceiver={setReceiver}
										/>
										{Object.keys(
											liveData?.participants || {}
										).map(
											participant =>
												participant !==
													userAuth?.uid && (
													<ParticipantButton
														key={participant}
														spacing={spacing}
														participant={
															participant
														}
														participantPosition={
															liveData
																?.participants[
																participant
															].position || ""
														}
														receiver={receiver}
														setReceiver={
															setReceiver
														}
													/>
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
												boxShadow:
													"4px 4px 10px rgba(0,0,0,0.1)",
												borderRadius: "7px",
											}}
											value={detailedRequest}
											onChange={e =>
												setDetailedRequest(
													e.target.value
												)
											}
										/>

										<Button
											color={"info"}
											variant="contained"
											sx={{
												color: "white",
												p: 2,
												minWidth: 0,
											}}
											onClick={() =>
												sendRequest(detailedRequest)
											}
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
														sendRequest(
															request.text
														)
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
								onChange={(e, newValue) => {
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
			<Dialog
				fullWidth
				maxWidth={"mobile"}
				open={open}
				onClose={() => setOpen(false)}
			>
				<DialogContent>
					<TextField
						sx={{ mt: 2 }}
						autoFocus
						label="내 포지션"
						fullWidth
						color="info"
						value={positionText}
						onChange={e => setPositionText(e.currentTarget.value)}
					/>
				</DialogContent>
				<DialogActions>
					<Button
						variant="text"
						sx={{
							boxShadow: "none",
							p: 1,
						}}
						onClick={() => setOpen(false)}
					>
						취소
					</Button>
					<Button
						variant="text"
						sx={{
							boxShadow: "none",
							p: 1,

							color: "#007AFF",
						}}
						onClick={changePosition}
					>
						{"변경"}
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
};

export default LiveDashboard;
