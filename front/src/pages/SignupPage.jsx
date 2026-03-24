import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { signUp, confirmSignUp } from '../lib/cognito';

export default function SignupPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [sendingCode, setSendingCode] = useState(false);
  const [verifyingCode, setVerifyingCode] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [signupRequested, setSignupRequested] = useState(false);

  const validateBeforeSendCode = () => {
    if (!nickname.trim() || !email.trim() || !password || !confirmPassword) {
      alert('닉네임, 이메일, 비밀번호, 비밀번호 확인을 먼저 입력해주세요.');
      return false;
    }
    if (password !== confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return false;
    }
    return true;
  };

  const handleSendCode = async () => {
    if (emailVerified) return;
    if (!validateBeforeSendCode()) return;

    setSendingCode(true);
    try {
      await signUp(email, password, nickname);
      setCodeSent(true);
      setSignupRequested(true);
      alert('이메일로 인증 코드가 전송되었습니다. 인증번호를 입력해주세요.');
    } catch (err) {
      console.error('회원가입 오류:', err);
      if (String(err?.message).includes('UsernameExistsException')) {
        setCodeSent(true);
        setSignupRequested(true);
        alert('이미 가입 요청된 이메일입니다. 받은 인증 코드를 입력해주세요.');
      } else {
        alert(err.message || '인증 코드 전송 실패!');
      }
    } finally {
      setSendingCode(false);
    }
  };

  const handleVerification = async (e) => {
    e.preventDefault();
    if (!verificationCode.trim()) {
      alert('인증 코드를 입력해주세요.');
      return;
    }

    setVerifyingCode(true);

    try {
      await confirmSignUp(email, verificationCode);
      setEmailVerified(true);
      setCodeSent(false);
      setVerificationCode('');
      alert('이메일 인증이 완료되었습니다.');
    } catch (err) {
      console.error('인증 오류:', err);
      alert('인증번호가 올바르지 않습니다. 다시 확인해주세요.');
    } finally {
      setVerifyingCode(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!signupRequested) {
      alert('먼저 인증 코드를 요청해주세요.');
      return;
    }
    if (!emailVerified) {
      alert('이메일 인증을 완료해주세요.');
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      alert('회원가입이 완료되었습니다. 로그인해주세요.');
      navigate('/login');
    }, 200);
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
              <CardTitle className="text-xl">회원가입</CardTitle>
              <CardDescription>이메일 인증 후 가입을 완료해주세요</CardDescription>
            </CardHeader>

            <CardContent>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <Label htmlFor="nickname">닉네임</Label>
                  <Input
                    id="nickname"
                    type="text"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    placeholder="닉네임을 입력하세요"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">이메일</Label>
                  <div className="flex gap-2">
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="이메일을 입력하세요"
                      disabled={emailVerified}
                      required
                    />
                    <Button
                      type="button"
                      onClick={handleSendCode}
                      disabled={sendingCode || emailVerified}
                      className="shrink-0"
                    >
                      {emailVerified ? '인증완료' : sendingCode ? '전송 중...' : '인증요청'}
                    </Button>
                  </div>
                </div>

                {codeSent && !emailVerified && (
                  <div className="space-y-2 rounded-md border bg-muted/30 p-3">
                    <Label htmlFor="code">인증 코드</Label>
                    <div className="flex gap-2">
                      <Input
                        id="code"
                        type="text"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        placeholder="6자리 인증 코드"
                        required
                      />
                      <Button
                        type="button"
                        onClick={handleVerification}
                        disabled={verifyingCode}
                        className="shrink-0"
                      >
                        {verifyingCode ? '확인 중...' : '확인'}
                      </Button>
                    </div>
                  </div>
                )}

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
                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting ? '처리 중...' : '회원가입 완료'}
                </Button>
                <div className="text-center text-xs mt-2 text-muted-foreground">
                  이미 계정이 있으신가요?{' '}
                  <Link to="/login" className="hover:underline text-primary">
                    로그인
                  </Link>
                </div>
              </form>
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
