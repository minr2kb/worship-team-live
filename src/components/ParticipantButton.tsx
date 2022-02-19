import { Button, Box, useTheme } from "@mui/material";

import React from "react";

interface ParticipantButtonProps {
	spacing?: number;
	participant: string;
	participantPosition: string;
	receiver: string | null;
	setReceiver: (value: React.SetStateAction<string | null>) => void;
}

const ParticipantButton: React.VFC<ParticipantButtonProps> = ({
	spacing = 2,
	participant,
	participantPosition,
	receiver,
	setReceiver,
}) => {
	const theme = useTheme();
	return (
		<Button
			key={participant}
			onClick={() => setReceiver(participant)}
			color={receiver === participant ? "info" : "primary"}
			variant="contained"
			sx={{
				fontWeight: "normal",
				color:
					receiver === participant
						? "#fff"
						: theme.palette.text.primary,
				p: "8px",
				pl: 2,
				pr: 2,
				mr: spacing,
				mb: spacing,
			}}
		>
			{participantPosition}
		</Button>
	);
};

export default ParticipantButton;
