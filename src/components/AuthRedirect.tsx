import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Auth from '../pages/Auth';

export function AuthRedirect() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p>Loading...</p>
      </div>
    );
  }

  if (user) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column', gap: '1rem' }}>
        <p>You are logged in as {user.email}</p>
      </div>
    );
  }

  return <Auth />;
}

