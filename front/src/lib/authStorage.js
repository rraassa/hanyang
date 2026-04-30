/**
 * 로그인·토큰·세션 시각은 sessionStorage에 둡니다.
 * 탭/창을 닫으면 브라우저가 비우므로 "창 끄면 로그아웃"과 동일한 효과입니다.
 * (같은 탭에서 새로고침은 유지됩니다.)
 */

export const AUTH_STORAGE_KEYS = [
  "isLoggedIn",
  "displayName",
  "nickname",
  "isAdmin",
  "idToken",
  "accessToken",
  "refreshToken",
  "kakaoId",
  "loginType",
  "sessionLoginAt",
  "sessionLastActivityAt",
];

/** 예전 localStorage 로그인 상태를 session으로 옮기고 local에서 제거 */
export function migrateLegacyAuthFromLocalStorage() {
  if (typeof window === "undefined") return;
  AUTH_STORAGE_KEYS.forEach((key) => {
    const v = localStorage.getItem(key);
    if (v == null) return;
    if (sessionStorage.getItem(key) == null) sessionStorage.setItem(key, v);
    localStorage.removeItem(key);
  });
}
