import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { logOut } from '../firebase/auth';
import { CategoriesList } from '../components/CategoriesList';

function WeeklyView() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logOut();
      navigate('/auth');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1>Weekly View</h1>
          {user && (
            <p style={{ color: '#666' }}>
              Welcome, {user.displayName || user.email}!
            </p>
          )}
        </div>
        <button
          onClick={handleLogout}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Logout
        </button>
      </div>
      <p>This is the main app view where the weekly pie charts will be displayed.</p>
      
      {/* Temporary: Categories list for testing Day 3 functionality */}
      <CategoriesList />
    </div>
  );
}

export default WeeklyView;

