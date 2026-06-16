/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Send, 
  MessageSquare, 
  User, 
  Bot, 
  X,
  RefreshCw,
  HelpCircle,
  Lightbulb
} from 'lucide-react';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  isCustomStatus?: boolean;
}

interface AIAssistantProps {
  isDarkMode: boolean;
}

export default function AIAssistant({
  isDarkMode
}: AIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "assistant",
      text: "Olá! Sou o assistente de IA da Família Kinjango. Posso ajudá-lo a encontrar membros da família, verificar dotes, responder sobre a saúde familiar, auditar finanças ou calcular o Índice de Progresso (FPI)."
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Quick preset questions recommended by PM
  const presets = [
    "Resuma a situação financeira da família",
    "Quem necessita de suporte de saúde urgente?",
    "Quem são os patriarcas da família?",
    "Como calcular o Índice de Desenvolvimento (FPI)?"
  ];

  // Auto-scroll on new messages
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMsgId = Date.now().toString();
    const userMsg: Message = {
      id: userMsgId,
      sender: 'user',
      text: textToSend
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'aistudio-build'
        },
        body: JSON.stringify({ query: textToSend })
      });

      if (!response.ok) {
        throw new Error("Erro de conexão com o servidor de IA");
      }

      const data = await response.json();
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'assistant',
          text: data.reply
        }
      ]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'assistant',
          text: "Pedimos desculpa. Não conseguimos estabelecer contacto com o assistente inteligente neste momento. Por favor verifique as chaves ou tente mais tarde."
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Sparkle AI button in bottom corner */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-indigo-600 hover:bg-indigo-700 text-white p-4 h-14 w-14 rounded-full shadow-2xl flex items-center justify-center cursor-pointer transition-all hover:scale-110 duration-200"
        title="Assistente de IA Familiar"
      >
        <Sparkles size={22} className="animate-pulse" />
      </button>

      {/* Side Slide Drawer Panel */}
      {isOpen && (
        <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[420px] shadow-2xl flex flex-col font-sans border-l border-zinc-800/80 animate-slide-left">
          
          {/* Header */}
          <div className={`p-4 flex items-center justify-between border-b ${
            isDarkMode ? 'bg-zinc-950 border-zinc-900 text-zinc-100' : 'bg-indigo-900 border-indigo-950 text-white'
          }`}>
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-amber-400 animate-pulse" />
              <div>
                <h4 className="text-sm font-bold">Kinjango AI Assistant</h4>
                <p className="text-[10px] opacity-80">Sugerir melhorias e respostas inteligentes</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1 rounded hover:opacity-80 text-white cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages Area */}
          <div className={`flex-1 p-4 overflow-y-auto space-y-4 text-xs ${
            isDarkMode ? 'bg-zinc-900' : 'bg-slate-50'
          }`}>
            {messages.map((m) => (
              <div 
                key={m.id} 
                className={`flex gap-2.5 max-w-[85%] ${
                  m.sender === 'user' ? 'ml-auto flex-row-reverse' : ''
                }`}
              >
                <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                  m.sender === 'user' 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-zinc-800 text-amber-400'
                }`}>
                  {m.sender === 'user' ? <User size={14} /> : <Bot size={14} />}
                </div>

                <div className={`p-3.5 rounded-2xl leading-relaxed whitespace-pre-line ${
                  m.sender === 'user'
                    ? 'bg-indigo-600 text-white rounded-tr-none'
                    : isDarkMode ? 'bg-zinc-950 text-zinc-200 border border-zinc-800/60 rounded-tl-none' : 'bg-white text-zinc-800 border border-slate-100 shadow-xs rounded-tl-none'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-2.5 max-w-[85%]">
                <div className="w-7 h-7 rounded-full bg-zinc-800 text-amber-400 flex items-center justify-center animate-spin">
                  <RefreshCw size={13} />
                </div>
                <div className={`p-3 rounded-2xl italic text-[11px] ${
                  isDarkMode ? 'bg-zinc-950/40 text-zinc-500' : 'bg-white text-slate-400'
                }`}>
                  Fretando canais de IA para formular a resposta...
                </div>
              </div>
            )}
            <div ref={scrollRef}></div>
          </div>

          {/* Quick presets helper */}
          {messages.length < 3 && (
            <div className={`p-3 space-y-1.5 border-t text-[11px] ${
              isDarkMode ? 'bg-zinc-950 border-zinc-900' : 'bg-white border-slate-200'
            }`}>
              <div className="flex items-center gap-1.5 text-zinc-400 mb-2">
                <Lightbulb size={13} className="text-amber-400" />
                <span className="font-semibold uppercase tracking-wider text-[9px] font-mono">Sugestões de Perguntas</span>
              </div>
              <div className="grid grid-cols-1 gap-1.5">
                {presets.map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(preset)}
                    className={`text-left p-2 rounded-lg border hover:border-indigo-500 hover:text-white hover:bg-indigo-600/10 text-xs transition-all cursor-pointer ${
                      isDarkMode ? 'border-zinc-800 bg-zinc-900/40 text-zinc-400' : 'border-slate-100 bg-slate-50'
                    }`}
                  >
                    "{preset}"
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Footer Input Area */}
          <div className={`p-3 border-t flex gap-2 ${
            isDarkMode ? 'bg-zinc-950 border-zinc-900' : 'bg-white border-slate-200'
          }`}>
            <textarea
              rows={1}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(inputValue);
                }
              }}
              placeholder="Escreva sua pergunta ou melhoria..."
              className={`flex-1 px-3 py-2 text-xs rounded-xl border focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none max-h-24 ${
                isDarkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-slate-50 border-slate-100 text-zinc-800'
              }`}
            />
            <button
              onClick={() => handleSendMessage(inputValue)}
              disabled={!inputValue.trim() || isLoading}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white h-9 w-9 rounded-xl flex items-center justify-center cursor-pointer select-none shrink-0"
            >
              <Send size={15} />
            </button>
          </div>

        </div>
      )}
    </>
  );
}
