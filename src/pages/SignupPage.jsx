import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';

export default function SignupPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [emailVerified, setEmailVerified] = useState(false);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  // 이메일 인증 요청
  const handleEmailVerification = async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/auth/send-code?email=${email}`, {
        method: 'POST',
      });
      const text = await res.text();

      if (!res.ok) {
        alert(text || '인증 요청 실패');
        return;
      }

      if (text.includes('이미')) {
        alert(text);
        return;
      }

      setShowCodeModal(true);
    } catch (err) {
      alert('이메일 인증 요청 중 오류 발생');
    }
  };

  // 인증 코드 확인
  const handleCodeConfirm = async () => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/auth/verify-code?email=${email}&code=${verificationCode}`,
        { method: 'POST' }
      );
      const text = await res.text();
      if (text.includes('성공')) {
        alert('✅ 인증 성공!');
        setEmailVerified(true);
        setShowCodeModal(false);
      } else {
        alert(text);
      }
    } catch {
      alert('인증 확인 중 오류 발생');
    }
  };

  // 회원가입 요청
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!emailVerified) return alert('이메일 인증이 필요합니다.');
    if (password !== confirm) return alert('비밀번호가 일치하지 않습니다.');

    try {
      const res = await fetch('http://localhost:8080/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const text = await res.text();

      if (res.ok && text.includes('성공')) {
        alert('🎉 회원가입 성공');
        navigate('/login');
      } else {
        alert(text);
      }
    } catch {
      alert('회원가입 요청 실패');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAF5] px-4">
      <div className="flex w-full max-w-5xl bg-white shadow-2xl rounded-lg overflow-hidden relative">
        {/* 왼쪽 폼 */}
        <div className="w-1/2 p-10 flex flex-col justify-center z-10 relative bg-white">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">회원가입</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 이메일 입력 */}
            <div>
              <label className="block text-sm text-gray-600 mb-1">이메일</label>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={emailVerified}
                  className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm"
                />
                {!emailVerified && (
                  <button
                    type="button"
                    onClick={handleEmailVerification}
                    className="px-3 py-2 text-sm border border-black rounded"
                  >
                    인증
                  </button>
                )}
              </div>
            </div>

            {/* 비밀번호 */}
            <div>
              <label className="block text-sm text-gray-600 mb-1">비밀번호</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              />
            </div>

            {/* 비밀번호 확인 */}
            <div>
              <label className="block text-sm text-gray-600 mb-1">비밀번호 확인</label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              />
            </div>

            {/* 제출 */}
            <button
              type="submit"
              className="w-full bg-[#0E2A7B] text-white py-2 rounded text-sm hover:bg-[#1b3b9b]"
            >
              회원가입
            </button>

            <div className="text-center text-xs mt-2 text-gray-600">
              <Link to="/login" className="hover:underline text-[#0E2A7B]">
                이미 계정이 있으신가요? 로그인
              </Link>
            </div>
          </form>
        </div>

        {/* 오른쪽 이미지 */}
        <div className="w-1/2 bg-[#F5F5F5] relative">
          <img
            src="/img/login-bg.png"
            alt="Signup Visual"
            className="absolute inset-0 w-full h-full object-cover translate-x-[10%]"
          />
        </div>

        {/* 인증 모달 */}
        {showCodeModal && (
          <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-md w-[300px] space-y-3">
              <h3 className="text-sm font-semibold">인증 코드 입력</h3>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                placeholder="이메일로 받은 인증번호"
              />
              <button
                onClick={handleCodeConfirm}
                className="w-full bg-[#0E2A7B] text-white py-2 rounded text-sm hover:bg-[#1b3b9b]"
              >
                확인
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
