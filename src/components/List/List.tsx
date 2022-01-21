import React, { forwardRef } from "react";
import classNames from "classnames";
import { autocompleteClasses } from "@mui/material";

export interface Props {
	children: React.ReactNode;
	columns?: number;
	style?: React.CSSProperties;
	horizontal?: boolean;
}

export const List = forwardRef<HTMLUListElement, Props>(
	({ children, columns = 1, horizontal, style }: Props, ref) => {
		return (
			<ul
				ref={ref}
				style={
					{
						display: "grid",
						gridAutoRows: "max-content",
						boxSizing: "border-box",
						minWidth: "350px",
						gridGap: "10px",
						padding: "20px",
						paddingBottom: 0,
						margin: "10px",
						borderRadius: "5px",
						minHeight: "200px",
						transition: "background-color 350ms ease",
						gridTemplateColumns: "repeat(var(--columns, 1), 1fr)",

						width: horizontal ? "100%" : "auto",
						gridAutoFlow: horizontal ? "column" : "",
						// "--columns": "columns",

						// "&:after": {
						// 	content: "",
						// 	height: "10px",
						// 	gridColumnStart: "span var(--columns, 1)",
						// },
						...style,
					}
					//  as React.CSSProperties
				}
				className={
					classNames()
					// styles.List,
					// horizontal && styles.horizontal
				}
			>
				{children}
			</ul>
		);
	}
);
