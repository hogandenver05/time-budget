import { createBrowserRouter } from 'react-router-dom';
import WeeklyView from './pages/WeeklyView';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AuthRedirect } from './components/AuthRedirect';

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <WeeklyView />
      </ProtectedRoute>
    ),
  },
  {
    path: '/auth',
    element: <AuthRedirect />,
  },
]);

