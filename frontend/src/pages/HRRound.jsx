import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { hrAPI, progressAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import ChatBubble, { TypingIndicator } from '../components/ChatBubble';
import ScoreBadge from '../components/ScoreBadge';
import Loader from '../components/Loader';

const STAR_TIPS = [
  { label: 'Situation', color: 'text-cyan-400', tip: 'Set the context' },
  { label: 'Task', color: 'text-brand-400', tip: 'Your responsibility' },
  { label: 'Action', color: 'text-amber-400', tip: 'What you did' },
  { label: 'Result', color: 'text-emerald-400', tip: 'The outcome' },
];

export default function HRRound() {
  const { companyName } = useParams();
  const company = decodeURIComponent(companyName);
  const { user } = useAuth();

  const [state, setState] = useState('idle');
  const [messages, setMessages] = useState([]);
  const [chatLogId, setChatLogId] = useState(null);
  const [input, setInput] = useState('');
  const [questionNumber, setQuestionNumber] = useState(1);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [showTips, setShowTips] = useState(false);

  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, state]);

  const startInterview = useCallback(async () => {
    setState('starting');
    setError('');
    setMessages([]);
    setResult(null);
    try {
      const res = await hrAPI.start({ company });
      const { chatLogId: id, message } = res.data.data;
      setChatLogId(id);
      setMessages([{ role: 'assistant', content: message, timestamp: new Date() }]);
      setQuestionNumber(2);
      setState('chatting');
      setTimeout(() => inputRef.current?.focus(), 100);
    } catch (err) {
      setError('Failed to start HR interview. Please try again.');
      setState('idle');
    }
  }, [company]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || state === 'typing') return;

    const userMsg = { role: 'user', content: text, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setState('typing');

    try {
      const res = await hrAPI.chat({ chatLogId, userMessage: text, questionNumber });
      const data = res.data.data;

      setMessages(prev => [...prev, { role: 'assistant', content: data.message, timestamp: new Date() }]);

      if (data.isCompleted) {
        setResult({ score: data.score, summary: data.summary });
        await progressAPI.saveRound(company, {
          roundType: 'hr',
          score: data.score,
          feedback: data.summary,
          details: { questionsAsked: questionNumber - 1 },
        });
        setState('completed');
      } else {
        setQuestionNumber(data.questionNumber || questionNumber + 1);
        setState('chatting');
        setTimeout(() => inputRef.current?.focus(), 100);
      }
    } catch (err) {
      setError('Failed to send message. Please try again.');
      setState('chatting');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Idle screen
  if (state === 'idle') {
    return (
      <div className="page-container max-w-2xl animate-fade-in">
        <div className="card p-8 text-center">
          <div className="text-6xl mb-4">🤝</div>
          <h1 className="text-2xl font-extrabold text-white mb-2">HR Interview</h1>
          <p className="text-slate-400 mb-1">{company} · Behavioral Round</p>
          {error && <p className="text-rose-400 text-sm mt-3">{error}</p>}

          {/* STAR method */}
          <div className="my-6 p-4 bg-dark-600 rounded-xl border border-white/8">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">STAR Method — Use it for behavioral answers</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {STAR_TIPS.map(s => (
                <div key={s.label} className="text-center p-2.5 bg-dark-500 rounded-lg">
                  <p className={`font-bold text-sm ${s.color}`}>{s.label}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{s.tip}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="text-left bg-dark-600 rounded-xl p-4 mb-6 text-sm text-slate-400 space-y-1.5">
            <p>📌 6 behavioral/situational questions</p>
            <p>📌 Topics: Intro, Strengths, Teamwork, Why {company}, Goals</p>
            <p>📌 Evaluated on: Communication, Confidence & STAR usage</p>
            <p>📌 Be genuine, specific, and structured</p>
          </div>

          <button onClick={startInterview} className="btn-primary px-10 py-3 text-base">
            Start HR Interview →
          </button>
        </div>
      </div>
    );
  }

  if (state === 'starting') {
    return <div className="flex justify-center items-center min-h-[60vh]"><Loader size="lg" text="Preparing your HR interview..." /></div>;
  }

  // Completed screen
  if (state === 'completed' && result) {
    return (
      <div className="page-container max-w-2xl animate-fade-in">
        <div className="card p-8 text-center mb-5">
          <div className="text-5xl mb-3">🎊</div>
          <h2 className="text-2xl font-extrabold text-white mb-1">HR Round Complete!</h2>
          <p className="text-slate-400 mb-5">{company}</p>
          <div className="flex justify-center mb-5"><ScoreBadge score={result.score} size="lg" showLabel /></div>

          {/* Score breakdown */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
            {[
              { label: 'Communication', pct: 30, color: 'bg-cyan-500' },
              { label: 'Confidence', pct: 20, color: 'bg-brand-500' },
              { label: 'STAR Method', pct: 25, color: 'bg-amber-500' },
              { label: 'Cultural Fit', pct: 25, color: 'bg-emerald-500' },
            ].map(item => (
              <div key={item.label} className="card p-2 text-center">
                <div className={`w-1.5 h-8 ${item.color} rounded-full mx-auto mb-1.5`} style={{ height: `${(result.score / 100) * 32}px` }} />
                <p className="text-xs text-slate-500">{item.label}</p>
              </div>
            ))}
          </div>

          <div className="bg-dark-600 rounded-xl p-5 text-left mb-5">
            <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2">HR Evaluation Summary</p>
            <p className="text-slate-300 text-sm leading-relaxed">{result.summary}</p>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            <button onClick={startInterview} className="btn-primary">Retry Round</button>
            <Link to={`/company/${encodeURIComponent(company)}`} className="btn-secondary">Back to {company}</Link>
          </div>
        </div>

        {/* Transcript */}
        <div className="card p-5">
          <p className="text-sm font-semibold text-slate-400 mb-4">Interview Transcript</p>
          <div className="space-y-4 max-h-80 overflow-y-auto chat-scroll pr-1">
            {messages.map((m, i) => <ChatBubble key={i} role={m.role} content={m.content} />)}
          </div>
        </div>
      </div>
    );
  }

  // Chat interface
  return (
    <div className="flex flex-col h-[calc(100vh-64px)] max-w-3xl mx-auto">
      {/* Header */}
      <div className="px-5 py-3 border-b border-white/8 bg-dark-800/80 backdrop-blur-xl flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-bold text-sm">HR</div>
          <div>
            <p className="text-sm font-bold text-white">HR Interviewer</p>
            <p className="text-xs text-slate-500">{company} · Question {questionNumber - 1}/6</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowTips(!showTips)}
            className={`btn-ghost text-xs ${showTips ? 'text-brand-400' : 'text-slate-500'}`}
          >
            💡 STAR
          </button>
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-24 bg-dark-500 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all" style={{ width: `${Math.min(100, ((questionNumber - 1) / 6) * 100)}%` }} />
            </div>
            <span className="text-xs text-slate-500">{questionNumber - 1}/6</span>
          </div>
        </div>
      </div>

      {/* STAR tips panel */}
      {showTips && (
        <div className="shrink-0 px-5 py-3 bg-dark-700/80 border-b border-white/8 grid grid-cols-4 gap-2">
          {STAR_TIPS.map(s => (
            <div key={s.label} className="text-center">
              <p className={`text-xs font-bold ${s.color}`}>{s.label}</p>
              <p className="text-xs text-slate-600">{s.tip}</p>
            </div>
          ))}
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto chat-scroll p-5 space-y-4">
        {messages.map((m, i) => <ChatBubble key={i} role={m.role} content={m.content} timestamp={m.timestamp} />)}
        {state === 'typing' && <TypingIndicator />}
        {error && <p className="text-rose-400 text-xs text-center">{error}</p>}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="shrink-0 p-4 border-t border-white/8 bg-dark-800/60 backdrop-blur-xl">
        <div className="flex gap-3 items-end">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={3}
            disabled={state !== 'chatting'}
            className="input-field flex-1 resize-none text-sm leading-relaxed"
            placeholder="Type your answer... Use the STAR method for behavioral questions (Enter to send)"
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || state !== 'chatting'}
            className="btn-primary shrink-0 px-4 py-3 self-end bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
        <p className="text-xs text-slate-600 mt-1.5">Enter to send · Shift+Enter for new line · Toggle 💡 STAR for tips</p>
      </div>
    </div>
  );
}
