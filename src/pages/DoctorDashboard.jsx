import { useEffect, useState } from 'react';

function DoctorDashboard() {
  const [bookings, setBookings] = useState([]);
  const [slots, setSlots] = useState([]);
  const [doctorId, setDoctorId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [slotDate, setSlotDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [addError, setAddError] = useState('');
  const [adding, setAdding] = useState(false);

  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const loadData = (id) => {
    fetch(`${import.meta.env.VITE_API_URL}/doctors/${id}/bookings`)
      .then((res) => res.json())
      .then(setBookings);

    fetch(`${import.meta.env.VITE_API_URL}/doctors/${id}/slots`)
      .then((res) => res.json())
      .then(setSlots);
  };

  useEffect(() => {
    if (!user) return;

    fetch(`${import.meta.env.VITE_API_URL}/doctors`)
      .then((res) => res.json())
      .then((doctorsList) => {
        const me = doctorsList.find((d) => d.name === user.name);
        if (!me) {
          setError('Could not find your doctor profile.');
          setLoading(false);
          return;
        }
        setDoctorId(me.id);
        loadData(me.id);
        setLoading(false);
      })
      .catch(() => {
        setError('Could not load your dashboard.');
        setLoading(false);
      });
  }, []);

  const handleAddSlot = async (e) => {
    e.preventDefault();
    setAddError('');
    setAdding(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/doctors/${doctorId}/slots`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slot_date: slotDate, start_time: startTime, end_time: endTime }),
      });

      const data = await res.json();

      if (!res.ok) {
        setAddError(data.error || 'Could not add slot');
        setAdding(false);
        return;
      }

      setSlots((prev) => [...prev, data]);
      setSlotDate('');
      setStartTime('');
      setEndTime('');
      setAdding(false);
    } catch (err) {
      setAddError('Could not connect to the server.');
      setAdding(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <p className="text-slate-500">Please log in as a doctor to view this page.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface px-4 py-10">
      <div className="max-w-3xl mx-auto space-y-10">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 mb-1">Add a Time Slot</h1>
          <p className="text-slate-500 mb-6">Open up a new appointment slot for patients to book</p>

          {addError && (
            <div className="bg-red-50 text-red-600 text-sm px-4 py-2.5 rounded-lg mb-4">
              {addError}
            </div>
          )}

          <form onSubmit={handleAddSlot} className="bg-white rounded-xl shadow-md p-5 flex flex-wrap gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
              <input
                type="date"
                value={slotDate}
                onChange={(e) => setSlotDate(e.target.value)}
                className="px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-doctor"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Start time</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-doctor"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">End time</label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-doctor"
                required
              />
            </div>
            <button
              type="submit"
              disabled={adding}
              className="bg-doctor hover:bg-doctor-dark text-white font-semibold px-5 py-2.5 rounded-lg transition-colors disabled:opacity-60"
            >
              {adding ? 'Adding...' : 'Add Slot'}
            </button>
          </form>
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-800 mb-3">Your Open Slots</h2>
          {slots.length === 0 && <p className="text-slate-500">No open slots yet — add one above.</p>}
          <div className="grid sm:grid-cols-3 gap-3">
            {slots.map((s) => (
              <div key={s.id} className="bg-white rounded-lg shadow-sm p-4 text-sm">
                <p className="font-medium text-slate-800">{s.slot_date}</p>
                <p className="text-slate-500">{s.start_time.slice(0, 5)} - {s.end_time.slice(0, 5)}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-800 mb-3">Your Appointments</h2>
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
    </div>
  );
}

export default DoctorDashboard;