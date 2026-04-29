const BASE_API_URL =
  process.env.REACT_APP_LISTING_API_URL ||
  process.env.REACT_APP_API_URL ||
  "https://s7mxjqae5k3uol4wqy3dglqrjy0wbats.lambda-url.ap-northeast-2.on.aws/";

const API_URL = BASE_API_URL.replace(/\/+$/, "");

const requestJson = async (path, options = {}) => {
  const url = `${API_URL}${path}`;
  const response = await fetch(url, options);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const msg =
      data?.error ||
      data?.message ||
      (response.status === 404
        ? `매물 API를 찾을 수 없습니다(404). 배포된 Lambda가 ${path} 를 처리하는지 확인하세요.`
        : null) ||
      `매물 요청 실패 (${response.status})`;
    const err = new Error(msg);
    err.status = response.status;
    err.url = url;
    throw err;
  }
  return data;
};

export const getListings = async () => {
  const data = await requestJson("/listings");
  return Array.isArray(data?.listings) ? data.listings : [];
};

export const createListing = async ({ year, model, mileage, accident, color }) => {
  const data = await requestJson("/listings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ year, model, mileage, accident, color }),
  });
  return data?.listing;
};

export const updateListing = async (listingId, payload) => {
  const data = await requestJson("/listings", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ listingId, ...payload }),
  });
  return data?.listing;
};

export const deleteListing = async (listingId) => {
  await requestJson("/listings", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ listingId }),
  });
};

