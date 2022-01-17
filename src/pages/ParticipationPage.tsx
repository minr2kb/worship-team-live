import React from "react";
import CenterCard from "../layouts/CenterCard";
import {
	Grid,
	Box,
	Typography,
	Button,
	Link,
	TextField,
	IconButton,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { useRecoilState } from "recoil";
import { userRecoil } from "../states/recoil";

interface ParticipationPageProps {
	setMode: React.Dispatch<
		React.SetStateAction<"host" | "participant" | null>
	>;
}

const ParticipationPage: React.VFC<ParticipationPageProps> = ({ setMode }) => {
	const [user, setUser] = useRecoilState(userRecoil);
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
				/>
				<TextField
					fullWidth
					label="나의 포지션"
					variant="standard"
					color="info"
					sx={{ mt: 3 }}
				/>

				<Button
					fullWidth
					variant="contained"
					color="info"
					sx={{ mt: 5, mb: 6, color: "white" }}
				>
					시작하기
				</Button>
			</Grid>
		</CenterCard>
	);
};

export default ParticipationPage;
