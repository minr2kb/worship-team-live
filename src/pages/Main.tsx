import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import MainLayout from "../layouts/MainLayout";
import Login from "./Login";
import Menu from "./Menu";
import HostingPage from "./HostingPage";
import ParticipationPage from "./ParticipationPage";
import Setting from "./Setting";
import { Box, Fab, Slide } from "@mui/material";
import { useRecoilState, useRecoilValue } from "recoil";
import { userRecoil, isLoadingRecoil, themeModeRecoil } from "../states/recoil";
import { Bars } from "react-loader-spinner";
import { DarkMode, LightMode } from "@mui/icons-material";
import { useSearchParams } from "react-router-dom";
import VideoLayout from "../layouts/VideoLayout";

const SLIDE_DURATION = 200;

const Main: React.VFC = () => {
	const [searchParams, _setSearchParams] = useSearchParams();
	const user = useRecoilValue(userRecoil);
	const isLoading = useRecoilValue(isLoadingRecoil);
	const [themeMode, setThemeMode] = useRecoilState(themeModeRecoil);
	const [mode, setMode] = useState<"host" | "participant" | "setting" | null>(
		searchParams.get("code") ? "participant" : null
	);
	const [transition, setTransition] = useState<
		"host" | "participant" | "setting" | null
	>(searchParams.get("code") ? "participant" : null);

	useEffect(() => {
		if (!window.navigator.onLine) {
			toast.error("인터넷 연결이 필요합니다");
		}
	}, []);

	const endTransition = () => {
		setTimeout(() => setTransition(mode), SLIDE_DURATION);
	};

	return (
		<>
			<Toaster position="bottom-center" />
			<VideoLayout url={"https://youtu.be/F8ZihHpG9Q0"}>
				{isLoading ? (
					<>
						<Bars
							color={
								themeMode === "light" ? "#505050" : "#F0F0F0"
							}
							height={40}
							width={50}
						/>
					</>
				) : (
					<>
						{user ? (
							<>
								{(mode === "host" || transition === "host") && (
									<Slide
										direction="left"
										in={
											mode === "host" &&
											transition === "host"
										}
										mountOnEnter
										unmountOnExit
										timeout={SLIDE_DURATION}
										addEndListener={endTransition}
									>
										<Box width={"100vw"}>
											<HostingPage setMode={setMode} />
										</Box>
									</Slide>
								)}
								{(mode === "participant" ||
									transition === "participant") && (
									<Slide
										direction="left"
										in={
											mode === "participant" &&
											transition === "participant"
										}
										mountOnEnter
										unmountOnExit
										timeout={SLIDE_DURATION}
										addEndListener={endTransition}
									>
										<Box width={"100vw"}>
											<ParticipationPage
												code={searchParams.get("code")}
												pw={searchParams.get("pw")}
												setMode={setMode}
											/>
										</Box>
									</Slide>
								)}
								{(mode === "setting" ||
									transition === "setting") && (
									<Slide
										direction="left"
										in={
											mode === "setting" &&
											transition === "setting"
										}
										mountOnEnter
										unmountOnExit
										timeout={SLIDE_DURATION}
										addEndListener={endTransition}
									>
										<Box width={"100vw"}>
											<Setting setMode={setMode} />
										</Box>
									</Slide>
								)}
								<Slide
									direction="up"
									in={mode === null && transition === null}
									mountOnEnter
									unmountOnExit
									timeout={SLIDE_DURATION}
									addEndListener={endTransition}
								>
									<Box width={"100vw"}>
										<Menu setMode={setMode} />
									</Box>
								</Slide>
							</>
						) : (
							<Login />
						)}
					</>
				)}
			</VideoLayout>
			{!isLoading && (
				<Fab
					sx={{
						position: "absolute",
						bottom: "7%",
						right: "10%",
					}}
					size={"large"}
					color={"primary"}
					onClick={() =>
						setThemeMode(themeMode === "light" ? "dark" : "light")
					}
				>
					{themeMode === "light" ? <LightMode /> : <DarkMode />}
				</Fab>
			)}
		</>
	);
};

export default Main;
