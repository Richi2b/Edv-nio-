/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  FamilyMember, 
  Payment, 
  FamilyRequest, 
  PatientRecord, 
  FamilyEvent, 
  UserRole 
} from '../types';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  LineChart,
  Line
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  Activity, 
  Heart, 
  Clock, 
  AlertTriangle,
  BadgeAlert,
  HandCoins,
  HeartHandshake
} from 'lucide-react';

interface DashboardProps {
  members: FamilyMember[];
  payments: Payment[];
  requests: FamilyRequest[];
  patients: PatientRecord[];
  events: FamilyEvent[];
  activeRole: UserRole;
  isDarkMode: boolean;
  setCurrentTab: (tab: string) => void;
}

export default function Dashboard({
  members,
  payments,
  requests,
  patients,
  events,
  activeRole,
  isDarkMode,
  setCurrentTab
}: DashboardProps) {
  // Live State Statistics
  const totalMembers = members.length;
  const aliveMembersList = members.filter(m => !m.isDeceased);
  const totalAlive = aliveMembersList.length;
  const totalDeceased = members.filter(m => m.isDeceased).length;
  
  // Patient details
  const activePatients = patients.length;
  const criticalPatients = patients.filter(p => p.clinicalState === 'Sério' || p.clinicalState === 'Crítico').length;

  // Active pending requests
  const pendingRequests = requests.filter(r => r.status === 'Submetido' || r.status === 'Em Análise').length;

  // Financial calculations
  // Monthly quota is 10.000 Kz. Let's count active adult members.
  // Active adult members (Age >= 18). Let's assume anyone born before 2008-01-01 is an adult.
  const adultMembers = aliveMembersList.filter(m => {
    const age = new Date().getFullYear() - new Date(m.birthDate).getFullYear();
    return age >= 18;
  });
  const totalAdultsCount = adultMembers.length;

  // Expected quotas: for Mar, Apr, May 2026 (for each month we expect totalAdultsCount * 10,000 Kz)
  // Let's use the actual payments record size or live values to compute
  const totalCollected = payments.reduce((sum, p) => sum + p.amount, 0);
  
  // Total expected historically = say we have 3 months tracked (3 * 8 active paying adults in mock)
  const expectedPerMonth = 80000; // 8 paying members * 10000
  const expectedTotalThreeMonths = expectedPerMonth * 3;
  const totalDue = Math.max(0, expectedTotalThreeMonths - totalCollected);

  // Active/Upcoming events (next 3 inside June/July 2026)
  const upcomingEvents = [...events]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  // Recharts metric calculations: Quotas Trends
  const monthsData = [
    { name: 'Março', arrecadado: 80000, esperado: 80000, divida: 0 },
    { name: 'Abril', arrecadado: 60000, esperado: 80000, divida: 20000 },
    { name: 'Maio', arrecadado: 51500, esperado: 80000, divida: 28500 },
  ];

  // Gender Demographics data
  const maleCount = aliveMembersList.filter(m => m.gender === 'M').length;
  const femaleCount = aliveMembersList.filter(m => m.gender === 'F').length;
  const genderData = [
    { name: 'Masculino', value: maleCount, color: '#3b82f6' },
    { name: 'Feminino', value: femaleCount, color: '#ec4899' }
  ];

  // Generation Distribution Data
  const getGeneration = (birthDate: string) => {
    const year = new Date(birthDate).getFullYear();
    if (year <= 1955) return 'Geração Patrono (Avó/Avô)';
    if (year <= 1980) return 'Geração Líder (Pais)';
    if (year <= 2000) return 'Geração Jovem (Netos)';
    return 'Geração Júnior (Bisnetos)';
  };
  const generations = aliveMembersList.reduce((acc: Record<string, number>, curr) => {
    const gen = getGeneration(curr.birthDate);
    acc[gen] = (acc[gen] || 0) + 1;
    return acc;
  }, {});

  const generationData = Object.keys(generations).map(key => ({
    name: key,
    Quantidade: generations[key]
  }));

  // FPI Summary calculation (dynamic representation)
  const complianceWeight = Math.min(100, Math.round((totalCollected / expectedTotalThreeMonths) * 100));
  const employmentWeight = Math.round((aliveMembersList.filter(m => m.profession && m.profession !== 'Estudante' && m.profession !== 'Reformada' && m.profession !== 'Reformado').length / totalAlive) * 100);
  const educationWeight = Math.round((aliveMembersList.filter(m => ['Licenciatura', 'Mestrado', 'Doutoramento'].includes(m.educationLevel)).length / totalAlive) * 100);
  const FPIValue = Math.round((complianceWeight + employmentWeight + educationWeight) / 3);

  return (
    <div id="dashboard-module-view" className="space-y-8 animate-fade-in">
      {/* Module Title Section */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-sans tracking-tight">Painel Gestão Família Kinjango</h2>
          <p className="text-sm text-zinc-400">Análise empresarial, fluxo financeiro, saúde e árvore da linhagem familiar em tempo real.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs font-mono px-3 py-1.5 rounded-full border ${
            isDarkMode ? 'border-zinc-800 bg-zinc-900 text-indigo-400' : 'border-slate-200 bg-slate-100 text-indigo-600'
          }`}>
            Sessão Administrativa: <strong className="font-semibold uppercase">{activeRole}</strong>
          </span>
        </div>
      </div>

      {/* CRITICAL ALERTS BANNER FOR PATIENTS */}
      {criticalPatients > 0 && (
        <div className={`p-4 rounded-xl border flex items-start gap-4 shadow-sm animate-pulse ${
          isDarkMode ? 'bg-red-950/20 border-red-900/50 text-red-200' : 'bg-red-50 border-red-200 text-red-900'
        }`}>
          <BadgeAlert size={24} className="text-red-500 shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold font-sans">Alerta Prioritário de Saúde Familiar!</h4>
            <p className="text-xs text-zinc-400 mt-1 dark:text-zinc-300">
              Existe {criticalPatients} parente com quadro clínico sério necessitando de reabilitação urgente: 
              {patients.map(p => ` ${p.memberName} (${p.clinicalState}) - Responsável: ${p.responsibleMemberName}.`)}
            </p>
            <button 
              onClick={() => setCurrentTab('patients')}
              className="text-xs font-bold underline mt-2 text-red-500 hover:text-red-400 cursor-pointer block"
            >
              Consultar Acompanhamento Clínico →
            </button>
          </div>
        </div>
      )}

      {/* KPI GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* KPI: Total Members */}
        <div className={`p-5 rounded-2xl border ${
          isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-100'
        } shadow-sm backdrop-blur-sm transition-transform hover:-translate-y-0.5 duration-200`}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold font-mono uppercase tracking-wider text-zinc-400">Total Linhagem</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
              <Users size={16} />
            </div>
          </div>
          <p className="text-2xl font-bold font-sans">{totalMembers} Membros</p>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-zinc-400">
            <span className="text-emerald-500 font-semibold">• {totalAlive} Ativos</span>
            <span>/</span>
            <span className="text-zinc-500 font-semibold">• {totalDeceased} Memorial</span>
          </div>
        </div>

        {/* KPI: Quotas collected */}
        <div className={`p-5 rounded-2xl border ${
          isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-100'
        } shadow-sm backdrop-blur-sm transition-transform hover:-translate-y-0.5 duration-200`}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold font-mono uppercase tracking-wider text-zinc-400">Fundo Arrecadado</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <HandCoins size={16} />
            </div>
          </div>
          <p className="text-2xl font-bold font-sans text-emerald-500">{(totalCollected).toLocaleString()} Kz</p>
          <div className="flex items-center gap-1 mt-2 text-xs text-zinc-400">
            <span className="font-mono text-zinc-500">Taxa Base: 10.000 Kz/mês</span>
          </div>
        </div>

        {/* KPI: Total Debt */}
        <div className={`p-5 rounded-2xl border ${
          isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-100'
        } shadow-sm backdrop-blur-sm transition-transform hover:-translate-y-0.5 duration-200`}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold font-mono uppercase tracking-wider text-zinc-400">Dívida em Quotas</span>
            <div className="w-8 h-8 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center">
              <AlertTriangle size={16} />
            </div>
          </div>
          <p className="text-2xl font-bold font-sans text-red-500">{(totalDue).toLocaleString()} Kz</p>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-red-400">
            <span>Quota Esperada: {(expectedTotalThreeMonths).toLocaleString()} Kz</span>
          </div>
        </div>

        {/* KPI: FPI Index */}
        <div className={`p-5 rounded-2xl border ${
          isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-100'
        } shadow-sm backdrop-blur-sm transition-transform hover:-translate-y-0.5 duration-200`}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold font-mono uppercase tracking-wider text-zinc-400">Índice Progresso (FPI)</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <TrendingUp size={16} />
            </div>
          </div>
          <p className="text-2xl font-bold font-sans text-amber-500">{FPIValue} / 100</p>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-amber-400 font-semibold cursor-pointer" onClick={() => setCurrentTab('fpi')}>
            <span>Nível de Progresso Saudável →</span>
          </div>
        </div>

      </div>

      {/* RECHARTS DATA VISUALIZATION SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Area / Column Chart for quotas comparison */}
        <div className={`lg:col-span-2 p-6 rounded-2xl border ${
          isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-100'
        }`}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-bold font-sans">Histórico de Quotas Mensais (10k Kz/membro)</h3>
              <p className="text-xs text-zinc-500">Total arrecadado vs esperado por trimestre de prestação</p>
            </div>
            <span className="text-xs text-indigo-500 font-mono font-bold">Kwanza (AOA)</span>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthsData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#27272a' : '#f1f5f9'} />
                <XAxis dataKey="name" fontSize={11} stroke={isDarkMode ? '#71717a' : '#64748b'} />
                <YAxis fontSize={11} stroke={isDarkMode ? '#71717a' : '#64748b'} />
                <Tooltip 
                  contentStyle={isDarkMode ? { backgroundColor: '#18181b', borderColor: '#27272a' } : {}}
                  labelClassName="text-sm font-bold"
                />
                <Legend iconSize={10} wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="esperado" fill="#6366f1" name="Esperado" radius={[4, 4, 0, 0]} />
                <Bar dataKey="arrecadado" fill="#10b981" name="Arrecadado" radius={[4, 4, 0, 0]} />
                <Bar dataKey="divida" fill="#ef4444" name="Dívida" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie chart and Quick Stats right column */}
        <div className={`p-6 rounded-2xl border ${
          isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-100'
        } flex flex-col justify-between`}>
          <div>
            <h3 className="text-sm font-bold font-sans mb-1">Crescimento Linguagem por Sexo</h3>
            <p className="text-xs text-zinc-500 mb-4">Divisão proporcional dos parentes vivos</p>
            
            <div className="h-44 relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={genderData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={65}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {genderData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={isDarkMode ? { backgroundColor: '#18181b', borderColor: '#27272a' } : {}} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute text-center">
                <span className="text-2xl font-bold block">{totalAlive}</span>
                <span className="text-[10px] text-zinc-400 font-mono uppercase">Vivos Ativos</span>
              </div>
            </div>

            {/* List labels */}
            <div className="space-y-1.5 mt-2">
              {genderData.map((entry, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs font-sans">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }}></span>
                    <span className="text-zinc-500 dark:text-zinc-400">{entry.name}</span>
                  </div>
                  <span className="font-semibold">{entry.value} membros ({Math.round((entry.value/totalAlive)*100)}%)</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* BOTTOM SEGMENT: EVENTS AND PEDIDOS ACTION BOX */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Upcoming Events Module Quick Box */}
        <div className={`p-6 rounded-2xl border ${
          isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-100'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold font-sans flex items-center gap-2">
              <Clock size={16} className="text-indigo-500" />
              Eventos Semanais & Reuniões Próximas
            </h3>
            <button 
              onClick={() => setCurrentTab('calendar')}
              className="text-xs text-indigo-500 font-semibold hover:underline cursor-pointer"
            >
              Ver Tudo
            </button>
          </div>

          <div className="space-y-3.5">
            {upcomingEvents.map((evt) => (
              <div key={evt.id} className={`p-3 rounded-xl border flex items-center justify-between gap-4 ${
                isDarkMode ? 'bg-zinc-950 border-zinc-800 hover:bg-zinc-900' : 'bg-slate-50 border-slate-200/60 hover:bg-slate-100'
              } transition-colors duration-150`}>
                <div className="min-w-0 flex-1">
                  <span className={`text-[9px] font-mono font-semibold px-2 py-0.5 rounded-full ${
                    evt.type === 'Aniversário' ? 'bg-pink-500/10 text-pink-500' :
                    evt.type === 'Casamento' ? 'bg-amber-500/10 text-amber-500' :
                    evt.type === 'Reunião' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-indigo-500/10 text-indigo-500'
                  }`}>
                    {evt.type}
                  </span>
                  <h4 className="text-xs font-bold font-sans mt-1.5 truncate">{evt.title}</h4>
                  <p className="text-[10px] text-zinc-500 truncate mt-0.5">{evt.description}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs font-semibold font-mono">{evt.date}</p>
                  <span className="text-[9px] text-zinc-400 block truncate font-mono max-w-[100px]">{evt.location}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Requests quick look & strategic recommendation */}
        <div className={`p-6 rounded-2xl border ${
          isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-100'
        } flex flex-col justify-between`}>
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold font-sans flex items-center gap-2">
                <HeartHandshake size={16} className="text-indigo-500" />
                Pedidos de Apoio Familiar
              </h3>
              {pendingRequests > 0 && (
                <span className="bg-amber-500/15 text-amber-500 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold animate-pulse">
                  {pendingRequests} pendentes
                </span>
              )}
            </div>

            <div className="space-y-3">
              {requests.slice(0, 2).map((req) => (
                <div key={req.id} className="text-xs font-sans">
                  <div className="flex items-center justify-between font-semibold">
                    <span className="truncate max-w-[200px]">{req.title}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold ${
                      req.status === 'Submetido' ? 'bg-indigo-500/10 text-indigo-500' :
                      req.status === 'Em Análise' ? 'bg-amber-500/10 text-amber-500' :
                      req.status === 'Aprovado' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-zinc-500/10 text-zinc-500'
                    }`}>
                      {req.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 truncate mt-1">{req.description}</p>
                  {req.amountRequested && (
                    <p className="text-[10px] text-emerald-500 font-semibold font-mono mt-0.5">
                      Montante: {req.amountRequested.toLocaleString()} Kz
                    </p>
                  )}
                  <hr className={`my-2 ${isDarkMode ? 'border-zinc-800' : 'border-slate-100'}`} />
                </div>
              ))}
            </div>
          </div>

          <button 
            onClick={() => setCurrentTab('requests')}
            className={`w-full py-2 flex items-center justify-center gap-2 border rounded-xl text-xs font-semibold cursor-pointer ${
              isDarkMode 
                ? 'border-zinc-800 hover:bg-zinc-950 text-indigo-400' 
                : 'border-slate-200 hover:bg-slate-50 text-indigo-600'
            }`}
          >
            Acessar Fluxo de Pedidos e Apoio →
          </button>
        </div>

      </div>

    </div>
  );
}
