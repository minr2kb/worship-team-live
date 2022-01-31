import { Timestamp } from "firebase/firestore";

type Uid = string;

export interface RequestPacket {
	id: string;
	text: string;
	from: Uid;
	to: Uid;
	status: "unchecked" | "accepted" | "rejected";
}

export interface Request {
	id: string;
	text: string;
}

export interface RequestSet {
	name: string;
	list: Request[];
}

export interface IUser {
	name: string | null;
	currentLive: string | null;
	requestList: RequestSet[];
}

export interface Live {
	title: string;
	code: string;
	password: string | null;
	host: Uid;
	createdTime: Timestamp | Date;
	participants: {
		[key: Uid]: {
			position: string;
			isVerified: boolean;
			requestSet: number;
		};
	};
	requests: RequestPacket[];
}
