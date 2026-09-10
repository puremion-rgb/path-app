/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // /home처럼 로그인 쿠키를 읽어서 매 요청마다 서버에서 새로 그리는("dynamic") 화면도,
  // Next.js가 클라이언트(브라우저) 쪽에서 최근 방문 결과를 잠깐(기본 30초) 재사용하는
  // 캐시(Router Cache)가 있습니다. 그래서 AI로 새 일정을 만들고 홈으로 돌아오면,
  // 그 30초 안에는 방금 만든 최신 데이터 대신 조금 전 방문했을 때의 화면이 그대로
  // 보이고, 새로고침(전체 페이지 다시 불러오기)을 해야만 이 캐시를 건너뛰어 최신
  // 데이터가 나오는 문제가 있었습니다. dynamic 캐시 시간을 0으로 줄이면, 새로고침 없이
  // 일반적인 화면 이동만으로도 매번 서버에서 최신 데이터를 다시 가져옵니다.
  experimental: {
    staleTimes: {
      dynamic: 0,
    },
  },
};

module.exports = nextConfig;
