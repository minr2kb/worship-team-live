import { RequestSet, RequestPacket, Live } from "./interfaces/types";

export const defaultRequestSets: RequestSet[] = [
	{
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
				text: "📈 모니터 올려주세요",
			},
			{
				id: "8",
				text: "📉 모니터 줄여주세요",
			},
			{
				id: "9",
				text: "🛠 톤 잡아주세요",
			},
			{
				id: "10",
				text: "💬 자막이 안나와요",
			},
			{
				id: "11",
				text: "✋ 여기 좀 봐주세요",
			},
			{
				id: "12",
				text: "🙋 한명만 와주세요",
			},
		],
	},
	{
		name: "기본 인도자 리스트",
		list: [
			{
				id: "1",
				text: "🔙 처음으로",
			},
			{
				id: "2",
				text: "🔁 계속 반복",
			},
			{
				id: "3",
				text: "👍 키 업",
			},
			{
				id: "4",
				text: "🫧 잔잔하게",
			},
			{
				id: "5",
				text: "⏩ 다음곡",
			},
			{
				id: "6",
				text: "⏪ 이전곡",
			},
			{
				id: "7",
				text: "↗️ 빌드업",
			},
			{
				id: "8",
				text: "⛔️ 엔딩",
			},
			{
				id: "9",
				text: "🚧 브릿지",
			},
			{
				id: "10",
				text: "🎸 간주",
			},
		],
	},
];

export const demoRequests: RequestPacket[] = [
	{
		id: "0",
		text: "🚗 템포 높여주세요",
		from: "3",
		to: "0",
		status: "unchecked",
	},
	{
		id: "1",
		text: "🔈 소리가 안나와요",
		from: "6",
		to: "0",
		status: "unchecked",
	},
	{
		id: "2",
		text: "🙋 한명만 와주세요",
		from: "9",
		to: "ALL",
		status: "unchecked",
	},
	{
		id: "3",
		text: "✋ 여기 좀 봐주세요",
		from: "5",
		to: "0",
		status: "unchecked",
	},
	{
		id: "4",
		text: "👍 볼륨 올려주세요",
		from: "6",
		to: "0",
		status: "unchecked",
	},
	{
		id: "5",
		text: "🐢 템포 내려주세요",
		from: "8",
		to: "0",
		status: "unchecked",
	},
	{
		id: "6",
		text: "✋ 여기 좀 봐주세요",
		from: "7",
		to: "0",
		status: "unchecked",
	},
	{
		id: "7",
		text: "👎 볼륨 내려주세요",
		from: "4",
		to: "0",
		status: "unchecked",
	},
	{
		id: "8",
		text: "🙋 한명만 와주세요",
		from: "5",
		to: "ALL",
		status: "unchecked",
	},
	{
		id: "9",
		text: "💬 자막이 안나와요",
		from: "3",
		to: "0",
		status: "unchecked",
	},
];

export const demoRequestsAndResponses: RequestPacket[] = [
	{
		id: "0",
		text: "🚗 템포 높여주세요",
		from: "3",
		to: "0",
		status: "accepted",
	},
	{
		id: "1",
		text: "🔈 소리가 안나와요",
		from: "0",
		to: "1",
		status: "accepted",
	},
	{
		id: "2",
		text: "🙋 한명만 와주세요",
		from: "9",
		to: "ALL",
		status: "accepted",
	},
	{
		id: "3",
		text: "✋ 여기 좀 봐주세요",
		from: "0",
		to: "2",
		status: "accepted",
	},
	{
		id: "4",
		text: "👍 볼륨 올려주세요",
		from: "0",
		to: "1",
		status: "rejected",
	},
	{
		id: "5",
		text: "🐢 템포 내려주세요",
		from: "5",
		to: "0",
		status: "accepted",
	},
	{
		id: "6",
		text: "✋ 여기 좀 봐주세요",
		from: "7",
		to: "0",
		status: "unchecked",
	},
	{
		id: "7",
		text: "👎 볼륨 내려주세요",
		from: "0",
		to: "1",
		status: "unchecked",
	},
	{
		id: "8",
		text: "🙋 한명만 와주세요",
		from: "5",
		to: "ALL",
		status: "accepted",
	},
	{
		id: "8",
		text: "🚗 템포 높여주세요",
		from: "3",
		to: "0",
		status: "unchecked",
	},
];

export const demoParticipants = {
	"0": {
		position: "⭐️ 인도자",
		isVerified: true,
		requestSet: 0,
	},
	"1": {
		position: "🎛 음향팀",
		isVerified: true,
		requestSet: 0,
	},
	"2": {
		position: "🎹 메인건반",
		isVerified: true,
		requestSet: 0,
	},
	"3": {
		position: "🎻 세컨건반",
		isVerified: true,
		requestSet: 0,
	},
	"4": {
		position: "🖥 방송팀",
		isVerified: true,
		requestSet: 0,
	},
	"5": {
		position: "🥁 드럼",
		isVerified: true,
		requestSet: 0,
	},
	"6": {
		position: "🎸 베이스",
		isVerified: true,
		requestSet: 0,
	},
	"7": {
		position: "🪕 어쿠스틱",
		isVerified: true,
		requestSet: 0,
	},
	"8": {
		position: "⚡️ 일렉",
		isVerified: true,
		requestSet: 0,
	},
	"9": {
		position: "🎙 싱어R",
		isVerified: true,
		requestSet: 0,
	},
	"10": {
		position: "🎙 싱어L",
		isVerified: true,
		requestSet: 0,
	},
};

export const demoLiveData: Live = {
	title: "데모교회 주일예배",
	code: "268436",
	password: null,
	host: "0",
	createdTime: new Date(),
	participants: demoParticipants,
	requests: [],
};
