// 화면에 쓰이는 "정적 UI 문구"만 남겨둔 파일입니다.
// (여행 일정/장소/경로/찜/대화 같은 실제 데이터는 더 이상 여기 없습니다 —
//  전부 lib/apiClient.js를 통해 실제 DB(lib/repo/*)와 Google/Gemini API에서 가져옵니다.)

export const brand = {
  name: "PATH",
  tagline: "AI와 함께, 일본 여행의 가장 확실한 길",
  subTagline: "여행 계획부터 이동경로까지 한 번에",
};

export const quickTags = [
  "도보 최소",
  "환승 최소",
  "맛집 포함",
  "관광 위주",
  "여유롭게",
  "가족 여행",
];

export const suggestedPrompts = [
  "도쿄 2박 3일 일정을 추천해줘",
  "지브리 박물관 가는 방법 알려줘",
  "주변 맛집 추천해줘",
];

// AI 분석/재분석 화면(StepChecklist)에 표시되는 단계 라벨.
// 실제 진행 상태(pending/active/done/error)는 lib/agent의 Tool 호출 이벤트로 채워집니다.
export const analysisSteps = [
  { id: "intent", title: "요청 내용 분석", desc: "여행 조건, 인원, 날짜 확인" },
  { id: "places", title: "방문 장소 검색", desc: "Google Places" },
  { id: "routes", title: "이동 경로 계산", desc: "Google Routes" },
  { id: "transit", title: "교통 정보 확인", desc: "ODPT" },
  { id: "rag", title: "여행 지식 검색", desc: "RAG" },
];

export const reanalysisSteps = [
  { id: "places", title: "방문 장소 재확인", desc: "Google Places" },
  { id: "routes", title: "이동 경로 재계산", desc: "Google Routes" },
  { id: "transit", title: "교통 정보 재확인", desc: "ODPT" },
  { id: "rag", title: "여행 팁 재확인", desc: "RAG" },
];

export const faqItems = [
  "AI 일정은 어떻게 수정하나요?",
  "교통 정보는 실시간인가요?",
  "지원 지역이 궁금해요",
];

export const onboardingSlides = [
  {
    id: 1,
    eyebrow: "AI가 알아서 일정을 짜줘요",
    title: ["말 한마디로 완성되는", "일본 여행"],
    desc: "신주쿠에서 센소지까지, AI에게 물어보세요",
    demoUser: "신주쿠에서 센소지까지 당일치기 여행 일정 짜줘!",
    demoAi: "AI가 일본 여행 일정을 생성하고 있어요...",
    scene: "mountain",
  },
  {
    id: 2,
    eyebrow: "실제 데이터 기반이라 믿을 수 있어요",
    title: ["구글맵, 실시간 교통정보까지", "AI가 직접 확인"],
    desc: "환승·시간표는 AI 상상이 아닌 실제 데이터예요",
    tools: ["Google Routes", "ODPT", "Google Places"],
    scene: "map",
  },
  {
    id: 3,
    eyebrow: "대화로 언제든 바꿀 수 있어요",
    title: ["점심은 스시로,", "환승은 한 번으로"],
    desc: "채팅하듯 말하면 일정이 바로 수정돼요",
    scene: "chat",
  },
];
