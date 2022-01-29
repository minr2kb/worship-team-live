import React from "react";
import Card from "../layouts/CenterCard";
import toast, { Toaster } from "react-hot-toast";
import { Grid, Box, Typography, Button, Link, Tooltip } from "@mui/material";
import {
	signInAnonymously,
	signInWithRedirect,
	setPersistence,
	browserLocalPersistence,
} from "firebase/auth";
import { auth, provider } from "../firebase";

const Login: React.VFC = () => {
	const signInWithGoogle = () => {
		toast.loading("구글 로그인 중...");
		setPersistence(auth, browserLocalPersistence)
			.then(() => {
				return signInWithRedirect(auth, provider);
			})
			.catch(error => {
				console.log(error);
			});
	};

	const signInAsGuest = () => {
		const toastId = toast.loading("게스트로 로그인 중...");
		signInAnonymously(auth)
			.then(() => {
				toast.dismiss(toastId);
				console.log("success");
			})
			.catch(error => {
				console.log(error);
			});
	};

	return (
		<>
			<Toaster position="bottom-center" />
			<Card>
				<Grid
					container
					width={"100%"}
					maxWidth="300px"
					alignItems={"center"}
					flexDirection={"column"}
				>
					<Typography variant="h1" sx={{ mt: 7, mb: 3 }}>
						찬양팀 라이브
					</Typography>
					<Box width="100%">
						<Tooltip
							title="라이브 만들기와 나의 요청 저장이 가능해요 😆"
							placement="bottom"
							arrow
						>
							<Button
								fullWidth
								variant="contained"
								onClick={signInWithGoogle}
							>
								<img
									src={"/social-logos/google_icon.png"}
									alt="google_icon"
									width="15px"
									height="15px"
									style={{ marginRight: "5px" }}
								/>
								구글로 로그인
							</Button>
						</Tooltip>

						<Grid
							container
							sx={{ mt: 2, mb: 2 }}
							justifyContent={"space-between"}
							alignItems={"center"}
						>
							<Grid width={"40%"}>
								<hr style={{ border: "solid 0.3px #C2C2C2" }} />
							</Grid>

							<Typography
								variant="body2"
								sx={{ ml: 1, mr: 1 }}
								color={"text.primary"}
							>
								혹은
							</Typography>

							<Grid width={"40%"}>
								<hr style={{ border: "solid 0.3px #C2C2C2" }} />
							</Grid>
						</Grid>
						<Tooltip
							title="라이브 참가만 가능해요 😢"
							placement="bottom"
							arrow
						>
							<Button
								fullWidth
								variant="contained"
								onClick={signInAsGuest}
							>
								🕶 게스트 모드
							</Button>
						</Tooltip>
					</Box>
					<Typography
						variant="body2"
						sx={{
							mt: 4,
							mb: 4,
						}}
					>
						어떤 서비스인지 궁금하신가요?
						<Link
							href="/about"
							sx={{
								fontWeight: "bold",
								color: "#505050",
								textDecorationColor: "#505050",
								ml: "7px",
								cursor: "pointer",
							}}
						>
							더 알아보기
						</Link>
					</Typography>
				</Grid>
			</Card>
		</>
	);
};

export default Login;
