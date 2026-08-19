import React, { useEffect, useRef } from 'react';
import { MessageBubble, MessageProps } from './MessageBubble';
import { motion, AnimatePresence } from 'framer-motion';

interface ChatWindowProps {
  messages: MessageProps[];
  isTyping?: boolean;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ messages, isTyping }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isTyping]);

  return (
    <div 
      ref={scrollRef} 
      className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-transparent relative scroll-smooth"
    >
      <div className="max-w-4xl mx-auto flex flex-col justify-end min-h-full pb-6">
        {messages.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="flex-1 flex flex-col items-center justify-center text-[#839F9D] opacity-80 my-20"
          >
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-sm border border-[#E8E2D2]">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#D9B978" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
            </div>
            <p className="text-xs font-mono uppercase tracking-widest text-[#0B2E33]">Start your digital wealth consultation.</p>
          </motion.div>
        ) : (
          <AnimatePresence initial={false}>
            {messages.map((msg, idx) => (
              <MessageBubble 
                key={idx} 
                role={msg.role} 
                content={msg.content} 
                cards={msg.cards} 
                timestamp={msg.timestamp} 
              />
            ))}
          </AnimatePresence>
        )}

        <AnimatePresence>
          {isTyping && (
            <motion.div 
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
              className="flex w-full justify-start mt-2"
            >
              <div className="flex max-w-[85%] items-end gap-3">
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-[#0B2E33] flex items-center justify-center shadow-sm">
                  <span className="flex space-x-1.5">
                    <motion.span 
                      animate={{ y: [0, -4, 0] }} 
                      transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut", delay: 0 }}
                      className="h-1.5 w-1.5 bg-[#D9B978] rounded-full"
                    />
                    <motion.span 
                      animate={{ y: [0, -4, 0] }} 
                      transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                      className="h-1.5 w-1.5 bg-[#D9B978] rounded-full"
                    />
                    <motion.span 
                      animate={{ y: [0, -4, 0] }} 
                      transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
                      className="h-1.5 w-1.5 bg-[#D9B978] rounded-full"
                    />
                  </span>
                </div>
                <div className="px-5 py-4 rounded-2xl bg-white border border-[#E8E2D2] text-[#839F9D] font-mono uppercase tracking-widest text-[10px] rounded-bl-none shadow-sm">
                  Thinking...
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
