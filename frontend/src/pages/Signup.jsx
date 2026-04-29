import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Signup = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side validation
    if (!form.name || !form.email || !form.password) {
      setErrors(['Please fill in all fields']);
      return;
    }
    if (form.password !== form.confirmPassword) {
      setErrors(['Passwords do not match']);
      return;
    }
    if (form.password.length < 6) {
      setErrors(['Password must be at least 6 characters']);
      return;
    }

    setIsLoading(true);
    try {
      const { data } = await authAPI.signup({
        name: form.name,
        email: form.email,
        password: form.password,
      });
      login(data.token, data.user);
      toast.success(`Account created! Welcome, ${data.user.name}!`);
      navigate('/dashboard');
    } catch (err) {
      const msgs = err.response?.data?.errors ||
        [err.response?.data?.message || 'Signup failed. Please try again.'];
      setErrors(msgs);
    } finally {
      setIsLoading(false);
    }
  };

  // Password strength indicator
  const getStrength = (pw) => {
    if (!pw) return 0;
    let score = 0;
    if (pw.length >= 6) score++;
    if (pw.length >= 10) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    return score;
  };
  const strength = getStrength(form.password);
  const strengthColors = ['', 'bg-rose-500', 'bg-amber-500', 'bg-amber-400', 'bg-sage-500', 'bg-sage-400'];
  const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-sage-500/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-sm animate-slide-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-9 h-9 bg-sage-500 rounded-xl flex items-center justify-center shadow-lg shadow-sage-500/30">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M2 5h12M2 8h9M2 11h6" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="font-display font-bold text-2xl">TaskFlow</span>
          </div>
          <h1 className="font-display font-bold text-3xl mb-1">Create account</h1>
          <p className="text-ink-500 font-body text-sm">Start managing your tasks today</p>
        </div>

        <div className="card p-6 shadow-2xl shadow-black/30">
          {errors.length > 0 && (
            <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl animate-scale-in">
              {errors.map((e, i) => (
                <p key={i} className="text-rose-400 text-sm font-body">{e}</p>
              ))}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-display font-semibold text-ink-500 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Jane Smith"
                className="input-field"
                autoComplete="name"
              />
            </div>

            <div>
              <label className="block text-xs font-display font-semibold text-ink-500 uppercase tracking-wider mb-1.5">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="input-field"
                autoComplete="email"
              />
            </div>

            <div>
              <label className="block text-xs font-display font-semibold text-ink-500 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Min. 6 characters"
                className="input-field"
                autoComplete="new-password"
              />
              {/* Password strength bar */}
              {form.password && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-all duration-300
                          ${i <= strength ? strengthColors[strength] : 'bg-ink-700'}
                        `}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-ink-500 font-mono">{strengthLabels[strength]}</p>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-display font-semibold text-ink-500 uppercase tracking-wider mb-1.5">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="input-field"
                autoComplete="new-password"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full mt-2 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account...
                </>
              ) : 'Create Account'}
            </button>
          </form>
        </div>

        <p className="text-center mt-5 text-ink-500 text-sm font-body">
          Already have an account?{' '}
          <Link to="/login" className="text-sage-400 hover:text-sage-300 font-medium transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
