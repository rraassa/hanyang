/** 후기 객체에서 본문 필드 추출 (API 필드명 차이 대비) */
export const getReviewContentField = (review) => {
  if (!review) return "";
  const raw =
    review.content ??
    review.body ??
    review.description ??
    review.text ??
    "";
  return String(raw).replace(/\s+/g, " ").trim();
};

/** 목록용 한 줄~두 줄 미리보기 (CSS line-clamp 보조용 짧은 텍스트) */
export const getReviewContentPreview = (review, maxLength = 120) => {
  const text = getReviewContentField(review);
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trimEnd()}...`;
};
