import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { signUp, confirmSignUp } from '../lib/cognito';

export default function SignupPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    setLoading(true);
    try {
      await signUp(email, password, name);
      alert('회원가입 성공! 이메일로 전송된 인증 코드를 입력해주세요.');
      setStep(2);
    } catch (err) {
      console.error('회원가입 오류:', err);
      alert(err.message || '회원가입 실패!');
    } finally {
      setLoading(false);
    }
  };

  const handleVerification = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await confirmSignUp(email, verificationCode);
      alert('이메일 인증 완료! 로그인해주세요.');
      navigate('/login');
    } catch (err) {
      console.error('인증 오류:', err);
      alert(err.message || '인증 실패!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-5xl shadow-2xl">
        <div className="flex overflow-hidden">
          <div className="w-1/2 p-10 flex flex-col justify-center z-10 relative bg-card">
            <CardHeader className="relative pt-8">
              <button 
                onClick={() => navigate("/")}
                className="absolute -top-2 -left-2 text-gray-600 hover:text-gray-800 transition-colors duration-200 flex items-center gap-1"
              >
                <span className="text-lg font-black leading-none">&lt;</span>
                <span className="text-xs relative top-[1px]">메인페이지로</span>
              </button>
              <CardTitle className="text-xl">
                {step === 1 ? '회원가입' : '이메일 인증'}
              </CardTitle>
              <CardDescription>
                {step === 1 ? '최고의 서비스로 보답드리겠습니다' : '이메일로 전송된 인증 코드를 입력하세요'}
              </CardDescription>
            </CardHeader>

            <CardContent>
              {step === 1 ? (
                <form className="space-y-4" onSubmit={handleSignup}>
                  <div className="space-y-2">
                    <Label htmlFor="name">이름</Label>
                    <Input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="이름을 입력하세요"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">이메일</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="이메일을 입력하세요"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">비밀번호</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="비밀번호를 입력하세요 (최소 8자, 대소문자, 숫자 포함)"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">비밀번호 확인</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="비밀번호를 다시 입력하세요"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? '가입 중...' : '회원가입'}
                  </Button>
                  <div className="text-center text-xs mt-2 text-muted-foreground">
                    이미 계정이 있으신가요?{' '}
                    <Link to="/login" className="hover:underline text-primary">
                      로그인
                    </Link>
                  </div>
                </form>
              ) : (
                <form className="space-y-4" onSubmit={handleVerification}>
                  <div className="space-y-2">
                    <Label htmlFor="code">인증 코드</Label>
                    <Input
                      id="code"
                      type="text"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      placeholder="6자리 인증 코드"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? '인증 중...' : '인증 완료'}
                  </Button>
                </form>
              )}
            </CardContent>
          </div>

          <div className="w-1/2 bg-muted relative">
            <img
              src="/img/login-bg.png"
              alt="Signup Visual"
              className="absolute inset-0 w-full h-full object-cover translate-x-[10%]"
            />
          </div>
        </div>
      </Card>
    </div>
  );
}
