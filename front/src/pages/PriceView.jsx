import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const DEFAULT_PRICE_TEXT = "1억1천6백만원";
const API_URL =
  process.env.REACT_APP_PRICE_API_URL ||
  "https://5ee7cm3sytpokhfy2bupy3sgui0xvqbn.lambda-url.ap-northeast-2.on.aws/";

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
  if (localStorage.getItem("isAdmin") === "true") return true;

  const payload = parseJwtPayload(localStorage.getItem("idToken"));
  const groups = payload?.["cognito:groups"];
  if (!Array.isArray(groups)) return false;

  return groups.some((groupName) => String(groupName).toLowerCase().includes("admin"));
};

export default function PriceView() {
  const navigate = useNavigate();
  const hasAlertedLoginRef = useRef(false);
  const today = new Date();
  const formattedDate = `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, "0")}.${String(
    today.getDate()
  ).padStart(2, "0")}`;
  const [priceText, setPriceText] = useState(DEFAULT_PRICE_TEXT);
  const [draftPriceText, setDraftPriceText] = useState(priceText);
  const [isEditingPrice, setIsEditingPrice] = useState(false);
  const [loading, setLoading] = useState(true);
  const isAdmin = useMemo(() => checkIsAdminUser(), []);
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  const requestPriceApi = async (method = "GET", body) => {
    const response = await fetch(API_URL, {
      method,
      headers: { "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(text || `${response.status} ${response.statusText}`);
    }

    return response.json();
  };

  // 가격 조회
  useEffect(() => {
    if (!isLoggedIn) {
      if (!hasAlertedLoginRef.current) {
        hasAlertedLoginRef.current = true;
        alert("개인택시 시세는 로그인 후 확인할 수 있습니다.");
      }
      navigate("/login");
      return;
    }

    requestPriceApi("GET")
      .then((data) => {
        setPriceText(data.currentPrice || data?.data?.currentPrice || DEFAULT_PRICE_TEXT);
        setLoading(false);
      })
      .catch((err) => {
        console.error("가격 조회 실패:", err);
        setPriceText(DEFAULT_PRICE_TEXT);
        setLoading(false);
      });
  }, [isLoggedIn, navigate]);

  const handleToggleEdit = async () => {
    if (!isEditingPrice) {
      setDraftPriceText(priceText);
      setIsEditingPrice(true);
      return;
    }

    const nextPrice = draftPriceText.trim();
    if (!nextPrice) {
      alert("시세 금액을 입력해 주세요.");
      return;
    }

    setLoading(true);
    try {
      const result = await requestPriceApi("POST", {
          price: nextPrice,
          updatedBy: localStorage.getItem("displayName") || "admin"
      });
      setPriceText(result.currentPrice || result?.data?.currentPrice || nextPrice);
      setIsEditingPrice(false);
      alert("가격이 업데이트되었습니다.");
    } catch (error) {
      console.error("가격 업데이트 실패:", error);
      alert(`가격 업데이트에 실패했습니다.\n${error.message || ""}`);
    } finally {
      setLoading(false);
    }
  };

  if (!isLoggedIn) return null;

  if (loading) {
    return (
      <section className="w-full px-4 pb-8 md:pb-10">
        <div className="mx-auto w-full max-w-[1220px] rounded-[10px] pt-4 md:pt-6">
          <div className="text-center py-20">
            <p className="text-lg text-gray-600">가격 정보를 불러오는 중...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full px-4 pb-8 md:pb-10">
      <div className="mx-auto w-full max-w-[1220px] rounded-[10px] pt-4 md:pt-6">
        <div className="relative mx-auto w-full max-w-[1040px]">
          <h2 className="text-center text-2xl font-extrabold text-[#0E2A7B] tracking-tight md:text-3xl">개인택시 시세</h2>
          {isAdmin && (
            <button
              type="button"
              onClick={handleToggleEdit}
              className="absolute right-0 top-1/2 -translate-y-1/2 text-sm font-bold text-black hover:underline"
            >
              {isEditingPrice ? "완료" : "수정하기"}
            </button>
          )}
        </div>

        <div className="mx-auto mt-10 mb-8 w-full max-w-[1040px] border border-[#E7E7E7] bg-[#fafaf5] px-6 py-16 shadow-[0_6px_20px_rgba(0,0,0,0.08)] md:mt-12 md:mb-10 md:px-14 md:py-20">
          <div className="mx-auto w-fit">
            <p className="text-center text-2xl font-extrabold leading-tight text-black md:-ml-36 md:text-[32px]">
              {formattedDate} 현재 시세는
            </p>
            <p className="mt-2 text-center text-2xl font-extrabold leading-tight md:ml-36 md:text-[32px]">
              {isAdmin && isEditingPrice ? (
                <input
                  type="text"
                  value={draftPriceText}
                  onChange={(e) => setDraftPriceText(e.target.value)}
                  className="w-[260px] border-b-2 border-red-600 bg-transparent text-center text-red-600 outline-none"
                  aria-label="시세 금액 입력"
                />
              ) : (
                <span className="text-red-600">{priceText}</span>
              )}
              <span className="text-black"> 입니다.</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
