# '찬양팀 라이브' 프로젝트 소스코드
## 서비스 주소
https://worship-team-live.web.app/

## 기획

### 계기

찬양팀 사역을 하다보면 멤버들 간의 소통이 필요하다. 악기 팀 사이, 싱어와 방송팀 사이에 등등. 그러나 연습시간 혹은 예배시간에는 멤버들 간의 원활한 소통과 피드백이 상당히 어려운 것이 현실이다.

거리상 멀어서 부르는게 쉽지 않기도 하지만, 심지어 찬양이 시작되기라도 하면 소리를 지를 수도, 손을 흔들어 표시하기도 어렵다. 특히 악기 연주팀은 손이 바쁘게 움직이기 때문에 카톡을 할 여건조차 되지 않는다.

소통을 방해하는 상황적 요인들이 뚜렷하게 드러남에도 불구하고 아직까지는 적절한 대안 혹은 시스템이 없다. 그렇다면 시스템 구축 금액에 대한 부담이 없고, 조작이 매우 단순하며, 제스쳐나 소리가 없이 디스플레이를 통해 소통이 가능한 플랫폼을 구축한다면 어떨까?

### 주요 서비스

찬양팀은 연습이나 예배 등의 상황에 방(라이브)을 생성한다. 그 방에 다른 멤버들이 함께 참가할 수 있고, 각자가 저장해놓은 요청 버튼을 이용해 간단하게 소통이 가능하다. 또한 요청이 오가는 것을 실시간으로 확인 가능하다.

### 서비스 플로우
[서비스 플로우](https://miro.com/app/board/uXjVOWMhuW4=/?invite_link_id=84353965716)

### 비즈니스 모델

현재는 무료서비스이지만, 만약 미래에 서비스 규모가 커지면 서비 비용이 청구되거나 앱개발이 들어 갈 수도 있다. 초기는 후원계좌, 후에는 광고 혹은 유료 서비스까지 고려해야 할 수도.

## 개발

### 기술 스택

Frontend

- TypeScript
- React.js
- Material UI
- react-hot-toast

Backend

- Firebase auth
- Firebase firestore
- Firebase Hosting

### UI 디자인
[Figma](https://www.figma.com/embed?embed_host=notion&url=https%3A%2F%2Fwww.figma.com%2Ffile%2FzXh3hUi41JhsyobXucJnga%2F%25EC%25B0%25AC%25EC%2596%2591%25ED%258C%2580-%25EC%2586%258C%25ED%2586%25B5-%25EC%258B%259C%25EC%258A%25A4%25ED%2585%259C%3Fnode-id%3D0%253A1)

## 데이터 구조

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
	    status: "unchecked" | "accepted" | "rejected";
    }
  ];
}
```

### 기능 구현

Routes

- "/":	메인 페이지, 로그인, 라이브 만들기, 참가하기
- "/edit":	요청 리스트 수정 페이지
- "/live/:id":	id에 해당하는 라이브
- "/demo"	대시보드 demo

Request status

|  | unchecked | accepted | rejected |
| --- | --- | --- | --- |
| from me | 흰색/확인중 | 초록/확인됨 | 빨강/거절됨 |
| to me | 버튼 | 회색/확인함 | 회색/거절함 |
