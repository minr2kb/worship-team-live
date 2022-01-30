import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Main from "./pages/Main";
import LiveDashboard from "./pages/LiveDashboard";
// import About from "./pages/About";
// import Test from "./pages/Test";
import { useRecoilState } from "recoil";
import { userRecoil, userAuthRecoil, isLoadingRecoil } from "./states/recoil";
import { onAuthStateChanged } from "firebase/auth";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "./firebase";
import EditRequestList from "./pages/EditRequestList";
import { use100vh } from "react-div-100vh";
import { Navigate } from "react-router-dom";

const defaultRequestSet = {
	name: "기본 요청 리스트",
	list: [
		{
			id: "1",
			text: "🔈 소리가 안나와요",
		},
		{
			id: "2",
			text: "🔇 뮤트 해주세요",
		},
		{
			id: "3",
			text: "👍 볼륨 올려주세요",
		},
		{
			id: "4",
			text: "👎 볼륨 내려주세요",
		},
		{
			id: "5",
			text: "🚗 템포 높여주세요",
		},
		{
			id: "6",
			text: "🐢 템포 내려주세요",
		},
		{
			id: "7",
			text: "💬 자막이 안나와요",
		},
		{
			id: "8",
			text: "⚠️ 여기 좀 봐주세요",
		},
		{
			id: "9",
			text: "✋ 한명만 와주세요",
		},
	],
};

function App() {
	const [user, setUser] = useRecoilState(userRecoil);
	const [userAuth, setUserAuth] = useRecoilState(userAuthRecoil);
	const [isLoading, setIsLoading] = useRecoilState(isLoadingRecoil);
	const height = use100vh();

	useEffect(() => {
		setIsLoading(true);
		onAuthStateChanged(auth, user => {
			console.log(user);
			if (user) {
				const userCopy = JSON.parse(JSON.stringify(user));
				setUserAuth(userCopy);
				getDoc(doc(db, "User", user.uid))
					.then(docSnap => {
						if (docSnap.exists()) {
							console.log("Document data:", docSnap.data());
							setUser(JSON.parse(JSON.stringify(docSnap.data())));
							setIsLoading(false);
						} else {
							console.log("No such document!");
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
								.catch(err => setUser(null));
						}
					})
					.catch(err => setUser(null));
			} else {
				setUserAuth(null);
				setIsLoading(false);
			}
		});
	}, []);

	return (
		<Routes>
			<Route path="/" element={<Main />} />
			{/* <Route path="/test" element={<Test />} />
			<Route path="/about" element={<About />} /> */}
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
	);
}

export default App;
