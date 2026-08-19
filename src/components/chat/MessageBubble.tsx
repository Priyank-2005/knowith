import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Bot, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { CardRenderer, AICard } from './AICards/CardRenderer';

export interface MessageProps {
  role: 'user' | 'assistant' | 'system';
  content?: string;
  cards?: AICard[];
  timestamp?: string;
}

export const MessageBubble: React.FC<MessageProps> = ({ role, content, cards, timestamp }) => {
  if (role === 'system') return null;

  const isBot = role === 'assistant';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`flex w-full ${isBot ? 'justify-start' : 'justify-end'} mb-6 group`}
    >
      <div className={`flex max-w-[85%] ${isBot ? 'flex-row' : 'flex-row-reverse'} items-end gap-3`}>
        
        {/* Avatar */}
        <div className={`flex-shrink-0 h-8 w-8 rounded flex items-center justify-center shadow-sm ${isBot ? 'bg-[var(--gold)] text-[var(--ink)]' : 'bg-[var(--ink)] text-[var(--marble)]'}`}>
          {isBot ? <Bot size={18} /> : <User size={18} />}
        </div>

        {/* Bubble */}
        <div className="flex flex-col gap-1">
          <div 
            className={`px-5 py-4 rounded-xl shadow-sm border ${
              isBot 
                ? 'bg-[var(--marble-2)] border-[rgba(11,46,51,0.1)] text-[var(--ink)] rounded-bl-none' 
                : 'bg-[var(--ink)] border-[var(--ink)] text-[var(--marble)] rounded-br-none'
            }`}
          >
            {content && (
              <div className={`prose prose-sm max-w-none ${!isBot ? 'prose-invert text-[var(--marble)]' : 'prose-slate prose-p:leading-relaxed prose-headings:text-[var(--ink)] font-serif text-[15px]'}`}>
                <ReactMarkdown>{content}</ReactMarkdown>
              </div>
            )}
            
            {/* Dynamic AI Cards rendered if structured data exists */}
            {cards && cards.length > 0 && (
              <CardRenderer cards={cards} />
            )}
          </div>
          
          {/* Timestamp (Shows on hover for cleaner UI) */}
          {timestamp && (
            <span className={`text-[10px] font-mono tracking-widest uppercase text-[var(--slate-soft)] opacity-0 group-hover:opacity-100 transition-opacity ${isBot ? 'ml-2 text-left' : 'mr-2 text-right'}`}>
              {new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};
