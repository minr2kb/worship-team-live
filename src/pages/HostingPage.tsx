import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import CenterCard from "../layouts/CenterCard";
import {
	Grid,
	Typography,
	Button,
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
import { useRecoilState, useRecoilValue } from "recoil";
import { userRecoil, userAuthRecoil } from "../states/recoil";
import {
	collection,
	doc,
	getDoc,
	setDoc,
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
		React.SetStateAction<"host" | "participant" | "setting" | null>
	>;
}

const HostingPage: React.VFC<HostingPageProps> = ({ setMode }) => {
	const navigate = useNavigate();
	const [user, setUser] = useRecoilState(userRecoil);
	const userAuth = useRecoilValue(userAuthRecoil);
	const [currentRequestSet, setCurrentRequestSet] = useState<number>(0);
	const [error, setError] = useState<
		"title" | "position" | "password" | null
	>(null);
	const [open, setOpen] = useState(false);
	const [liveTitle, setLiveTitle] = useState("");
	const [position, setPosition] = useState(user?.name);
	const [password, setPassword] = useState<string | null>(null);
	const [fixedCode, setFixedCode] = useState<string | null>(null);
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
		} else if (!position || position.length < 1) {
			setError("position");
		} else if (password !== null && /[^a-zA-Z0-9]/.test(password)) {
			setError("password");
		} else {
			setError(null);
			if (userAuth?.uid) {
				const toastId = toast.loading("????????? ?????????...");
				// deleteLives();
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

							setDoc(
								doc(collection(db, "Live"), fixedCode || code),
								{
									title: liveTitle,
									code: fixedCode || code,
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
								}
							).then(res => {
								console.log("Hosted live successfully");

								updateDoc(
									doc(collection(db, "User"), userAuth?.uid),
									{
										currentLive: fixedCode || code,
									}
								)
									.then(res => {
										if (user)
											setUser({
												...user,
												currentLive: fixedCode || code,
											});
										toast.dismiss(toastId);
										navigate(`/live/${fixedCode || code}`);
									})
									.catch(err => {
										console.log(err);
										toast.dismiss(toastId);
										toast.error(
											"????????? ????????? ??????????????????"
										);
									});
							});
						} else {
							console.log("Fail to host live");
							toast.dismiss(toastId);
							toast.error("????????? ????????? ??????????????????");
						}
					})
					.catch(err => {
						console.log(err);
						toast.dismiss(toastId);
						toast.error("????????? ????????? ??????????????????");
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
							toast("??????????????? ???????????????");
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
							console.log("Found current live!");
							setCurrentLive(doc.data() as Live);
							setOpen(true);
						}
					}
				})
				.catch(err => console.log(err));
		}
	};

	useEffect(() => {
		queryCurrentLive();
		console.log(userAuth, user);
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
							????????? ?????????
						</Typography>
						<Typography
							width={"100%"}
							variant="body1"
							sx={{ mb: 2 }}
						>
							???????????? ????????? ?????? ????????? ??????????????????.
						</Typography>
					</Grid>

					<TextField
						fullWidth
						label="????????? ??????"
						variant="standard"
						color="info"
						sx={{ backgroundColor: "transparent" }}
						value={liveTitle}
						onChange={e => setLiveTitle(e.target.value)}
						error={error === "title"}
						helperText={error === "title" && "????????? ??????????????????"}
					/>
					<TextField
						fullWidth
						label="?????? ?????????"
						variant="standard"
						color="info"
						sx={{ mt: 3, backgroundColor: "transparent" }}
						value={position}
						onChange={e => setPosition(e.target.value)}
						error={error === "position"}
						helperText={
							error === "position" && "???????????? ??????????????????"
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
							value={fixedCode ? true : false}
							onChange={e => {
								e.target.checked
									? setFixedCode(
											(userAuth?.uid || "aaaaaa").slice(
												0,
												6
											)
									  )
									: setFixedCode(null);
							}}
						/>
						<Typography>
							??????????????? ?????? <b>{fixedCode}</b>
						</Typography>
					</Grid>
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
						<Typography>???????????? ??????</Typography>
					</Grid>
					{password !== null && (
						<TextField
							fullWidth
							label="????????????"
							variant="standard"
							color="info"
							sx={{ backgroundColor: "transparent" }}
							value={password || ""}
							onChange={e => setPassword(e.target.value)}
							error={error === "password"}
							helperText={"????????? ????????? ?????? ???????????????"}
						/>
					)}

					<Tooltip
						title="??? 24?????? ???????????? ?????? ????????? ?????? ??? ??????????????????!"
						placement="bottom"
						arrow
						enterTouchDelay={0}
					>
						<Button
							fullWidth
							variant="contained"
							color="info"
							sx={{ mt: 5, mb: 6, color: "white" }}
							onClick={startLive}
						>
							????????????
						</Button>
					</Tooltip>
				</Grid>
			</CenterCard>
			<Dialog fullWidth maxWidth={"mobile"} open={open}>
				<DialogContent>
					<DialogContentText>
						??????????????? ?????????(<b>{currentLive?.title || ""}</b>)???
						???????????????. ?????? ?????????????????????????
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
						{"?????????"}
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
						{"????????????"}
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
};

export default HostingPage;
