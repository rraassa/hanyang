import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const DEFAULT_PRICE_TEXT = "1억1천6백만원";
const PRICE_STORAGE_KEY = "taxiMarketPriceText";

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
  const today = new Date();
  const formattedDate = `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, "0")}.${String(
    today.getDate()
  ).padStart(2, "0")}`;
  const [priceText, setPriceText] = useState(localStorage.getItem(PRICE_STORAGE_KEY) || DEFAULT_PRICE_TEXT);
  const [draftPriceText, setDraftPriceText] = useState(priceText);
  const [isEditingPrice, setIsEditingPrice] = useState(false);
  const isAdmin = useMemo(() => checkIsAdminUser(), []);
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  useEffect(() => {
    if (!isLoggedIn) {
      alert("개인택시 시세는 로그인 후 확인할 수 있습니다.");
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  const handleToggleEdit = () => {
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

    setPriceText(nextPrice);
    localStorage.setItem(PRICE_STORAGE_KEY, nextPrice);
    setIsEditingPrice(false);
  };

  if (!isLoggedIn) return null;

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
