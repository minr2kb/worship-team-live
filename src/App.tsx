import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@mui/material";
import { getTheme } from "./theme";
import Main from "./pages/Main";
import LiveDashboard from "./pages/LiveDashboard";
import { defaultRequestSet } from "./consts";
import Demo from "./pages/Demo";
import { useRecoilState } from "recoil";
import {
	userRecoil,
	userAuthRecoil,
	isLoadingRecoil,
	themeModeRecoil,
} from "./states/recoil";
import { onAuthStateChanged } from "firebase/auth";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "./firebase";
import EditRequestList from "./pages/EditRequestList";
import { use100vh } from "react-div-100vh";
import { Navigate } from "react-router-dom";

function App() {
	const [user, setUser] = useRecoilState(userRecoil);
	const [userAuth, setUserAuth] = useRecoilState(userAuthRecoil);
	const [isLoading, setIsLoading] = useRecoilState(isLoadingRecoil);
	const [themeMode, setThemeMode] = useRecoilState(themeModeRecoil);
	const height = use100vh();

	useEffect(() => {
		const savedThemeMode = window.localStorage.getItem("themeMode");
		if (savedThemeMode) {
			setThemeMode(savedThemeMode);
		} else {
			setThemeMode(
				window.matchMedia &&
					window.matchMedia("(prefers-color-scheme: Dark)").matches
					? "dark"
					: "light"
			);
		}

		setIsLoading(true);
		onAuthStateChanged(auth, user => {
			if (user) {
				const userCopy = JSON.parse(JSON.stringify(user));
				setUserAuth(userCopy);
				getDoc(doc(db, "User", user.uid))
					.then(docSnap => {
						if (docSnap.exists()) {
							setUser(JSON.parse(JSON.stringify(docSnap.data())));
							setIsLoading(false);
						} else {
							console.log("No user!");
							const userRef = collection(db, "User");

							const newUserData = {
								name: user.displayName,
								currentLive: null,
								requestList: [defaultRequestSet],
							};
							setDoc(doc(userRef, user.uid), newUserData)
								.then(res => {
									setUser(newUserData);
									setIsLoading(false);
								})
								.catch(err => {
									console.log(err);
									setUser(null);
									setIsLoading(false);
								});
						}
					})
					.catch(err => {
						console.log(err);
						setUser(null);
						setIsLoading(false);
					});
			} else {
				setUserAuth(null);
				setIsLoading(false);
			}
		});
	}, []);

	useEffect(() => {
		window.localStorage.setItem("themeMode", themeMode);
		document.body.style.backgroundColor =
			themeMode === "light" ? "#ececec" : "#2C2C2C";
	}, [themeMode]);

	return (
		<ThemeProvider theme={getTheme(themeMode)}>
			<Routes>
				<Route path="/" element={<Main />} />
				<Route path="/demo" element={<Demo />} />
				{/* <Route path="/about" element={<About />} /> */}
				<Route
					path="/edit"
					element={user ? <EditRequestList /> : <Navigate to={"/"} />}
				/>
				<Route path="/live/:id" element={<LiveDashboard />} />
				<Route
					path="*"
					element={
						<h1
							style={{
								padding: "1rem",
								textAlign: "center",
								marginTop: height ? height * 0.3 : "30vh",
							}}
						>
							<p>404: 페이지를 찾을 수 없습니다.</p>
						</h1>
					}
				/>
			</Routes>
		</ThemeProvider>
	);
}

export default App;
