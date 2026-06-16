/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  FamilyMember, 
  Payment, 
  FPIRecommendation 
} from '../types';
import { 
  INITIAL_RECOMMENDATIONS 
} from '../mockData';
import { 
  TrendingUp, 
  Award, 
  GraduationCap, 
  Briefcase, 
  CheckSquare, 
  Plus, 
  Sparkles,
  Search,
  BookOpen,
  Info
} from 'lucide-react';

interface FPIProgressProps {
  members: FamilyMember[];
  payments: Payment[];
  isDarkMode: boolean;
}

export default function FPIProgress({
  members,
  payments,
  isDarkMode
}: FPIProgressProps) {
  const [recommendations, setRecommendations] = useState<FPIRecommendation[]>(INITIAL_RECOMMENDATIONS);
  const [suggestion, setSuggestion] = useState('');
  const [sugCategory, setSugCategory] = useState<'Participação' | 'Financeiro' | 'Educação' | 'Emprego'>('Educação');

  // Dynamic calculations based on active state of members
  const aliveMembers = members.filter(m => !m.isDeceased);
  const totalAlive = aliveMembers.length;

  // 1. Quotas score
  // Quotas collected vs total expected (simulate base expected per month as 8 paying adults * 10000 = 80000 per month over 3 months)
  const expectedTotal = 80000 * 3;
  const collectedTotal = payments.reduce((sum, p) => sum + p.amount, 0);
  const financialScore = Math.min(100, Math.round((collectedTotal / expectedTotal) * 100));

  // 2. Education score
  // Ratio of members with higher academic education (Licenciatura, Mestrado, Doutoramento)
  const highGradsCount = aliveMembers.filter(m => ['Licenciatura', 'Mestrado', 'Doutoramento'].includes(m.educationLevel)).length;
  const educationScore = Math.round((highGradsCount / totalAlive) * 105); // apply weight factor

  // 3. Employment score
  // Productive members (excluding student and children or retired)
  const productiveCount = aliveMembers.filter(m => m.profession && m.profession !== 'Estudante' && m.profession !== 'Reformada' && m.profession !== 'Reformado').length;
  const employmentScore = Math.round((productiveCount / totalAlive) * 100);

  // 4. Participation Score
  // Baseline static factor for community bonds
  const participationScore = 85; 

  // Combined FPI Score
  const fpiScore = Math.min(100, Math.round((financialScore + educationScore + employmentScore + participationScore) / 4));

  const handleAddSuggestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!suggestion.trim()) return;

    const newSug: FPIRecommendation = {
      id: "sug" + (recommendations.length + 1),
      category: sugCategory,
      impact: 'Médio',
      description: suggestion
    };

    setRecommendations([...recommendations, newSug]);
    setSuggestion('');
  };

  // Score Color Map helper
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-500 hover:text-emerald-400';
    if (score >= 55) return 'text-amber-500 hover:text-amber-400';
    return 'text-red-500 hover:text-red-400';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-sans">Family Progress Index (FPI)</h2>
          <p className="text-xs text-zinc-500">Métrica proprietária unificada para avaliar o desenvolvimento social, escolar e económico familiar.</p>
        </div>

        <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-400/20 text-amber-500 px-3 py-1.5 rounded-lg text-[10px] font-mono uppercase tracking-wider font-bold">
          <Award size={12} />
          <span>Status: Crescimento Saudável</span>
        </div>
      </div>

      {/* Main Score panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Total Score gauge card */}
        <div className={`p-6 rounded-2xl border text-center flex flex-col items-center justify-center space-y-4 ${
          isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-100'
        } shadow-sm`}>
          <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-zinc-400">Score Combinado</h3>
          
          <div className="relative w-40 h-40 flex items-center justify-center">
            {/* Simple CSS gauge simulation */}
            <svg className="w-full h-full transform -rotate-90">
              <circle 
                cx="80" 
                cy="80" 
                r="65" 
                stroke={isDarkMode ? '#1e1e24' : '#f1f5f9'} 
                strokeWidth="10" 
                fill="transparent" 
              />
              <circle 
                cx="80" 
                cy="80" 
                r="65" 
                stroke="#6366f1" 
                strokeWidth="12" 
                fill="transparent" 
                strokeDasharray="408"
                strokeDashoffset={408 - (408 * fpiScore) / 100}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute text-center">
              <span className="text-4.5xl font-serif font-bold text-zinc-900 dark:text-zinc-100 leading-none">
                {fpiScore}
              </span>
              <span className="text-[10px] text-zinc-400 font-mono block uppercase mt-1">Pontos de 100</span>
            </div>
          </div>

          <p className="text-xs text-zinc-500 font-sans max-w-[200px]">
            O score atual reflete avanço educacional e excelente assiduidade fiscal na tesouraria do dote.
          </p>
        </div>

        {/* PILLARS DETAILED BREAKS */}
        <div className={`md:col-span-2 p-6 rounded-2xl border space-y-4 justify-between flex flex-col ${
          isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-100'
        } shadow-sm`}>
          <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-zinc-400">Pilaress de Crescimento Corporativo</h3>
          
          <div className="space-y-4 text-xs font-sans">
            {/* Pillar 1: Financial Quota */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between font-semibold">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
                  Finanças e Quotas do Lado Social ({financialScore}%)
                </span>
                <span className="font-mono text-zinc-400">Colegial</span>
              </div>
              <div className="w-full h-2 rounded-full bg-zinc-800/40 overflow-hidden">
                <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${financialScore}%` }}></div>
              </div>
            </div>

            {/* Pillar 2: Academic Education */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between font-semibold">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-pink-500"></span>
                  Formação Académica Superior ({Math.min(100, educationScore)}%)
                </span>
                <span className="font-mono text-zinc-400">Geração Jovem</span>
              </div>
              <div className="w-full h-2 rounded-full bg-zinc-800/40 overflow-hidden">
                <div className="h-full bg-pink-500 rounded-full" style={{ width: `${Math.min(100, educationScore)}%` }}></div>
              </div>
            </div>

            {/* Pillar 3: Productive Activity */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between font-semibold">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  Empregabilidade e Produtividade ({employmentScore}%)
                </span>
                <span className="font-mono text-zinc-400">Atividade Ativa</span>
              </div>
              <div className="w-full h-2 rounded-full bg-zinc-800/40 overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${employmentScore}%` }}></div>
              </div>
            </div>

            {/* Pillar 4: Participation */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between font-semibold">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                  Comunicação e Laços Conjugais ({participationScore}%)
                </span>
                <span className="font-mono text-zinc-400">Eventos</span>
              </div>
              <div className="w-full h-2 rounded-full bg-zinc-800/40 overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: `${participationScore}%` }}></div>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl border dark:border-zinc-800 bg-zinc-950/25 flex items-center gap-2 text-[10px] text-zinc-400">
            <Info size={14} className="text-zinc-500 shrink-0" />
            <p>
              * O cálculo é recalculado automaticamente em tempo de execução quando novos membros se formam, pagam quotas ou comunicam no mural.
            </p>
          </div>
        </div>

      </div>

      {/* STRATEGIC GUIDELINES TIMELINE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Guidelines List */}
        <div className={`lg:col-span-2 p-6 rounded-2xl border ${
          isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-100'
        } space-y-4 shadow-sm`}>
          <h3 className="text-sm font-bold font-sans flex items-center gap-1.5">
            <BookOpen size={16} className="text-indigo-500" />
            Diretrizes recomendadas do Conselho
          </h3>

          <div className="space-y-4">
            {recommendations.map(rec => (
              <div key={rec.id} className="p-4 rounded-xl bg-zinc-950/30 border border-zinc-800 flex items-start gap-3.5 text-xs">
                <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold font-mono tracking-wider ${
                  rec.impact === 'Alto' ? 'bg-red-500/10 text-red-500' : 'bg-amber-500/10 text-amber-500'
                }`}>
                  Impactor: {rec.impact}
                </span>

                <div className="min-w-0 flex-1 leading-relaxed">
                  <span className="text-[10px] font-bold font-mono text-indigo-400 block mb-1 uppercase tracking-widest">{rec.category}</span>
                  <p className="text-zinc-300 font-sans">{rec.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Suggest direct policy guideline */}
        <div className={`p-6 rounded-2xl border flex flex-col justify-between ${
          isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-100'
        } shadow-sm`}>
          <form onSubmit={handleAddSuggestion} className="space-y-4 text-xs font-sans">
            <div className="flex items-center gap-1.5 border-b dark:border-zinc-800 pb-3">
              <Sparkles size={15} className="text-amber-400 animate-pulse" />
              <h4 className="font-bold">Propor Diretriz ao Conselho</h4>
            </div>

            <div>
              <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-1">Categoria de Incentivo</label>
              <select
                value={sugCategory}
                onChange={(e) => setSugCategory(e.target.value as any)}
                className={`w-full px-3 py-2 rounded-lg border focus:outline-none ${
                  isDarkMode ? 'bg-zinc-950 border-zinc-800 text-zinc-200' : 'bg-white border-slate-200 text-slate-800'
                }`}
              >
                <option value="Educação">Educação e Bolsas</option>
                <option value="Financeiro">Arrecadação e Quotas</option>
                <option value="Emprego">Estágios e Micro-crédito</option>
                <option value="Participação">Reuniões e Alambamentos</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-1">Descrição do Plano Estratégico</label>
              <textarea
                required
                rows={5}
                value={suggestion}
                onChange={(e) => setSuggestion(e.target.value)}
                placeholder="Ex: Estabelecer premiação anual académica de bolsas de mérito financiadas por 7% do fundo acumulado..."
                className={`w-full px-3 py-2 rounded-lg border focus:outline-none ${
                  isDarkMode ? 'bg-zinc-950 border-zinc-800 text-zinc-200' : 'bg-white border-slate-200 text-slate-800'
                }`}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-xl cursor-pointer shadow-lg shadow-indigo-600/10 text-center"
            >
              Arquivar Proposta Estratégica
            </button>
          </form>
        </div>

      </div>

    </div>
  );
}
