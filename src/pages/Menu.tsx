import React from "react";
import Card from "../layouts/CenterCard";
import { Grid, Box, Typography, Button } from "@mui/material";
import { useRecoilState } from "recoil";
import { userAuthRecoil } from "../states/recoil";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";

interface MenuProps {
	setMode: React.Dispatch<
		React.SetStateAction<"host" | "participant" | null>
	>;
}

const Menu: React.VFC<MenuProps> = ({ setMode }) => {
	const [userAuth, setUserAuth] = useRecoilState(userAuthRecoil);
	const navigate = useNavigate();

	return (
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
				<Box width="100%">
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
							onClick={() =>
								navigate("/edit", { replace: false })
							}
						>
							📋 내 요청 편집하기
						</Button>
					)}
				</Box>
				<div
					onClick={() => {
						signOut(auth)
							.then(() => {
								window.location.reload();
							})
							.catch(error => {
								console.log(error);
							});
					}}
				>
					<Typography
						variant="body2"
						sx={{
							mt: 4,
							mb: 4,
							fontWeight: "bold",
							color: "#505050",
							textDecoration: "underline",
							cursor: "pointer",
						}}
					>
						{userAuth?.isAnonymous ? "뒤로가기" : "로그아웃"}
					</Typography>
				</div>
			</Grid>
		</Card>
	);
};

export default Menu;
