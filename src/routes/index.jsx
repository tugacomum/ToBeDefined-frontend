import { BrowserRouter } from 'react-router-dom';

import AuthRoutes from './auth.routes';
import AppRoutes from './app.routes';
import { useAuth } from '../contexts/auth';

export default function Routes() {
    const { user } = useAuth();

    return (
        <BrowserRouter>
            {!user ? <AuthRoutes /> : <AppRoutes />}
        </BrowserRouter>
    );
};
