import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        alert("로그인 성공!");
        localStorage.setItem("isLoggedIn", "true");
        navigate("/");
        setTimeout(() => window.location.reload(), 10);
      } else {
        alert("로그인 실패!");
      }
    } catch (err) {
      console.error("로그인 오류:", err);
      alert("서버 오류 발생");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAF5] px-4">
      <div className="flex w-full max-w-5xl bg-white shadow-2xl rounded-lg overflow-hidden relative">
        {/* 왼쪽 폼 영역 */}
        <div className="w-1/2 p-10 flex flex-col justify-center z-10 relative bg-white">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">어서오세요.</h2>
          <p className="text-sm text-gray-500 mb-5">최고의 서비스로 보답드리겠습니다</p>

          <form className="space-y-3" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm text-gray-600 mb-1">이메일</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">비밀번호</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              />
            </div>
            <div className="flex items-center justify-between text-xs text-gray-600">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                아이디 비밀번호 기억
              </label>
              <a href="#" className="text-[#0E2A7B] hover:underline">
                비밀번호 찾기
              </a>
            </div>
            <button
              type="submit"
              className="w-full bg-[#0E2A7B] text-white py-2 rounded text-sm hover:bg-[#1b3b9b] transition"
            >
              로그인
            </button>
            <button
              type="button"
              className="w-full bg-yellow-300 text-black py-2 rounded text-sm flex items-center justify-center gap-2 hover:bg-yellow-400 transition"
            >
              <img src="/img/kakao-icon.png" alt="kakao" className="w-4 h-4" />
              카카오 계정으로 로그인
            </button>
            <div className="text-center text-xs mt-2 text-gray-600">
              <Link to="/signup" className="hover:underline text-[#0E2A7B]">
                회원가입
              </Link>
            </div>
          </form>
        </div>

        {/* 오른쪽 회색 영역 + 이미지 */}
        <div className="w-1/2 bg-[#F5F5F5] relative">
          <img
            src="/img/login-bg.png"
            alt="Login Visual"
            className="absolute inset-0 w-full h-full object-cover translate-x-[10%]"
          />
        </div>
      </div>
    </div>
  );
}
