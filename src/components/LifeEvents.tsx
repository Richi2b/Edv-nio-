/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Marriage, 
  FamilyRequest, 
  DeathRecord, 
  FamilyMember, 
  UserRole 
} from '../types';
import { 
  Heart, 
  MapPin, 
  Calendar, 
  Plus, 
  ChevronRight, 
  X,
  FileCheck,
  ThumbsUp,
  Flame,
  MessageSquareShare,
  ClipboardList,
  AlertCircle
} from 'lucide-react';

interface LifeEventsProps {
  marriages: Marriage[];
  setMarriages: (m: Marriage[]) => void;
  requests: FamilyRequest[];
  setRequests: (r: FamilyRequest[]) => void;
  deaths: DeathRecord[];
  setDeaths: (d: DeathRecord[]) => void;
  members: FamilyMember[];
  activeRole: UserRole;
  isDarkMode: boolean;
}

export default function LifeEvents({
  marriages,
  setMarriages,
  requests,
  setRequests,
  deaths,
  setDeaths,
  members,
  activeRole,
  isDarkMode
}: LifeEventsProps) {
  const [activeSubTab, setActiveSubTab] = useState<'marriages' | 'requests' | 'obituaries'>('marriages');

  // Form states - Marriages
  const [isMarriageFormOpen, setIsMarriageFormOpen] = useState(false);
  const [spouse1Id, setSpouse1Id] = useState('');
  const [spouse2Id, setSpouse2Id] = useState('');
  const [marriageDate, setMarriageDate] = useState('');
  const [marriageLocation, setMarriageLocation] = useState('');

  // Form states - Requests
  const [isRequestFormOpen, setIsRequestFormOpen] = useState(false);
  const [reqTitle, setReqTitle] = useState('');
  const [reqType, setReqType] = useState<'Casamento' | 'Apoio Financeiro' | 'Apoio de Saúde' | 'Outro'>('Apoio Financeiro');
  const [reqDesc, setReqDesc] = useState('');
  const [reqAmount, setReqAmount] = useState('');

  // Tribute State - Obituaries
  const [tributeAuthor, setTributeAuthor] = useState('');
  const [tributeText, setTributeText] = useState('');
  const [selectedDeathForTribute, setSelectedDeathForTribute] = useState<string | null>(null);

  // Helper name mapping
  const getMemberName = (id: string) => {
    return members.find(m => m.id === id)?.fullName || 'N/A';
  };

  // 1. Submit Marriage
  const handleAddMarriage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!spouse1Id || !spouse2Id || !marriageDate) return;

    const newMarriage: Marriage = {
      id: "mar" + (marriages.length + 1),
      spouse1Id,
      spouse2Id,
      spouse1Name: getMemberName(spouse1Id),
      spouse2Name: getMemberName(spouse2Id),
      date: marriageDate,
      location: marriageLocation || "Não especificado",
      photos: ["https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=600"],
      status: "Planeado"
    };

    setMarriages([...marriages, newMarriage]);
    setIsMarriageFormOpen(false);
  };

  // Translate Marriage status classes
  const getMarriageStatusBadge = (status: Marriage['status']) => {
    switch (status) {
      case 'Celebrado': return 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/25';
      case 'Planeado': return 'bg-indigo-500/10 text-indigo-500 border border-indigo-500/25';
      default: return 'bg-amber-500/10 text-amber-500 border border-amber-500/25';
    }
  };

  // 2. Submit Request (By any member)
  const handleAddRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reqTitle || !reqDesc) return;

    // Default current login representing Bernardo or the current role representative
    const currentMemberRepresentation = members.find(m => m.id === 'm6') || members[0];

    const newRequest: FamilyRequest = {
      id: "req" + (requests.length + 1),
      title: reqTitle,
      type: reqType,
      requesterId: currentMemberRepresentation.id,
      requesterName: currentMemberRepresentation.fullName,
      description: reqDesc,
      amountRequested: reqAmount ? parseFloat(reqAmount) : undefined,
      submittedAt: new Date().toISOString().split('T')[0],
      status: 'Submetido'
    };

    setRequests([...requests, newRequest]);
    setIsRequestFormOpen(false);
    setReqTitle('');
    setReqDesc('');
    setReqAmount('');
  };

  // Request state transitions (Admin / Conselho Familiar)
  const handleTransitionRequest = (id: string, nextStatus: FamilyRequest['status'], remarkText?: string) => {
    const updated = requests.map(r => {
      if (r.id === id) {
        return { 
          ...r, 
          status: nextStatus,
          remarks: remarkText || r.remarks
        };
      }
      return r;
    });
    setRequests(updated);
  };

  // 3. Obituaries - Light a candle interaction
  const handleLightCandle = (id: string) => {
    const updated = deaths.map(d => {
      if (d.id === id) {
        return { ...d, candlesLit: d.candlesLit + 1 };
      }
      return d;
    });
    setDeaths(updated);
  };

  // Add tribute to deceased ancestors
  const handleAddTribute = (e: React.FormEvent, deathId: string) => {
    e.preventDefault();
    if (!tributeText) return;

    const author = tributeAuthor || "Anónimo";
    const updated = deaths.map(d => {
      if (d.id === deathId) {
        return {
          ...d,
          tributes: [...d.tributes, `${tributeText} - ${author}`]
        };
      }
      return d;
    });
    setDeaths(updated);
    setTributeText('');
    setTributeAuthor('');
    setSelectedDeathForTribute(null);
  };

  const isModerator = activeRole === UserRole.SUPER_ADMIN || activeRole === UserRole.CONSELHO_FAMILIAR;

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Upper sub-tabs selector */}
      <div className={`p-1.5 rounded-xl border flex gap-1 font-sans ${
        isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-slate-100 border-slate-200'
      }`}>
        <button
          onClick={() => setActiveSubTab('marriages')}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg cursor-pointer transition-all ${
            activeSubTab === 'marriages' 
              ? 'bg-indigo-600 text-white shadow-md' 
              : isDarkMode ? 'text-zinc-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Casamentos Familiar
        </button>
        <button
          onClick={() => setActiveSubTab('requests')}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg cursor-pointer transition-all ${
            activeSubTab === 'requests' 
              ? 'bg-indigo-600 text-white shadow-md' 
              : isDarkMode ? 'text-zinc-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Gestão de Pedidos & Apoio
        </button>
        <button
          onClick={() => setActiveSubTab('obituaries')}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg cursor-pointer transition-all ${
            activeSubTab === 'obituaries' 
              ? 'bg-indigo-600 text-white shadow-md' 
              : isDarkMode ? 'text-zinc-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Memorial de Óbitos
        </button>
      </div>

      {/* SUB-MODULO: 1. CASAMENTOS */}
      {activeSubTab === 'marriages' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold font-sans">Arquivo de Matrimónios</h3>
              <p className="text-xs text-zinc-500">Histórico de uniões familiares, casamentos agendados e processos matrimoniais ativos.</p>
            </div>
            {isModerator && (
              <button
                onClick={() => setIsMarriageFormOpen(true)}
                className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-4 py-2 rounded-xl cursor-pointer"
              >
                <Plus size={14} />
                <span>Registrar União</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {marriages.map((m) => (
              <div key={m.id} className={`rounded-2xl border overflow-hidden ${
                isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-100'
              } shadow-sm`}>
                <img 
                  src={m.photos[0]} 
                  alt="Casamento" 
                  referrerPolicy="no-referrer"
                  className="w-full h-44 object-cover" 
                />
                <div className="p-5 space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h4 className="text-sm font-bold font-sans text-indigo-500 leading-tight">
                        {m.spouse1Name} <br />
                        <span className="text-xs text-zinc-400 font-normal">com</span> {m.spouse2Name}
                      </h4>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold font-mono ${getMarriageStatusBadge(m.status)}`}>
                      {m.status}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-zinc-500 font-sans border-t dark:border-zinc-800/80 pt-3">
                    <div className="flex items-center gap-2">
                      <Calendar size={13} />
                      <span>Data de Celebração: <strong>{m.date}</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={13} />
                      <span>Mesa/Local: <strong>{m.location}</strong></span>
                    </div>
                  </div>

                  {m.status === 'Celebrado' && (
                    <div className="p-3 bg-indigo-500/5 rounded-xl border border-indigo-500/10 text-center text-[10px] font-semibold text-indigo-400">
                      União indissolúvel preservada nos anais da família.
                    </div>
                  )}

                  {m.status === 'Em processo' && (
                    <div className="p-3 bg-amber-500/5 rounded-xl border border-amber-500/10 text-center text-[10px] font-semibold text-amber-500 animate-pulse">
                      Processo de Alambamento / Dote correndo trâmites comunitários.
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-MODULO: 2. GESTÃO DE PEDIDOS */}
      {activeSubTab === 'requests' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold font-sans">Pedidos de Suporte & Eventos</h3>
              <p className="text-xs text-zinc-500">Fluxo estratégico de aprovação de alambamentos, dotes ou suporte urgente de saúde familiar.</p>
            </div>
            <button
              onClick={() => setIsRequestFormOpen(true)}
              className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-4 py-2 rounded-xl cursor-pointer"
            >
              <Plus size={14} />
              <span>Submeter Solicitação</span>
            </button>
          </div>

          <div className="space-y-4">
            {requests.map((r) => (
              <div key={r.id} className={`p-5 rounded-2xl border ${
                isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-100'
              } shadow-xs space-y-4`}>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400">
                      {r.type}
                    </span>
                    <h4 className="text-sm font-bold font-sans mt-2">{r.title}</h4>
                    <span className="text-[10px] text-zinc-500 font-mono">Solicitado por: <strong>{r.requesterName}</strong> • {r.submittedAt}</span>
                  </div>

                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold font-mono ${
                    r.status === 'Submetido' ? 'bg-indigo-500/10 text-indigo-500' :
                    r.status === 'Em Análise' ? 'bg-amber-500/10 text-amber-500 animate-pulse' :
                    r.status === 'Aprovado' ? 'bg-emerald-500/15 text-emerald-500' : 'bg-zinc-500/10 text-zinc-400'
                  }`}>
                    {r.status}
                  </span>
                </div>

                <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed font-sans">{r.description}</p>
                
                {r.amountRequested && (
                  <p className="text-xs text-emerald-500 font-semibold font-mono">
                    Montante Orçado: {r.amountRequested.toLocaleString()} Kz
                  </p>
                )}

                {r.remarks && (
                  <div className={`p-3 rounded-lg border text-xs font-sans ${
                    isDarkMode ? 'bg-zinc-950 border-zinc-800 text-zinc-400' : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}>
                    <span className="text-[10px] font-bold font-mono text-indigo-400 block mb-1">Notas do Conselho Familiar:</span>
                    {r.remarks}
                  </div>
                )}

                {/* Transitions buttons under role RBAC check */}
                {isModerator && (
                  <div className="flex flex-wrap gap-2 pt-2 border-t dark:border-zinc-800 text-[11px]">
                    <span className="text-[10px] font-mono text-zinc-500 self-center uppercase font-bold mr-2">Controlo Moderador:</span>
                    
                    {r.status === 'Submetido' && (
                      <button
                        onClick={() => handleTransitionRequest(r.id, 'Em Análise', "O conselho está a avaliar a dotação de quotas para esse projeto.")}
                        className="bg-amber-500/10 hover:bg-amber-500 text-amber-500 hover:text-white px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer"
                      >
                        Avaliar Pedido
                      </button>
                    )}

                    {r.status === 'Em Análise' && (
                      <>
                        <button
                          onClick={() => handleTransitionRequest(r.id, 'Aprovado', "Aprovado por decisão de mesa do Conselho Familiar. Proceda com libertação de fundos.")}
                          className="bg-emerald-500/10 hover:bg-emerald-500 text-emerald-500 hover:text-white px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer"
                        >
                          Aprovar Pedido
                        </button>
                        <button
                          onClick={() => handleTransitionRequest(r.id, 'Concluído', "Conclusão de assistência familiar executada.")}
                          className="bg-neutral-500/10 hover:bg-neutral-500 text-zinc-400 hover:text-white px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer"
                        >
                          Finalizar Processo
                        </button>
                      </>
                    )}

                    {r.status === 'Aprovado' && (
                      <button
                        onClick={() => handleTransitionRequest(r.id, 'Concluído', "O montante foi libertado e prestado suporte.")}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer"
                      >
                        Marcar como Concluído
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-MODULO: 3. MEMORIAL DE OBITOS */}
      {activeSubTab === 'obituaries' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-bold font-sans">Memorial Digital dos Antepassados</h3>
            <p className="text-xs text-zinc-500">Homenagem eterna aos fundadores da linhagem Kinjango. Luz das nossas conquistas.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {deaths.map((d) => (
              <div key={d.id} className={`rounded-2xl border p-5 space-y-4 relative ${
                isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200'
              } shadow-sm`}>
                
                {/* Candle graphic in upper corner */}
                <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-500 px-2.5 py-1 rounded-full text-xs font-mono">
                  <Flame size={12} className="animate-pulse text-amber-400" />
                  <span>{d.candlesLit} acesas</span>
                </div>

                <div>
                  <h4 className="text-sm font-bold font-sans text-zinc-600 dark:text-zinc-100">{d.memberName}</h4>
                  <p className="text-[10px] text-zinc-500 font-mono mt-1">Falecimento: {d.date} • Causa: {d.cause}</p>
                </div>

                <div className="space-y-1.5 text-xs text-zinc-500 font-sans border-t dark:border-zinc-800/80 pt-3">
                  <span className="text-[10px] font-bold font-mono text-indigo-400 uppercase tracking-widest block mb-1">Cerimónia Memorial</span>
                  <p className="leading-relaxed text-zinc-600 dark:text-zinc-300">{d.ceremonies}</p>
                </div>

                {/* Tributes timeline / lists */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold font-mono text-pink-500 uppercase tracking-widest block">Mensagens de Saudade</span>
                  <div className="space-y-2 p-3 rounded-lg bg-zinc-950/20 max-h-40 overflow-y-auto">
                    {d.tributes.map((trib, idx) => (
                      <p key={idx} className="text-[11px] italic text-zinc-400 border-l border-zinc-700 pl-2 leading-relaxed">
                        "{trib}"
                      </p>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    onClick={() => handleLightCandle(d.id)}
                    className="flex items-center gap-1.5 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-400/20 text-amber-500 hover:text-amber-400 px-3.5 py-2 rounded-xl text-xs font-semibold cursor-pointer tracking-wide"
                  >
                    <Flame size={13} className="text-amber-400 animate-pulse" />
                    <span>Acender Vela Virtual</span>
                  </button>

                  <button
                    onClick={() => setSelectedDeathForTribute(d.id)}
                    className="flex items-center gap-1 bg-zinc-800 hover:bg-zinc-750 text-zinc-300 px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer"
                  >
                    <span>Escrever Homenagem</span>
                  </button>
                </div>

                {/* Drop Tribute form */}
                {selectedDeathForTribute === d.id && (
                  <form onSubmit={(e) => handleAddTribute(e, d.id)} className="p-3 border dark:border-zinc-800 rounded-xl space-y-2 bg-zinc-950/40 animate-fade-in text-[11px]">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-[9px] text-zinc-500">Submeter Homenagem</span>
                      <button type="button" onClick={() => setSelectedDeathForTribute(null)} className="text-zinc-500 hover:text-zinc-400">
                        <X size={12} />
                      </button>
                    </div>
                    <input
                      type="text"
                      placeholder="Seu Nome (Ex: neto Bernardo)..."
                      value={tributeAuthor}
                      onChange={(e) => setTributeAuthor(e.target.value)}
                      className="w-full px-2 py-1.5 text-xs bg-zinc-950 border border-zinc-800 rounded focus:outline-none"
                    />
                    <textarea
                      required
                      placeholder="Sua homenagem carinhosa..."
                      value={tributeText}
                      onChange={(e) => setTributeText(e.target.value)}
                      rows={2}
                      className="w-full px-2 py-1.5 text-xs bg-zinc-950 border border-zinc-800 rounded focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="bg-pink-600 hover:bg-pink-700 text-white px-3 py-1 rounded text-[10px] font-semibold cursor-pointer"
                    >
                      Publicar Mensagem
                    </button>
                  </form>
                )}

              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL FORM marriages */}
      {isMarriageFormOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleAddMarriage} className={`w-full max-w-md rounded-2xl shadow-2xl p-6 space-y-4 text-xs font-sans ${
            isDarkMode ? 'bg-zinc-900 border border-zinc-800' : 'bg-white border'
          }`}>
            <h4 className="font-bold text-sm uppercase tracking-wider text-zinc-400">Registrar União Matrimonial</h4>
            
            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-1">Conjuge 1</label>
                <select
                  required
                  value={spouse1Id}
                  onChange={(e) => setSpouse1Id(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    isDarkMode ? 'bg-zinc-950 border-zinc-800 text-zinc-200' : 'bg-white border-slate-200'
                  }`}
                >
                  <option value="">Selecione...</option>
                  {members.map(m => (
                    <option key={m.id} value={m.id}>{m.fullName}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-1">Conjuge 2</label>
                <select
                  required
                  value={spouse2Id}
                  onChange={(e) => setSpouse2Id(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    isDarkMode ? 'bg-zinc-950 border-zinc-800 text-zinc-200' : 'bg-white border-slate-200'
                  }`}
                >
                  <option value="">Selecione...</option>
                  {members.map(m => (
                    <option key={m.id} value={m.id}>{m.fullName}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-1">Data do Casamento</label>
                <input
                  type="date"
                  required
                  value={marriageDate}
                  onChange={(e) => setMarriageDate(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    isDarkMode ? 'bg-zinc-950 border-zinc-800 text-zinc-200' : 'bg-white border-slate-200'
                  }`}
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-1">Local / Paróquia</label>
                <input
                  type="text"
                  placeholder="Ex: Igreja de Nossa Senhora de Fátima, Luanda"
                  value={marriageLocation}
                  onChange={(e) => setMarriageLocation(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    isDarkMode ? 'bg-zinc-950 border-zinc-800 text-zinc-200' : 'bg-white border-slate-200'
                  }`}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t pt-4 dark:border-zinc-800">
              <button
                type="button"
                onClick={() => setIsMarriageFormOpen(false)}
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
                Gravar União
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL FORM Requests */}
      {isRequestFormOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleAddRequest} className={`w-full max-w-md rounded-2xl shadow-2xl p-6 space-y-4 text-xs font-sans ${
            isDarkMode ? 'bg-zinc-900 border border-zinc-800' : 'bg-white border'
          }`}>
            <h4 className="font-bold text-sm uppercase tracking-wider text-zinc-400">Submeter Pedido ao Conselho</h4>
            
            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-1">Título do Pedido</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Aquisição de Medicamentos Paula"
                  value={reqTitle}
                  onChange={(e) => setReqTitle(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    isDarkMode ? 'bg-zinc-950 border-zinc-800 text-zinc-200' : 'bg-white border-slate-200'
                  }`}
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-1">Tipo de Apoio</label>
                <select
                  value={reqType}
                  onChange={(e) => setReqType(e.target.value as any)}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    isDarkMode ? 'bg-zinc-950 border-zinc-800 text-zinc-200' : 'bg-white border-slate-200'
                  }`}
                >
                  <option value="Apoio Financeiro">Apoio Financeiro</option>
                  <option value="Apoio de Saúde">Apoio de Saúde / Alerta Clínico</option>
                  <option value="Casamento">Casamento / Dote Processo</option>
                  <option value="Outro">Outras Demandas</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-1">Montante Estimado (Kz) - Opcional</label>
                <input
                  type="number"
                  placeholder="Ex: 50000"
                  value={reqAmount}
                  onChange={(e) => setReqAmount(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    isDarkMode ? 'bg-zinc-950 border-zinc-800 text-zinc-200' : 'bg-white border-slate-200'
                  }`}
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-1">Descrição Detalhada do Pedido</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Detalhe a necessidade, medicamentos envolvidos ou datas limites..."
                  value={reqDesc}
                  onChange={(e) => setReqDesc(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    isDarkMode ? 'bg-zinc-950 border-zinc-800 text-zinc-200' : 'bg-white border-slate-200'
                  }`}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t pt-4 dark:border-zinc-800">
              <button
                type="button"
                onClick={() => setIsRequestFormOpen(false)}
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
                Submeter Pedido
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
