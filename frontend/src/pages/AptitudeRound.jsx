import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { aptitudeAPI, progressAPI } from '../services/api';
import ScoreBadge from '../components/ScoreBadge';
import Loader from '../components/Loader';

const CATEGORY_COLORS = {
  'Quantitative': 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  'Logical Reasoning': 'text-brand-400 bg-brand-500/10 border-brand-500/20',
  'Verbal Ability': 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  'Data Interpretation': 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
};

export default function AptitudeRound() {
  const { companyName } = useParams();
  const company = decodeURIComponent(companyName);
  const navigate = useNavigate();

  const [state, setState] = useState('loading'); // loading | ready | answering | submitted | result
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [result, setResult] = useState(null);
  const [timer, setTimer] = useState(0);
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 min
  const [error, setError] = useState('');

  const fetchQuestions = useCallback(async () => {
    setState('loading');
    setError('');
    try {
      const res = await aptitudeAPI.getQuestions(company);
      setQuestions(res.data.data.questions || []);
      setAnswers({});
      setCurrentIndex(0);
      setTimeLeft(25 * 60);
      setState('ready');
    } catch (err) {
      setError('Failed to load questions. Please try again.');
      setState('ready');
    }
  }, [company]);

  useEffect(() => { fetchQuestions(); }, [fetchQuestions]);

  // Countdown timer
  useEffect(() => {
    if (state !== 'answering') return;
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { clearInterval(interval); handleSubmit(); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [state]);

  const handleSelect = (optionLetter) => {
    setAnswers(prev => ({ ...prev, [currentIndex]: optionLetter }));
  };

  const handleSubmit = async () => {
    setState('loading');
    try {
      const answersArray = questions.map((_, i) => answers[i] || '');
      const res = await aptitudeAPI.submit({ questions, answers: answersArray });
      const data = res.data.data;
      setResult(data);

      await progressAPI.saveRound(company, {
        roundType: 'aptitude',
        score: data.score,
        feedback: data.feedback,
        details: { correct: data.correct, total: data.total },
      });

      setState('result');
    } catch (err) {
      setError('Failed to submit. Please try again.');
      setState('answering');
    }
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const answered = Object.keys(answers).length;
  const q = questions[currentIndex];

  if (state === 'loading') return <div className="flex justify-center items-center min-h-[60vh]"><Loader size="lg" text="Generating AI questions for you..." /></div>;

  // Result screen
  if (state === 'result' && result) {
    return (
      <div className="page-container max-w-3xl animate-fade-in">
        <div className="card p-8 text-center mb-6">
          <h2 className="text-2xl font-extrabold text-white mb-2">Aptitude Round Complete!</h2>
          <p className="text-slate-400 mb-6">{company} · {result.total} Questions</p>
          <div className="flex justify-center mb-6"><ScoreBadge score={result.score} size="lg" showLabel /></div>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="card p-3 text-center">
              <p className="text-2xl font-bold text-emerald-400">{result.correct}</p>
              <p className="text-xs text-slate-500">Correct</p>
            </div>
            <div className="card p-3 text-center">
              <p className="text-2xl font-bold text-rose-400">{result.total - result.correct}</p>
              <p className="text-xs text-slate-500">Wrong</p>
            </div>
            <div className="card p-3 text-center">
              <p className="text-2xl font-bold text-brand-400">{result.score}%</p>
              <p className="text-xs text-slate-500">Score</p>
            </div>
          </div>
          <p className="text-slate-300 text-sm mb-6 bg-dark-600 rounded-xl p-4">{result.feedback}</p>
          <div className="flex flex-wrap justify-center gap-3">
            <button onClick={fetchQuestions} className="btn-primary">Try Again</button>
            <Link to={`/company/${encodeURIComponent(company)}`} className="btn-secondary">Back to {company}</Link>
          </div>
        </div>

        {/* Detailed results */}
        <div className="space-y-3">
          <h3 className="section-title">Question Review</h3>
          {result.results?.map((r, i) => (
            <div key={i} className={`card p-4 border ${r.isCorrect ? 'border-emerald-500/20' : 'border-rose-500/20'}`}>
              <div className="flex items-start gap-3">
                <span className={`text-lg ${r.isCorrect ? '✅' : '❌'}`}>{r.isCorrect ? '✅' : '❌'}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-200 font-medium mb-2">{r.question}</p>
                  <div className="flex flex-wrap gap-3 text-xs">
                    <span className="text-slate-500">Your: <span className={r.isCorrect ? 'text-emerald-400 font-semibold' : 'text-rose-400 font-semibold'}>{r.userAnswer || 'Not answered'}</span></span>
                    {!r.isCorrect && <span className="text-slate-500">Correct: <span className="text-emerald-400 font-semibold">{r.correctAnswer}</span></span>}
                  </div>
                  {r.explanation && <p className="text-xs text-slate-500 mt-2 bg-dark-600 rounded-lg p-2">{r.explanation}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Ready/Instruction screen
  if (state === 'ready') {
    return (
      <div className="page-container max-w-2xl animate-fade-in">
        <div className="card p-8 text-center">
          <div className="text-6xl mb-4">🧮</div>
          <h1 className="text-2xl font-extrabold text-white mb-2">Aptitude Round</h1>
          <p className="text-slate-400 mb-1">{company} Placement Test</p>
          {error && <p className="text-rose-400 text-sm mt-2 mb-4">{error}</p>}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-6">
            {[['15', 'Questions'], ['25', 'Minutes'], ['4', 'Categories'], ['MCQ', 'Format']].map(([v, l]) => (
              <div key={l} className="card p-3 text-center">
                <p className="text-xl font-bold text-brand-400">{v}</p>
                <p className="text-xs text-slate-500">{l}</p>
              </div>
            ))}
          </div>
          <div className="text-left bg-dark-600 rounded-xl p-4 mb-6 text-sm text-slate-400 space-y-1">
            <p>📌 Select one answer per question</p>
            <p>📌 All questions carry equal marks</p>
            <p>📌 No negative marking</p>
            <p>📌 AI will evaluate your answers with explanations</p>
          </div>
          {questions.length > 0 ? (
            <button onClick={() => setState('answering')} className="btn-primary px-10 py-3 text-base">
              Start Test →
            </button>
          ) : (
            <button onClick={fetchQuestions} className="btn-primary px-10 py-3 text-base">
              Load Questions
            </button>
          )}
        </div>
      </div>
    );
  }

  // Quiz screen
  return (
    <div className="page-container max-w-2xl animate-fade-in">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="text-sm text-slate-400">
          <span className="text-white font-semibold">{answered}</span>/{questions.length} answered
        </div>
        <div className={`font-mono text-lg font-bold px-4 py-1.5 rounded-xl border ${timeLeft < 300 ? 'text-rose-400 border-rose-500/30 bg-rose-500/10' : 'text-brand-400 border-brand-500/30 bg-brand-500/10'}`}>
          ⏱ {formatTime(timeLeft)}
        </div>
        <div className="text-sm text-slate-400">Q {currentIndex + 1}/{questions.length}</div>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-dark-500 rounded-full mb-6 overflow-hidden">
        <div className="h-full bg-gradient-to-r from-brand-500 to-accent-cyan rounded-full transition-all" style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }} />
      </div>

      {/* Question */}
      {q && (
        <div className="card p-6 mb-4">
          <div className="flex items-center gap-2 mb-4">
            <span className={`badge border text-xs ${CATEGORY_COLORS[q.category] || 'text-slate-400 bg-slate-500/10 border-white/10'}`}>{q.category}</span>
            <span className="text-xs text-slate-500">Question {currentIndex + 1}</span>
          </div>
          <p className="text-white font-medium leading-relaxed mb-5">{q.question}</p>
          <div className="space-y-2.5">
            {q.options?.map((opt) => {
              const letter = opt.charAt(0);
              const selected = answers[currentIndex] === letter;
              return (
                <button
                  key={letter}
                  onClick={() => handleSelect(letter)}
                  className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all ${
                    selected
                      ? 'bg-brand-600/20 border-brand-500/60 text-white font-semibold shadow-brand'
                      : 'bg-dark-600 border-white/8 text-slate-300 hover:border-brand-500/30 hover:bg-brand-500/5'
                  }`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between gap-3">
        <button onClick={() => setCurrentIndex(i => Math.max(0, i - 1))} disabled={currentIndex === 0} className="btn-secondary">
          ← Prev
        </button>

        {/* Question dots */}
        <div className="flex gap-1 flex-wrap justify-center max-w-xs">
          {questions.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`w-6 h-6 rounded text-xs font-semibold transition-all ${
                i === currentIndex ? 'bg-brand-600 text-white' :
                answers[i] ? 'bg-emerald-500/30 text-emerald-400 border border-emerald-500/30' :
                'bg-dark-500 text-slate-600 border border-white/8'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>

        {currentIndex < questions.length - 1 ? (
          <button onClick={() => setCurrentIndex(i => i + 1)} className="btn-secondary">
            Next →
          </button>
        ) : (
          <button onClick={handleSubmit} className="btn-primary">
            Submit Test ✓
          </button>
        )}
      </div>

      {error && <p className="text-rose-400 text-sm text-center mt-4">{error}</p>}
    </div>
  );
}
