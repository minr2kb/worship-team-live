export interface Request {
	_id: string;
	text: string;
	from: string;
	to: string;
	status: "unchecked" | "accepted" | "rejected";
}