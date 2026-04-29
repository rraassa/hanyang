import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  createListing,
  deleteListing as deleteListingApi,
  getListings,
  updateListing,
} from "../lib/listingApi";

const parseJwtPayload = (token) => {
  if (!token) return null;

  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(base64)
        .split("")
        .map((char) => `%${`00${char.charCodeAt(0).toString(16)}`.slice(-2)}`)
        .join("")
    );
    return JSON.parse(json);
  } catch (error) {
    return null;
  }
};

const checkIsAdminUser = () => {
  const loginType = localStorage.getItem("loginType");
  if (loginType && loginType !== "cognito") return false;

  const payload = parseJwtPayload(localStorage.getItem("idToken"));
  const groups = payload?.["cognito:groups"];
  if (!Array.isArray(groups)) return false;

  return groups.some((groupName) => String(groupName).toLowerCase() === "admin");
};

/** 로컬 UI 데모용만 켜세요: REACT_APP_SAMPLE_LISTINGS=true */
const SAMPLE_FALLBACK_ENABLED =
  process.env.REACT_APP_SAMPLE_LISTINGS === "true";

const SAMPLE_LISTINGS = [
  { id: "sample-1", year: "2020년식", model: "소나타", mileage: "11만km", accident: "무사고", color: "회색", status: "구매가능" },
  { id: "sample-2", year: "2021년식", model: "K5", mileage: "9만km", accident: "무사고", color: "회색", status: "구매가능" },
];

export default function ListingBox({ onNavigate }) {
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [listingsLoadError, setListingsLoadError] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [draft, setDraft] = useState({
    year: "",
    model: "",
    mileage: "",
    accident: "",
    color: "",
  });
  const [activeAdminRowId, setActiveAdminRowId] = useState(null);
  const [activeUserRowId, setActiveUserRowId] = useState(null);
  const isAdmin = useMemo(() => checkIsAdminUser(), []);
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const canManageListings = isLoggedIn && isAdmin;

  useEffect(() => {
    const loadListings = async () => {
      setListingsLoadError("");
      try {
        const data = await getListings();
        /** 서버가 빈 목록을 주면 빈 목록 표시 — 예전처럼 샘플 데이터로 채우지 않음 */
        setListings(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("매물 목록 로드 실패:", error);
        const hint =
          error?.message ||
          "서버에서 매물을 불러오지 못했습니다.";
        setListingsLoadError(hint);
        setListings(SAMPLE_FALLBACK_ENABLED ? SAMPLE_LISTINGS : []);
      } finally {
        setLoading(false);
      }
    };

    loadListings();
  }, []);

  const handleDraftChange = (field, value) => {
    setDraft((prev) => ({ ...prev, [field]: value }));
  };

  const handleRegisterToggle = async () => {
    if (!isRegisterOpen) {
      setIsRegisterOpen(true);
      return;
    }

    const year = draft.year.trim();
    const model = draft.model.trim();
    const mileage = draft.mileage.trim();
    const accident = draft.accident.trim();
    const color = draft.color.trim();
    if (!year || !model || !mileage || !accident || !color) {
      alert("매물 등록 항목을 모두 입력해 주세요.");
      return;
    }

    try {
      setSubmitting(true);
      const created = await createListing({ year, model, mileage, accident, color });
      setListings((prev) => [created || { id: Date.now(), year, model, mileage, accident, color, status: "구매가능" }, ...prev]);
      setDraft({ year: "", model: "", mileage: "", accident: "", color: "" });
      setIsRegisterOpen(false);
    } catch (error) {
      alert(error.message || "매물 등록에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleAdminRowClick = (id) => {
    if (!canManageListings) return;
    setActiveAdminRowId((prev) => (prev === id ? null : id));
  };

  const handleUserRowClick = (id) => {
    if (canManageListings) return;
    setActiveUserRowId((prev) => (prev === id ? null : id));
  };

  const handleToggleStatus = async (id) => {
    const target = listings.find((item) => item.id === id);
    if (!target) return;

    const nextStatus = target.status === "판매완료" ? "구매가능" : "판매완료";
    try {
      setSubmitting(true);
      const updated = await updateListing(id, { status: nextStatus });
      setListings((prev) =>
        prev.map((item) =>
          item.id === id
            ? { ...item, ...(updated || {}), status: updated?.status || nextStatus }
            : item
        )
      );
      setActiveAdminRowId(null);
    } catch (error) {
      alert(error.message || "매물 상태 변경에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteListing = async (id) => {
    try {
      setSubmitting(true);
      await deleteListingApi(id);
      setListings((prev) => prev.filter((item) => item.id !== id));
      setActiveAdminRowId(null);
    } catch (error) {
      alert(error.message || "매물 삭제에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mt-16 md:mt-20 w-full px-4 md:px-20 py-6 bg-[#fafaf5]">
      <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <h2 className="text-xl font-bold text-[#0E2A7B]">매물 목록</h2>
        {canManageListings && (
          <button
            type="button"
            onClick={handleRegisterToggle}
            disabled={submitting}
            className="rounded-lg bg-white px-3 py-1.5 text-sm font-semibold text-[#0E2A7B] shadow-[0_4px_12px_rgba(0,0,0,0.12)] hover:bg-[#f7f7f7]"
          >
            {isRegisterOpen ? "등록 완료" : "매물 등록"}
          </button>
        )}
      </div>

      {listingsLoadError && (
        <p className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-950 md:text-sm">
          {listingsLoadError} 네트워크 탭에서 <span className="font-mono">/listings</span> 요청 상태(404·500
          등)와 <span className="font-mono">REACT_APP_LISTING_API_URL</span> 설정을 확인해 주세요.
        </p>
      )}

      {/* 매물 리스트 전체를 감싸는 흰색 박스 */}
      <div className="rounded-2xl bg-white shadow-[0_8px_30px_rgba(0,0,0,0.08)] p-2">
        {canManageListings && isRegisterOpen && (
          <div className="mx-2 mb-2 rounded-xl border border-[#E7E7E7] bg-[#fafaf5] px-4 py-3">
            <div className="flex flex-wrap items-center gap-2 md:gap-3 text-sm md:text-base">
              <span className="text-gray-600">연식 -</span>
              <input
                value={draft.year}
                onChange={(e) => handleDraftChange("year", e.target.value)}
                className="h-8 w-24 rounded border border-gray-300 bg-white px-2 outline-none focus:border-[#0E2A7B]"
              />

              <input
                value={draft.model}
                onChange={(e) => handleDraftChange("model", e.target.value)}
                className="h-8 w-24 rounded border border-gray-300 bg-white px-2 font-bold text-[#0E2A7B] outline-none focus:border-[#0E2A7B]"
              />

              <span className="text-gray-600">주행거리 -</span>
              <input
                value={draft.mileage}
                onChange={(e) => handleDraftChange("mileage", e.target.value)}
                className="h-8 w-24 rounded border border-gray-300 bg-white px-2 outline-none focus:border-[#0E2A7B]"
              />

              <span className="text-gray-600">사고유무 -</span>
              <input
                value={draft.accident}
                onChange={(e) => handleDraftChange("accident", e.target.value)}
                className="h-8 w-24 rounded border border-gray-300 bg-white px-2 outline-none focus:border-[#0E2A7B]"
              />

              <span className="text-gray-600">색상 -</span>
              <input
                value={draft.color}
                onChange={(e) => handleDraftChange("color", e.target.value)}
                className="h-8 w-24 rounded border border-gray-300 bg-white px-2 outline-none focus:border-[#0E2A7B]"
              />
            </div>
          </div>
        )}

        {/* 리스트 내용 스크롤 영역 */}
        <div className="max-h-[450px] overflow-y-auto scrollbar-hide divide-y divide-gray-200">
          {loading && (
            <div className="px-4 py-8 text-center text-gray-500">매물을 불러오는 중...</div>
          )}
          {!loading && listings.length === 0 && (
            <div className="px-4 py-10 text-center text-sm text-gray-500">
              등록된 매물이 없습니다.
            </div>
          )}
          {listings.map((item, idx) => {
            const isAvailable = item.status === "구매가능";
            const isAdminActionsOpen = canManageListings && activeAdminRowId === item.id;
            const showInquiryButton = !canManageListings && isAvailable && activeUserRowId === item.id;
            return (
              <div
                key={item.id ?? idx}
                onClick={() => {
                  if (canManageListings) {
                    handleAdminRowClick(item.id);
                    return;
                  }
                  handleUserRowClick(item.id);
                }}
                className="group px-4 py-4 md:py-5 w-full flex flex-col md:flex-row justify-between md:items-center min-h-[100px] bg-white gap-3 md:gap-0"
              >
                {/* 왼쪽 정보 */}
                <div className="flex min-w-0 flex-1 flex-row items-center gap-3 whitespace-nowrap md:gap-5">
                  <p className="text-sm md:text-base text-gray-500 group-hover:scale-105 transition-transform duration-300 whitespace-nowrap">
                    연식 - {item.year}
                  </p>
                  <p className="text-lg md:text-xl font-bold text-[#0E2A7B] group-hover:scale-110 transition-transform duration-300 whitespace-nowrap">
                    {item.model}
                  </p>
                  <p className="text-sm md:text-base text-gray-600 group-hover:scale-105 transition-transform duration-300 whitespace-nowrap">
                    주행거리 - {item.mileage}
                  </p>
                  <p className="text-sm md:text-base text-gray-600 group-hover:scale-105 transition-transform duration-300 whitespace-nowrap">
                    사고유무 - {item.accident}
                  </p>
                  <p className="text-sm md:text-base text-gray-600 group-hover:scale-105 transition-transform duration-300 whitespace-nowrap">
                    색상 - {item.color}
                  </p>
                </div>

                {/* 상태 텍스트 */}
                <div className="w-full shrink-0 text-left md:w-auto md:min-w-[92px] md:text-right">
                  {isAdminActionsOpen ? (
                    <div className="flex items-center gap-2 md:justify-end">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleStatus(item.id);
                        }}
                        disabled={submitting}
                        className="rounded-md bg-[#0E2A7B] px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-[#0b2367]"
                      >
                        {item.status === "판매완료" ? "구매가능" : "판매 완료"}
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteListing(item.id);
                        }}
                        disabled={submitting}
                        className="rounded-md bg-red-500 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-red-600"
                      >
                        삭제
                      </button>
                    </div>
                  ) : showInquiryButton ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!isLoggedIn) {
                          window.alert("문의하기는 로그인 후 이용할 수 있습니다.");
                          navigate("/login", { replace: true });
                          return;
                        }
                        onNavigate?.("inquiry");
                      }}
                      className="rounded-md bg-[#0E2A7B] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#0b2367] md:text-sm"
                    >
                      문의하기
                    </button>
                  ) : (
                    <p
                      className={`text-base font-semibold transition duration-300 group-hover:scale-110 ${
                        isAvailable
                          ? "text-blue-600 group-hover:drop-shadow-[0_0_4px_rgba(59,130,246,0.8)]"
                          : "text-red-500 group-hover:drop-shadow-[0_0_4px_rgba(239,68,68,0.8)]"
                      }`}
                    >
                      {item.status}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
