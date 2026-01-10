import { createBrowserRouter } from 'react-router-dom';
import WeeklyView from './pages/WeeklyView';
import ActivitiesPage from './pages/ActivitiesPage';
import DayDetailsPage from './pages/DayDetailsPage';
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
    path: '/activities',
    element: (
      <ProtectedRoute>
        <Layout>
          <ActivitiesPage />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/day/:dayIndex',
    element: (
      <ProtectedRoute>
        <Layout>
          <DayDetailsPage />
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

