import { createBrowserRouter } from 'react-router-dom';
import { AuthRedirect } from './components/AuthRedirect';
import Auth from './pages/Auth';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AuthRedirect />,
  },
  {
    path: '/auth',
    element: <Auth />,
  },
]);

