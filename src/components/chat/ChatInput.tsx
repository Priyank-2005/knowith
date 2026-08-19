import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
  disabled?: boolean;
  placeholder?: string;
}

export const ChatInput: React.FC<ChatInputProps> = ({ 
  onSend, 
  isLoading, 
  disabled = false,
  placeholder = "Type your message..."
}) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading && !disabled) {
      onSend(input.trim());
      setInput('');
      // Reset height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    // Auto-resize
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  };

  return (
    <div className="px-6 py-4 bg-transparent relative z-20">
      <form onSubmit={handleSubmit} className="relative max-w-4xl mx-auto flex items-end gap-2 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#E8E2D2] p-1.5 transition-shadow focus-within:shadow-[0_8px_30px_rgb(0,0,0,0.08)] focus-within:border-[#D9B978]">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          disabled={disabled || isLoading}
          placeholder={disabled ? "Conversation locked." : placeholder}
          className="flex-1 max-h-32 min-h-[44px] bg-transparent py-3 pl-4 pr-12 resize-none focus:outline-none disabled:opacity-50 transition-all text-[#0B2E33] placeholder:text-[#839F9D] font-medium"
          rows={1}
        />
        
        <button
          type="submit"
          disabled={!input.trim() || isLoading || disabled}
          className={`absolute right-2.5 bottom-2.5 p-2 rounded-xl flex items-center justify-center transition-all duration-300
            ${input.trim() && !isLoading && !disabled 
              ? 'bg-[#0B2E33] text-[#D9B978] shadow-md hover:scale-105' 
              : 'bg-[#F6F3EC] text-[#839F9D]'
            }`}
        >
          {isLoading ? (
            <Loader2 size={18} className="animate-spin text-[#0B2E33]" />
          ) : (
            <Send size={18} className={input.trim() && !isLoading && !disabled ? 'text-[#D9B978] translate-x-0.5 -translate-y-0.5' : ''} />
          )}
        </button>
      </form>
      <div className="max-w-4xl mx-auto text-center mt-3 mb-1">
        <span className="text-[10px] text-[#839F9D] font-mono tracking-widest uppercase">
          Secured by Knowith Capital AI
        </span>
      </div>
    </div>
  );
};
