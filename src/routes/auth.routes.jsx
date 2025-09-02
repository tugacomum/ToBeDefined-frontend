import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/auth/login';
import Register from '../pages/auth/register';
import ForgotPassword from '../pages/auth/forgotPassword';
import VerifyEmail from '../pages/auth/verifyEmail';
import Terms from '../pages/terms';

export default function AuthRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/forgotPassword" element={<ForgotPassword />} />
      <Route path="/register" element={<Register />} />
      <Route path="/terms" element={<Terms />} />
      <Route path='/verifyEmail' element={<VerifyEmail />} />
      <Route path="*" element={<Navigate to="/loginv2" />} />
    </Routes>
  );
};
