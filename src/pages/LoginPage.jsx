import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';

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
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-5xl shadow-2xl">
        <div className="flex overflow-hidden">
          {/* 왼쪽 폼 영역 */}
          <div className="w-1/2 p-10 flex flex-col justify-center z-10 relative bg-card">
            <CardHeader className="relative pt-8">
              <button 
                onClick={() => navigate("/")}
                className="absolute -top-2 -left-2 text-gray-600 hover:text-gray-800 transition-colors duration-200 flex items-center gap-1"
              >
                <span className="text-lg font-black leading-none">&lt;</span>
                <span className="text-xs relative top-[1px]">메인페이지로</span>
              </button>
              <CardTitle className="text-xl">어서오세요.</CardTitle>
              <CardDescription>최고의 서비스로 보답드리겠습니다</CardDescription>
            </CardHeader>

            <CardContent>
              <form className="space-y-4" onSubmit={handleLogin}>
                <div className="space-y-2">
                  <Label htmlFor="email">이메일</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="이메일을 입력하세요"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">비밀번호</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="비밀번호를 입력하세요"
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    아이디 비밀번호 기억
                  </label>
                  <a href="#" className="text-primary hover:underline">
                    비밀번호 찾기
                  </a>
                </div>
                <Button type="submit" className="w-full">
                  로그인
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  className="w-full flex items-center justify-center gap-2"
                >
                  <img src="/img/kakao-icon.png" alt="kakao" className="w-4 h-4" />
                  카카오 계정으로 로그인
                </Button>
                <div className="text-center text-xs mt-2 text-muted-foreground">
                  <Link to="/signup" className="hover:underline text-primary">
                    회원가입
                  </Link>
                </div>
              </form>
            </CardContent>
          </div>

          {/* 오른쪽 회색 영역 + 이미지 */}
          <div className="w-1/2 bg-muted relative">
            <img
              src="/img/login-bg.png"
              alt="Login Visual"
              className="absolute inset-0 w-full h-full object-cover translate-x-[10%]"
            />
          </div>
        </div>
      </Card>
    </div>
  );
}
