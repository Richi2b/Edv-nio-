/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Payment, 
  FamilyEvent, 
  Notice, 
  FamilyMember, 
  UserRole 
} from '../types';
import { 
  DollarSign, 
  Calendar, 
  MessageSquare, 
  Plus, 
  Printer, 
  CheckCircle, 
  Award,
  AlertOctagon, 
  User, 
  MessageCircle,
  Clock,
  ChevronRight,
  Smile,
  X
} from 'lucide-react';

interface FinanceCalendarProps {
  payments: Payment[];
  setPayments: (p: Payment[]) => void;
  events: FamilyEvent[];
  setEvents: (e: FamilyEvent[]) => void;
  notices: Notice[];
  setNotices: (n: Notice[]) => void;
  members: FamilyMember[];
  activeRole: UserRole;
  isDarkMode: boolean;
}

export default function FinanceCalendar({
  payments,
  setPayments,
  events,
  setEvents,
  notices,
  setNotices,
  members,
  activeRole,
  isDarkMode
}: FinanceCalendarProps) {
  const [activeSegment, setActiveSegment] = useState<'finance' | 'calendar' | 'mural'>('finance');

  // VIEW RECEIPT MODAL STATE
  const [activeReceipt, setActiveReceipt] = useState<Payment | null>(null);

  // FORM STATS - FINANCE
  const [isPayFormOpen, setIsPayFormOpen] = useState(false);
  const [payMemberId, setPayMemberId] = useState('');
  const [payMonth, setPayMonth] = useState('2026-06');
  const [payAmount, setPayAmount] = useState('10000');
  const [payFine, setPayFine] = useState(false);

  // FORM STATS - CALENDAR
  const [isEventFormOpen, setIsEventFormOpen] = useState(false);
  const [evtTitle, setEvtTitle] = useState('');
  const [evtDesc, setEvtDesc] = useState('');
  const [evtDate, setEvtDate] = useState('2026-06-16');
  const [evtType, setEvtType] = useState<FamilyEvent['type']>('Reunião');
  const [evtLoc, setEvtLoc] = useState('');

  // FORM STATS - MURAL
  const [isNoticeFormOpen, setIsNoticeFormOpen] = useState(false);
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeContent, setNoticeContent] = useState('');

  // Comments state inside post
  const [commentTextState, setCommentTextState] = useState<Record<string, string>>({});

  // Helper name map
  const getMemberName = (id: string) => {
    return members.find(m => m.id === id)?.fullName || 'N/A';
  };

  const getMemberDetails = (id: string) => {
    return members.find(m => m.id === id);
  };

  // --- 1. FINANCIAL REGISTRY ACTION ---
  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payMemberId || !payMonth) return;

    const selectedM = getMemberDetails(payMemberId);
    const amountVal = parseFloat(payAmount);
    const hasFineCharge = payFine;
    const fineAmountVal = hasFineCharge ? 1500 : 0;

    const newPayment: Payment = {
      id: "pay" + (payments.length + 1),
      memberId: payMemberId,
      memberName: selectedM?.fullName || 'Desconhecido',
      month: payMonth,
      amount: amountVal + fineAmountVal,
      paidAt: new Date().toISOString().split('T')[0],
      receiptNumber: `REC-2026-0${100 + payments.length}`,
      hasFine: hasFineCharge,
      fineAmount: fineAmountVal
    };

    setPayments([...payments, newPayment]);
    setIsPayFormOpen(false);
  };

  // --- 2. CALENDAR EVENTS ACTION ---
  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!evtTitle || !evtDate) return;

    const newEvt: FamilyEvent = {
      id: "evt" + (events.length + 1),
      title: evtTitle,
      description: evtDesc,
      date: evtDate,
      type: evtType,
      location: evtLoc || "Virtual Teams"
    };

    setEvents([...events, newEvt]);
    setIsEventFormOpen(false);
    setEvtTitle('');
    setEvtDesc('');
    setEvtLoc('');
  };

  // --- 3. NEWS FEED POSTS ---
  const handleAddNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeTitle || !noticeContent) return;

    // Secretary or Admin
    const rep = members.find(m => m.id === 'm5') || members[0]; // Teresa

    const newNotice: Notice = {
      id: "not" + (notices.length + 1),
      title: noticeTitle,
      content: noticeContent,
      authorName: rep.fullName,
      authorRole: activeRole === UserRole.SUPER_ADMIN ? 'Super Administrador' : 'Conselho Securitário',
      publishedAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
      reactions: { "❤️": 1, "👍": 2 },
      comments: []
    };

    setNotices([newNotice, ...notices]);
    setIsNoticeFormOpen(false);
    setNoticeTitle('');
    setNoticeContent('');
  };

  // Emoji comment reaction clicker
  const handleEmojiReaction = (noticeId: string, emoji: string) => {
    const updated = notices.map(n => {
      if (n.id === noticeId) {
        const reactionsCopy = { ...n.reactions };
        reactionsCopy[emoji] = (reactionsCopy[emoji] || 0) + 1;
        return { ...n, reactions: reactionsCopy };
      }
      return n;
    });
    setNotices(updated);
  };

  // Comment submission inside walls
  const handleSubmitComment = (noticeId: string) => {
    const text = commentTextState[noticeId];
    if (!text) return;

    const updated = notices.map(n => {
      if (n.id === noticeId) {
        return {
          ...n,
          comments: [
            ...n.comments,
            {
              id: "c" + (n.comments.length + 1),
              authorName: activeRole === UserRole.SUPER_ADMIN ? 'Moderador / Admin' : 'Familiar Kinjango',
              content: text,
              timestamp: new Date().toISOString().slice(11, 16)
            }
          ]
        };
      }
      return n;
    });

    setNotices(updated);
    setCommentTextState(prev => ({ ...prev, [noticeId]: '' }));
  };

  // DYNAMIC CALCULATIONS - DEBTORS & PAYMENTS
  // Active paying adults
  const payingAdultIds = members.filter(m => !m.isDeceased && m.id !== 'm11').map(m => m.id);

  // Expected quotas for current active months Mar, Apr, May 2026.
  // In our mock, Teresa is unpaid for may (has late payment paid late pay19), Jandira/Aline are unpaid.
  // Let's list a stateful calculated list of devedores (members who haven't paid May 2026 yet)
  const currentMonthValue = "2026-05";
  const paidMembersForMay = payments.filter(p => p.month === currentMonthValue).map(p => p.memberId);
  const debtorsList = members.filter(m => !m.isDeceased && m.id !== 'm11' && m.id !== 'm1' && m.id !== 'm2' && m.id !== 'm12' && !paidMembersForMay.includes(m.id));

  // Access rights check
  const isTresoureiro = activeRole === UserRole.SUPER_ADMIN || activeRole === UserRole.TESOUREIRO;
  const isSecretario = activeRole === UserRole.SUPER_ADMIN || activeRole === UserRole.SECRETARIO || activeRole === UserRole.CONSELHO_FAMILIAR;

  // Custom visual calendar rendering June 2026 index grid layout helper
  const renderCalendarMonthGrid = () => {
    // June 2026 starts on Monday (1st). Has 30 days.
    // Days representation
    const days = Array.from({ length: 30 }, (_, i) => i + 1);
    
    // Day cell event spotter
    const getEventsForDay = (dayNum: number) => {
       const dateStr = `2026-06-${dayNum < 10 ? '0' + dayNum : dayNum}`;
       return events.filter(e => e.date === dateStr);
    };

    return (
      <div className="grid grid-cols-7 gap-2 text-center text-xs font-sans">
        {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'].map(d => (
          <div key={d} className="font-mono uppercase font-bold text-zinc-500 text-[10px] pb-1.5 border-b dark:border-zinc-800">{d}</div>
        ))}
        {days.map(day => {
          const dayEvents = getEventsForDay(day);
          const hasEvents = dayEvents.length > 0;
          return (
            <div 
              key={day} 
              className={`p-3 h-16 rounded-xl border flex flex-col justify-between items-center transition-all ${
                hasEvents 
                  ? isDarkMode ? 'border-indigo-500/30 bg-indigo-500/5' : 'border-indigo-500/20 bg-slate-100'
                  : isDarkMode ? 'border-zinc-800 bg-zinc-950/20 hover:bg-zinc-900/10' : 'border-slate-100 bg-white hover:bg-slate-50'
              }`}
            >
              <span className={`font-mono text-[10px] ${
                hasEvents ? 'font-bold text-indigo-500' : 'text-zinc-500'
              }`}>{day}</span>
              {hasEvents && (
                <div className="flex gap-1">
                  {dayEvents.map(e => (
                    <span 
                      key={e.id} 
                      className={`w-1.5 h-1.5 rounded-full ${
                        e.type === 'Aniversário' ? 'bg-pink-500' :
                        e.type === 'Reunião' ? 'bg-emerald-500' : 'bg-indigo-500'
                      }`}
                      title={e.title}
                    ></span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Sub menu tabs */}
      <div className={`p-1.5 rounded-xl border flex gap-1 font-sans ${
        isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-slate-100 border-slate-200'
      }`}>
        <button
          onClick={() => setActiveSegment('finance')}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg cursor-pointer transition-all ${
            activeSegment === 'finance' 
              ? 'bg-indigo-600 text-white shadow-md' 
              : isDarkMode ? 'text-zinc-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Quota Mensal (10.000 Kz)
        </button>
        <button
          onClick={() => setActiveSegment('calendar')}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg cursor-pointer transition-all ${
            activeSegment === 'calendar' 
              ? 'bg-indigo-600 text-white shadow-md' 
              : isDarkMode ? 'text-zinc-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Calendário Familiar
        </button>
        <button
          onClick={() => setActiveSegment('mural')}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg cursor-pointer transition-all ${
            activeSegment === 'mural' 
              ? 'bg-indigo-600 text-white shadow-md' 
              : isDarkMode ? 'text-zinc-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Mural de Comunicados
        </button>
      </div>

      {/* --- SECTION 1: FINANCE --- */}
      {activeSegment === 'finance' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold font-sans">Sistema de Quotas e Tesouraria</h3>
              <p className="text-xs text-zinc-500">Fluxo contabilístico de contribuições familiares estabelecidas no valor fixo de 10.000 Kz/mês por membro.</p>
            </div>
            {isTresoureiro && (
              <button
                onClick={() => setIsPayFormOpen(true)}
                className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-4 py-2.5 rounded-xl cursor-pointer"
              >
                <Plus size={14} />
                <span>Registrar Pagamento</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* PAYERS LIST TABLE */}
            <div className={`p-5 rounded-2xl border ${
              isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-100'
            } shadow-sm space-y-4`}>
              <h4 className="text-xs font-bold font-sans flex items-center gap-2 text-emerald-500">
                <CheckCircle size={15} />
                <span>Rúbrica de Contuintes (Pagantes Recorrentes)</span>
              </h4>

              <div className="overflow-x-auto">
                <table className="w-full text-left font-sans text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-800/20 dark:border-zinc-800 text-[10px] text-zinc-400 uppercase font-mono">
                      <th className="pb-2">Nome</th>
                      <th className="pb-2">Mês</th>
                      <th className="pb-2">Montante</th>
                      <th className="pb-2 text-center">Recibo</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/10 dark:divide-zinc-800/30">
                    {payments.slice().reverse().map((pay) => (
                      <tr key={pay.id} className="hover:bg-zinc-800/5 dark:hover:bg-zinc-800/5">
                        <td className="py-2.5 font-semibold">{pay.memberName}</td>
                        <td className="py-2.5 font-mono">{pay.month}</td>
                        <td className="py-2.5 font-mono text-emerald-500">{(pay.amount).toLocaleString()} Kz</td>
                        <td className="py-2.5">
                          <div className="flex items-center justify-center">
                            <button
                              onClick={() => setActiveReceipt(pay)}
                              className="p-1 border border-indigo-500/25 hover:bg-indigo-600 hover:text-white rounded-lg text-indigo-500 transition-colors cursor-pointer"
                              title="Emitir Recibo Oficial"
                            >
                              <Printer size={12} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* DEBTORS LIST TABLE */}
            <div className={`p-5 rounded-2xl border ${
              isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-100'
            } shadow-sm space-y-4`}>
              <h4 className="text-xs font-bold font-sans flex items-center gap-2 text-red-500 animate-pulse">
                <AlertOctagon size={15} />
                <span>Relação de Membros Inadimplentes (Devedores)</span>
              </h4>

              <div className="overflow-x-auto">
                <table className="w-full text-left font-sans text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-800/20 dark:border-zinc-800 text-[10px] text-zinc-400 uppercase font-mono">
                      <th className="pb-2">Familiar devedor</th>
                      <th className="pb-2 text-center">Meses Atraso</th>
                      <th className="pb-2">Multa Incidente</th>
                      <th className="pb-2">Dívida Estimada</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/10 dark:divide-zinc-800/30">
                    {debtorsList.map((m) => (
                      <tr key={m.id} className="hover:bg-zinc-800/5">
                        <td className="py-2.5 font-semibold text-zinc-700 dark:text-zinc-200">{m.fullName}</td>
                        <td className="py-2.5 font-mono text-center text-red-400 font-bold">1 mês (Maio)</td>
                        <td className="py-2.5 font-mono text-amber-500">1.500 Kz</td>
                        <td className="py-2.5 font-mono text-red-500 font-bold">11.500 Kz</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-[10px] text-zinc-500 font-mono italic leading-none">
                * As quotas vencem no dia 10 de cada mês coerente. Aplica-se multa regulamentar de 15% (1.500 Kz).
              </p>
            </div>

          </div>
        </div>
      )}

      {/* --- SECTION 2: CALENDAR --- */}
      {activeSegment === 'calendar' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold font-sans">Calendário Integrado Kinjango</h3>
              <p className="text-xs text-zinc-500">Marcação oficial de reuniões de conselho, dotes/casamentos, exéquias e datas de aniversário de patriarcas.</p>
            </div>
            {isSecretario && (
              <button
                onClick={() => setIsEventFormOpen(true)}
                className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-4 py-2.5 rounded-xl cursor-pointer"
              >
                <Plus size={14} />
                <span>Agendar Evento</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Month grid visualizer */}
            <div className={`lg:col-span-2 p-5 rounded-2xl border ${
              isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-100'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-bold font-sans">Novembro / Dezembro 2026 - Vista Trimestre</h4>
                <span className="text-xs text-indigo-500 font-mono font-bold">Junho 2026 (Ativo)</span>
              </div>
              
              {renderCalendarMonthGrid()}
            </div>

            {/* EVENTS QUICK LISTING DETAILS */}
            <div className={`p-5 rounded-2xl border ${
              isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-100'
            } space-y-4`}>
              <h4 className="text-xs font-bold font-sans font-mono uppercase tracking-wider text-zinc-400">Sumário de Agendamentos</h4>
              <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                {events.map(evt => (
                  <div key={evt.id} className="p-3 rounded-xl border border-zinc-800 bg-zinc-950/40 text-xs">
                    <div className="flex items-center justify-between font-bold mb-1">
                      <span className="text-indigo-400">{evt.title}</span>
                      <span className="font-mono text-[10px] text-zinc-500">{evt.date}</span>
                    </div>
                    <p className="text-[11px] text-zinc-400 mb-1">{evt.description}</p>
                    <span className="text-[10px] text-zinc-500 font-mono">Tipo: <strong>{evt.type}</strong> • Capela/Mesa: {evt.location}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* --- SECTION 3: COMMUNICATIONS WALL --- */}
      {activeSegment === 'mural' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold font-sans">Mural Familiar de Notícias</h3>
              <p className="text-xs text-zinc-500">Mural participativo para publicação de comunicados, acordos do conselho e felicitações.</p>
            </div>
            {isSecretario && (
              <button
                onClick={() => setIsNoticeFormOpen(true)}
                className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-4 py-2.5 rounded-xl cursor-pointer"
              >
                <Plus size={14} />
                <span>Publicar Comunicado</span>
              </button>
            )}
          </div>

          <div className="space-y-6 max-w-2xl mx-auto">
            {notices.map((not) => (
              <div key={not.id} className={`p-5 rounded-2xl border space-y-4 ${
                isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-100'
              } shadow-sm`}>
                <div>
                  <h4 className="text-base font-bold font-sans text-indigo-500">{not.title}</h4>
                  <div className="flex items-center gap-2 text-[10px] text-zinc-500 mt-1 font-mono">
                    <span>Autor: <strong>{not.authorName}</strong> ({not.authorRole})</span>
                    <span>•</span>
                    <span>{not.publishedAt}</span>
                  </div>
                </div>

                <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed font-sans">{not.content}</p>

                {/* Micro Reactions */}
                <div className="flex items-center gap-2 border-y dark:border-zinc-800 py-2.5 text-xs">
                  <span className="text-[10px] text-zinc-500 pr-1">Reações Rápidas:</span>
                  {Object.entries(not.reactions).map(([reactionEmoji, reacCount]) => (
                    <button
                      key={reactionEmoji}
                      onClick={() => handleEmojiReaction(not.id, reactionEmoji)}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border cursor-pointer hover:scale-105 duration-100 ${
                        isDarkMode ? 'border-zinc-800 bg-zinc-950/40 text-zinc-400' : 'border-slate-200 bg-slate-50'
                      }`}
                    >
                      <span>{reactionEmoji}</span>
                      <span className="font-mono font-bold text-[10px]">{reacCount}</span>
                    </button>
                  ))}
                  <button 
                    onClick={() => handleEmojiReaction(not.id, "🎉")}
                    className="p-1 px-1.5 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg text-zinc-400 transition-colors"
                  >
                    🎉
                  </button>
                </div>

                {/* Sub Comments timeline */}
                <div className="space-y-3">
                  <h5 className="text-[10px] font-bold font-mono text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
                    <MessageCircle size={12} />
                    <span>Respostas familiares ({not.comments.length})</span>
                  </h5>

                  <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                    {not.comments.map(c => (
                      <div key={c.id} className="p-2.5 rounded-xl bg-zinc-950/25 border border-zinc-800/40 text-[11px] font-sans">
                        <div className="flex items-center justify-between font-semibold mb-0.5 text-zinc-400">
                          <span>{c.authorName}</span>
                          <span className="font-mono text-[9px] text-zinc-500">{c.timestamp}</span>
                        </div>
                        <p>{c.content}</p>
                      </div>
                    ))}
                  </div>

                  {/* Add instant reply */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Adicione um comentário carinhoso..."
                      value={commentTextState[not.id] || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setCommentTextState(prev => ({ ...prev, [not.id]: val }));
                      }}
                      className={`flex-1 px-3 py-1.5 text-xs rounded-lg border focus:outline-none focus:ring-1 focus:ring-indigo-500 ${
                        isDarkMode ? 'bg-zinc-950 border-zinc-800 text-zinc-200' : 'bg-white border-slate-200 text-slate-800'
                      }`}
                    />
                    <button
                      onClick={() => handleSubmitComment(not.id)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-4 py-1.5 rounded-lg cursor-pointer"
                    >
                      Enviar
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- FORM MODALS --- */}

      {/* MODAL: Record payment quota */}
      {isPayFormOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleRecordPayment} className={`w-full max-w-md rounded-2xl shadow-2xl p-6 space-y-4 text-xs font-sans ${
            isDarkMode ? 'bg-zinc-900 border border-zinc-800' : 'bg-white border'
          }`}>
            <h4 className="font-bold text-sm uppercase tracking-wider text-zinc-400">Adicionar Quota Recibo</h4>
            
            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-1">Membro Doador</label>
                <select
                  required
                  value={payMemberId}
                  onChange={(e) => setPayMemberId(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    isDarkMode ? 'bg-zinc-950 border-zinc-800 text-zinc-200' : 'bg-white border-slate-200'
                  }`}
                >
                  <option value="">Selecione...</option>
                  {members.filter(m => !m.isDeceased).map(m => (
                    <option key={m.id} value={m.id}>{m.fullName}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-1">Mês Pagamento</label>
                  <input
                    type="month"
                    required
                    value={payMonth}
                    onChange={(e) => setPayMonth(e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border ${
                      isDarkMode ? 'bg-zinc-950 border-zinc-800 text-zinc-200' : 'bg-white border-slate-200'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-1">Montante (Kz)</label>
                  <input
                    type="number"
                    required
                    value={payAmount}
                    onChange={(e) => setPayAmount(e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border ${
                      isDarkMode ? 'bg-zinc-950 border-zinc-800 text-zinc-200' : 'bg-white border-slate-200'
                    }`}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t dark:border-zinc-800/40">
                <input
                  type="checkbox"
                  id="payFineCheckbox"
                  checked={payFine}
                  onChange={(e) => setPayFine(e.target.checked)}
                  className="w-4 h-4 rounded border-zinc-800 accent-indigo-600 cursor-pointer"
                />
                <label htmlFor="payFineCheckbox" className="font-semibold text-zinc-300 cursor-pointer">
                  Aplicar taxa de multa por atraso (1.500 Kz)
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t pt-4 dark:border-zinc-800">
              <button
                type="button"
                onClick={() => setIsPayFormOpen(false)}
                className={`px-3 py-1.5 rounded-lg font-semibold ${
                  isDarkMode ? 'bg-zinc-800 hover:bg-zinc-750 text-zinc-300' : 'bg-slate-100 text-slate-700'
                }`}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 rounded-lg font-semibold"
              >
                Gravar Quota
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL: Add Event */}
      {isEventFormOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleAddEvent} className={`w-full max-w-md rounded-2xl shadow-2xl p-6 space-y-4 text-xs font-sans ${
            isDarkMode ? 'bg-zinc-900 border border-zinc-800' : 'bg-white border'
          }`}>
            <h4 className="font-bold text-sm uppercase tracking-wider text-zinc-400">Novo Agendamento</h4>

            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-1">Título do Evento</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Assembleia do Conselho Huambo"
                  value={evtTitle}
                  onChange={(e) => setEvtTitle(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    isDarkMode ? 'bg-zinc-950 border-zinc-800 text-zinc-200' : 'bg-white border-slate-200'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-1">Data Agendada</label>
                  <input
                    type="date"
                    required
                    value={evtDate}
                    onChange={(e) => setEvtDate(e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border ${
                      isDarkMode ? 'bg-zinc-950 border-zinc-800 text-zinc-200' : 'bg-white border-slate-200'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-1">Tipo de Compromisso</label>
                  <select
                    value={evtType}
                    onChange={(e) => setEvtType(e.target.value as any)}
                    className={`w-full px-3 py-2 rounded-lg border ${
                      isDarkMode ? 'bg-zinc-950 border-zinc-800 text-zinc-200' : 'bg-white border-slate-200'
                    }`}
                  >
                    <option value="Reunião">Reunião Ordinária</option>
                    <option value="Aniversário">Aniversário Parente</option>
                    <option value="Casamento">Casamento Celebração</option>
                    <option value="Aviso">Aviso Comunitário</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-1">Local / Link Teams</label>
                <input
                  type="text"
                  placeholder="Ex: Luanda, Alvalade or Teams online"
                  value={evtLoc}
                  onChange={(e) => setEvtLoc(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    isDarkMode ? 'bg-zinc-950 border-zinc-800 text-zinc-200' : 'bg-white border-slate-200'
                  }`}
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-1">Resumo / Detalhes</label>
                <textarea
                  rows={2}
                  value={evtDesc}
                  onChange={(e) => setEvtDesc(e.target.value)}
                  placeholder="Ordem de mesa, assuntos pautados..."
                  className={`w-full px-3 py-2 rounded-lg border ${
                    isDarkMode ? 'bg-zinc-950 border-zinc-800 text-zinc-200' : 'bg-white border-slate-200'
                  }`}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t pt-4 dark:border-zinc-800">
              <button
                type="button"
                onClick={() => setIsEventFormOpen(false)}
                className={`px-3 py-1.5 rounded-lg font-semibold ${
                  isDarkMode ? 'bg-zinc-800 hover:bg-zinc-750 text-zinc-300' : 'bg-slate-100 text-slate-700'
                }`}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 rounded-lg font-semibold"
              >
                Agendar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL: publish notice */}
      {isNoticeFormOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleAddNotice} className={`w-full max-w-md rounded-2xl shadow-2xl p-6 space-y-4 text-xs font-sans ${
            isDarkMode ? 'bg-zinc-900 border border-zinc-800' : 'bg-white border'
          }`}>
            <h4 className="font-bold text-sm uppercase tracking-wider text-zinc-400">Publicar Novo Comunicado</h4>

            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-1">Título do Comunicado</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Pauta Final da Reunião de Caixa"
                  value={noticeTitle}
                  onChange={(e) => setNoticeTitle(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    isDarkMode ? 'bg-zinc-950 border-zinc-800 text-zinc-200' : 'bg-white border-slate-200'
                  }`}
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-1">Corpo da Mensagem</label>
                <textarea
                  required
                  rows={5}
                  placeholder="Escreva termos importantes, directrizes de dote, auxílio geral..."
                  value={noticeContent}
                  onChange={(e) => setNoticeContent(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    isDarkMode ? 'bg-zinc-950 border-zinc-800 text-zinc-200' : 'bg-white border-slate-200'
                  }`}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t pt-4 dark:border-zinc-800">
              <button
                type="button"
                onClick={() => setIsNoticeFormOpen(false)}
                className={`px-3 py-1.5 rounded-lg font-semibold ${
                  isDarkMode ? 'bg-zinc-800 hover:bg-zinc-750 text-zinc-300' : 'bg-slate-100 text-slate-700'
                }`}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 rounded-lg font-semibold"
              >
                Publicar Comunicado
              </button>
            </div>
          </form>
        </div>
      )}

      {/* --- HIGH-FIDELITY RECEIPT PREVIEW MODAL (INVOICE PORTFOLIO) --- */}
      {activeReceipt && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white text-zinc-900 w-full max-w-xl rounded-2xl shadow-2xl p-6 border-t-8 border-indigo-600 animate-zoom-in font-sans relative flex flex-col justify-between">
            <button 
              onClick={() => setActiveReceipt(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-zinc-100 text-zinc-400 cursor-pointer"
            >
              <X size={18} />
            </button>

            {/* Receipt template to simulate formal PDF */}
            <div id="print-area-container" className="space-y-6">
              {/* Header */}
              <div className="text-center border-b pb-4 border-zinc-200">
                <h3 className="font-serif font-bold text-lg tracking-wider text-indigo-900 uppercase">REPÚBLICA DE ANGOLA</h3>
                <h4 className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase">DIRETÓRIO FAMILIAR KINJANGO</h4>
                <p className="text-[9px] mt-1 text-zinc-400 font-mono">Controle de Quotas, Proteção Social e Previdência Estágio</p>
              </div>

              {/* Receipt Title and ID */}
              <div className="flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] uppercase font-mono text-zinc-400 block">Número do Recibo:</span>
                  <strong className="text-indigo-600 font-mono">{activeReceipt.receiptNumber}</strong>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-mono text-zinc-400 block">Data da Emissão:</span>
                  <strong className="font-mono">{activeReceipt.paidAt}</strong>
                </div>
              </div>

              {/* Receipt Body text */}
              <div className="space-y-4 text-xs leading-relaxed border-y py-5 border-dashed border-zinc-200">
                <p>
                  Recebemos do(a) Ilustre Senhor(a) <strong>{activeReceipt.memberName}</strong>, 
                  membro ativo da <strong>Linhagem Manuel Kinjango</strong>, a importância líquida de:
                </p>
                
                {/* Large Amount Badge */}
                <div className="bg-indigo-50/70 p-4 rounded-xl border border-indigo-100 text-center">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-indigo-900 block mb-1">Valor Recebido</span>
                  <span className="text-xl font-bold font-mono text-indigo-900">{(activeReceipt.amount).toLocaleString()} Kz</span>
                  <p className="text-[9px] italic text-indigo-600 mt-1 font-mono uppercase">Dez mil Kwanzas (Taxa Quota Base) {activeReceipt.hasFine && ' + Multa Atavamento (Mil e Quinhentos Kwanzas)'}</p>
                </div>

                <p>
                  Referente à contribuição da <strong>Quota de Apoio Familiar e Prevenção de Óbito</strong> para o mês de: 
                  <strong className="font-mono text-indigo-800 ml-1">{activeReceipt.month}</strong>.
                </p>
              </div>

              {/* Signatures */}
              <div className="grid grid-cols-2 gap-4 pt-4 text-center text-[10px] font-sans">
                <div className="border-t pt-2 border-zinc-200">
                  <p className="font-bold">Lucas Manuel Kinjango</p>
                  <p className="text-zinc-500">Tesoureiro Principal</p>
                </div>
                <div className="border-t pt-2 border-zinc-200">
                  <p className="font-bold">António Manuel Kinjango</p>
                  <p className="text-zinc-500">Presidente do Conselho</p>
                </div>
              </div>
            </div>

            {/* Print action button */}
            <div className="flex justify-end gap-2 border-t pt-4 border-zinc-200 mt-6">
              <button
                onClick={() => {
                  window.print();
                }}
                className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-xl text-xs font-semibold cursor-pointer shadow-lg shadow-indigo-600/10"
              >
                <Printer size={13} />
                <span>Imprimir Recibo (Simulado)</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
