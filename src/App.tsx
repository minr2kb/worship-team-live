import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Main from "./pages/Main";
import LiveDashboard from "./pages/LiveDashboard";
import About from "./pages/About";
import Test from "./pages/Test";
import { useRecoilState } from "recoil";
import { userRecoil, isLoadingRecoil } from "./states/recoil";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

function App() {
	const [user, setUser] = useRecoilState(userRecoil);
	const [isLoading, setIsLoading] = useRecoilState(isLoadingRecoil);

	useEffect(() => {
		setIsLoading(true);
		onAuthStateChanged(auth, user => {
			console.log(user);
			if (user) {
				const userCopy = JSON.parse(JSON.stringify(user));
				setUser(userCopy);
			} else {
				setUser(null);
			}
			setIsLoading(false);
		});
	}, []);

	return (
		<Routes>
			<Route path="/" element={<Main />} />
			<Route path="/test" element={<Test />} />
			<Route path="/about" element={<About />} />
			<Route path="/live/:id" element={<LiveDashboard />} />
			<Route
				path="*"
				element={
					<h1
						style={{
							padding: "1rem",
							textAlign: "center",
							marginTop: "30vh",
						}}
					>
						<p>404: 페이지를 찾을 수 없습니다.</p>
					</h1>
				}
			/>
		</Routes>
	);
}

export default App;
