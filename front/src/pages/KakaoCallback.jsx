import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getKakaoToken, getKakaoUserInfo } from '../lib/kakao';

export default function KakaoCallback() {
  const navigate = useNavigate();

  useEffect(() => {
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

        localStorage.setItem('accessToken', tokenData.access_token);
        localStorage.setItem('kakaoId', userInfo.id);
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('displayName', userInfo.properties?.nickname || '카카오 사용자');
        localStorage.setItem('loginType', 'kakao');
        localStorage.setItem('isAdmin', 'false');

        alert('카카오 로그인 성공!');
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
