import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function SignupPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', college: '', branch: '', graduationYear: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      await signup(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 6 }, (_, i) => currentYear + i);

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center px-4 py-10 relative overflow-hidden">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-radial from-brand-600/12 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-lg animate-slide-up">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-accent-cyan flex items-center justify-center shadow-brand">
              <svg viewBox="0 0 24 24" className="w-6 h-6 text-white fill-none stroke-current" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <span className="font-bold text-xl text-white">Placement <span className="glow-text">Prep AI</span></span>
          </Link>
          <h1 className="text-2xl font-bold text-white mb-1">Create your account</h1>
          <p className="text-slate-500 text-sm">Start preparing for campus placements today</p>
        </div>

        <div className="card p-8">
          {error && (
            <div className="mb-5 px-4 py-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm flex items-center gap-2">
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Full Name *</label>
                <input type="text" name="name" value={form.name} onChange={handleChange} className="input-field" placeholder="Your full name" required />
              </div>
              <div>
                <label className="label">Email Address *</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} className="input-field" placeholder="you@example.com" required />
              </div>
            </div>

            <div>
              <label className="label">Password *</label>
              <input type="password" name="password" value={form.password} onChange={handleChange} className="input-field" placeholder="Minimum 6 characters" required />
            </div>

            <div>
              <label className="label">College / University</label>
              <input type="text" name="college" value={form.college} onChange={handleChange} className="input-field" placeholder="e.g. IIT Bombay, NIT Trichy" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Branch / Department</label>
                <input type="text" name="branch" value={form.branch} onChange={handleChange} className="input-field" placeholder="e.g. CSE, ECE, IT" />
              </div>
              <div>
                <label className="label">Graduation Year</label>
                <select name="graduationYear" value={form.graduationYear} onChange={handleChange} className="input-field">
                  <option value="">Select year</option>
                  {years.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base mt-2">
              {loading ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Creating account...</>
              ) : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-slate-500 text-sm mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-400 hover:text-brand-300 font-semibold transition-colors">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
