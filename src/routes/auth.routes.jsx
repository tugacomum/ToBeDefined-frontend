import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/auth/login';
import Register from '../pages/auth/register';
import ForgotPassowrd from '../pages/auth/forgotPassword';

export default function AuthRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgotPassword" element={<ForgotPassowrd />} />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
};
