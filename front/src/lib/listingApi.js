const API_URL =
  process.env.REACT_APP_LISTING_API_URL ||
  process.env.REACT_APP_API_URL ||
  "https://nlob2ghdyk.execute-api.ap-northeast-2.amazonaws.com";

const requestJson = async (path, options = {}) => {
  const response = await fetch(`${API_URL}${path}`, options);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data?.error || "매물 요청에 실패했습니다.");
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

