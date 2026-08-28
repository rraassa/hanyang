const DEFAULT_KAKAO_CHANNEL_CHAT_URL = "https://pf.kakao.com/_FxmxbSX/chat";

/** 카카오톡 채널 1:1 채팅(챗봇·상담) URL */
export const getKakaoChannelChatUrl = () => {
  const raw =
    process.env.REACT_APP_KAKAO_CHANNEL_CHAT_URL || DEFAULT_KAKAO_CHANNEL_CHAT_URL;
  return String(raw).trim().replace(/^http:\/\//i, "https://");
};
