import React from "react";
import classNames from "classnames";

interface Props {
	children: React.ReactNode;
	center?: boolean;
	style?: React.CSSProperties;
}

export function Wrapper({ children, center, style }: Props) {
	return (
		<div
			style={{
				display: "flex",
				width: "100%",
				boxSizing: "border-box",
				padding: "20px",
				justifyContent: center ? "flex-start" : "center",
				...style,
			}}
		>
			{children}
		</div>
	);
}
