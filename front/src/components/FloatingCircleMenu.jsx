/**
 * 사이트 전역 우측 고정: 전화 / 카카오 채널 채팅 / 오시는 길
 */
import { getKakaoChannelChatUrl } from "../lib/kakaoChannel";

const PHONE_LABEL = "전화하기";
const TEL_HREF = "tel:01037368082";
const KAKAO_CHAT_URL = getKakaoChannelChatUrl();

function IconPhone({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6.62 10.79c1.44 2.83 3.76 5.15 6.59 6.59l2.2-2.2c.27-.27.68-.35 1.02-.24 1.12.38 2.35.59 3.6.59.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.21 2.48.59 3.6.11.34.04.75-.24 1.02l-2.2 2.2Z"
        fill="currentColor"
      />
    </svg>
  );
}

function IconChat({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 4h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H8l-4 3v-3H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z"
        fill="currentColor"
        opacity="0.95"
      />
      <circle cx="9" cy="11" r="1.2" fill="#0E2A7B" />
      <circle cx="12" cy="11" r="1.2" fill="#0E2A7B" />
      <circle cx="15" cy="11" r="1.2" fill="#0E2A7B" />
    </svg>
  );
}

function IconMapPin({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 2C8.7 2 6 4.6 6 8c0 4.2 3.1 7.2 5.4 9.2.3.2.6.2.8 0 2.3-2.1 5.8-5.1 5.8-9.2 0-3.4-2.5-6-5.1-6H12Z"
        fill="currentColor"
      />
      <circle cx="12" cy="8" r="1.6" fill="#0E2A7B" />
    </svg>
  );
}

export default function FloatingCircleMenu({ onNavigateDirections }) {
  const mobileCircleClass =
    "h-[2.85rem] w-[2.85rem] md:h-[4.75rem] md:w-[4.75rem]";

  return (
    <div
      className="pointer-events-auto fixed right-1.5 z-40 flex flex-col items-center gap-1.5 md:right-5 md:gap-4"
      style={{ bottom: "calc(env(safe-area-inset-bottom, 0px) + 0.35rem)" }}
      role="navigation"
      aria-label="빠른 연락"
    >
      <a
        href={TEL_HREF}
        className={`group flex ${mobileCircleClass} flex-col items-center justify-center gap-0.5 rounded-full bg-[#0E2A7B] text-white shadow-[0_3px_9px_rgba(14,42,123,0.3)] transition hover:bg-[#0a1f5c] focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-[#0E2A7B]`}
        aria-label={PHONE_LABEL}
      >
        <IconPhone className="h-4 w-4 shrink-0 md:h-7 md:w-7" />
        <span className="px-0.5 text-center text-[0.45rem] font-bold leading-tight md:px-1 md:text-[0.65rem]">
          {PHONE_LABEL}
        </span>
      </a>

      <a
        href={KAKAO_CHAT_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={`flex ${mobileCircleClass} items-center justify-center rounded-full bg-[#0E2A7B] text-white shadow-[0_3px_9px_rgba(14,42,123,0.3)] transition hover:bg-[#0a1f5c] focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-[#0E2A7B]`}
        aria-label="카카오톡으로 문의하기"
      >
        <IconChat className="h-4 w-4 md:h-9 md:w-9" />
      </a>

      <button
        type="button"
        onClick={() => onNavigateDirections?.()}
        className={`flex ${mobileCircleClass} flex-col items-center justify-center gap-0.5 rounded-full bg-[#0E2A7B] text-white shadow-[0_3px_9px_rgba(14,42,123,0.3)] transition hover:bg-[#0a1f5c] focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-[#0E2A7B]`}
        aria-label="오시는 길 페이지로"
      >
        <IconMapPin className="h-4 w-4 md:h-8 md:w-8" />
        <span className="px-1 text-center text-[0.5rem] font-bold leading-tight md:text-[0.65rem]">
          오시는 길
        </span>
      </button>
    </div>
  );
}
