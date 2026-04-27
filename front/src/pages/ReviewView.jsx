import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAllReviews,
  getMyReviews,
  createReview,
  deleteReview,
  updateReview,
  getCurrentUserId,
  isAdminUser,
} from "../lib/reviewApi";
import {
  resolveReviewImageUrl,
  withResolvedReviewImage,
  logReviewImageError,
} from "../lib/reviewImageUrl";

const getReviewImageSource = resolveReviewImageUrl;
const normalizeReviewImage = withResolvedReviewImage;

export default function ReviewView() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [allReviews, setAllReviews] = useState([]);
  const [myReviews, setMyReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isWritePageOpen, setIsWritePageOpen] = useState(false);
  const [draftTitle, setDraftTitle] = useState("");
  const [draftContent, setDraftContent] = useState("");
  const [draftImageUrl, setDraftImageUrl] = useState("");
  const [selectedReview, setSelectedReview] = useState(null);
  const [isEditingSelected, setIsEditingSelected] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 12;

  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const currentUserId = getCurrentUserId();
  const adminUser = isAdminUser();

  const loadReviews = useCallback(async () => {
    setLoading(true);
    try {
      const all = await getAllReviews();
      setAllReviews((all || []).map(normalizeReviewImage));
      
      if (isLoggedIn) {
        try {
          const my = await getMyReviews();
          setMyReviews((my || []).map(normalizeReviewImage));
        } catch (e) {
          console.error("내 후기 로드 실패:", e);
        }
      }
    } catch (error) {
      console.error("후기 로드 실패:", error);
    } finally {
      setLoading(false);
    }
  }, [isLoggedIn]);

  // 후기 로드
  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  const handleTabChange = (tab) => {
    if (tab === "mine" && !isLoggedIn) {
      alert("내 후기는 로그인 후 확인할 수 있습니다.");
      navigate("/login", { replace: true });
      return;
    }
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handleCreateReview = async () => {
    if (!draftTitle.trim() || !draftContent.trim()) {
      alert("제목과 내용을 모두 입력해 주세요.");
      return;
    }

    try {
      await createReview(draftTitle.trim(), draftContent.trim(), "서울", "후기", draftImageUrl);
      alert("후기가 작성되었습니다!");
      setDraftTitle("");
      setDraftContent("");
      setDraftImageUrl("");
      setIsWritePageOpen(false);
      setActiveTab("mine");
      await loadReviews();
    } catch (error) {
      alert(error.message || "후기 작성에 실패했습니다.");
    }
  };

  const handleOpenWritePage = () => {
    if (!isLoggedIn) {
      alert("후기 작성은 로그인 후 이용할 수 있습니다.");
      navigate("/login", { replace: true });
      return;
    }
    setIsWritePageOpen(true);
  };

  /** 업로드 실패·타임아웃 완화: 긴 변 기준 리사이즈 후 JPEG data URL */
  const compressImageToDataUrl = (file, maxEdge = 1920, quality = 0.82) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          let { width, height } = img;
          if (width > maxEdge || height > maxEdge) {
            if (width >= height) {
              height = Math.round((height * maxEdge) / width);
              width = maxEdge;
            } else {
              width = Math.round((width * maxEdge) / height);
              height = maxEdge;
            }
          }
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            reject(new Error("canvas"));
            return;
          }
          ctx.drawImage(img, 0, 0, width, height);
          try {
            resolve(canvas.toDataURL("image/jpeg", quality));
          } catch (e) {
            reject(e);
          }
        };
        img.onerror = () => reject(new Error("image load"));
        img.src = reader.result;
      };
      reader.onerror = () => reject(new Error("read"));
      reader.readAsDataURL(file);
    });

  const handlePickImage = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("이미지 파일만 첨부할 수 있습니다.");
      event.target.value = "";
      return;
    }

    try {
      const dataUrl =
        file.size > 800000 ? await compressImageToDataUrl(file) : await new Promise((resolve, reject) => {
          const r = new FileReader();
          r.onload = () => resolve(typeof r.result === "string" ? r.result : "");
          r.onerror = reject;
          r.readAsDataURL(file);
        });
      if (dataUrl) setDraftImageUrl(dataUrl);
    } catch {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") setDraftImageUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
    event.target.value = "";
  };

  const handleOpenReviewDetail = (review) => {
    setSelectedReview(review);
    setIsEditingSelected(false);
    setEditTitle(review.title || "");
    setEditContent(review.content || "");
  };

  const canEditReview = (review) => {
    return isLoggedIn && review?.userId === currentUserId;
  };

  const canDeleteReview = (review) => {
    if (!isLoggedIn) return false;
    if (adminUser) return true;
    return review?.userId === currentUserId;
  };

  const handleDeleteSelectedReview = async () => {
    if (!selectedReview) return;
    if (!window.confirm("후기를 삭제하시겠습니까?")) return;

    try {
      await deleteReview(selectedReview.reviewId, selectedReview.userId);
      alert("후기가 삭제되었습니다.");
      setSelectedReview(null);
      await loadReviews();
    } catch (error) {
      alert(error.message || "후기 삭제에 실패했습니다.");
    }
  };

  const handleUpdateSelectedReview = async () => {
    if (!selectedReview) return;
    if (!editTitle.trim() || !editContent.trim()) {
      alert("제목과 내용을 모두 입력해 주세요.");
      return;
    }

    try {
      const updated = await updateReview(
        selectedReview.reviewId,
        editTitle.trim(),
        editContent.trim()
      );
      setSelectedReview(updated || { ...selectedReview, title: editTitle.trim(), content: editContent.trim() });
      setIsEditingSelected(false);
      alert("후기가 수정되었습니다.");
      await loadReviews();
    } catch (error) {
      alert(error.message || "후기 수정에 실패했습니다.");
    }
  };

  const displayReviews = activeTab === "mine" ? myReviews : allReviews;
  const totalPages = Math.max(1, Math.ceil(displayReviews.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const pagedReviews = displayReviews.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  if (loading) {
    return (
      <section className="w-full px-4 pb-8 md:pb-10">
        <div className="mx-auto w-full max-w-[1220px] rounded-[10px] pt-4 md:pt-6">
          <div className="text-center py-20">
            <p className="text-lg text-gray-600">후기를 불러오는 중...</p>
          </div>
        </div>
      </section>
    );
  }

  if (isWritePageOpen) {
    return (
      <section className="w-full px-4 pb-8 md:pb-10">
        <div className="mx-auto mt-6 w-full max-w-[1220px] rounded border border-[#e5e5e5] bg-[#fafaf5] px-6 py-8 shadow-[0_6px_16px_rgba(0,0,0,0.08)] md:px-12 md:py-10">
          <label className="block text-2xl font-bold text-black">제목</label>
          <input
            type="text"
            value={draftTitle}
            onChange={(e) => setDraftTitle(e.target.value)}
            placeholder="제목을 입력해 주세요."
            className="mt-3 h-12 w-full rounded-xl border border-[#efefef] bg-white px-4 text-base outline-none shadow-[0_4px_10px_rgba(0,0,0,0.06)] focus:border-[#0E2A7B]"
          />

          <div className="mt-6">
            <label className="block text-lg font-bold text-black md:text-xl">첨부파일</label>
            <input
              type="file"
              accept="image/*"
              onChange={handlePickImage}
              className="mt-3 block w-full text-sm text-gray-700 file:mr-4 file:rounded-lg file:border-0 file:bg-[#0E2A7B] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-[#0b2367]"
            />
            {draftImageUrl && (
              <div className="mt-4 overflow-hidden rounded-xl border border-[#e5e5e5] bg-white">
                <img
                  src={draftImageUrl}
                  alt="첨부 미리보기"
                  className="h-48 w-full object-cover md:h-64"
                />
              </div>
            )}
          </div>

          <div className="mt-8">
            <label className="block text-2xl font-bold text-black">내용</label>
          </div>
          <textarea
            value={draftContent}
            onChange={(e) => setDraftContent(e.target.value)}
            placeholder="후기 내용을 입력해 주세요."
            className="mt-3 min-h-[320px] w-full resize-y rounded-xl border border-[#efefef] bg-white p-4 text-base outline-none shadow-[0_4px_10px_rgba(0,0,0,0.06)] focus:border-[#0E2A7B]"
          />

          <div className="mt-6 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsWritePageOpen(false)}
              className="h-10 min-w-20 rounded-full bg-gray-200 px-4 text-sm font-bold text-gray-700 hover:bg-gray-300"
            >
              취소
            </button>
            <button
              type="button"
              onClick={handleCreateReview}
              className="h-10 min-w-20 rounded-full bg-[#0E2A7B] px-4 text-sm font-bold text-white hover:bg-[#0a1f5c]"
            >
              완료
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (selectedReview) {
    return (
      <section className="w-full px-4 pb-8 md:pb-10">
        <div className="mx-auto w-full max-w-[1220px] rounded-[10px] pt-4 md:pt-6">
          <div className="mb-4">
            <button
              type="button"
              onClick={() => setSelectedReview(null)}
              className="rounded-lg bg-white px-3 py-2 text-sm font-semibold text-[#0E2A7B] shadow-[0_4px_12px_rgba(0,0,0,0.12)] hover:bg-[#f6f6f6]"
            >
              목록으로
            </button>
          </div>

          <div className="overflow-hidden rounded-xl border border-[#E7E7E7] bg-[#fafaf5] shadow-[0_6px_20px_rgba(0,0,0,0.08)]">
            <div className="h-72 w-full bg-gradient-to-br from-[#dfe6ff] to-[#f4f6ff] md:h-96">
              {getReviewImageSource(selectedReview) && (
                <img
                  src={getReviewImageSource(selectedReview)}
                  alt="후기 이미지"
                  className="h-full w-full object-cover"
                  onError={(e) => logReviewImageError(e, "후기 상세")}
                />
              )}
            </div>
            <div className="px-6 py-6 md:px-10 md:py-8">
              <span className="inline-block rounded bg-[#0E2A7B] px-2 py-0.5 text-[11px] font-semibold text-white">
                {selectedReview.city} | {selectedReview.type}
              </span>
              {isEditingSelected ? (
                <div className="mt-3 space-y-3">
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="h-12 w-full rounded-xl border border-[#efefef] bg-white px-4 text-xl font-extrabold text-black outline-none focus:border-[#0E2A7B] md:text-2xl"
                  />
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="min-h-[180px] w-full resize-y rounded-xl border border-[#efefef] bg-white p-4 text-base leading-relaxed text-gray-700 outline-none focus:border-[#0E2A7B] md:text-lg"
                  />
                </div>
              ) : (
                <>
                  <h3 className="mt-3 text-2xl font-extrabold text-black md:text-3xl">{selectedReview.title}</h3>
                  <p className="mt-4 whitespace-pre-line text-base leading-relaxed text-gray-700 md:text-lg">
                    {selectedReview.content}
                  </p>
                </>
              )}
              <p className="mt-4 text-sm text-gray-500">
                작성일: {new Date(selectedReview.createdAt).toLocaleDateString('ko-KR')}
              </p>
              <div className="mt-4 flex items-center gap-2">
                {canEditReview(selectedReview) && !isEditingSelected && (
                  <button
                    type="button"
                    onClick={() => setIsEditingSelected(true)}
                    className="rounded-md bg-[#0E2A7B] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#0b2367]"
                  >
                    수정
                  </button>
                )}
                {canEditReview(selectedReview) && isEditingSelected && (
                  <>
                    <button
                      type="button"
                      onClick={handleUpdateSelectedReview}
                      className="rounded-md bg-[#0E2A7B] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#0b2367]"
                    >
                      수정 완료
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditingSelected(false);
                        setEditTitle(selectedReview.title || "");
                        setEditContent(selectedReview.content || "");
                      }}
                      className="rounded-md bg-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-300"
                    >
                      취소
                    </button>
                  </>
                )}
                {canDeleteReview(selectedReview) && (
                  <button
                    type="button"
                    onClick={handleDeleteSelectedReview}
                    className="rounded-md bg-red-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-600"
                  >
                    삭제
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full px-4 pb-8 md:pb-10">
      <div className="mx-auto w-full max-w-[1220px] rounded-[10px] pt-4 md:pt-6">
        <h2 className="text-center text-2xl font-extrabold text-[#0E2A7B] tracking-tight md:text-3xl">거래 후기</h2>

        <div className="mt-7 md:mt-10">
          <div className="flex items-center justify-center gap-6 md:gap-10">
            <button
              type="button"
              onClick={() => handleTabChange("all")}
              className={`w-40 rounded-xl py-3 text-base font-bold transition-all duration-200 md:w-52 md:py-3.5 md:text-lg ${
                activeTab === "all"
                  ? "bg-[#0E2A7B] text-white shadow-[0_8px_18px_rgba(14,42,123,0.35)]"
                  : "bg-white text-[#0E2A7B] shadow-[0_4px_12px_rgba(0,0,0,0.12)]"
              }`}
            >
              모든 후기
            </button>
            <button
              type="button"
              onClick={() => handleTabChange("mine")}
              className={`w-40 rounded-xl py-3 text-base font-bold transition-all duration-200 md:w-52 md:py-3.5 md:text-lg ${
                activeTab === "mine"
                  ? "bg-[#0E2A7B] text-white shadow-[0_8px_18px_rgba(14,42,123,0.35)]"
                  : "bg-white text-[#0E2A7B] shadow-[0_4px_12px_rgba(0,0,0,0.12)]"
              }`}
            >
              내 후기
            </button>
          </div>
        </div>

        <div className="mt-10 flex justify-center md:justify-end">
          <button
            type="button"
            onClick={handleOpenWritePage}
            className="h-9 w-20 rounded-lg bg-white text-xs font-semibold text-[#0E2A7B] shadow-[0_4px_12px_rgba(0,0,0,0.12)] transition-colors duration-200 hover:bg-[#f6f6f6] md:h-10 md:w-24 md:text-sm"
          >
            후기 작성
          </button>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:mt-12">
          {pagedReviews.map((review) => (
            <article
              key={review.reviewId}
              onClick={() => handleOpenReviewDetail(review)}
              className="group cursor-pointer"
            >
              {getReviewImageSource(review) && (
                <img
                  src={getReviewImageSource(review)}
                  alt="후기 이미지"
                  className="h-36 w-full rounded-md object-cover shadow-[0_4px_10px_rgba(0,0,0,0.08)] transition-transform duration-300 group-hover:translate-y-[-2px]"
                  onError={(e) => logReviewImageError(e, "후기 목록")}
                />
              )}
              {!getReviewImageSource(review) && (
                <div className="h-36 w-full rounded-md bg-white shadow-[0_4px_10px_rgba(0,0,0,0.08)] transition-transform duration-300 group-hover:translate-y-[-2px]" />
              )}
              <div className="mt-3">
                <span className="inline-block rounded bg-[#0E2A7B] px-2 py-0.5 text-[11px] font-semibold text-white">
                  {review.city} | {review.type}
                </span>
                <p className="mt-1 text-sm font-semibold text-black">{review.title}</p>
              </div>
            </article>
          ))}
        </div>

        {pagedReviews.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500">
              {activeTab === "mine" ? "작성한 후기가 없습니다." : "등록된 후기가 없습니다."}
            </p>
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-2">
            {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((pageNumber) => {
              const active = pageNumber === safePage;
              return (
                <button
                  key={pageNumber}
                  type="button"
                  onClick={() => setCurrentPage(pageNumber)}
                  className={`h-7 min-w-7 border border-[#0E2A7B] px-1.5 text-sm font-semibold ${
                    active ? "bg-[#0E2A7B] text-white" : "bg-white text-[#0E2A7B]"
                  }`}
                >
                  {pageNumber}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
