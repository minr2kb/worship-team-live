import React from "react";
import { Route } from "react-router";
export default (
	<Route>
		<Route path="/" />
		<Route path="/demo" />
		<Route path="/edit" />
		<Route path="/live/:id" />
		<Route path="*" />
	</Route>
);
