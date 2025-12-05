import { createBrowserRouter } from 'react-router-dom';
import WeeklyView from './pages/WeeklyView';
import PlanEntriesPage from './pages/PlanEntriesPage';
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
    path: '/entries',
    element: (
      <ProtectedRoute>
        <Layout>
          <PlanEntriesPage />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/auth',
    element: <AuthRedirect />,
  },
]);

