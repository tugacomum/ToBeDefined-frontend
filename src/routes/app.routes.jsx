import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '../pages/home/home';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
