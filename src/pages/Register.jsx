import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const specialties = ['Cardiologist', 'Dermatologist', 'Pediatrician', 'General Physician', 'Orthopedic', 'Neurologist'];

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('patient');
  const [specialty, setSpecialty] = useState(specialties[0]);
  const [bio, setBio] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const body = { name, email, password, role };
      if (role === 'doctor') {
        body.specialty = specialty;
        body.bio = bio;
      }

      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Something went wrong');
        setLoading(false);
        return;
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      if (data.user.role === 'doctor') {
        navigate('/dashboard');
      } else {
        navigate('/doctors');
      }
    } catch (err) {
      setError('Could not connect to the server. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Create account</h1>
        <p className="text-slate-500 mb-8">Sign up to book appointments with doctors</p>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm px-4 py-2.5 rounded-lg mb-5">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Full name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-patient focus:border-transparent"
              placeholder="Jane Doe"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-patient focus:border-transparent"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-patient focus:border-transparent"
              placeholder="••••••••"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">I am a</label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setRole('patient')}
                className={`flex-1 py-2.5 rounded-lg border font-medium transition-colors ${
                  role === 'patient'
                    ? 'bg-patient text-white border-patient'
                    : 'border-slate-300 text-slate-600'
                }`}
              >
                Patient
              </button>
              <button
                type="button"
                onClick={() => setRole('doctor')}
                className={`flex-1 py-2.5 rounded-lg border font-medium transition-colors ${
                  role === 'doctor'
                    ? 'bg-doctor text-white border-doctor'
                    : 'border-slate-300 text-slate-600'
                }`}
              >
                Doctor
              </button>
            </div>
          </div>

          {role === 'doctor' && (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Specialty</label>
                <select
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-doctor focus:border-transparent bg-white"
                >
                  {specialties.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Short bio</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows="2"
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-doctor focus:border-transparent"
                  placeholder="A brief line about your experience"
                />
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-patient hover:bg-patient-dark text-white font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-60"
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-6">
          Already have an account? <Link to="/" className="text-patient font-medium hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;