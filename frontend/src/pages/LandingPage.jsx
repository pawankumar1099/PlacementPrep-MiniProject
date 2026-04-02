import React from 'react';
import { Link } from 'react-router-dom';

const companies = ['Google', 'Microsoft', 'Amazon', 'TCS', 'Infosys', 'Wipro', 'Accenture', 'Deloitte', 'Flipkart', 'Uber'];
const features = [
  { icon: '🧠', title: 'AI Resume Analyzer', desc: 'ATS scoring, keyword analysis & actionable feedback powered by Gemini AI' },
  { icon: '🧮', title: 'Aptitude Rounds', desc: 'Company-specific MCQs in quant, logical, verbal, and data interpretation' },
  { icon: '💻', title: 'Coding Challenges', desc: 'Real DSA problems with Monaco Editor, multi-language support & AI evaluation' },
  { icon: '⚙️', title: 'Technical Interview', desc: 'Conversational AI covers DS, Algo, OOP, DBMS, OS & company tech stack' },
  { icon: '🤝', title: 'HR Interview', desc: 'Behavioral STAR-method interview with communication & confidence scoring' },
  { icon: '📊', title: 'Progress Tracking', desc: 'Per-company round tracking, scores history & placement readiness dashboard' },
];

const stats = [
  { value: '50+', label: 'Companies' },
  { value: '6', label: 'Interview Rounds' },
  { value: '100%', label: 'AI Powered' },
  { value: '∞', label: 'Practice Sessions' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-dark-900 overflow-hidden">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 md:px-12 py-5 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-accent-cyan flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-white fill-none stroke-current" strokeWidth="2">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
          <span className="font-bold text-white text-lg">Placement <span className="glow-text">Prep AI</span></span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login" className="btn-ghost hidden sm:inline-flex">Log in</Link>
          <Link to="/signup" className="btn-primary">Get Started Free</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-20 pb-16 px-6 md:px-12 text-center overflow-hidden">
        {/* Background glows */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-radial from-brand-600/20 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-20 left-1/4 w-64 h-64 bg-accent-cyan/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto animate-fade-in">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-brand-500/30 bg-brand-500/10 text-brand-300 text-xs font-semibold mb-6">
            <span className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-pulse" />
            Powered by Google Gemini AI
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-tight mb-6">
            Ace Every <span className="glow-text">Campus Placement</span><br />Round with AI
          </h1>
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Practice aptitude, coding, technical & HR rounds for top companies. Get AI feedback, track your progress, and land your dream job.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/signup" className="btn-primary px-8 py-3.5 text-base shadow-brand-lg">
              Start Practicing Now
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
            </Link>
            <Link to="/login" className="btn-secondary px-8 py-3.5 text-base">Already have an account</Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-10 border-y border-white/5 bg-dark-800/40">
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-3xl md:text-4xl font-extrabold glow-text">{s.value}</p>
              <p className="text-slate-500 text-sm mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Companies ticker */}
      <section className="py-10 overflow-hidden">
        <p className="text-center text-slate-500 text-sm mb-6 tracking-widest uppercase font-medium">Practice for top companies</p>
        <div className="flex gap-4 animate-none overflow-x-auto pb-2 px-6 scrollbar-hide justify-center flex-wrap">
          {companies.map((c) => (
            <div key={c} className="px-5 py-2.5 bg-dark-700 border border-white/8 rounded-xl text-slate-300 text-sm font-semibold whitespace-nowrap hover:border-brand-500/40 hover:text-white transition-all">
              {c}
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 md:px-12 max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">Everything you need to crack placements</h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">AI-powered rounds that mirror real company interview processes</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f) => (
            <div key={f.title} className="card p-6 hover:border-brand-500/30 hover:shadow-card-hover transition-all duration-300 group">
              <div className="text-4xl mb-4">{f.icon}</div>
              <h3 className="text-base font-bold text-white mb-2 group-hover:text-brand-300 transition-colors">{f.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial from-brand-600/10 to-transparent" />
        <div className="relative max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-5">Ready to land your dream job?</h2>
          <p className="text-slate-400 mb-8 text-lg">Sign up free and start your first AI mock interview in minutes.</p>
          <Link to="/signup" className="btn-primary px-10 py-4 text-base shadow-brand-lg">
            Create Free Account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-6 text-center text-slate-600 text-sm">
        © {new Date().getFullYear()} Placement Prep AI. Built for campus placement success.
      </footer>
    </div>
  );
}
