const {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");

const s3Client = new S3Client({ region: "ap-northeast-2" });

const REGION = "ap-northeast-2";
const BUCKET = "hanyang-taxi-data";
const REVIEWS_KEY = "data/reviews/all.json";
const IMAGE_PREFIX = "data/reviews/images";

const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

const ok = (statusCode, body) => ({
  statusCode,
  headers,
  body: JSON.stringify(body),
});

const getMethod = (event) =>
  (event.requestContext?.http?.method || event.httpMethod || "").toUpperCase();

const normalizePath = (event) => {
  let path = event.rawPath || event.path || "/";
  path = path.split("?")[0];
  path = path.replace(/\/+$/, "") || "/";
  path = path.replace(/^\/(prod|dev|stage|staging)(?=\/)/, "") || path;
  return path;
};

const parseBody = (event) => {
  if (!event.body) return {};
  if (typeof event.body === "object") return event.body;
  try {
    const raw = event.isBase64Encoded
      ? Buffer.from(event.body, "base64").toString("utf8")
      : event.body;
    return raw ? JSON.parse(raw) : {};
  } catch {
    return null;
  }
};

const mimeToExt = (mime) => {
  if (mime === "image/jpeg") return "jpg";
  if (mime === "image/png") return "png";
  if (mime === "image/webp") return "webp";
  if (mime === "image/gif") return "gif";
  return "bin";
};

const parseDataUrl = (dataUrl) => {
  const m = String(dataUrl || "").match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
  if (!m) return null;
  return { mime: m[1], base64: m[2] };
};

const extractS3Key = (value) => {
  if (!value) return "";

  const str = String(value);

  // URL 형태
  if (str.startsWith("http://") || str.startsWith("https://")) {
    const marker = ".amazonaws.com/";
    const idx = str.indexOf(marker);
    if (idx >= 0) {
      return decodeURIComponent(str.slice(idx + marker.length));
    }
    return "";
  }

  // key 형태
  if (str.startsWith("data/reviews/")) return str;

  return "";
};

const uploadImageDataUrl = async (dataUrl, userId) => {
  const parsed = parseDataUrl(dataUrl);
  if (!parsed) return { imageUrl: "", imageKey: "" };

  const ext = mimeToExt(parsed.mime);
  const now = Date.now();
  const rand = Math.random().toString(36).slice(2, 8);
  const key = `${IMAGE_PREFIX}/${userId}/${now}_${rand}.${ext}`;
  const body = Buffer.from(parsed.base64, "base64");

  await s3Client.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: body,
      ContentType: parsed.mime,
    })
  );

  return {
    imageKey: key,
    imageUrl: `https://${BUCKET}.s3.${REGION}.amazonaws.com/${key}`,
  };
};

const deleteImageObject = async (imageKeyOrUrl) => {
  const key = extractS3Key(imageKeyOrUrl);
  if (!key) return;

  try {
    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: BUCKET,
        Key: key,
      })
    );
  } catch (e) {
    console.error("Delete image failed:", e);
  }
};

const getReviews = async () => {
  try {
    const command = new GetObjectCommand({ Bucket: BUCKET, Key: REVIEWS_KEY });
    const response = await s3Client.send(command);
    const data = await response.Body.transformToString();
    const parsed = JSON.parse(data);
    if (Array.isArray(parsed)) return { reviews: parsed };
    if (parsed && Array.isArray(parsed.reviews)) return { reviews: parsed.reviews };
    return { reviews: [] };
  } catch (e) {
    return { reviews: [] };
  }
};

const saveReviews = async (data) => {
  await s3Client.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: REVIEWS_KEY,
      Body: JSON.stringify({ reviews: data.reviews || [] }, null, 2),
      ContentType: "application/json",
    })
  );
};

exports.handler = async (event) => {
  const method = getMethod(event);
  const path = normalizePath(event);

  if (method === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  try {
    const data = await getReviews();

    // GET /reviews
    if (method === "GET" && path === "/reviews") {
      return ok(200, { reviews: data.reviews || [] });
    }

    // GET /reviews/my?userId=xxx
    if (method === "GET" && path === "/reviews/my") {
      const userId = event.queryStringParameters?.userId;
      if (!userId) return ok(400, { error: "userId required" });

      const myReviews = (data.reviews || []).filter((r) => r.userId === userId);
      return ok(200, { reviews: myReviews });
    }

    // POST /reviews
    if (method === "POST" && path === "/reviews") {
      const body = parseBody(event);
      if (body === null) return ok(400, { error: "Invalid JSON body" });

      const { userId, title, content, city, type, imageUrl, imageData } = body;
      if (!userId || !title || !content) {
        return ok(400, { error: "Missing required fields" });
      }

      // imageData 우선, 없으면 imageUrl 사용
      const incomingImage = imageData || imageUrl || "";
      let uploaded = { imageUrl: "", imageKey: "" };

      if (incomingImage && String(incomingImage).startsWith("data:image/")) {
        uploaded = await uploadImageDataUrl(incomingImage, userId);
      } else if (incomingImage) {
        // 이미 URL/Key 형태로 들어온 경우
        uploaded = {
          imageUrl: String(incomingImage),
          imageKey: extractS3Key(String(incomingImage)),
        };
      }

      const now = new Date().toISOString();
      const review = {
        userId,
        reviewId: `review_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        title: String(title).trim(),
        content: String(content).trim(),
        city: city || "서울",
        type: type || "후기",
        imageUrl: uploaded.imageUrl || "",
        imageKey: uploaded.imageKey || "",
        createdAt: now,
        updatedAt: now,
      };

      data.reviews = data.reviews || [];
      data.reviews.unshift(review);
      await saveReviews(data);

      return ok(201, { success: true, review });
    }

    // PUT /reviews (본인만 수정) - 제목/내용만 수정
    if (method === "PUT" && path === "/reviews") {
      const body = parseBody(event);
      if (body === null) return ok(400, { error: "Invalid JSON body" });

      const { userId, reviewId, title, content } = body;
      if (!userId || !reviewId || !title || !content) {
        return ok(400, { error: "Missing required fields" });
      }

      const idx = (data.reviews || []).findIndex((r) => r.reviewId === reviewId);
      if (idx === -1) return ok(404, { error: "Review not found" });

      const target = data.reviews[idx];
      if (target.userId !== userId) {
        return ok(403, { error: "본인 후기만 수정할 수 있습니다." });
      }

      const updated = {
        ...target,
        title: String(title).trim(),
        content: String(content).trim(),
        updatedAt: new Date().toISOString(),
      };

      data.reviews[idx] = updated;
      await saveReviews(data);

      return ok(200, { success: true, review: updated });
    }

    // DELETE /reviews
    // - 본인: 본인 후기 삭제 가능
    // - 관리자: isAdmin=true 이면 타인 후기 삭제 가능
    if (method === "DELETE" && path === "/reviews") {
      const body = parseBody(event);
      if (body === null) return ok(400, { error: "Invalid JSON body" });

      const { userId, reviewId, isAdmin } = body;
      if (!userId || !reviewId) {
        return ok(400, { error: "Missing userId or reviewId" });
      }

      const idx = (data.reviews || []).findIndex((r) => r.reviewId === reviewId);
      if (idx === -1) return ok(404, { error: "Review not found" });

      const target = data.reviews[idx];

      if (!isAdmin && target.userId !== userId) {
        return ok(403, { error: "본인 후기만 삭제할 수 있습니다." });
      }

      // 리뷰 삭제 시 S3 이미지도 같이 삭제
      await deleteImageObject(target.imageKey || target.imageUrl);

      data.reviews.splice(idx, 1);
      await saveReviews(data);

      return ok(200, { success: true });
    }

    return ok(404, { error: "Not found" });
  } catch (error) {
    console.error("Error:", error);
    return ok(500, { error: error.message || "Internal Server Error" });
  }
};
