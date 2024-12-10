# '찬양팀 라이브' 프로젝트 소스코드
![worship-team-live](https://github.com/user-attachments/assets/0ae07454-d926-436e-8c1f-a16ea62d41db)

## 프로젝트 개요
찬양팀 라이브는 예배/찬양 상황에서 팀원들 간의 실시간 소통을 돕는 웹 애플리케이션입니다. 특히 소리를 내거나 손동작을 할 수 없는 상황에서도 간단한 터치만으로 의사소통이 가능하도록 설계되었습니다.

## 핵심 기능
### 실시간 라이브 세션
- 방 생성 및 참여
    - 고유한 6자리 코드 생성 시스템
    - 선택적 비밀번호 보호 기능
    - 호스트/참여자 권한 구분
    - 실시간 요청 시스템
- 실시간 요청 시스템
    - Firebase Firestore를 활용한 실시간 데이터 동기화
    - 요청 상태 관리 (확인중/수락됨/거절됨)
    - 푸시 알림 기능

### 사용자 경험 최적화

- 반응형 레이아웃
    - Material UI 기반의 모바일 최적화 디자인
    - 태블릿/데스크톱 대응 레이아웃
- NoSleep으로 모바일 화면 꺼짐 방지
- MUII 활용 다크모드 지원

### 커스터마이저블 요청 시스템

- 개인화된 요청 세트
    - 사용자별 커스텀 요청 리스트 관리
    - 드래그 앤 드롭 기반 요청 순서 변경
    - 실시간 요청 세트 전환 기능

## 기술 스택

### 프론트엔드
- TypeScript + React.js
- Material UI
- react-hot-toast (토스트 알림)
- Recoil (상태 관리)

### 백엔드/인프라
- Firebase Authentication
    - Google OAuth 인증
    - 익명 로그인 지원
- Firebase Firestore
    - 실시간 데이터베이스
    - 요청/응답 처리
    - Firebase Cloud Messaging


## 서비스 플로우

[서비스 플로우](https://miro.com/app/board/uXjVOWMhuW4=/?invite_link_id=84353965716)



## UI 디자인

[Figma](https://www.figma.com/embed?embed_host=notion&url=https%3A%2F%2Fwww.figma.com%2Ffile%2FzXh3hUi41JhsyobXucJnga%2F%25EC%25B0%25AC%25EC%2596%2591%25ED%258C%2580-%25EC%2586%258C%25ED%2586%25B5-%25EC%258B%259C%25EC%258A%25A4%25ED%2585%259C%3Fnode-id%3D0%253A1)

## DB 디자인

### User

```tsx
interface User {
	name: string | null;
	currentLive: string | null;
	requestList: [
		{
			name: string;
			list: [
				{
					id: string;
					text: string;
				}
			];
		}
	];
}
```

### Live

```tsx
interface Live {
	title: string;
	code: string;
	password: string | null;
	host: Uid;
	createdTime: Timestamp;
	participants: {
		[key: Uid]: {
			position: string;
			isVerified: boolean;
			requestSet: number;
		};
	};
	requests: [
		{
			id: string;
			text: string;
			from: Uid;
			to: Uid;
			status: ReqStatus;
		}
	];
}
```

## 라우터 & 상태 체크

Routes

-   "/": 메인 페이지, 로그인, 라이브 만들기, 참가하기
-   "/edit": 요청 리스트 수정 페이지
-   "/live/:id": id에 해당하는 라이브
-   "/demo" 대시보드 demo

Request status

|         | unchecked   | accepted    | rejected    |
| ------- | ----------- | ----------- | ----------- |
| from me | 흰색/확인중 | 초록/확인됨 | 빨강/거절됨 |
| to me   | 버튼        | 회색/확인함 | 회색/거절함 |

## 👨‍💻 개발자

- Kyungbae Min - [GitHub](https://github.com/minr2kb)
- Email: kbmin1129@gmail.com
