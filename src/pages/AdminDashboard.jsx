import { useEffect, useState } from 'react';

function AdminDashboard() {
  const [tab, setTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const authHeaders = { Authorization: `Bearer ${token}` };
  const apiUrl = import.meta.env.VITE_API_URL;

  const loadAll = () => {
    setLoading(true);
    Promise.all([
      fetch(`${apiUrl}/admin/users`, { headers: authHeaders }).then((r) => r.json()),
      fetch(`${apiUrl}/admin/doctors`, { headers: authHeaders }).then((r) => r.json()),
      fetch(`${apiUrl}/admin/bookings`, { headers: authHeaders }).then((r) => r.json()),
    ])
      .then(([u, d, b]) => {
        setUsers(u);
        setDoctors(d);
        setBookings(b);
        setLoading(false);
      })
      .catch(() => {
        setError('Could not load admin data.');
        setLoading(false);
      });
  };

  useEffect(() => {
    if (user?.role === 'admin') loadAll();
  }, []);

  const deleteUser = async (id) => {
    if (!confirm('Delete this user? This also removes their doctor profile and bookings if any.')) return;
    await fetch(`${apiUrl}/admin/users/${id}`, { method: 'DELETE', headers: authHeaders });
    loadAll();
  };

  const cancelBooking = async (id) => {
    if (!confirm('Cancel this booking? The slot will become open again.')) return;
    await fetch(`${apiUrl}/admin/bookings/${id}`, { method: 'DELETE', headers: authHeaders });
    loadAll();
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <p className="text-slate-500">Admin access required.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface px-4 py-10">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-800 mb-1">Admin Dashboard</h1>
        <p className="text-slate-500 mb-6">Manage users, doctors, and bookings</p>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="flex gap-2 mb-6">
          {['users', 'doctors', 'bookings'].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                tab === t ? 'bg-slate-800 text-white' : 'bg-white text-slate-600 border border-slate-300'
              }`}
            >
              {t} ({t === 'users' ? users.length : t === 'doctors' ? doctors.length : bookings.length})
            </button>
          ))}
        </div>

        {loading && <p className="text-slate-500">Loading...</p>}

        {!loading && tab === 'users' && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-500 text-left">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-t border-slate-100">
                    <td className="px-4 py-3 font-medium text-slate-800">{u.name}</td>
                    <td className="px-4 py-3 text-slate-600">{u.email}</td>
                    <td className="px-4 py-3 capitalize text-slate-600">{u.role}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => deleteUser(u.id)}
                        className="text-red-500 hover:text-red-700 text-xs font-medium"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && tab === 'doctors' && (
          <div className="grid sm:grid-cols-2 gap-4">
            {doctors.map((d) => (
              <div key={d.id} className="bg-white rounded-xl shadow-md p-5">
                <p className="font-semibold text-slate-800">{d.name}</p>
                <p className="text-sm text-doctor font-medium">{d.specialty}</p>
                <p className="text-sm text-slate-500 mt-1">{d.email}</p>
                {d.bio && <p className="text-sm text-slate-600 mt-2">{d.bio}</p>}
              </div>
            ))}
          </div>
        )}

        {!loading && tab === 'bookings' && (
          <div className="space-y-4">
            {bookings.map((b) => (
              <div key={b.id} className="bg-white rounded-xl shadow-md p-5">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-semibold text-slate-800">{b.patient_name}</p>
                    <p className="text-sm text-slate-500">Age {b.patient_age} · {b.patient_email}</p>
                  </div>
                  <button
                    onClick={() => cancelBooking(b.id)}
                    className="text-red-500 hover:text-red-700 text-xs font-medium"
                  >
                    Cancel
                  </button>
                </div>
                <p className="text-sm text-slate-600">
                  With <span className="font-medium">{b.doctor_name}</span> on {b.slot_date} at {b.start_time.slice(0, 5)}
                </p>
                <p className="text-sm text-slate-500">Payment: {b.payment_type}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;