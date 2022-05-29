import React from "react";
import Card from "../layouts/CenterCard";
import {
	Grid,
	Box,
	Typography,
	Button,
	useMediaQuery,
	useTheme,
	IconButton,
} from "@mui/material";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { isLoadingRecoil, userAuthRecoil } from "../states/recoil";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { ArrowBack } from "@mui/icons-material";

interface SettingProps {
	setMode: React.Dispatch<
		React.SetStateAction<"host" | "participant" | "setting" | null>
	>;
}

const Setting: React.VFC<SettingProps> = ({ setMode }) => {
	const setIsLoading = useSetRecoilState(isLoadingRecoil);
	const userAuth = useRecoilValue(userAuthRecoil);
	const theme = useTheme();
	const navigate = useNavigate();
	const isMobile = useMediaQuery(theme.breakpoints.down("mobile"));

	return (
		<>
			<Card>
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
						<Typography
							width={"100%"}
							variant="h1"
							sx={{ mt: 2, mb: 2 }}
						>
							설정
						</Typography>
					</Grid>
					<Box width="100%" mt={isMobile ? 2 : 0}>
						<Button
							fullWidth
							variant="contained"
							sx={{ mb: 2 }}
							onClick={() =>
								navigate("/edit", { replace: false })
							}
						>
							📋 내 요청 편집하기
						</Button>
						<Button
							fullWidth
							variant="contained"
							onClick={
								() =>
									window.location.assign(
										"https://minr2kb.notion.site/df3634209d394602b37c41f7a91a1486"
									)
								// navigate(
								// 	"https://minr2kb.notion.site/df3634209d394602b37c41f7a91a1486"
								// )
							}
						>
							💡 서비스 소개
						</Button>
					</Box>
					<div
						onClick={() => {
							setIsLoading(true);
							signOut(auth)
								.then(() => {
									window.location.reload();
								})
								.catch(err => {
									console.log(err);
								});
						}}
					>
						<Typography
							variant="body2"
							sx={{
								mt: 4,
								mb: 4,
								fontWeight: "bold",
								color: theme.palette.secondary.main,
								textDecoration: "underline",
								cursor: "pointer",
							}}
						>
							{userAuth?.isAnonymous ? "뒤로가기" : "로그아웃"}
						</Typography>
					</div>
				</Grid>
			</Card>
		</>
	);
};

export default Setting;
