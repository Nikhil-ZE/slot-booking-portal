import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

function DoctorSlots() {
  const { id } = useParams();
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/doctors/${id}/slots`)
      .then((res) => res.json())
      .then((data) => {
        setSlots(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Could not load slots right now.');
        setLoading(false);
      });
  }, [id]);

  return (
    <div className="min-h-screen bg-surface px-4 py-10">
      <div className="max-w-2xl mx-auto">
        <Link to="/doctors" className="text-doctor text-sm font-medium hover:underline mb-4 inline-block">
          ← Back to doctors
        </Link>

        <h1 className="text-3xl font-bold text-slate-800 mb-1">Available Slots</h1>
        <p className="text-slate-500 mb-8">Choose a time that works for you</p>

        {loading && <p className="text-slate-500">Loading slots...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && slots.length === 0 && (
          <p className="text-slate-500">No open slots for this doctor right now.</p>
        )}

        <div className="grid sm:grid-cols-2 gap-4">
          {slots.map((slot) => (
            <div
              key={slot.id}
              className="bg-white rounded-xl shadow-md p-5 flex items-center justify-between"
            >
              <div>
                <p className="font-semibold text-slate-800">{slot.slot_date}</p>
                <p className="text-sm text-slate-500">
                  {slot.start_time.slice(0, 5)} - {slot.end_time.slice(0, 5)}
                </p>
              </div>
              <button className="bg-patient hover:bg-patient-dark text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
                Book
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DoctorSlots;