import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DoctorSlots from './pages/DoctorSlots';
import Login from './pages/Login';
import Register from './pages/Register';
import Doctors from './pages/Doctors';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/doctors/:id/slots" element={<DoctorSlots />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;