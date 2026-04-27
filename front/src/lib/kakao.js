const KAKAO_REST_API_KEY = '09812f17a0d591bebdbaff3799dd185e';

/**
 * 접속 중인 origin을 기본으로 사용해 protocol/domain mismatch를 방지한다.
 * 필요하면 REACT_APP_KAKAO_REDIRECT_URI로 명시 override 가능.
 */
const KAKAO_REDIRECT_URI = (
  process.env.REACT_APP_KAKAO_REDIRECT_URI ||
  `${window.location.origin}/auth/kakao/callback`
).replace(/\/+$/, "");

export const kakaoLogin = () => {
  const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_REST_API_KEY}&redirect_uri=${KAKAO_REDIRECT_URI}&response_type=code`;
  window.location.href = kakaoAuthUrl;
};

export const getKakaoToken = async (code) => {
  const response = await fetch('https://kauth.kakao.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: KAKAO_REST_API_KEY,
      redirect_uri: KAKAO_REDIRECT_URI,
      code: code,
    }),
  });
  return response.json();
};

export const getKakaoUserInfo = async (accessToken) => {
  const response = await fetch('https://kapi.kakao.com/v2/user/me', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return response.json();
};

export const kakaoLogout = async (accessToken) => {
  await fetch('https://kapi.kakao.com/v1/user/logout', {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}` },
  });
};
