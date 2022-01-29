import React, { useState } from "react";
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
} from "firebase/firestore";
import { db } from "../firebase";
import { RequestSet } from "../interfaces/types";

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

	const [liveTitle, setLiveTitle] = useState("");
	const [position, setPosition] = useState("");

	const startLive = () => {
		if (position.length < 1) {
			window.alert("포지션을 입력해주세요.");
		} else {
			if (userAuth?.uid) {
				getDoc(doc(db, "Live", "total"))
					.then(docSnap => {
						if (docSnap.exists()) {
							const code = docSnap.data().count;
							updateDoc(doc(db, "Live", "total"), {
								count: increment(1),
							});

							addDoc(collection(db, "Live"), {
								title: liveTitle,
								code: code,
								password: null,
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
							}).then(docRef => {
								console.log(
									"Document written with ID: ",
									docRef.id
								);

								updateDoc(
									doc(collection(db, "User"), userAuth?.uid),
									{
										currentLive: docRef.id,
									}
								)
									.then(res => {
										if (user)
											setUser({
												...user,
												currentLive: docRef.id,
											});
										navigate(`/live/${docRef.id}`);
									})
									.catch(err => {
										console.log(err);
									});
							});
						} else {
							console.log("No such document!");
						}
					})
					.catch(err => console.log(err));
			}
		}
	};

	return (
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
					<Typography width={"100%"} variant="body1" sx={{ mb: 2 }}>
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
				/>
				<TextField
					fullWidth
					label="나의 포지션"
					variant="standard"
					color="info"
					sx={{ mt: 3 }}
					value={position}
					onChange={e => setPosition(e.target.value)}
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
	);
};

export default HostingPage;
