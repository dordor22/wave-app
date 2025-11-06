import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Signup() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setLoading(true);
    const res = await signUp({ email, password });
    setLoading(false);
    if (res && 'error' in res && res.error) {
      setError(res.error);
      return;
    }
    if (res && 'needsEmailConfirm' in res && res.needsEmailConfirm) {
      setInfo('נשלח מייל לאישור. בדוק את תיבת הדואר שלך.');
      return;
    }
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>הרשמה</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <label>אימייל</label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <label>סיסמה</label>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            {error && <div className="text-red-600 text-sm">{error}</div>}
            {info && <div className="text-green-700 text-sm">{info}</div>}
            <Button type="submit" disabled={loading} className="w-full">{loading ? 'נרשם…' : 'הרשם'}</Button>
          </form>
          <div className="text-sm mt-4">
            יש לך כבר משתמש? <Link className="underline" to="/login">להתחברות</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


