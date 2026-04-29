import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <header className="border-b border-ink-700 bg-ink-900/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-sage-500 rounded-lg flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 4h10M2 7h7M2 10h5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="font-display font-bold text-lg tracking-tight">TaskFlow</span>
        </div>

        {/* User info + logout */}
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-display font-semibold text-white leading-tight">{user?.name}</p>
            <p className="text-xs text-ink-500 font-mono">{user?.email}</p>
          </div>
          <div className="w-8 h-8 bg-sage-500/20 border border-sage-500/30 rounded-full flex items-center justify-center">
            <span className="text-sage-400 font-display font-bold text-sm">
              {user?.name?.[0]?.toUpperCase()}
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="text-ink-500 hover:text-white transition-colors text-sm font-medium font-body"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
