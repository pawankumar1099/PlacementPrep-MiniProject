import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { technicalAPI, progressAPI } from '../services/api';
import ChatBubble, { TypingIndicator } from '../components/ChatBubble';
import ScoreBadge from '../components/ScoreBadge';
import Loader from '../components/Loader';

export default function TechnicalRound() {
  const { companyName } = useParams();
  const company = decodeURIComponent(companyName);

  const [state, setState] = useState('idle'); // idle | starting | chatting | typing | completed
  const [messages, setMessages] = useState([]);
  const [chatLogId, setChatLogId] = useState(null);
  const [input, setInput] = useState('');
  const [questionNumber, setQuestionNumber] = useState(1);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

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
      const res = await technicalAPI.start({ company });
      const { chatLogId: id, message } = res.data.data;
      setChatLogId(id);
      setMessages([{ role: 'assistant', content: message, timestamp: new Date() }]);
      setQuestionNumber(2);
      setState('chatting');
      setTimeout(() => inputRef.current?.focus(), 100);
    } catch (err) {
      setError('Failed to start interview. Please try again.');
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
      const res = await technicalAPI.chat({ chatLogId, userMessage: text, questionNumber });
      const data = res.data.data;

      setMessages(prev => [...prev, { role: 'assistant', content: data.message, timestamp: new Date() }]);

      if (data.isCompleted) {
        setResult({ score: data.score, summary: data.summary });
        await progressAPI.saveRound(company, {
          roundType: 'technical',
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

  // Idle/Start screen
  if (state === 'idle') {
    return (
      <div className="page-container max-w-2xl animate-fade-in">
        <div className="card p-8 text-center">
          <div className="text-6xl mb-4">⚙️</div>
          <h1 className="text-2xl font-extrabold text-white mb-2">Technical Interview</h1>
          <p className="text-slate-400 mb-1">{company} · CS Fundamentals Round</p>
          {error && <p className="text-rose-400 text-sm mt-3">{error}</p>}
          <div className="grid grid-cols-2 gap-3 my-6">
            {[['5', 'Questions'], ['AI', 'Interviewer'], ['Live', 'Feedback'], ['Score', 'Report']].map(([v, l]) => (
              <div key={l} className="card p-3 text-center">
                <p className="text-xl font-bold text-brand-400">{v}</p>
                <p className="text-xs text-slate-500">{l}</p>
              </div>
            ))}
          </div>
          <div className="text-left bg-dark-600 rounded-xl p-4 mb-6 text-sm text-slate-400 space-y-1.5">
            <p>📌 Topics: DS, Algorithms, OOP, DBMS, OS, Networking</p>
            <p>📌 Conversational format — one question at a time</p>
            <p>📌 Take your time to think before answering</p>
            <p>📌 AI evaluates depth, accuracy & clarity</p>
          </div>
          <button onClick={startInterview} className="btn-primary px-10 py-3 text-base">
            Start Interview →
          </button>
        </div>
      </div>
    );
  }

  if (state === 'starting') {
    return <div className="flex justify-center items-center min-h-[60vh]"><Loader size="lg" text="Preparing your technical interview..." /></div>;
  }

  // Completed screen
  if (state === 'completed' && result) {
    return (
      <div className="page-container max-w-2xl animate-fade-in">
        <div className="card p-8 text-center mb-5">
          <div className="text-5xl mb-3">🎉</div>
          <h2 className="text-2xl font-extrabold text-white mb-1">Technical Round Complete!</h2>
          <p className="text-slate-400 mb-5">{company}</p>
          <div className="flex justify-center mb-5"><ScoreBadge score={result.score} size="lg" showLabel /></div>
          <div className="bg-dark-600 rounded-xl p-5 text-left mb-5">
            <p className="text-xs font-semibold text-brand-400 uppercase tracking-wider mb-2">Round Summary</p>
            <p className="text-slate-300 text-sm leading-relaxed">{result.summary}</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <button onClick={startInterview} className="btn-primary">Retry Round</button>
            <Link to={`/company/${encodeURIComponent(company)}`} className="btn-secondary">Back to {company}</Link>
          </div>
        </div>

        {/* Chat history */}
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
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-500 to-accent-cyan flex items-center justify-center text-white font-bold text-sm">AI</div>
          <div>
            <p className="text-sm font-bold text-white">Technical Interviewer</p>
            <p className="text-xs text-slate-500">{company} · Question {questionNumber - 1}/5</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-24 bg-dark-500 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-brand-500 to-accent-cyan rounded-full transition-all" style={{ width: `${Math.min(100, ((questionNumber - 1) / 5) * 100)}%` }} />
          </div>
          <span className="text-xs text-slate-500">{questionNumber - 1}/5</span>
        </div>
      </div>

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
            placeholder="Type your answer here... (Enter to send, Shift+Enter for new line)"
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || state !== 'chatting'}
            className="btn-primary shrink-0 px-4 py-3 self-end"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
        <p className="text-xs text-slate-600 mt-1.5">Press Enter to send · Shift+Enter for new line</p>
      </div>
    </div>
  );
}
