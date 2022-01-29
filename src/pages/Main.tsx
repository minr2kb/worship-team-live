import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import MainLayout from "../layouts/MainLayout";
import Login from "./Login";
import Menu from "./Menu";
import HostingPage from "./HostingPage";
import ParticipationPage from "./ParticipationPage";
import { Grid, Box, Typography, Button, Link, Slide } from "@mui/material";
import { useRecoilState } from "recoil";
import { userRecoil, isLoadingRecoil } from "../states/recoil";
import { Bars } from "react-loader-spinner";

const SLIDE_DURATION = 200;

const Main: React.VFC = () => {
	const [user, setUser] = useRecoilState(userRecoil);
	const [isLoading, setIsLoading] = useRecoilState(isLoadingRecoil);
	const [mode, setMode] = useState<"host" | "participant" | null>(null);
	const [transition, setTransition] = useState<"host" | "participant" | null>(
		null
	);

	const endTransition = () => {
		setTimeout(() => setTransition(mode), SLIDE_DURATION);
	};

	return (
		<>
			<Toaster position="bottom-center" />
			<MainLayout>
				{isLoading ? (
					<>
						<Bars color="#505050" height={40} width={50} />
					</>
				) : (
					<>
						{user ? (
							<>
								{(mode == "host" || transition == "host") && (
									<Slide
										direction="left"
										in={
											mode == "host" &&
											transition == "host"
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
								{(mode == "participant" ||
									transition == "participant") && (
									<Slide
										direction="left"
										in={
											mode == "participant" &&
											transition == "participant"
										}
										mountOnEnter
										unmountOnExit
										timeout={SLIDE_DURATION}
										addEndListener={endTransition}
									>
										<Box width={"100vw"}>
											<ParticipationPage
												setMode={setMode}
											/>
										</Box>
									</Slide>
								)}
								<Slide
									direction="up"
									in={mode == null && transition == null}
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
			</MainLayout>
		</>
	);
};

export default Main;
