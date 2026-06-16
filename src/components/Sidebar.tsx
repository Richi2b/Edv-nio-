/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  FamilyMember, 
  UserRole 
} from '../types';
import { 
  LayoutDashboard, 
  Users, 
  GitFork, 
  HeartHandshake, 
  Activity, 
  Heart, 
  DollarSign, 
  Calendar, 
  MessageSquare, 
  TrendingUp, 
  Bot, 
  Moon, 
  Sun,
  ShieldCheck,
  ChevronDown,
  User
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  activeRole: UserRole;
  setActiveRole: (role: UserRole) => void;
  isDarkMode: boolean;
  setIsDarkMode: (dark: boolean) => void;
  currentUser: FamilyMember | null;
  setCurrentUser: (member: FamilyMember) => void;
  members: FamilyMember[];
}

export default function Sidebar({
  currentTab,
  setCurrentTab,
  activeRole,
  setActiveRole,
  isDarkMode,
  setIsDarkMode,
  currentUser,
  setCurrentUser,
  members
}: SidebarProps) {
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Painel Geral', icon: LayoutDashboard },
    { id: 'registry', label: 'Cadastro Familiar', icon: Users },
    { id: 'tree', label: 'Árvore Genealógica', icon: GitFork },
    { id: 'marriages', label: 'Casamentos', icon: Heart },
    { id: 'requests', label: 'Gestão de Pedidos', icon: HeartHandshake },
    { id: 'obituaries', label: 'Memorial & Óbitos', icon: ShieldCheck },
    { id: 'patients', label: 'Familiares Doentes', icon: Activity },
    { id: 'finance', label: 'Gestão Financeira', icon: DollarSign },
    { id: 'calendar', label: 'Calendário Familiar', icon: Calendar },
    { id: 'communication', label: 'Mural de Notícias', icon: MessageSquare },
    { id: 'fpi', label: 'Progresso Familiar (FPI)', icon: TrendingUp },
    { id: 'ai', label: 'Familiar Assistente IA', icon: Bot, badge: 'IA' },
  ];

  const roleLabels: Record<UserRole, { title: string; color: string }> = {
    [UserRole.SUPER_ADMIN]: { title: 'Super Administrador', color: 'bg-indigo-600 text-white' },
    [UserRole.CONSELHO_FAMILIAR]: { title: 'Conselho Familiar', color: 'bg-emerald-600 text-white' },
    [UserRole.TESOUREIRO]: { title: 'Tesoureiro da Família', color: 'bg-amber-600 text-white' },
    [UserRole.SECRETARIO]: { title: 'Secretário Familiar', color: 'bg-sky-600 text-white' },
    [UserRole.FAMILIAR]: { title: 'Membro / Familiar', color: 'bg-neutral-600 text-white' },
  };

  // Find a suitable member representative for the selected role to simulate a logged-in user
  const handleRoleChange = (role: UserRole) => {
    setActiveRole(role);
    setRoleDropdownOpen(false);

    // Auto-select a representative member to keep the simulation seamless
    let rep: FamilyMember | undefined;
    if (role === UserRole.TESOUREIRO) {
      rep = members.find(m => m.id === 'm9'); // Lucas
    } else if (role === UserRole.SECRETARIO) {
      rep = members.find(m => m.id === 'm5'); // Teresa
    } else if (role === UserRole.CONSELHO_FAMILIAR) {
      rep = members.find(m => m.id === 'm3'); // António
    } else if (role === UserRole.SUPER_ADMIN) {
      rep = members.find(m => m.id === 'm6'); // Bernardo (Web Dev / Admin)
    } else {
      rep = members.find(m => m.id === 'm7'); // Jandira
    }
    if (rep) {
      setCurrentUser(rep);
    }
  };

  return (
    <aside className={`w-80 border-r flex flex-col justify-between transition-colors duration-300 ${
      isDarkMode ? 'bg-zinc-950 border-zinc-800 text-zinc-100' : 'bg-white border-slate-200 text-slate-800'
    } h-screen sticky top-0 overflow-y-auto`}>
      
      {/* Upper Navigation & Branding */}
      <div>
        {/* Brand logo & title */}
        <div className={`p-6 border-b flex items-center justify-between ${
          isDarkMode ? 'border-zinc-800' : 'border-slate-100'
        }`}>
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 text-white p-2.5 rounded-xl shadow-lg shadow-indigo-600/20 flex items-center justify-center">
              <span className="font-sans font-bold text-lg tracking-wider">KF</span>
            </div>
            <div>
              <h1 className="font-sans font-bold text-lg tracking-tight">KinjangoFamily</h1>
              <p className="text-[10px] uppercase tracking-widest font-mono text-zinc-500">Módulos Corporativos</p>
            </div>
          </div>

          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-2 rounded-lg transition-all border ${
              isDarkMode ? 'hover:bg-zinc-900 border-zinc-800 text-amber-400' : 'hover:bg-slate-50 border-slate-200 text-indigo-600'
            }`}
            title="Alternar Tema"
          >
            {isDarkMode ? <Sun size={17} /> : <Moon size={17} />}
          </button>
        </div>

        {/* Dynamic simulator login selection widget */}
        <div className={`p-4 border-b ${isDarkMode ? 'border-zinc-800 bg-zinc-900/40' : 'border-slate-100 bg-slate-50/50'}`}>
          <div className="relative mb-3">
            <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block mb-1">
              Perfil Ativo (Simulação)
            </label>
            <button
              onClick={() => {
                setRoleDropdownOpen(!roleDropdownOpen);
                setUserDropdownOpen(false);
              }}
              className={`w-full flex items-center justify-between p-2.5 rounded-lg border text-left text-xs font-medium cursor-pointer transition-all ${
                isDarkMode ? 'bg-zinc-900 border-zinc-700 text-zinc-200 hover:border-zinc-500' : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${
                  activeRole === UserRole.SUPER_ADMIN ? 'bg-indigo-500' :
                  activeRole === UserRole.CONSELHO_FAMILIAR ? 'bg-emerald-500' :
                  activeRole === UserRole.TESOUREIRO ? 'bg-amber-500' :
                  activeRole === UserRole.SECRETARIO ? 'bg-sky-500' : 'bg-neutral-500'
                }`}></span>
                <span>{roleLabels[activeRole].title}</span>
              </div>
              <ChevronDown size={14} className="text-zinc-400" />
            </button>

            {roleDropdownOpen && (
              <div className={`absolute top-full left-0 right-0 z-50 mt-1 rounded-lg border shadow-xl ${
                isDarkMode ? 'bg-zinc-900 border-zinc-700' : 'bg-white border-slate-200'
              }`}>
                {Object.values(UserRole).map((role) => (
                  <button
                    key={role}
                    onClick={() => handleRoleChange(role)}
                    className={`w-full text-left px-3 py-2 text-xs font-sans hover:bg-indigo-600 hover:text-white transition-colors flex items-center gap-2 first:rounded-t-lg last:rounded-b-lg ${
                      activeRole === role ? 'bg-indigo-600/15 text-indigo-500' : isDarkMode ? 'text-zinc-300' : 'text-slate-700'
                    }`}
                  >
                    <span className="font-medium">{roleLabels[role].title}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Current simulating user avatar card */}
          {currentUser && (
            <div className="flex items-center gap-3">
              <img 
                src={currentUser.photoUrl} 
                alt={currentUser.fullName} 
                referrerPolicy="no-referrer"
                className="w-9 h-9 rounded-full object-cover ring-2 ring-indigo-500/50" 
              />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold truncate leading-tight">{currentUser.fullName}</p>
                <span className="text-[10px] text-zinc-400 block font-mono truncate">{currentUser.profession}</span>
              </div>
            </div>
          )}
        </div>

        {/* Scrollable menu directory */}
        <nav className="p-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                id={`sidebar-link-${item.id}`}
                onClick={() => setCurrentTab(item.id)}
                className={`w-full flex items-center justify-between text-left px-3 py-2.5 rounded-xl text-sm font-sans font-medium transition-all cursor-pointer ${
                  isActive 
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10' 
                    : isDarkMode 
                      ? 'text-zinc-400 hover:bg-zinc-900 hover:text-white' 
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={18} className={isActive ? 'text-white' : isDarkMode ? 'text-zinc-400' : 'text-slate-500'} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-md ${
                    isActive ? 'bg-white text-indigo-600' : 'bg-indigo-500/10 text-indigo-500'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Corporate Metadata Footer */}
      <div className={`p-5 text-center text-[10px] font-sans border-t ${
        isDarkMode ? 'border-zinc-800 text-zinc-500 bg-zinc-950' : 'border-slate-100 text-slate-400 bg-slate-50'
      }`}>
        <p className="font-semibold tracking-wider text-indigo-500 mb-0.5">KINJANGO FAMILY CORP</p>
        <p className="font-mono">FPI: Premium Multi-Family v1.0</p>
        <p className="text-[9px] mt-2 text-zinc-400 font-mono">Luanda & Huambo, Angola</p>
      </div>
    </aside>
  );
}
