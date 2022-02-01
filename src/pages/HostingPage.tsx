import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import CenterCard from "../layouts/CenterCard";
import {
	Grid,
	Box,
	Typography,
	Button,
	Link,
	TextField,
	IconButton,
	NativeSelect,
	Tooltip,
	DialogContent,
	DialogActions,
	Dialog,
	DialogContentText,
	Switch,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { useRecoilState } from "recoil";
import { userRecoil, userAuthRecoil } from "../states/recoil";
import {
	collection,
	doc,
	getDoc,
	setDoc,
	addDoc,
	updateDoc,
	increment,
	serverTimestamp,
	query,
	where,
	Timestamp,
	getDocs,
	deleteDoc,
	deleteField,
} from "firebase/firestore";
import { db } from "../firebase";
import { Live, RequestSet } from "../interfaces/types";

interface HostingPageProps {
	setMode: React.Dispatch<
		React.SetStateAction<"host" | "participant" | null>
	>;
}

const HostingPage: React.VFC<HostingPageProps> = ({ setMode }) => {
	const navigate = useNavigate();
	const [user, setUser] = useRecoilState(userRecoil);
	const [userAuth, setUserAuth] = useRecoilState(userAuthRecoil);
	const [currentRequestSet, setCurrentRequestSet] = useState<number>(0);
	const [error, setError] = useState<
		"title" | "position" | "password" | null
	>(null);
	const [open, setOpen] = useState(false);
	const [liveTitle, setLiveTitle] = useState("");
	const [position, setPosition] = useState("");
	const [password, setPassword] = useState<string | null>(null);
	const [currentLive, setCurrentLive] = useState<Live | null>(null);

	const deleteLives = () => {
		const today = new Date();
		today.setDate(today.getDate() - 1);

		getDocs(
			query(collection(db, "Live"), where("createdTime", "<", today))
		).then(snapShots => {
			snapShots.docs.forEach(doc =>
				deleteDoc(doc.ref).then(res => console.log(res))
			);
		});
	};

	const startLive = () => {
		if (liveTitle.length < 1) {
			setError("title");
		} else if (position.length < 1) {
			setError("position");
		} else if (password !== null && !/[a-zA-Z0-9]/.test(password)) {
			setError("password");
		} else {
			setError(null);
			if (userAuth?.uid) {
				const toastId = toast.loading("라이브 생성중...");
				deleteLives();
				getDoc(doc(db, "Live", "total"))
					.then(docSnap => {
						if (docSnap.exists()) {
							const code = docSnap
								.data()
								.count.toString()
								.padStart(6, "0");
							updateDoc(doc(db, "Live", "total"), {
								count: increment(1),
							});

							setDoc(doc(collection(db, "Live"), code), {
								title: liveTitle,
								code: code,
								password: password,
								host: userAuth?.uid,
								createdTime: serverTimestamp(),
								participants: {
									[userAuth?.uid]: {
										position: position,
										isVerified: true,
										requestSet: currentRequestSet,
									},
								},
								requests: [],
							}).then(res => {
								console.log("Document written successfully");

								updateDoc(
									doc(collection(db, "User"), userAuth?.uid),
									{
										currentLive: code,
									}
								)
									.then(res => {
										if (user)
											setUser({
												...user,
												currentLive: code,
											});
										toast.dismiss(toastId);
										navigate(`/live/${code}`);
									})
									.catch(err => {
										console.log(err);
										toast.dismiss(toastId);
										toast.error(
											"라이브 생성에 실패했습니다"
										);
									});
							});
						} else {
							console.log("No such document!");
							toast.dismiss(toastId);
							toast.error("라이브 생성에 실패했습니다");
						}
					})
					.catch(err => {
						console.log(err);
						toast.dismiss(toastId);
						toast.error("라이브 생성에 실패했습니다");
					});
			}
		}
	};

	const exitLive = (liveID: string) => {
		if (liveID.length > 0) {
			updateDoc(doc(collection(db, "User"), userAuth?.uid), {
				currentLive: null,
			})
				.then(res => {
					updateDoc(doc(collection(db, "Live"), liveID), {
						[`participants.${userAuth?.uid}`]: deleteField(),
					})
						.then(res => {
							toast("라이브에서 나갔습니다");
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

	const queryCurrentLive = () => {
		if (user?.currentLive) {
			getDoc(doc(db, "Live", user?.currentLive))
				.then(doc => {
					if (doc.exists()) {
						console.log("We Have!");
						const today = new Date();
						today.setDate(today.getDate() - 1);
						if (
							(
								(doc.data() as Live).createdTime as Timestamp
							).toDate() > today &&
							Object.keys(
								(doc.data() as Live).participants
							).includes(userAuth?.uid || "")
						) {
							setCurrentLive(doc.data() as Live);
							setOpen(true);
						}
					} else {
						console.log("No Doc!");
					}
				})
				.catch(err => console.log(err));
		}
	};

	useEffect(() => {
		queryCurrentLive();
	}, []);

	return (
		<>
			<Toaster position="bottom-center" />
			<CenterCard>
				<Grid
					container
					width={"100%"}
					maxWidth="300px"
					alignItems={"center"}
					flexDirection={"column"}
				>
					<Grid
						container
						flexDirection={"column"}
						justifyContent={"flex-start"}
						alignItems={"flex-start"}
						sx={{ mt: 5 }}
					>
						<IconButton
							sx={{ p: 0 }}
							onClick={() => {
								setMode(null);
							}}
						>
							<ArrowBack color="secondary" />
						</IconButton>
						<Typography width={"100%"} variant="h1" sx={{ mt: 2 }}>
							라이브 만들기
						</Typography>
						<Typography
							width={"100%"}
							variant="body1"
							sx={{ mb: 2 }}
						>
							라이브의 시작을 위해 정보를 입력해주세요.
						</Typography>
					</Grid>

					<TextField
						fullWidth
						label="라이브 제목"
						variant="standard"
						color="info"
						value={liveTitle}
						onChange={e => setLiveTitle(e.target.value)}
						error={error == "title"}
						helperText={error == "title" && "제목을 입력해주세요"}
					/>
					<TextField
						fullWidth
						label="나의 포지션"
						variant="standard"
						color="info"
						sx={{ mt: 3 }}
						value={position}
						onChange={e => setPosition(e.target.value)}
						error={error == "position"}
						helperText={
							error == "position" && "포지션을 입력해주세요"
						}
					/>

					{!userAuth?.isAnonymous && (
						<NativeSelect
							fullWidth
							variant="filled"
							value={currentRequestSet}
							sx={{ mt: 5, mb: 3 }}
							onChange={e =>
								setCurrentRequestSet(Number(e.target.value))
							}
						>
							{user?.requestList.map(
								(requestSet: RequestSet, idx: number) => (
									<option key={idx} value={idx}>
										{requestSet.name}
									</option>
								)
							)}
						</NativeSelect>
					)}
					<Grid container alignItems={"center"}>
						<Switch
							color="info"
							value={password ? true : false}
							onChange={e => {
								e.target.checked
									? setPassword("")
									: setPassword(null);
							}}
						/>
						<Typography>비밀번호 설정</Typography>
					</Grid>
					{password !== null && (
						<TextField
							fullWidth
							label="비밀번호"
							variant="standard"
							color="info"
							value={password || ""}
							onChange={e => setPassword(e.target.value)}
							error={error == "password"}
							helperText={"영문과 숫자만 설정 가능합니다"}
						/>
					)}

					<Tooltip
						title="⏰ 24시간 이후에는 자동 삭제가 되는 점 참고해주세요!"
						placement="bottom"
						arrow
					>
						<Button
							fullWidth
							variant="contained"
							color="info"
							sx={{ mt: 5, mb: 6, color: "white" }}
							onClick={startLive}
						>
							시작하기
						</Button>
					</Tooltip>
				</Grid>
			</CenterCard>
			<Dialog fullWidth maxWidth={"mobile"} open={open}>
				<DialogContent>
					<DialogContentText>
						진행중이던 라이브(<b>{currentLive?.title || ""}</b>)가
						존재합니다. 계속 참여하시겠습니까?
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button
						variant="text"
						sx={{
							boxShadow: "none",
							p: 1,
							// color: "#FF3B30",
						}}
						onClick={() => {
							exitLive(currentLive?.code || "");
							setOpen(false);
						}}
					>
						{"나가기"}
					</Button>
					<Button
						variant="text"
						sx={{
							boxShadow: "none",
							p: 1,
							color: "#007AFF",
						}}
						onClick={() => {
							navigate(`/live/${currentLive?.code || ""}`);
						}}
					>
						{"계속하기"}
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
};

export default HostingPage;
