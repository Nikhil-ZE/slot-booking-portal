import { useEffect, useState } from 'react';

const specialtyColors = {
  Cardiologist: 'bg-rose-100 text-rose-700',
  Dermatologist: 'bg-amber-100 text-amber-700',
  Pediatrician: 'bg-emerald-100 text-emerald-700',
};

function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/doctors`)
      .then((res) => res.json())
      .then((data) => {
        setDoctors(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Could not load doctors right now.');
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-surface px-4 py-10">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-800 mb-1">Find a Doctor</h1>
        <p className="text-slate-500 mb-8">Choose a doctor to view available appointment slots</p>

        {loading && <p className="text-slate-500">Loading doctors...</p>}
        {error && <p className="text-red-500">{error}</p>}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow p-6 flex flex-col"
            >
              <div className="w-14 h-14 rounded-full bg-doctor/10 text-doctor flex items-center justify-center font-bold text-xl mb-4">
                {doc.name.split(' ').slice(-1)[0][0]}
              </div>

              <h2 className="text-lg font-semibold text-slate-800">{doc.name}</h2>

              <span
                className={`inline-block w-fit text-xs font-medium px-2.5 py-1 rounded-full mt-2 mb-3 ${
                  specialtyColors[doc.specialty] || 'bg-slate-100 text-slate-700'
                }`}
              >
                {doc.specialty}
              </span>

              <p className="text-sm text-slate-500 flex-1">{doc.bio}</p>

              <button className="mt-5 w-full bg-doctor hover:bg-doctor-dark text-white font-semibold py-2 rounded-lg transition-colors">
                View Slots
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Doctors;