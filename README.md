# PATH — AI와 대화하며 완성하는 일본 여행 플래너

> Journeys Powered by Conversation
> 일정을 처음 짜는 것도, 현지에서 바꾸는 것도 **말 한마디**로 끝내는 AI 여행 플래너입니다.
> 채팅으로 일정을 만들고, 실시간 교통 정보를 반영한 동선을 지도 위에서 바로 확인할 수 있어요.

**🔗 서비스 바로가기** · https://wa26bteam01.yjjob.kr/splash
**🎨 Figma** · https://www.figma.com/design/UMFFJJF0zPpLyxHYHRZlCA/path?node-id=2-3

<p>
  <img src="./docs/path-splash.webp" width="180" alt="시작 화면">
  <img src="./docs/path-plan.webp" width="180" alt="추천 여행 일정">
  <img src="./docs/path-route.webp" width="180" alt="일정 · 경로 지도">
</p>

<img src="./docs/path-pc.webp" width="560" alt="PC 화면 — 홈 · AI 여행 만들기">

<br>

## 📌 프로젝트 개요

| 항목 | 내용 |
| --- | --- |
| 기간 | 2026.09.01 – 2026.09.30 |
| 팀 | 4명 |
| 담당 | UI/UX 디자인 · 프론트엔드 |
| 플랫폼 | 반응형 웹 (모바일 · PC) |

<br>

## 🤔 해결하고 싶었던 문제

여행 일정은 **처음 짜는 것도, 현지에서 바꾸는 것도 번거롭습니다.**
장소를 찾고, 이동 동선과 교통편을 따로 검색하고, 일정이 틀어지면 처음부터 다시 맞춰야 하기 때문이에요.

PATH는 AI와 채팅하는 것만으로 일정을 만들고, 말 한마디로 바로 고칠 수 있게 합니다.

<br>

## ✨ 주요 기능

- **AI와 채팅하며 일정 완성**: 가고 싶은 곳과 취향을 대화로 알려 주면 AI가 장소를 찾고 일정을 구성합니다. 분석 과정은 단계별 체크리스트로 보여 줍니다.
- **말 한마디로 일정 즉시 수정**: 채팅으로 요청하면 일정이 바로 바뀝니다. 음성 입력도 지원합니다.
- **실시간 교통 기반 동선 추천**: Google Routes API로 대중교통 경로를 계산하고, 도쿄 지하철 운행 정보(ODPT)가 연결되어 있으면 지연 · 운휴 여부를 함께 안내합니다.
- **지도에서 위치 · 교통 확인**: 일정의 장소와 이동 경로를 지도에서 보고, 주변 장소와 장소 상세 정보를 확인합니다.
- **AI에게 질문하기**: 환율(엔 → 원)처럼 여행 중 궁금한 점을 바로 물어보고, 일본 여행 지식(RAG)에서 근거를 찾아 답합니다.
- **일정 저장 · 내보내기**: 일정을 저장하고 찜할 수 있고, 해외에서 데이터가 불안정할 때를 대비해 이미지나 PDF로 저장할 수 있습니다.

<br>

## 🛠 기술 스택

| 구분 | 사용 기술 |
| --- | --- |
| Framework | Next.js 14 (App Router), React 18 |
| Language | JavaScript |
| Styling | CSS Modules, Tailwind CSS |
| AI | Google Gemini, LangChain (Agent · Tool 호출), Gemini 임베딩 기반 RAG |
| 지도 · 경로 | Google Maps, Places API (New), Routes API |
| 교통 정보 | ODPT 공공교통 오픈데이터 (선택) |
| 환율 | Frankfurter API |
| DB | SQLite (Node.js 내장 `node:sqlite`) |
| 인증 | JWT (`jose`), `bcryptjs` |
| 내보내기 | html2canvas, jsPDF |
| Font | Pretendard |

<br>

## 📁 폴더 구조

```
app/
  home/              홈
  ai/                AI 여행 만들기 (질문 · 채팅 · 분석 · 결과 · 경로 · 장소 상세)
  map/               지도 (주변 · 경로)
  favorites/         찜
  my/                MY (프로필 · 내 여행 · 설정 · 고객센터)
  login/             로그인
  api/               API 라우트 (agent · auth · favorites · places · trips)
components/          공통 컴포넌트 (BottomNav, Header, Timeline, GoogleMapView 등)
lib/
  agent/             AI Agent (프롬프트 · Tool · 실행)
  google/            Google Places · Routes 연동
  repo/              DB 접근 (users, trips, favorites, chat 등)
  db.js              SQLite 연결과 테이블 생성
  odpt.js            ODPT 교통 정보 연동
  exchangeRate.js    환율 조회
  exportItinerary.js 일정 이미지 · PDF 저장
scripts/
  seed-knowledge.mjs RAG 지식베이스 시드
```

<br>

## 🚀 실행 방법

Node.js **22.5 이상**이 필요합니다. (내장 SQLite를 사용합니다.)

```bash
npm install
cp .env.example .env   # 값을 채워 주세요
npm run db:seed        # (선택) AI가 참고할 일본 여행 지식 등록
npm run dev
```

`.env`에 넣을 값은 아래와 같습니다.

| 변수 | 설명 | 필수 |
| --- | --- | --- |
| `AUTH_SECRET` | 로그인 세션 서명용 임의의 긴 문자열 | ✅ |
| `GEMINI_API_KEY` | Google Gemini API 키 | ✅ |
| `GOOGLE_MAPS_SERVER_KEY` | Places API (New) · Routes API 사용이 켜진 서버용 키 | ✅ |
| `NEXT_PUBLIC_GOOGLE_MAPS_BROWSER_KEY` | 지도 표시용 브라우저 키 | ✅ |
| `ODPT_API_KEY` | 도쿄 지하철 실시간 운행 정보 (없으면 Google 경로만 안내) | 선택 |

DB 파일(`data/app.db`)은 처음 실행할 때 자동으로 만들어집니다.
