import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const { token, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={{
      background: 'var(--red)',
      color: 'var(--white)',
      padding: '1rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap'
    }}>
      <div style={{ flex: '1', minWidth: '100px' }}>
        <Link to="/landing" style={{ textDecoration: 'none', color: 'var(--white)' }}>
          <h2 style={{ margin: 0 }}>Hijack UMass</h2>
        </Link>
      </div>

      {token && (
        <div style={{ flex: '1', display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <Link to="/" className="red-button">All Rides</Link>
          <Link to="/drivers" className="red-button">Drivers</Link>
          <Link to="/riders" className="red-button">Riders</Link>
          <Link to="/create" className="red-button">Create Post</Link>
          <Link to="/inbox" className="red-button">Inbox</Link>
        </div>
      )}

      {token && (
        <div style={{ flex: '1', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '1rem', minWidth: '150px' }}>
          <span style={{ fontWeight: 'bold' }}>{user?.name || user?.email}</span>
          <button onClick={handleLogout} className="red-button">Log Out</button>
        </div>
      )}

      
    </nav>
  );
}

export default Navbar;
