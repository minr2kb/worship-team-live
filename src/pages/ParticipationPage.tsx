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
} from "@mui/material";
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
} from "firebase/firestore";
import { db } from "../firebase";
import { RequestSet } from "../interfaces/types";

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
	const [liveCode, setLiveCode] = useState("");
	const [position, setPosition] = useState("");

	const startLive = () => {
		if (position.length < 1) {
			window.alert("포지션을 입력해주세요.");
		} else {
			if (userAuth?.uid) {
				updateDoc(doc(collection(db, "Live"), liveCode), {
					[`participants.${userAuth?.uid}`]: {
						position: position,
						isVerified: true,
						requestSet: currentRequestSet,
					},
				})
					.then(res => {
						navigate(`/live/${liveCode}`);
					})
					.catch(err =>
						window.alert(
							"종료되었거나 존재하지 않는 라이브 코드입니다."
						)
					);
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
					<IconButton sx={{ p: 0 }} onClick={() => setMode(null)}>
						<ArrowBack color="secondary" />
					</IconButton>
					<Typography width={"100%"} variant="h1" sx={{ mt: 2 }}>
						라이브 참가하기
					</Typography>
					<Typography width={"100%"} variant="body1" sx={{ mb: 2 }}>
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

				<Button
					fullWidth
					variant="contained"
					color="info"
					sx={{ mt: 5, mb: 6, color: "white" }}
					onClick={startLive}
				>
					시작하기
				</Button>
			</Grid>
		</CenterCard>
	);
};

export default ParticipationPage;
