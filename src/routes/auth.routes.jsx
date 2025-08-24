import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/auth/login';
import Loginv2 from '../pages/auth/loginv2';
import Register from '../pages/auth/register';
import ForgotPassowrd from '../pages/auth/forgotPassword';
import ForgotPasswordv2 from '../pages/auth/forgotPasswordv2';

export default function AuthRoutes() {
  return (
    <Routes>
      <Route path="/loginv2" element={<Loginv2 />} />
      <Route path="/forgotPasswordv2" element={<ForgotPasswordv2 />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgotPassword" element={<ForgotPassowrd />} />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
};
