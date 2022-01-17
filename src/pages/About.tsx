import React, { useEffect } from "react";
import {
	getAuth,
	signInWithRedirect,
	setPersistence,
	browserLocalPersistence,
} from "firebase/auth";
import { auth } from "../firebase";

const About = () => {
	useEffect(() => {
		// onAuthStateChanged(auth, (user) => {
		//     console.log(user);
		//     setUser(user);
		// });
	}, [auth]);
	return <h1>About Page</h1>;
};

export default About;
