const BUCKET = process.env.REACT_APP_REVIEW_S3_BUCKET || "hanyang-taxi-data";
const REGION = process.env.REACT_APP_REVIEW_S3_REGION || "ap-northeast-2";

const buildS3ObjectUrl = (key) => {
  const k = String(key).trim().replace(/^\/+/, "");
  if (!k.startsWith("data/reviews/")) return "";
  const encoded = k.split("/").map(encodeURIComponent).join("/");
  return `https://${BUCKET}.s3.${REGION}.amazonaws.com/${encoded}`;
};

const normalizeOne = (value) => {
  if (value == null) return "";
  const s = String(value).trim();
  if (!s) return "";
  if (s.startsWith("data:image/")) return s;
  if (s.startsWith("http://") || s.startsWith("https://")) return s;
  if (s.startsWith("data/reviews/")) return buildS3ObjectUrl(s) || s;
  return "";
};

/**
 * all.json / API에 따라 imageUrl, imageKey, imageData 등 필드가 섞여 올 수 있음.
 * imageData(base64)는 imageKey(짧은 S3 경로)보다 늦게 써서 메모리·파싱 부담을 줄임.
 */
export const resolveReviewImageUrl = (review) => {
  if (!review) return "";
  const order = [
    review.imageUrl,
    review.imageURL,
    review.imageKey,
    review.imageData,
    review.image,
    review.photoUrl,
    review.photoURL,
    review.attachmentUrl,
    review.fileUrl,
  ];
  for (const v of order) {
    const u = normalizeOne(v);
    if (u) return u;
  }
  return "";
};

export const withResolvedReviewImage = (review) => ({
  ...review,
  imageUrl: resolveReviewImageUrl(review),
});

/** 이미지 로드 실패 시(대부분 S3 403·404) 콘솔에 남김—일반 <img> 실패는 기본으로 로그가 없음 */
export const logReviewImageError = (e, context) => {
  const src = (e && e.currentTarget && e.currentTarget.src) || "";
  console.warn(
    context || "거래 후기 이미지",
    "로드 실패:",
    src,
    "· 네트워크 탭에서 상태 코드를 확인하세요(403이면 S3객체/버킷 읽기 권한)."
  );
};
