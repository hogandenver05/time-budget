import { createBrowserRouter } from 'react-router-dom';
import WeeklyView from './pages/WeeklyView';
import PlanEntriesPage from './pages/PlanEntriesPage';
import ProfilePage from './pages/ProfilePage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AuthRedirect } from './components/AuthRedirect';
import { Layout } from './components/Layout';

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
    path: '/profile',
    element: (
      <ProtectedRoute>
        <Layout>
          <ProfilePage />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/auth',
    element: <AuthRedirect />,
  },
]);

