import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getKakaoToken, getKakaoUserInfo } from '../lib/kakao';
import { establishSessionAnchors } from '../lib/authSession';

export default function KakaoCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const getDisplayNameFromKakao = (userInfo) => {
      const candidates = [
        userInfo?.properties?.nickname,
        userInfo?.kakao_account?.profile?.nickname,
        userInfo?.kakao_account?.name,
      ];
      const name = candidates.find((v) => typeof v === "string" && v.trim());
      if (name) return name.trim();

      const id = userInfo?.id != null ? String(userInfo.id) : "";
      return id ? `사용자${id.slice(-4)}` : "사용자";
    };

    const handleKakaoLogin = async () => {
      const code = new URLSearchParams(window.location.search).get('code');
      
      if (!code) {
        alert('카카오 로그인 실패');
        navigate('/login');
        return;
      }

      try {
        const tokenData = await getKakaoToken(code);
        const userInfo = await getKakaoUserInfo(tokenData.access_token);
        const displayName = getDisplayNameFromKakao(userInfo);

        sessionStorage.setItem('accessToken', tokenData.access_token);
        sessionStorage.removeItem('idToken');
        sessionStorage.removeItem('refreshToken');
        sessionStorage.setItem('kakaoId', userInfo.id);
        sessionStorage.setItem('isLoggedIn', 'true');
        sessionStorage.setItem('displayName', displayName);
        sessionStorage.setItem('loginType', 'kakao');
        sessionStorage.setItem('isAdmin', 'false');
        establishSessionAnchors();

        window.dispatchEvent(new Event("auth:changed"));
        navigate('/');
      } catch (error) {
        console.error('카카오 로그인 오류:', error);
        alert('카카오 로그인 실패');
        navigate('/login');
      }
    };

    handleKakaoLogin();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-lg">카카오 로그인 처리 중...</p>
    </div>
  );
}
