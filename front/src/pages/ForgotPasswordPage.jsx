import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { forgotPassword, confirmForgotPassword } from '../lib/cognito';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSendCode = async (e) => {
    e.preventDefault();
    if (!email.trim()) return alert('이메일을 입력해주세요.');
    setSending(true);
    try {
      await forgotPassword(email);
      setCodeSent(true);
      alert('이메일로 인증 코드가 전송되었습니다.');
    } catch (err) {
      alert(err.message || '코드 전송 실패');
    } finally {
      setSending(false);
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) return alert('비밀번호가 일치하지 않습니다.');
    setSubmitting(true);
    try {
      await confirmForgotPassword(email, code, newPassword);
      alert('비밀번호가 변경되었습니다. 다시 로그인해주세요.');
      navigate('/login');
    } catch (err) {
      alert(err.message || '비밀번호 변경 실패');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-6">
      <Card className="w-full max-w-md shadow-2xl">
        <div className="p-5 md:p-10">
          <CardHeader className="relative pt-8">
            <button
              onClick={() => navigate('/login')}
              className="absolute -top-2 -left-2 text-gray-600 hover:text-gray-800 transition-colors duration-200 flex items-center gap-1"
            >
              <span className="text-lg font-black leading-none">&lt;</span>
              <span className="text-xs relative top-[1px]">로그인으로</span>
            </button>
            <CardTitle className="text-xl">비밀번호 찾기</CardTitle>
            <CardDescription>
              {codeSent ? '이메일로 받은 코드와 새 비밀번호를 입력하세요' : '가입한 이메일을 입력하면 인증 코드를 보내드립니다'}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {!codeSent ? (
              <form className="space-y-4" onSubmit={handleSendCode}>
                <div className="space-y-2">
                  <Label htmlFor="email">이메일</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="가입한 이메일을 입력하세요"
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={sending}>
                  {sending ? '전송 중...' : '인증 코드 받기'}
                </Button>
              </form>
            ) : (
              <form className="space-y-4" onSubmit={handleReset}>
                <div className="space-y-2">
                  <Label htmlFor="code">인증 코드</Label>
                  <Input
                    id="code"
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="이메일로 받은 6자리 코드"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">새 비밀번호</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="새 비밀번호 (최소 8자, 대소문자, 숫자 포함)"
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
                    placeholder="새 비밀번호를 다시 입력하세요"
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting ? '변경 중...' : '비밀번호 변경'}
                </Button>
                <button
                  type="button"
                  onClick={() => setCodeSent(false)}
                  className="w-full text-xs text-center text-muted-foreground hover:underline"
                >
                  이메일 다시 입력
                </button>
              </form>
            )}
          </CardContent>
        </div>
      </Card>
    </div>
  );
}
