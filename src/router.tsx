import { createBrowserRouter } from 'react-router-dom';
import WeeklyView from './pages/WeeklyView';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AuthRedirect } from './components/AuthRedirect';
import { Layout } from './components/Layout';
import Auth from './pages/Auth';

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Layout>
          <WeeklyView />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/auth',
    element: <AuthRedirect />,
  },
]);

