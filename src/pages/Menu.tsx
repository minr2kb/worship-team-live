import React from "react";
import Card from "../layouts/CenterCard";
import {
	Grid,
	Box,
	Typography,
	Button,
	useMediaQuery,
	useTheme,
} from "@mui/material";
import { useRecoilState } from "recoil";
import { isLoadingRecoil, userAuthRecoil } from "../states/recoil";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";

interface MenuProps {
	setMode: React.Dispatch<
		React.SetStateAction<"host" | "participant" | "setting" | null>
	>;
}

const Menu: React.VFC<MenuProps> = ({ setMode }) => {
	const [isLoading, setIsLoading] = useRecoilState(isLoadingRecoil);
	const [userAuth, setUserAuth] = useRecoilState(userAuthRecoil);
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
					<Typography
						width={"100%"}
						maxWidth="300px"
						textAlign={"start"}
						fontSize="24px"
						sx={{ mt: 6, mb: 3 }}
					>
						{"반갑습니다, "}
						<b>{userAuth?.displayName}</b>
						{userAuth?.isAnonymous && "게스트"}
						{" 님"}
					</Typography>
					<Box width="100%" mt={isMobile ? 2 : 0} mb={6}>
						{!userAuth?.isAnonymous && (
							<Button
								fullWidth
								variant="contained"
								sx={{ mb: 2 }}
								onClick={() => setMode("host")}
							>
								⛪️ 라이브 만들기
							</Button>
						)}

						<Button
							fullWidth
							variant="contained"
							onClick={() => setMode("participant")}
						>
							✋ 라이브 참가하기
						</Button>
						{!userAuth?.isAnonymous && (
							<Button
								fullWidth
								variant="contained"
								sx={{ mt: 2 }}
								// onClick={() =>
								// 	navigate("/edit", { replace: false })
								// }
								onClick={() => setMode("setting")}
							>
								⚙️ 설정
							</Button>
						)}
					</Box>
					{/* <div
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
					</div> */}
				</Grid>
			</Card>
		</>
	);
};

export default Menu;
