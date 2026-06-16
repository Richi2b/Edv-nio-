/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { UserRole, FamilyMember, Marriage, FamilyRequest, DeathRecord, PatientRecord, Payment, Notice, FamilyEvent } from './types';
import { 
  INITIAL_MEMBERS, 
  INITIAL_MARRIAGES, 
  INITIAL_REQUESTS, 
  INITIAL_DEATHS, 
  INITIAL_PATIENTS, 
  INITIAL_PAYMENTS, 
  INITIAL_NOTICES, 
  INITIAL_EVENTS,
  getStoredState,
  setStoredState
} from './mockData';

// Component Imports
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import CadastroFamiliar from './components/CadastroFamiliar';
import GenealogyTree from './components/GenealogyTree';
import LifeEvents from './components/LifeEvents';
import Patients from './components/Patients';
import FinanceCalendar from './components/FinanceCalendar';
import FPIProgress from './components/FPIProgress';
import AIAssistant from './components/AIAssistant';
import { Sparkles, Bot, Calendar, ArrowRight, ShieldCheck } from 'lucide-react';

export default function App() {
  // --- 1. CORE THEMING & USER STATES ---
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return getStoredState('theme_dark', true);
  });
  const [activeRole, setActiveRole] = useState<UserRole>(() => {
    return getStoredState('active_role', UserRole.SUPER_ADMIN);
  });
  const [currentUser, setCurrentUser] = useState<FamilyMember | null>(() => {
    const initialRep = INITIAL_MEMBERS.find(m => m.id === 'm6') || INITIAL_MEMBERS[0]; // Bernardo
    return getStoredState('current_user', initialRep);
  });
  const [currentTab, setCurrentTab] = useState<string>(() => {
    return getStoredState('current_tab', 'dashboard');
  });

  // --- 2. RAW STATE ARRAYS SYNCHRONIZED ACROSS BLOCKS ---
  const [members, setMembers] = useState<FamilyMember[]>(() => getStoredState('members', INITIAL_MEMBERS));
  const [marriages, setMarriages] = useState<Marriage[]>(() => getStoredState('marriages', INITIAL_MARRIAGES));
  const [requests, setRequests] = useState<FamilyRequest[]>(() => getStoredState('requests', INITIAL_REQUESTS));
  const [deaths, setDeaths] = useState<DeathRecord[]>(() => getStoredState('deaths', INITIAL_DEATHS));
  const [patients, setPatients] = useState<PatientRecord[]>(() => getStoredState('patients', INITIAL_PATIENTS));
  const [payments, setPayments] = useState<Payment[]>(() => getStoredState('payments', INITIAL_PAYMENTS));
  const [events, setEvents] = useState<FamilyEvent[]>(() => getStoredState('events', INITIAL_EVENTS));
  const [notices, setNotices] = useState<Notice[]>(() => getStoredState('notices', INITIAL_NOTICES));

  // --- 3. STATE PERSISTENCE TRIGGER CLOCKS ---
  useEffect(() => { setStoredState('theme_dark', isDarkMode); }, [isDarkMode]);
  useEffect(() => { setStoredState('active_role', activeRole); }, [activeRole]);
  useEffect(() => { if (currentUser) setStoredState('current_user', currentUser); }, [currentUser]);
  useEffect(() => { setStoredState('current_tab', currentTab); }, [currentTab]);

  useEffect(() => { setStoredState('members', members); }, [members]);
  useEffect(() => { setStoredState('marriages', marriages); }, [marriages]);
  useEffect(() => { setStoredState('requests', requests); }, [requests]);
  useEffect(() => { setStoredState('deaths', deaths); }, [deaths]);
  useEffect(() => { setStoredState('patients', patients); }, [patients]);
  useEffect(() => { setStoredState('payments', payments); }, [payments]);
  useEffect(() => { setStoredState('events', events); }, [events]);
  useEffect(() => { setStoredState('notices', notices); }, [notices]);

  // Handle dynamic style switching inside body context
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      root.style.backgroundColor = '#09090b'; // dark slate
    } else {
      root.classList.remove('dark');
      root.style.backgroundColor = '#f8fafc'; // light slate
    }
  }, [isDarkMode]);

  // --- 4. RENDER SELECTOR BASED ON TAB SECTIONS ---
  const renderTabContent = () => {
    switch (currentTab) {
      case 'dashboard':
        return (
          <Dashboard 
            members={members}
            payments={payments}
            requests={requests}
            patients={patients}
            events={events}
            activeRole={activeRole}
            isDarkMode={isDarkMode}
            setCurrentTab={setCurrentTab}
          />
        );
      
      case 'registry':
        return (
          <CadastroFamiliar 
            members={members}
            setMembers={setMembers}
            activeRole={activeRole}
            isDarkMode={isDarkMode}
          />
        );

      case 'tree':
        return (
          <GenealogyTree 
            members={members}
            isDarkMode={isDarkMode}
          />
        );

      case 'marriages':
        return (
          <LifeEvents 
            activeRole={activeRole}
            isDarkMode={isDarkMode}
            members={members}
            marriages={marriages}
            setMarriages={setMarriages}
            requests={requests}
            setRequests={setRequests}
            deaths={deaths}
            setDeaths={setDeaths}
          />
        );

      case 'requests':
        return (
          <LifeEvents 
            activeRole={activeRole}
            isDarkMode={isDarkMode}
            members={members}
            marriages={marriages}
            setMarriages={setMarriages}
            requests={requests}
            setRequests={setRequests}
            deaths={deaths}
            setDeaths={setDeaths}
          />
        );
        
      case 'obituaries':
        return (
          <LifeEvents 
            activeRole={activeRole}
            isDarkMode={isDarkMode}
            members={members}
            marriages={marriages}
            setMarriages={setMarriages}
            requests={requests}
            setRequests={setRequests}
            deaths={deaths}
            setDeaths={setDeaths}
          />
        );

      case 'patients':
        return (
          <Patients 
            patients={patients}
            setPatients={setPatients}
            members={members}
            activeRole={activeRole}
            isDarkMode={isDarkMode}
          />
        );

      case 'finance':
        return (
          <FinanceCalendar 
            payments={payments}
            setPayments={setPayments}
            events={events}
            setEvents={setEvents}
            notices={notices}
            setNotices={setNotices}
            members={members}
            activeRole={activeRole}
            isDarkMode={isDarkMode}
          />
        );

      case 'calendar':
        return (
          <FinanceCalendar 
            payments={payments}
            setPayments={setPayments}
            events={events}
            setEvents={setEvents}
            notices={notices}
            setNotices={setNotices}
            members={members}
            activeRole={activeRole}
            isDarkMode={isDarkMode}
          />
        );

      case 'communication':
        return (
          <FinanceCalendar 
            payments={payments}
            setPayments={setPayments}
            events={events}
            setEvents={setEvents}
            notices={notices}
            setNotices={setNotices}
            members={members}
            activeRole={activeRole}
            isDarkMode={isDarkMode}
          />
        );

      case 'fpi':
        return (
          <FPIProgress 
            members={members}
            payments={payments}
            isDarkMode={isDarkMode}
          />
        );

      case 'ai':
        return (
          <div className="space-y-6 max-w-2xl mx-auto text-center py-10 animate-fade-in font-sans">
            <div className="bg-indigo-600/10 p-6 rounded-3xl inline-flex justify-center items-center mb-4">
              <Bot size={44} className="text-indigo-500 animate-bounce" />
            </div>
            <h3 className="text-xl font-bold">Assistente Virtual Inteligente (Gemini)</h3>
            <p className="text-xs text-zinc-500 leading-relaxed max-w-md mx-auto">
              Sugerir melhorias estruturais, auditar pagamentos, pesquisar casamentos e óbitos passados ou calcular o FPI da Linhagem Kinjango com análises preditivas.
            </p>
            
            <div className={`p-4 rounded-2xl border text-xs text-left max-w-md mx-auto space-y-3 ${
              isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200'
            }`}>
              <div className="flex items-center gap-2">
                <ShieldCheck size={14} className="text-emerald-500" />
                <span className="font-semibold text-emerald-500">Servidor Conectado</span>
              </div>
              <p className="text-zinc-400">
                O assistente inteligente foi instanciado com sucesso. Para começar uma conversa em tempo real de forma otimizada ou consultar dados específicos da família, clique no botão azul flutuante <Sparkles size={12} className="inline inline-block text-indigo-500 animate-pulse mx-1" /> correspondente no canto inferior direito do painel.
              </p>
            </div>
          </div>
        );

      default:
        return <div className="text-center text-xs font-mono py-10">Módulo em desenvolvimento estrutural.</div>;
    }
  };

  // Dynamic tab naming mapping for high fidelity header
  const tabTitles: Record<string, string> = {
    dashboard: 'Painel Geral de Controle',
    registry: 'Cadastro de Membros',
    tree: 'Árvore Genealógica',
    marriages: 'Registo de Casamentos',
    requests: 'Análise de Pedidos de Apoio',
    obituaries: 'Memorial & Necrólogo',
    patients: 'Controlo Clínico e de Saúde',
    finance: 'Quotas & Tesouraria',
    calendar: 'Calendário Oficial',
    communication: 'Mural e Jornal da Família',
    fpi: 'Family Progress Index (FPI)',
    ai: 'Familiar Inteligência Artificial'
  };

  // Calculate dynamic Family Progress Index (FPI) for header metric
  const aliveMembersList = members.filter(m => !m.isDeceased);
  const totalAlive = aliveMembersList.length || 1;
  const totalCollected = payments.reduce((sum, p) => sum + p.amount, 0);
  const expectedPerMonth = 80000;
  const expectedTotalThreeMonths = expectedPerMonth * 3;
  const complianceWeight = Math.min(100, Math.round((totalCollected / expectedTotalThreeMonths) * 100));
  const employmentWeight = Math.round((aliveMembersList.filter(m => m.profession && m.profession !== 'Estudante' && m.profession !== 'Reformada' && m.profession !== 'Reformado').length / totalAlive) * 100);
  const educationWeight = Math.round((aliveMembersList.filter(m => ['Licenciatura', 'Mestrado', 'Doutoramento'].includes(m.educationLevel)).length / totalAlive) * 100);
  const headerFPIScore = Math.min(100, Math.round((complianceWeight + employmentWeight + educationWeight + 85) / 4));

  return (
    <div className={`min-h-screen flex ${isDarkMode ? 'bg-zinc-950 text-zinc-100' : 'bg-slate-50 text-slate-800'}`}>
      
      {/* Sidebar navigation controls */}
      <Sidebar 
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        activeRole={activeRole}
        setActiveRole={setActiveRole}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        members={members}
      />

      {/* Main Panel Content with custom grid spacing and responsive overflow protection */}
      <main className="flex-1 min-w-0 flex flex-col h-screen overflow-hidden">
        {/* Geometric Balance High-Contrast Header */}
        <header className={`h-16 border-b flex items-center justify-between px-6 md:px-8 shrink-0 ${
          isDarkMode ? 'bg-zinc-900/60 border-zinc-800 text-zinc-100' : 'bg-white border-slate-200 text-slate-800'
        }`}>
          <div className="flex items-center gap-4">
            <h1 className={`text-base md:text-lg font-extrabold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              {tabTitles[currentTab] || 'Painel de Controle'}
            </h1>
            <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider shrink-0 ${
              isDarkMode ? 'bg-indigo-900/40 text-indigo-300 animate-pulse' : 'bg-indigo-50 text-indigo-700'
            }`}>
              Portal Kinjango
            </span>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="text-right hidden sm:block">
                <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">Family Progress Index</p>
                <div className="flex items-center gap-1.5 justify-end">
                  <span className={`text-sm font-black ${isDarkMode ? 'text-zinc-100' : 'text-slate-900'}`}>{headerFPIScore}.0%</span>
                  <span className="text-[10px] text-emerald-500 font-bold">▲ 2.4%</span>
                </div>
              </div>
              <div className={`w-9 h-9 rounded-full border-2 flex items-center justify-center shrink-0 ${
                isDarkMode ? 'border-zinc-800 border-t-indigo-500' : 'border-slate-100 border-t-indigo-500'
              }`}>
                <span className="text-[9px] font-bold text-indigo-500">FPI</span>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic content scroll area */}
        <div className="flex-1 p-6 md:p-8 space-y-8 overflow-y-auto">
          {renderTabContent()}
        </div>
      </main>

      {/* Floating AI Companion globally rendered */}
      <AIAssistant isDarkMode={isDarkMode} />
    </div>
  );
}
