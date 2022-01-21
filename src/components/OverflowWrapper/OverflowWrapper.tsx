import React from "react";

interface Props {
	children: React.ReactNode;
}

export function OverflowWrapper({ children }: Props) {
	return (
		<div
			style={{
				position: "absolute",
				top: 0,
				left: 0,
				bottom: 0,
				right: 0,
				overflow: "hidden",
			}}
		>
			{children}
		</div>
	);
}
