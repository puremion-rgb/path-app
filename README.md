# PATH — 일본 여행 AI 에이전트 (모바일 프론트엔드 프로토타입)

국비과정 '프로젝트2) ChatGPT 활용 응용SW개발' 프로젝트용, 팀 PATH의 모바일 화면 프론트엔드입니다.
Next.js 14 (App Router) + JavaScript로 제작되었으며, 첨부해주신 Figma 프로토타입(새_폴더.zip)과
로고(Logo-new01/02.svg), 화면구성.txt / 팀플_내용.txt / 참고용.txt에 정리된 18화면 구조를 기준으로
실제 라우팅이 동작하는 코드로 옮겼습니다.

## 이번 병합 (path-app + path_zip)

`path_zip`(초기 디자인본)의 다음 요소를 이 프로젝트에 합쳤습니다.

- **모바일 상단바**: 탭 화면은 `LogoHeader`(PATH 워드마크), 스택 화면은 `StackHeader`
  (뒤로가기 + 굵은 제목)로 통일 — `components/Header.js`가 `StackHeader`를 감쌉니다.
- **PC(데스크톱) 레이아웃 전체**: 좌측 사이드바(`components/Sidebar.js`, MY 하위메뉴 포함) +
  상단 크럼브/제목 바를 가진 `components/TabShell.js`로 교체. 홈/지도/찜/MY 및 그 하위 화면,
  AI 여행 플로우(`app/ai/layout.js`)가 PC에서 path_zip과 동일한 셸을 사용합니다.
- **로그인 화면**: `app/login/page.js` 를 path_zip 버전으로 교체 (모바일=세로 카드,
  PC=좌측 브랜드 패널 + 우측 폼). 더 이상 모바일 화면을 확대해서 보여주지 않습니다.
- **고객센터 › 일본 여행 팁**: `app/my/support/tips/page.js` 를 path_zip 버전(아코디언 +
  교통패스 상세)으로 교체하고, 고객센터·홈·지도의 관련 링크를 이 경로로 연결.

스타일은 기존 CSS Module을 유지하면서 path_zip 컴포넌트용으로 **Tailwind CSS v4**(preflight 제외,
유틸리티/테마만)를 추가했습니다. 색 토큰은 `app/globals.css` 의 `@theme` 에서 PATH 팔레트에 매핑됩니다.

## 실행 방법

```bash
npm install
npm run dev
```

브라우저에서 http://localhost:3000 접속 후, 개발자도구의 모바일 화면 크기(390px 내외)로 보시면
프로토타입과 동일한 레이아웃을, 넓은 창에서는 좌측 사이드바(PC) 레이아웃을 확인하실 수 있습니다.

배포용 빌드는 `npm run build && npm start` 로 확인하실 수 있고, Vercel에 그대로 올리셔도 됩니다.

## 구현된 화면

- 온보딩: 스플래시 → 서비스 소개(3슬라이드) → 로그인/회원가입
- 하단탭 5개: 홈 / 지도 / AI 여행 / 찜 / MY
- 지도 탭: 지도, 주변 맛집·관광지, 일본 여행 팁(RAG), 이동경로 상세
- AI 여행 탭(스택형, 하단 탭 없음): 여행 요청 → AI 분석 중(실패 상태 포함) → 일정 결과 →
  지도/경로 → 장소 상세 → 대화형 일정 수정(채팅) → AI 재분석 중 → 변경된 일정
- MY: 프로필 수정, 내 여행 일정(빈 상태 포함), 설정, 고객센터

## 구조

- `app/` — Next.js App Router 페이지 (화면 단위 라우팅)
- `components/` — 공통 컴포넌트 (Button, Card, Timeline, StepChecklist, BottomNav, MapArt 등)
- `lib/mockData.js` — 화면에 쓰이는 목업 데이터. 실제 서비스 연동 시 이 부분을
  Gemini/LangChain Agent, MySQL API 응답으로 교체하면 됩니다.
- `public/images/` — 전달해주신 PATH 로고 SVG
- `public/fonts/` — Pretendard 폰트 (자체 호스팅, 외부 CDN 의존 없음)

## 이번 업데이트 (v2)

- 스플래시/온보딩 배경을 전달받은 실제 이미지로 교체 (버튼·다음 로직은 기존 코드 그대로 유지)
- 홈 화면을 전달받은 참고 화면 구조로 재구성 (AI 여행 만들기 카드, 추천 스팟 그라디언트 타일, 요약 카드, 추천 질문 칩) + 900px 이상에서 4열 그리드
- 하단 탭바를 참고 디자인의 알약형 하이라이트 스타일로 교체하고, 홈 아이콘 크기가 다른 아이콘과 안 맞던 부분을 뷰박스 보정으로 수정
- 찜 화면의 장소 썸네일을 참고 디자인과 동일한 정사각형 "IMAGE" 플레이스홀더로 교체
- 데스크톱(PC, 900px 이상) 좌측 사이드바 내비게이션 추가 — 기존 PATH 브랜드 톤(네이비/오렌지) 유지



- 장소 사진은 저작권 문제를 피하기 위해 실제 사진 대신 브랜드 톤에 맞춘 일러스트 썸네일
  (`components/PlaceThumb.js`)로 대체했습니다. 실제 서비스에서는 Google Places Photo API 등으로
  교체하시면 됩니다.
- 지도 화면은 Google Maps 연동 전 단계이므로, 그리드+마커로 스타일링한 SVG 목업(`components/MapArt.js`)을
  사용했습니다.
- AI 분석/재분석 화면은 setTimeout으로 단계별 진행을 흉내낸 것이며, 실제 연동 시 LangChain Agent의
  Tool 호출 이벤트를 스트리밍으로 받아 같은 UI에 꽂으시면 됩니다.
