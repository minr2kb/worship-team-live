import React from "react";
import Card from "../layouts/CenterCard";
import toast, { Toaster } from "react-hot-toast";
import {
	Grid,
	Box,
	Typography,
	Button,
	Link,
	Tooltip,
	useTheme,
} from "@mui/material";
import {
	signInAnonymously,
	signInWithRedirect,
	setPersistence,
	browserLocalPersistence,
} from "firebase/auth";
import { auth, provider } from "../firebase";

const Login: React.VFC = () => {
	const theme = useTheme();
	const signInWithGoogle = () => {
		if (window.navigator.userAgent.includes("KAKAOTALK")) {
			window.alert(
				"카카오톡 브라우져에서는 구글 로그인이 불가합니다😢\n링크를 복사해서 다른 브라우져(크롬, 사파리 등)에서 열어주세요!"
			);
		} else {
			if (window.navigator.onLine) {
				const toastId = toast.loading("구글 로그인 중...");
				setPersistence(auth, browserLocalPersistence)
					.then(() => {
						toast.dismiss(toastId);
						return signInWithRedirect(auth, provider);
					})
					.catch(err => {
						toast.dismiss(toastId);
						console.log(err);
					});
			} else {
				toast.error("인터넷 연결이 필요합니다");
			}
		}
	};

	const signInAsGuest = () => {
		if (
			window.confirm(
				"게스트 모드에서는 라이브 만들기와 요청 버튼의 편집이 불가합니다. 계속하시겠습니까?"
			)
		) {
			if (window.navigator.onLine) {
				const toastId = toast.loading("게스트로 로그인 중...");
				signInAnonymously(auth)
					.then(() => {
						toast.dismiss(toastId);
						console.log("Guest login success");
					})
					.catch(err => {
						console.log(err);
					});
			} else {
				toast.error("인터넷 연결이 필요합니다");
			}
		}
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
								🕶 게스트 로그인
							</Button>
						</Tooltip>
					</Box>
					<Typography
						variant="body2"
						sx={{
							mt: 4,
						}}
					>
						어떤 서비스인지 궁금하신가요?
						<Link
							href="https://minr2kb.notion.site/df3634209d394602b37c41f7a91a1486"
							sx={{
								fontWeight: "bold",
								color: theme.palette.secondary.main,
								textDecorationColor:
									theme.palette.secondary.main,
								ml: "7px",
								cursor: "pointer",
							}}
						>
							더 알아보기
						</Link>
					</Typography>
					<Typography
						variant="body2"
						sx={{
							mb: 4,
							mt: 0.5,
						}}
					>
						사용방식이 궁금하신가요?
						<Link
							href="/demo"
							sx={{
								fontWeight: "bold",
								color: theme.palette.secondary.main,
								textDecorationColor:
									theme.palette.secondary.main,
								ml: "7px",
								cursor: "pointer",
							}}
						>
							데모 페이지
						</Link>
					</Typography>
				</Grid>
			</Card>
		</>
	);
};

export default Login;
