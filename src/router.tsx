import { createBrowserRouter } from 'react-router-dom';
import WeeklyView from './pages/WeeklyView';
import Auth from './pages/Auth';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <WeeklyView />,
  },
  {
    path: '/auth',
    element: <Auth />,
  },
]);

