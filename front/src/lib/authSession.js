/**
 * 브라우저 탭이 백그라운드여도 또는 닫았다가 다시 열어도
 * 로그인 시점·마지막 활동 시각을 기준으로 실제 경과 시간으로 만료를 판별합니다.
 */

export const SESSION_KEYS = {
  LOGIN_AT: "sessionLoginAt",
  LAST_ACTIVITY_AT: "sessionLastActivityAt",
};

/** 최대 세션 유지 시간(실시간 경과). 기본 24시간. */
export const getAbsSessionMaxMs = () =>
  Number(process.env.REACT_APP_SESSION_ABS_MAX_MS ?? 86400000) || 86400000;

export const getIdleTimeoutMsForUser = () => {
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  return isAdmin ? 1000 * 60 * 15 : 1000 * 60 * 30;
};

export function establishSessionAnchors() {
  const now = Date.now();
  localStorage.setItem(SESSION_KEYS.LOGIN_AT, String(now));
  localStorage.setItem(SESSION_KEYS.LAST_ACTIVITY_AT, String(now));
}

/**
 * 로그인 직후 session 키가 없는 기존 세션 호환용(한 번만 채움).
 */
export function ensureSessionAnchorsIfLoggedIn() {
  if (localStorage.getItem("isLoggedIn") !== "true") return;
  const now = Date.now();
  if (!localStorage.getItem(SESSION_KEYS.LOGIN_AT)) {
    localStorage.setItem(SESSION_KEYS.LOGIN_AT, String(now));
  }
  if (!localStorage.getItem(SESSION_KEYS.LAST_ACTIVITY_AT)) {
    localStorage.setItem(SESSION_KEYS.LAST_ACTIVITY_AT, String(now));
  }
}

const ACTIVITY_EVENTS = ["mousemove", "keydown", "click", "scroll", "touchstart"];

/** 수동 로그아웃 시에도 호출해 세션 타임스탬프를 함께 제거합니다. */
export function clearStoredAuth() {
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("displayName");
  localStorage.removeItem("nickname");
  localStorage.removeItem("isAdmin");
  localStorage.removeItem("idToken");
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("kakaoId");
  localStorage.removeItem("loginType");
  localStorage.removeItem(SESSION_KEYS.LOGIN_AT);
  localStorage.removeItem(SESSION_KEYS.LAST_ACTIVITY_AT);
  window.dispatchEvent(new Event("auth:changed"));
}

/**
 * 무활동·전체 세션 만료 검사(Date.now 기준).
 * lastActivityMillis: 메모리에 유지되는 최근 활동 시각과 storage를 함께 고려하기 위해 받음.
 */
export function evaluateSessionExpiry(lastActivityMillis) {
  if (localStorage.getItem("isLoggedIn") !== "true") {
    return { expired: false, reason: null };
  }

  const idleMs = getIdleTimeoutMsForUser();
  const absMs = getAbsSessionMaxMs();
  const loginAtRaw = Number(localStorage.getItem(SESSION_KEYS.LOGIN_AT));
  const storedLastRaw = Number(localStorage.getItem(SESSION_KEYS.LAST_ACTIVITY_AT));
  const loginAt = Number.isFinite(loginAtRaw) ? loginAtRaw : Date.now();
  const storedLast = Number.isFinite(storedLastRaw) ? storedLastRaw : lastActivityMillis;
  const effectiveLastActivity = Math.max(storedLast, lastActivityMillis);

  const now = Date.now();
  if (now - loginAt > absMs) {
    return { expired: true, reason: "max" };
  }
  if (now - effectiveLastActivity > idleMs) {
    return { expired: true, reason: "idle" };
  }
  return { expired: false, reason: null };
}

/**
 * App에서 주기·포커스 시 호출. 만료 시 로그아웃 후 true.
 */
export function performAutoLogoutIfExpired(navigate, lastActivityMillis, didLogoutRef) {
  const { expired, reason } = evaluateSessionExpiry(lastActivityMillis);
  if (!expired) return false;
  if (didLogoutRef.current) return true;
  didLogoutRef.current = true;

  clearStoredAuth();

  if (reason === "max") {
    alert("로그인 유지 시간이 만료되어 자동 로그아웃되었습니다.");
  } else {
    alert("오랫동안 활동이 없어 자동 로그아웃되었습니다.");
  }
  navigate("/login");
  return true;
}

/**
 * 마지막 활동 시각을 storage에 덜 자주 씁니다(백그라운드에서도 idle 판단용).
 */
export function maybePersistLastActivity(lastActivityMillis, lastPersistAtRef) {
  const now = Date.now();
  if (now - lastPersistAtRef.current < 8000) return;
  lastPersistAtRef.current = now;
  localStorage.setItem(SESSION_KEYS.LAST_ACTIVITY_AT, String(lastActivityMillis));
}

/**
 * 로그인 후 세션 감시: 실시간 경과 기반 무활동 + 최대 유지 시간.
 */
export function attachSessionExpiryGuards(navigate, didLogoutRef) {
  ensureSessionAnchorsIfLoggedIn();

  let lastActivityMillis =
    Number(localStorage.getItem(SESSION_KEYS.LAST_ACTIVITY_AT)) || Date.now();
  const lastPersistAtRef = { current: Date.now() };

  const maybeLogout = () => {
    performAutoLogoutIfExpired(navigate, lastActivityMillis, didLogoutRef);
  };

  const onActivity = () => {
    if (localStorage.getItem("isLoggedIn") !== "true") return;
    lastActivityMillis = Date.now();
    maybePersistLastActivity(lastActivityMillis, lastPersistAtRef);
  };

  const onVisibilityOrFocus = () => {
    if (document.visibilityState === "visible") {
      lastActivityMillis = Math.max(
        lastActivityMillis,
        Number(localStorage.getItem(SESSION_KEYS.LAST_ACTIVITY_AT)) || 0
      );
      maybeLogout();
    }
  };

  const intervalId = window.setInterval(maybeLogout, 15000);

  ACTIVITY_EVENTS.forEach((name) =>
    window.addEventListener(name, onActivity, { passive: true })
  );
  document.addEventListener("visibilitychange", onVisibilityOrFocus);
  window.addEventListener("focus", onVisibilityOrFocus);
  window.addEventListener("pageshow", onVisibilityOrFocus);

  onActivity();
  maybeLogout();

  return () => {
    window.clearInterval(intervalId);
    ACTIVITY_EVENTS.forEach((name) => window.removeEventListener(name, onActivity));
    document.removeEventListener("visibilitychange", onVisibilityOrFocus);
    window.removeEventListener("focus", onVisibilityOrFocus);
    window.removeEventListener("pageshow", onVisibilityOrFocus);
  };
}
