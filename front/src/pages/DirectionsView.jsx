import { useEffect, useRef, useState } from "react";

/**
 * 카카오맵 JavaScript API
 * @see https://apis.map.kakao.com/
 * 카카오 developers > 내 앱 > 플랫폼(Web 도메인 등록) > JavaScript 키
 */
const OFFICE_ADDRESS = "서울특별시 관악구 봉천로 500";
const DEFAULT_LAT = 37.4841;
const DEFAULT_LNG = 126.9521;

const getOfficeLat = () => parseFloat(process.env.REACT_APP_OFFICE_LAT || String(DEFAULT_LAT), 10);
const getOfficeLng = () => parseFloat(process.env.REACT_APP_OFFICE_LNG || String(DEFAULT_LNG), 10);

const getKakaoMapAppKey = () =>
  String(
    process.env.REACT_APP_KAKAO_JAVASCRIPT_KEY || process.env.REACT_APP_KAKAO_MAP_APP_KEY || ""
  ).trim();

const kakaoMapSearchUrl = () =>
  `https://map.kakao.com/link/search/${encodeURIComponent(OFFICE_ADDRESS)}`;

function loadKakaoMapScript(appKey) {
  return new Promise((resolve, reject) => {
    if (window.kakao?.maps) {
      resolve();
      return;
    }
    const existing = document.getElementById("kakao-maps-sdk");
    if (existing) {
      const done = () => {
        if (window.kakao?.maps) resolve();
        else reject(new Error("kakao maps"));
      };
      if (existing.getAttribute("data-loaded") === "1") {
        done();
        return;
      }
      existing.addEventListener("load", done);
      existing.addEventListener("error", () => reject(new Error("kakao load")));
      return;
    }
    const script = document.createElement("script");
    script.id = "kakao-maps-sdk";
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${encodeURIComponent(
      appKey
    )}&autoload=false&libraries=services`;
    script.async = true;
    script.onload = () => {
      script.setAttribute("data-loaded", "1");
      resolve();
    };
    script.onerror = () => reject(new Error("kakao script"));
    document.head.appendChild(script);
  });
}

function KakaoMapCanvas({ onReady, onError }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const appKey = getKakaoMapAppKey();

  useEffect(() => {
    if (!appKey || !containerRef.current) return;
    let cancelled = false;
    let loadTimeout = null;

    const run = async () => {
      try {
        await loadKakaoMapScript(appKey);
        if (cancelled || !containerRef.current) return;
        if (!window.kakao?.maps) {
          onError?.("SDK는 로드됐지만 kakao.maps 객체를 찾지 못했습니다.");
          return;
        }

        loadTimeout = window.setTimeout(() => {
          if (!cancelled) {
            onError?.("지도 초기화가 지연되고 있습니다. 플랫폼 Web 도메인 등록을 확인해 주세요.");
          }
        }, 7000);

        window.kakao.maps.load(() => {
          if (cancelled || !containerRef.current) return;
          const el = containerRef.current;
          const fallbackLat = getOfficeLat();
          const fallbackLng = getOfficeLng();
          const fallbackPos = new window.kakao.maps.LatLng(fallbackLat, fallbackLng);

          const map = new window.kakao.maps.Map(el, {
            center: fallbackPos,
            level: 3,
          });
          mapRef.current = map;

          const drawMarker = (position) => {
            const marker = new window.kakao.maps.Marker({ position, map });
            const infowindow = new window.kakao.maps.InfoWindow({
              content: `<div style="padding:8px 12px;font-size:13px;max-width:240px;line-height:1.4;">${OFFICE_ADDRESS}</div>`,
            });
            infowindow.open(map, marker);
            map.setCenter(position);
            if (loadTimeout) {
              clearTimeout(loadTimeout);
              loadTimeout = null;
            }
            onReady?.();
          };

          // 주소 기반으로 정확한 좌표를 우선 사용하고, 실패 시 기본 좌표로 폴백합니다.
          if (window.kakao.maps.services?.Geocoder) {
            const geocoder = new window.kakao.maps.services.Geocoder();
            geocoder.addressSearch(OFFICE_ADDRESS, (result, status) => {
              if (cancelled) return;
              if (status === window.kakao.maps.services.Status.OK && result?.[0]) {
                const y = Number(result[0].y);
                const x = Number(result[0].x);
                if (Number.isFinite(y) && Number.isFinite(x)) {
                  drawMarker(new window.kakao.maps.LatLng(y, x));
                  return;
                }
              }
              drawMarker(fallbackPos);
            });
          } else {
            drawMarker(fallbackPos);
          }
        });
      } catch (e) {
        const reason = e?.message || "카카오맵 SDK 로드 실패";
        console.warn("[DirectionsView] Kakao map init failed:", reason);
        onError?.(reason);
      }
    };

    run();

    return () => {
      cancelled = true;
      if (loadTimeout) {
        clearTimeout(loadTimeout);
      }
      if (mapRef.current) {
        try {
          mapRef.current = null;
        } catch {
          /* ignore */
        }
      }
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [appKey]);

  return <div ref={containerRef} className="h-full min-h-[min(50vh,480px)] w-full" />;
}

export default function DirectionsView() {
  const appKey = getKakaoMapAppKey();
  const [mapStatus, setMapStatus] = useState("idle");
  const [mapErrorReason, setMapErrorReason] = useState("");

  useEffect(() => {
    if (appKey) {
      setMapStatus("loading");
      setMapErrorReason("");
    } else {
      setMapStatus("idle");
      setMapErrorReason("");
    }
  }, [appKey]);

  return (
    <section className="w-full px-4 pb-8 md:pb-10">
      <div className="mx-auto w-full max-w-[1040px] pt-2 md:pt-4">
        <h1 className="text-center text-2xl font-extrabold tracking-tight text-black md:text-3xl">
          오시는 길
        </h1>

        <div className="mx-auto mt-6 flex flex-wrap items-center justify-center gap-3 text-sm">
          <a
            href={kakaoMapSearchUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-[#0E2A7B] bg-white px-4 py-1.5 font-semibold text-[#0E2A7B] transition hover:bg-[#f0f3ff]"
          >
            카카오맵에서 크게 보기
          </a>
        </div>

        <div className="mx-auto mt-6 w-full overflow-hidden rounded-2xl bg-white shadow-[0_10px_40px_rgba(0,0,0,0.12),0_4px_12px_rgba(0,0,0,0.08)] ring-1 ring-black/[0.04]">
          {appKey ? (
            <div className="relative">
              {(mapStatus === "idle" || mapStatus === "loading") && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#f5f6f8] text-sm text-gray-600">
                  지도를 불러오는 중입니다...
                </div>
              )}
              {mapStatus === "error" && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-[#f5f6f8] px-6 text-center">
                  <p className="text-sm font-semibold text-gray-700">지도를 불러오지 못했습니다.</p>
                  <p className="max-w-lg text-xs text-gray-500">
                    {mapErrorReason || "카카오 앱의 Web 도메인/JavaScript 키 설정을 확인해 주세요."}
                  </p>
                  <a
                    href={kakaoMapSearchUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full bg-[#0E2A7B] px-5 py-2 text-sm font-semibold text-white hover:bg-[#0a1f5c]"
                  >
                    카카오맵에서 위치 보기
                  </a>
                </div>
              )}
              <KakaoMapCanvas
                onReady={() => setMapStatus("ready")}
                onError={(reason) => {
                  setMapErrorReason(reason || "");
                  setMapStatus("error");
                }}
              />
            </div>
          ) : (
            <div className="flex min-h-[min(50vh,320px)] flex-col items-center justify-center gap-4 bg-[#f5f6f8] px-6 py-12 text-center">
              <p className="text-sm text-gray-700">
                페이지 안에 카카오맵을 띄우려면{" "}
                <a
                  className="font-semibold text-[#0E2A7B] underline"
                  href="https://developers.kakao.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Kakao developers
                </a>{" "}
                에서 앱을 만들고 <strong>JavaScript 키</strong>를 발급한 뒤, 아래 환경 변수에 넣어
                주세요.
              </p>
              <code className="block max-w-full rounded bg-white px-3 py-2 text-xs text-gray-800 shadow-sm">
                REACT_APP_KAKAO_JAVASCRIPT_KEY=발급받은_JavaScript_키
              </code>
              <p className="max-w-md text-xs text-gray-500">
                플랫폼에 Web 도메인(예: http://localhost:3000, 배포 URL)을 등록해야 합니다. 이용
                정책·쿼터는 공식 약관을 확인하세요.
              </p>
              <a
                href={kakaoMapSearchUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-[#0E2A7B] px-5 py-2 text-sm font-semibold text-white hover:bg-[#0a1f5c]"
              >
                카카오맵에서 위치 보기
              </a>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
