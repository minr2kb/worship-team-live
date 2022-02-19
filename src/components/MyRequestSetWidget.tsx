import { Typography, useTheme } from "@mui/material";
import React from "react";

import Card from "./Card";

interface MyRequestSetWidgetProps {
	children?: JSX.Element;
}

const MyRequestSetWidget: React.VFC<MyRequestSetWidgetProps> = ({
	children,
}) => {
	const theme = useTheme();
	return (
		<Card
			centered
			sx={{
				backgroundColor: theme.palette.primary.main,
			}}
		>
			<Typography variant="h4" mb={0.5}>
				요청 리스트
			</Typography>
			{children}
		</Card>
	);
};

export default MyRequestSetWidget;
