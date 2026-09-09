// PATH 앱 전역에서 사용하는 목업 데이터.
// 실제 서비스에서는 이 값들이 Gemini / LangChain Agent, MySQL, Google Places 등을
// 통해 채워집니다. 프론트엔드 프로토타입 단계이므로 정적 데이터로 대체합니다.

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

export const placeIcon = {
  senso: "pagoda",
  skytree: "tower",
  shibuya: "city",
  sushidai: "food",
  shinjukuGyoen: "garden",
};

export const places = {
  senso: {
    id: "senso",
    name: "센소지 (浅草寺)",
    category: "관광지",
    area: "다이토구",
    tone: "sunset",
    desc: "도쿄에서 가장 오래된 사찰 중 하나로 아사쿠사의 대표적인 관광 명소입니다.",
    hours: "06:00 - 17:00",
    address: "도쿄도 다이토구 아사쿠사 2-3-1",
    nearby: ["나카미세도리", "아사쿠사 신사", "스미다 공원"],
    fromPrev: { from: "신주쿠역", to: "센소지", duration: "25분", transfer: "환승 1회", walk: "도보 10분" },
  },
  skytree: {
    id: "skytree",
    name: "도쿄 스카이트리",
    category: "관광지",
    area: "스미다구",
    tone: "twilight",
    desc: "높이 634m의 전망대로, 도쿄 시내와 날씨가 좋으면 후지산까지 조망할 수 있습니다.",
    hours: "10:00 - 21:00",
    address: "도쿄도 스미다구 오시아게 1-1-2",
    nearby: ["소라마치", "스미다 수족관", "센소지"],
    fromPrev: { from: "센소지", to: "스카이트리", duration: "15분", transfer: "환승 없음", walk: "도보 5분" },
  },
  shibuya: {
    id: "shibuya",
    name: "시부야 스크램블",
    category: "관광지",
    area: "시부야구",
    tone: "night",
    desc: "세계에서 가장 붐비는 횡단보도 중 하나로, 도쿄 젊음의 거리를 상징하는 장소입니다.",
    hours: "24시간 개방",
    address: "도쿄도 시부야구 도겐자카 2초메",
    nearby: ["시부야 스카이", "하치코 동상", "센터가이"],
    fromPrev: { from: "신주쿠역", to: "시부야역", duration: "12분", transfer: "환승 없음", walk: "도보 3분" },
  },
  sushidai: {
    id: "sushidai",
    name: "스시 다이",
    category: "맛집",
    area: "츠키지",
    tone: "sunset",
    desc: "츠키지 인근에서 오랜 시간 사랑받은 현지인 추천 스시 맛집입니다.",
    hours: "07:00 - 14:00",
    address: "도쿄도 츄오구 츠키지 4초메",
    nearby: ["츠키지 장외시장", "나미요케 신사"],
    fromPrev: { from: "센소지", to: "스시 다이", duration: "22분", transfer: "환승 1회", walk: "도보 5분" },
  },
  shinjukuGyoen: {
    id: "shinjukuGyoen",
    name: "신주쿠 교엔",
    category: "관광지",
    area: "신주쿠",
    tone: "twilight",
    desc: "일본식, 프랑스식, 영국식 정원이 공존하는 도심 속 대형 공원입니다.",
    hours: "09:00 - 16:30",
    address: "도쿄도 신주쿠구 나이엔초 11",
    nearby: ["신주쿠역", "메이지진구"],
    fromPrev: { from: "신주쿠역", to: "신주쿠 교엔", duration: "10분", transfer: "환승 없음", walk: "도보 8분" },
  },
};

export const itineraryDays = [
  {
    id: "day1",
    label: "1일차",
    date: "4월 12일 (토)",
    condition: "도보 최소 · 환승 최대 1회 기준",
    items: [
      { time: "09:00", title: "신주쿠역 출발", desc: "JR 야마노테선 · 역에서 바로 승차", tone: "start" },
      { time: "09:45", title: "센소지", desc: "도보 10분 · 아사쿠사 대표 관광지", tone: "stop", placeId: "senso" },
      { time: "12:30", title: "점심 · 스시 다이", desc: "도보 5분 · 현지 인기 스시", tone: "stop", placeId: "sushidai" },
      { time: "13:30", title: "스카이트리", desc: "전철 15분 · 도쿄 전망 명소", tone: "hub", placeId: "skytree" },
      { time: "17:00", title: "숙소 복귀", desc: "", tone: "end" },
    ],
  },
  {
    id: "day2",
    label: "2일차",
    date: "4월 13일 (일)",
    condition: "관광 위주 · 여유롭게",
    items: [
      { time: "10:00", title: "신주쿠 교엔", desc: "도보 8분 · 도심 속 정원", tone: "stop", placeId: "shinjukuGyoen" },
      { time: "13:00", title: "점심 · 신주쿠 라멘 거리", desc: "도보 3분", tone: "stop" },
      { time: "15:00", title: "시부야 스크램블", desc: "전철 12분 · 시부야 스카이", tone: "stop", placeId: "shibuya" },
      { time: "19:00", title: "숙소 복귀", desc: "", tone: "end" },
    ],
  },
  {
    id: "day3",
    label: "3일차",
    date: "4월 14일 (월)",
    condition: "공항 이동일",
    items: [
      { time: "09:00", title: "숙소 체크아웃", desc: "", tone: "start" },
      { time: "11:00", title: "나리타 공항 이동", desc: "전철 60분 · 리무진 버스 대안 가능", tone: "end" },
    ],
  },
];

export const routeDetail = {
  from: "신주쿠역",
  to: "센소지",
  duration: "약 45분",
  transfers: "환승 1회",
  source: "교통 공공데이터 출처: 東京都交通局 / 공공교통오픈データ協議会",
  legs: [
    { mode: "JR 야마노테선", detail: "신주쿠역 → 우에노역", color: "#2f6fed" },
    { mode: "도쿄 메트로", detail: "우에노역 → 아사쿠사역", color: "#2f6fed" },
    { mode: "도보", detail: "아사쿠사역 → 센소지", color: "#12173f" },
  ],
};

export const changedSchedule = {
  summary: "환승 1회 · 도보 12분 단축",
  before: { title: "점심", value: "라멘 맛집", metaLabel: "환승", metaValue: "2회" },
  after: { title: "점심", value: "스시 맛집", metaLabel: "환승", metaValue: "1회" },
  date: "4월 12일 (토) · 변경 반영",
  items: [
    { time: "09:00", title: "신주쿠역 출발", tone: "start" },
    { time: "12:20", title: "스시 맛집 (변경됨)", tone: "changed" },
    { time: "13:30", title: "스카이트리 (환승 1회)", tone: "stop" },
    { time: "17:00", title: "숙소 복귀", tone: "end" },
  ],
};

export const chatMessages = [
  { role: "user", text: "점심은 스시로 바꾸고 환승도 최대 한 번으로 해줘." },
  {
    role: "ai",
    text: "좋아요! 조건을 반영해 점심 장소와 이동 경로를 다시 계산하고 있어요.",
    checklist: ["점심 장소 재검색", "이동 경로 재계산", "환승 횟수 확인"],
    result: { title: "변경된 일정", desc: "12:30 점심 → 스시 다이", meta: "13:30 스카이트리 이동 · 환승 1회" },
  },
];

export const homeRecommendations = [
  { id: "senso", label: "센소지", tone: "sunset" },
  { id: "skytree", label: "스카이트리", tone: "twilight" },
  { id: "shibuya", label: "시부야", tone: "night" },
];

export const favorites = [
  { id: "senso", name: "센소지", area: "아사쿠사 · 관광지", tone: "sunset" },
  { id: "skytree", name: "스카이트리", area: "스미다 · 관광지", tone: "twilight" },
  { id: "shinjukuGyoen", name: "신주쿠 교엔", area: "신주쿠 · 관광지", tone: "twilight" },
  { id: "sushidai", name: "스시 다이", area: "츠키지 · 맛집", tone: "sunset" },
];

export const trips = [
  { id: "trip1", title: "도쿄 2박 3일", range: "4/12 - 4/14", status: "예정" },
  { id: "trip2", title: "가족과 도쿄", range: "5/03 - 5/05", status: "예정" },
];

export const faqItems = [
  "AI 일정은 어떻게 수정하나요?",
  "교통 정보는 실시간인가요?",
  "지원 지역이 궁금해요",
];

export const travelTips = [
  { id: "subway", title: "일본 전철 이용 방법", desc: "IC카드 · 승차권 · 편성지 확인법", icon: "train" },
  { id: "transfer", title: "환승하는 방법", desc: "노선이 달라질 때 이용하는 법", icon: "swap" },
  { id: "pass", title: "교통패스 알아보기", desc: "도쿄 여행에 맞는 패스 선택", icon: "ticket" },
  { id: "walk", title: "도보 이동 팁", desc: "역 출구와 지상 이동 주의사항", icon: "walk" },
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
