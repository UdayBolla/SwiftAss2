import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();
  return (
    <div className='bg-container'>
    <nav className=" navbar-bg flex items-center justify-between bg-slate-800 px-6 py-3">
      <Link to="/" className="navbar-logo">SWIFT</Link>

      {location.pathname !== '/profile' && (
        <Link to="/profile" className="navbar-profile-link">
          <div className="navbar-profile-avatar">
            EH
          </div>
          <span className="navbar-profile-name">Ervin Howell</span>
        </Link>
      )}
    </nav>
    </div>
  );
}
