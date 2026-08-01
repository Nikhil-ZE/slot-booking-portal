import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

function DoctorSlots() {
  const { id } = useParams();
  const [slots, setSlots] = useState([]);
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [selectedSlot, setSelectedSlot] = useState(null);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [address, setAddress] = useState('');
  const [paymentType, setPaymentType] = useState('upi');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/doctors`)
      .then((res) => res.json())
      .then((data) => {
        const found = data.find((d) => String(d.id) === id);
        setDoctor(found);
      });

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

  const openBookingForm = (slot) => {
    setSelectedSlot(slot);
    setFormError('');
    setSuccess(false);
  };

  const closeForm = () => {
    setSelectedSlot(null);
    setName('');
    setAge('');
    setAddress('');
    setPaymentType('upi');
  };

  const handleBook = async (e) => {
    e.preventDefault();
    setFormError('');
    setSubmitting(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slot_id: selectedSlot.id,
          patient_name: name,
          patient_age: age,
          patient_address: address,
          payment_type: paymentType,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setFormError(data.error || 'Could not complete booking');
        setSubmitting(false);
        return;
      }

      setSuccess(true);
      setSubmitting(false);
      setSlots((prev) => prev.filter((s) => s.id !== selectedSlot.id));
    } catch (err) {
      setFormError('Could not connect to the server.');
      setSubmitting(false);
    }
  };

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
              <button
                onClick={() => openBookingForm(slot)}
                className="bg-patient hover:bg-patient-dark text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
              >
                Book
              </button>
            </div>
          ))}
        </div>
      </div>

      {selectedSlot && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center px-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
            {success ? (
              <div className="text-center">
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Booking Confirmed!</h2>
                <p className="text-slate-500 mb-6">
                  Your appointment with {doctor?.name} on {selectedSlot.slot_date} at{' '}
                  {selectedSlot.start_time.slice(0, 5)} is confirmed.
                </p>
                <button
                  onClick={closeForm}
                  className="w-full bg-patient hover:bg-patient-dark text-white font-semibold py-2.5 rounded-lg transition-colors"
                >
                  Done
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-slate-800 mb-1">Book Appointment</h2>
                <p className="text-slate-500 mb-6">
                  {selectedSlot.slot_date} · {selectedSlot.start_time.slice(0, 5)} - {selectedSlot.end_time.slice(0, 5)}
                </p>

                {formError && (
                  <div className="bg-red-50 text-red-600 text-sm px-4 py-2.5 rounded-lg mb-5">
                    {formError}
                  </div>
                )}

                <form onSubmit={handleBook} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Full name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-patient focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Age</label>
                    <input
                      type="number"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      min="0"
                      max="120"
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-patient focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Doctor</label>
                    <input
                      type="text"
                      value={doctor ? `${doctor.name} (${doctor.specialty})` : ''}
                      readOnly
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
                    <textarea
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      rows="2"
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-patient focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Payment type</label>
                    <div className="grid grid-cols-3 gap-2">
                      {['upi', 'cash', 'debit_card'].map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setPaymentType(type)}
                          className={`py-2 rounded-lg border text-sm font-medium transition-colors ${
                            paymentType === type
                              ? 'bg-patient text-white border-patient'
                              : 'border-slate-300 text-slate-600'
                          }`}
                        >
                          {type === 'upi' ? 'UPI' : type === 'cash' ? 'Cash' : 'Debit Card'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={closeForm}
                      className="flex-1 border border-slate-300 text-slate-600 font-semibold py-2.5 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 bg-patient hover:bg-patient-dark text-white font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-60"
                    >
                      {submitting ? 'Booking...' : 'Confirm Booking'}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default DoctorSlots;