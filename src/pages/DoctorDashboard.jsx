import { useEffect, useState } from 'react';

function DoctorDashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const user = JSON.parse(localStorage.getItem('user') || 'null');

  useEffect(() => {
    if (!user) return;

    // Find this doctor's `doctors.id` (not user id) via the doctors list
    fetch(`${import.meta.env.VITE_API_URL}/doctors`)
      .then((res) => res.json())
      .then((doctorsList) => {
        const me = doctorsList.find((d) => d.name === user.name);
        if (!me) {
          setError('Could not find your doctor profile.');
          setLoading(false);
          return;
        }
        return fetch(`${import.meta.env.VITE_API_URL}/doctors/${me.id}/bookings`)
          .then((res) => res.json())
          .then((data) => {
            setBookings(data);
            setLoading(false);
          });
      })
      .catch(() => {
        setError('Could not load your appointments.');
        setLoading(false);
      });
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <p className="text-slate-500">Please log in as a doctor to view this page.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface px-4 py-10">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-800 mb-1">Your Appointments</h1>
        <p className="text-slate-500 mb-8">Patients who booked a slot with you, {user.name}</p>

        {loading && <p className="text-slate-500">Loading appointments...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && bookings.length === 0 && (
          <p className="text-slate-500">No appointments booked yet.</p>
        )}

        <div className="space-y-4">
          {bookings.map((b) => (
            <div key={b.id} className="bg-white rounded-xl shadow-md p-5">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-semibold text-slate-800">{b.patient_name}</p>
                  <p className="text-sm text-slate-500">Age {b.patient_age}</p>
                </div>
                <span className="text-xs font-medium bg-doctor/10 text-doctor px-2.5 py-1 rounded-full">
                  {b.slot_date} · {b.start_time.slice(0, 5)}
                </span>
              </div>
              <p className="text-sm text-slate-600 mb-1"><span className="font-medium">Address:</span> {b.patient_address}</p>
              <p className="text-sm text-slate-600"><span className="font-medium">Payment:</span> {b.payment_type}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DoctorDashboard;