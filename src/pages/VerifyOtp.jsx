import { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';

function VerifyOtp() {
  const location = useLocation();
  const navigate = useNavigate();
  const emailFromState = location.state?.email || '';

  const [email, setEmail] = useState(emailFromState);
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    setInfo('');
    setSubmitting(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Verification failed');
        setSubmitting(false);
        return;
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      if (data.user.role === 'doctor') {
        navigate('/dashboard');
      } else if (data.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/doctors');
      }
    } catch (err) {
      setError('Could not connect to the server.');
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    setError('');
    setInfo('');
    setResending(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/resend-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Could not resend code');
        setResending(false);
        return;
      }

      setInfo('A new code has been sent to your email.');
      setResending(false);
    } catch (err) {
      setError('Could not connect to the server.');
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Verify your email</h1>
        <p className="text-slate-500 mb-8">Enter the 6-digit code we sent to your email address</p>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm px-4 py-2.5 rounded-lg mb-5">
            {error}
          </div>
        )}
        {info && (
          <div className="bg-green-50 text-green-700 text-sm px-4 py-2.5 rounded-lg mb-5">
            {info}
          </div>
        )}

        <form onSubmit={handleVerify} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-patient focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Verification code</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-patient focus:border-transparent text-center text-2xl tracking-widest"
              placeholder="000000"
              required
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-patient hover:bg-patient-dark text-white font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-60"
          >
            {submitting ? 'Verifying...' : 'Verify'}
          </button>
        </form>

        <button
          onClick={handleResend}
          disabled={resending}
          className="w-full text-center text-sm text-patient font-medium hover:underline mt-5 disabled:opacity-60"
        >
          {resending ? 'Sending...' : "Didn't get a code? Resend"}
        </button>

        <p className="text-center text-sm text-slate-500 mt-4">
          <Link to="/" className="text-patient font-medium hover:underline">Back to login</Link>
        </p>
      </div>
    </div>
  );
}

export default VerifyOtp;