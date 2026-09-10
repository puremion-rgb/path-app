# PATH — 일본 여행 AI 에이전트 (실제 작동 버전)

한국인 자유여행자를 위한 도쿄 여행 AI Agent 웹앱입니다. 화면만 만들어져 있던 프론트엔드
프로토타입에 **실제 백엔드 · 데이터베이스 · LangChain 기반 AI Agent · Google Maps/Places/Routes ·
Gemini · RAG**를 전부 연결해서, API 키만 넣으면 실제로 동작하는 프로그램입니다.

> 이 저장소에는 더 이상 "가짜 데이터(mock)"로 채워진 일정·경로·장소·대화가 없습니다.
> 로그인, 여행 일정 생성, 지도, 이동경로, 찜, 대화형 일정 수정이 모두 실제 API 호출과
> 실제 데이터베이스 저장을 통해 동작합니다.

---

## 1. 무엇이 실제로 동작하나요?

| 기능 | 구현 |
|---|---|
| 회원가입/로그인 | bcrypt 비밀번호 해시 + JWT(httpOnly 쿠키) 세션. `middleware.js`가 로그인 안 된 사용자를 `/login`으로 리다이렉트 |
| AI 여행 일정 생성 | **LangChain**(`@langchain/google-genai`) + **Gemini** Tool Calling Agent가 `search_places`(Google Places), `compute_route`(Google Routes), `search_travel_knowledge`(RAG), `check_transit_operations`(ODPT, 선택)를 실제로 호출해서 일정을 만듭니다 |
| AI 분석 중 화면 | Agent의 실제 Tool 호출 이벤트를 NDJSON 스트림으로 실시간 전달받아 단계별 체크리스트를 채웁니다 |
| 대화형 일정 수정 | 채팅 메시지를 다시 Agent에 전달해 필요한 Tool을 재호출하고, 일정을 실제로 갱신합니다 |
| 지도 | Google Maps JavaScript API로 실제 지도 위에 실제 좌표 마커 + 실제 이동경로(폴리라인)를 그립니다 |
| 이동경로 | Google Routes API(v2 `computeRoutes`)로 실제 대중교통 소요시간·환승 횟수를 계산합니다 |
| 여행 지식(RAG) | Gemini 임베딩(`gemini-embedding-001`) + 코사인 유사도 검색으로 여행 팁 문서를 검색합니다 |
| 실시간 교통정보(ODPT) | 선택 기능. `ODPT_API_KEY`가 있으면 도쿄메트로/도에이 지하철 실시간 운행정보를 덧붙입니다 |
| 찜 / 내 여행 일정 / 대화 기록 / Tool 호출 로그 | 전부 데이터베이스(SQLite, 파일 기반)에 저장됩니다 |

팀 계획서에 있던 `TOOL_LOG`(Agent가 실제로 어떤 Tool을 호출했는지 기록)도 그대로 구현되어 있습니다
(`ToolLog` 테이블, `lib/repo/toolLog.js`).

---

## 2. 빠른 시작

> **Node.js 22.5 이상이 필요합니다** (내장 `node:sqlite` 모듈을 사용하기 때문입니다).
> `node --version`으로 확인하시고, 낮다면 https://nodejs.org 에서 LTS(22.x 이상) 버전을 설치해주세요.

```bash
npm install
cp .env.example .env    # 이미 .env가 있다면 생략
```

`.env` 파일을 열어 아래 키를 채워주세요 (발급 방법은 3번 항목 참고):

```
GEMINI_API_KEY="..."
GOOGLE_MAPS_SERVER_KEY="..."
NEXT_PUBLIC_GOOGLE_MAPS_BROWSER_KEY="..."
```

RAG 지식베이스(여행 팁 문서 8건)를 임베딩해서 DB에 저장합니다 (최초 1회):

```bash
npm run db:seed
```

개발 서버 실행:

```bash
npm run dev
```

`http://localhost:3000` 접속 → 회원가입 → "AI 여행 만들기"에서 자연어로 요청하면
실제로 Google Places/Routes/RAG를 호출해서 일정을 만듭니다.

데이터베이스 파일은 `data/app.db`에 자동 생성됩니다 (별도 설치/서버 불필요).
처음부터 다시 시작하고 싶으면 `data/app.db*` 파일을 지우고 `npm run db:seed`를 다시 실행하세요.

---

## 3. API 키 발급 방법

### Gemini API (LLM + 임베딩) — `GEMINI_API_KEY`
1. https://aistudio.google.com/app/apikey 접속 (Google 계정 로그인)
2. "Get API key" → "Create API key" 클릭
3. 무료 등급(Free tier)으로 바로 사용 가능합니다.

### Google Maps Platform — `GOOGLE_MAPS_SERVER_KEY`, `NEXT_PUBLIC_GOOGLE_MAPS_BROWSER_KEY`
1. https://console.cloud.google.com 에서 새 프로젝트 생성 (또는 기존 프로젝트 사용)
2. "API 및 서비스 > 라이브러리"에서 아래 3개를 각각 사용 설정(Enable):
   - **Places API (New)**
   - **Routes API**
   - **Maps JavaScript API**
3. "API 및 서비스 > 사용자 인증 정보"에서 API 키를 **2개** 만듭니다.
   - 서버용 키 → `GOOGLE_MAPS_SERVER_KEY` (제한 없음 또는 서버 IP 제한. 브라우저에 노출되지 않습니다)
   - 브라우저용 키 → `NEXT_PUBLIC_GOOGLE_MAPS_BROWSER_KEY` (반드시 "HTTP 리퍼러 제한"을 걸어 배포 도메인만 허용하세요)
4. 신규 Google Cloud 계정은 보통 $300 무료 크레딧이 제공됩니다.

### ODPT (선택) — `ODPT_API_KEY`
- https://developer.odpt.org 에서 가입 (승인까지 영업일 기준 최대 2일)
- 설정하지 않아도 앱은 정상 동작합니다 — Google Routes 결과만 사용합니다 (팀 계획서의 MVP 방침과 동일).
- Tobu(도부 스카이트리라인) 데이터는 별도의 "오픈데이터 챌린지" 사이트 가입이 필요해 이번 버전 범위에서는 제외했습니다.

---

## 4. 프로젝트 구조

```
app/                      Next.js App Router 페이지 (화면)
  api/                    백엔드 API Route Handler
    auth/                 회원가입/로그인/로그아웃/내 정보
    agent/plan            AI 여행 일정 생성 (NDJSON 스트리밍)
    agent/modify          대화형 일정 수정 (NDJSON 스트리밍)
    trips/                내 여행 일정 CRUD
    favorites/             찜
    places/                Google Places 검색/상세/사진 프록시
lib/
  agent/                  LangChain Agent (tools.js, runAgent.js, prompts.js, normalize.js)
  google/                 Google Places / Routes API 래퍼
  gemini.js               Gemini 임베딩 REST 호출
  odpt.js                 ODPT(선택) 연동
  repo/                   데이터베이스 접근 계층 (User/Trip/Favorite/ChatMessage/ToolLog/KnowledgeDoc)
  db.js                   node:sqlite(DatabaseSync) 연결 + 테이블 생성
  auth.js                 비밀번호 해시(bcrypt) + JWT 세션(jose)
  apiClient.js            프론트엔드에서 백엔드 API를 호출하는 fetch 함수 모음
scripts/seed-knowledge.mjs  RAG 지식베이스 시드 스크립트
middleware.js             로그인 필요 화면 보호
```

---

## 5. 데이터베이스

기본값은 **SQLite**이며, 별도 패키지 설치 없이 Node.js 22+에 내장된 **`node:sqlite`**
(`DatabaseSync`) 모듈로 직접 구현했습니다 (`lib/db.js`, 파일은 `data/app.db`). Prisma 같은
별도 코드 생성 도구 없이 앱을 처음 실행하는 순간 테이블이 자동으로 만들어집니다.

Prisma나 `better-sqlite3` 같은 외부 패키지를 쓰지 않은 이유:
- `prisma generate`/`migrate`는 실행할 때마다 Prisma 서버에서 엔진 바이너리를 내려받는데,
  학교/실습실처럼 외부망이 제한된 환경에서는 이 요청이 막혀 설치 자체가 안 되는 경우가 있습니다.
- `better-sqlite3` 같은 네이티브 addon 패키지는 대부분 미리 컴파일된 바이너리를 포함하고 있지만,
  `npm install` 과정에서 환경에 따라 빌드 도구 확인 절차(node-gyp)가 실행되면서 컴파일러가 없거나
  네트워크가 제한된 PC에서 설치 전체가 실패하는 사례가 있습니다.
- `node:sqlite`는 Node.js 자체에 내장되어 있어 **설치 시점에 내려받거나 컴파일할 것이 전혀 없습니다.**
  Node 22.5 이상만 있으면 `npm install` 한 번으로 100% 동일하게 동작합니다 (실행 시 콘솔에
  "SQLite is an experimental feature" 경고가 한 번 뜰 수 있는데, 정상이며 무시해도 됩니다).

### MySQL/Supabase(PostgreSQL)로 교체하기
1. `lib/db.js`의 `getDb()` 구현부를 `mysql2`(또는 `pg`) 클라이언트로 교체합니다.
2. `lib/db.js`의 `createSchema()`에 있는 SQL을 그대로(또는 거의 그대로) 사용할 수 있습니다 —
   MySQL에서는 긴 텍스트 컬럼(`itinerary`, `embedding`, `resultJson` 등)에 `TEXT`/`LONGTEXT` 타입을 명시하세요.
3. `lib/repo/*.js`의 함수 시그니처(입출력)는 그대로 유지하도록 만들어져 있어서,
   내부 SQL 실행 부분만 새 클라이언트에 맞게 바꾸면 `app/api/**`, `lib/agent/**`는 수정할 필요가 없습니다.

---

## 6. ⚠️ 배포 시 꼭 확인하세요 (Vercel 등 서버리스 환경)

`node:sqlite`도 다른 SQLite 구현체와 마찬가지로 **로컬 디스크 파일**에 데이터를 저장합니다. 학교 PC나 일반 서버(VM), 또는
**Railway / Render / Fly.io**처럼 디스크가 유지되는 호스팅에 올리면 문제 없이 동작합니다.

하지만 **Vercel 같은 서버리스(Serverless) 배포**는 매 요청마다 파일시스템이 초기화될 수 있어
SQLite 파일이 유지되지 않습니다. Vercel에 배포하려면 아래 중 하나가 필요합니다.
- 5번 항목대로 MySQL/PostgreSQL 같은 "외부에 호스팅된" DB로 교체 (예: Supabase, PlanetScale, Railway MySQL)
- 또는 Vercel 대신 디스크가 유지되는 호스팅(Railway, Render, 자체 서버 등)을 사용

과제 제출 형식에 "배포 URL"이 필요하다면, **가장 빠른 방법은 Railway/Render에 그대로 배포**하는 것입니다
(둘 다 Next.js를 그대로 빌드/실행할 수 있고, 무료 플랜에서도 디스크가 유지됩니다).

---

## 7. 알려진 범위 제한 (의도적으로 남겨둔 부분)

- 로그인 화면의 Google/카카오 소셜 로그인 버튼은 비활성화되어 있습니다 (이메일/비밀번호만 실제 구현).
- ODPT는 선택 기능입니다 (3번 항목 참고). 미설정 시 Google Routes 결과만으로 안내합니다.
- 장소 사진은 상세 페이지에서는 Google Places 실제 사진을 보여주지만, 목록 화면(찜 목록 등)의
  일러스트 썸네일(`PlaceThumb`/`PlacePhoto`)은 API 호출 비용을 줄이기 위해 기존 디자인을 유지했습니다.
- 지원 지역은 팀 계획서의 1차 MVP 범위와 동일하게 도쿄 중심입니다 (Google Places/Routes 자체는
  다른 지역도 지원하므로, 프롬프트만 확장하면 오사카/교토 등으로 넓힐 수 있습니다).

---

## 8. 문제 해결

- **"GEMINI_API_KEY가 설정되지 않았습니다" / "GOOGLE_MAPS_SERVER_KEY가 설정되지 않았습니다"**
  → `.env`에 키를 넣었는지, 서버를 재시작했는지 확인하세요 (`npm run dev` 재실행).
- **지도가 회색으로 안 보여요** → `NEXT_PUBLIC_GOOGLE_MAPS_BROWSER_KEY`가 비어있거나,
  Google Cloud에서 "Maps JavaScript API"를 사용 설정하지 않은 경우입니다.
- **AI가 일정을 못 만들어요** → 서버 콘솔 로그에 Google Places/Routes 응답 오류 메시지가 그대로 출력됩니다.
  대부분 "API가 사용 설정되지 않음" 또는 "요청 한도 초과"입니다.
- **RAG 검색 결과가 항상 비어있어요** → `npm run db:seed`를 아직 실행하지 않았을 수 있습니다.
