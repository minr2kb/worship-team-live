import React, { useEffect, useState } from "react";
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
	Dialog,
	DialogContent,
	DialogContentText,
	DialogActions,
} from "@mui/material";
import toast, { Toaster } from "react-hot-toast";
import { ArrowBack } from "@mui/icons-material";
import { useRecoilState } from "recoil";
import { userAuthRecoil, userRecoil } from "../states/recoil";
import {
	collection,
	doc,
	getDoc,
	setDoc,
	addDoc,
	updateDoc,
	increment,
	serverTimestamp,
	deleteField,
	Timestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import { Live, RequestSet } from "../interfaces/types";

interface ParticipationPageProps {
	setMode: React.Dispatch<
		React.SetStateAction<"host" | "participant" | null>
	>;
}

const ParticipationPage: React.VFC<ParticipationPageProps> = ({ setMode }) => {
	const navigate = useNavigate();
	const [user, setUser] = useRecoilState(userRecoil);
	const [userAuth, setUserAuth] = useRecoilState(userAuthRecoil);
	const [currentRequestSet, setCurrentRequestSet] = useState<number>(0);

	const [error, setError] = useState<"code" | "position" | null>(null);
	const [liveCode, setLiveCode] = useState("");
	const [position, setPosition] = useState("");

	const [open, setOpen] = useState(false);
	const [currentLive, setCurrentLive] = useState<Live | null>(null);

	const [dialogMode, setDialogMode] = useState<"continue" | "password">(
		"continue"
	);
	const [password, setPassword] = useState("");
	const [livePassword, setLivePassword] = useState<string>("");

	const participateInLive = () => {
		const toastId = toast.loading("라이브 참가중...");
		updateDoc(doc(collection(db, "Live"), liveCode), {
			[`participants.${userAuth?.uid}`]: {
				position: position,
				isVerified: true,
				requestSet: currentRequestSet,
			},
		})
			.then(res => {
				updateDoc(doc(collection(db, "User"), userAuth?.uid), {
					currentLive: liveCode,
				})
					.then(res => {
						if (user)
							setUser({
								...user,
								currentLive: liveCode,
							});
						toast.dismiss(toastId);
						navigate(`/live/${liveCode}`);
					})
					.catch(err => {
						console.log(err);
						toast.dismiss(toastId);
						toast.error("라이브 생성에 실패했습니다");
					});
			})
			.catch(err =>
				toast.error("종료되었거나 존재하지 않는 라이브 코드입니다.")
			);
	};

	const startLive = () => {
		if (liveCode.length < 1) {
			setError("code");
		} else if (position.length < 1) {
			setError("position");
		} else {
			getDoc(doc(db, "Live", liveCode)).then(docSnapshot => {
				if (docSnapshot.exists()) {
					const pw = (docSnapshot.data() as Live).password;
					if (pw) {
						setDialogMode("password");
						setLivePassword(pw);
						setOpen(true);
					} else {
						participateInLive();
					}
				} else {
					toast.error(
						"종료되었거나 존재하지 않는 라이브 코드입니다."
					);
				}
			});
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
						<IconButton sx={{ p: 0 }} onClick={() => setMode(null)}>
							<ArrowBack color="secondary" />
						</IconButton>
						<Typography width={"100%"} variant="h1" sx={{ mt: 2 }}>
							라이브 참가하기
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
						label="라이브 코드"
						variant="standard"
						color="info"
						value={liveCode}
						onChange={e => setLiveCode(e.target.value)}
						error={error == "code"}
						helperText={error == "code" && "코드를 입력해주세요"}
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
							sx={{ mt: 5 }}
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

					<Button
						fullWidth
						variant="contained"
						color="info"
						sx={{ mt: 5, mb: 6, color: "white" }}
						onClick={startLive}
					>
						참가하기
					</Button>
				</Grid>
			</CenterCard>
			<Dialog fullWidth maxWidth={"mobile"} open={open}>
				{dialogMode == "continue" ? (
					<>
						<DialogContent>
							<DialogContentText>
								진행중이던 라이브(
								<b>{currentLive?.title || ""}</b>
								)가 존재합니다. 계속 참여하시겠습니까?
							</DialogContentText>
						</DialogContent>
						<DialogActions>
							<Button
								variant="text"
								sx={{
									boxShadow: "none",
									p: 1,
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
									navigate(
										`/live/${currentLive?.code || ""}`
									);
								}}
							>
								{"계속하기"}
							</Button>
						</DialogActions>
					</>
				) : (
					<>
						<DialogContent>
							<TextField
								sx={{ mt: 2 }}
								autoFocus
								label="비밀번호"
								fullWidth
								color="info"
								value={password}
								onChange={e =>
									setPassword(e.currentTarget.value)
								}
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
								onClick={() => {
									if (password == livePassword) {
										participateInLive();
									} else {
										toast.error(
											"라이브의 비밀번호가 옳지 않습니다"
										);
									}
								}}
							>
								{"확인"}
							</Button>
						</DialogActions>
					</>
				)}
			</Dialog>
		</>
	);
};

export default ParticipationPage;
