import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '../pages/home/home';
import CodeEditorJs from '../pages/poc-codeeditor-js/CodeEditorJs';
import Componets from '../components/components';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/CodeEditorJs" element={<CodeEditorJs />} />
      <Route path='/Components' element={<Componets />} /> {/* apenas para teste de componentes */}
      <Route path="/" element={<Home />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
