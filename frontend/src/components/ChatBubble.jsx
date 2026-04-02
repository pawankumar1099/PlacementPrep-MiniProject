import React from 'react';

export function TypingIndicator() {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-accent-cyan flex items-center justify-center shrink-0 text-xs font-bold text-white">AI</div>
      <div className="chat-bubble-ai flex items-center gap-1.5 py-3.5">
        <div className="w-2 h-2 bg-brand-400 rounded-full typing-dot" />
        <div className="w-2 h-2 bg-brand-400 rounded-full typing-dot" />
        <div className="w-2 h-2 bg-brand-400 rounded-full typing-dot" />
      </div>
    </div>
  );
}

export default function ChatBubble({ role, content, timestamp }) {
  const isAI = role === 'assistant';

  return (
    <div className={`flex items-start gap-3 animate-slide-up ${isAI ? '' : 'flex-row-reverse'}`}>
      {/* Avatar */}
      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold text-white ${
        isAI ? 'bg-gradient-to-br from-brand-500 to-accent-cyan' : 'bg-gradient-to-br from-slate-600 to-slate-500'
      }`}>
        {isAI ? 'AI' : 'You'}
      </div>

      {/* Bubble */}
      <div className={isAI ? 'chat-bubble-ai' : 'chat-bubble-user'}>
        <p className="whitespace-pre-wrap leading-relaxed">{content}</p>
        {timestamp && (
          <p className={`text-xs mt-1.5 ${isAI ? 'text-slate-500' : 'text-brand-200'}`}>
            {new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        )}
      </div>
    </div>
  );
}
