/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PatientRecord, FamilyMember, UserRole } from '../types';
import { 
  Heart, 
  Activity, 
  Plus, 
  ShieldAlert, 
  User, 
  Clock, 
  FileEdit, 
  Trash2, 
  X,
  Stethoscope
} from 'lucide-react';

interface PatientsProps {
  patients: PatientRecord[];
  setPatients: (p: PatientRecord[]) => void;
  members: FamilyMember[];
  activeRole: UserRole;
  isDarkMode: boolean;
}

export default function Patients({
  patients,
  setPatients,
  members,
  activeRole,
  isDarkMode
}: PatientsProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<PatientRecord | null>(null);

  // Form fields
  const [memberId, setMemberId] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [clinicalState, setClinicalState] = useState<'Estável' | 'Sério' | 'Crítico'>('Sério');
  const [needs, setNeeds] = useState('');
  const [responsibleMemberId, setResponsibleMemberId] = useState('');

  const getMemberDetails = (id: string) => {
    return members.find(m => m.id === id);
  };

  const handlesubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberId || !diagnosis) return;

    const patientMember = getMemberDetails(memberId);
    const responsibleMember = getMemberDetails(responsibleMemberId);

    if (editingPatient) {
      // Edit
      const updated = patients.map(p => {
        if (p.id === editingPatient.id) {
          return {
            ...p,
            memberId,
            memberName: patientMember?.fullName || p.memberName,
            diagnosis,
            clinicalState,
            needs,
            responsibleMemberId,
            responsibleMemberName: responsibleMember?.fullName || 'Conselho Geral'
          };
        }
        return p;
      });
      setPatients(updated);
    } else {
      // Create
      const newRec: PatientRecord = {
        id: "p" + (patients.length + 1),
        memberId,
        memberName: patientMember?.fullName || 'Desconhecido',
        diagnosis,
        clinicalState,
        needs,
        responsibleMemberId,
        responsibleMemberName: responsibleMember?.fullName || 'Conselho Geral',
        updatedAt: new Date().toISOString().split('T')[0]
      };
      setPatients([...patients, newRec]);
    }

    setIsFormOpen(false);
    setEditingPatient(null);
    setMemberId('');
    setDiagnosis('');
    setNeeds('');
    setResponsibleMemberId('');
  };

  const handleEdit = (p: PatientRecord) => {
    setEditingPatient(p);
    setMemberId(p.memberId);
    setDiagnosis(p.diagnosis);
    setClinicalState(p.clinicalState);
    setNeeds(p.needs);
    setResponsibleMemberId(p.responsibleMemberId);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Deseja remover este alerta de saúde familiar?")) {
      setPatients(patients.filter(p => p.id !== id));
    }
  };

  const canAlter = activeRole === UserRole.SUPER_ADMIN || activeRole === UserRole.CONSELHO_FAMILIAR || activeRole === UserRole.SECRETARIO;

  return (
    <div className="space-y-6 animate-fade-in">
      
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold font-sans">Gestão de Familiares Doentes</h2>
          <p className="text-xs text-zinc-500">Monitorização ativa, alertabilidade rápida e suprimento de apoio em saúde.</p>
        </div>

        {canAlter && (
          <button
            onClick={() => {
              setEditingPatient(null);
              setIsFormOpen(true);
            }}
            className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white font-semibold text-xs px-4 py-2.5 rounded-xl cursor-pointer"
          >
            <Plus size={14} />
            <span>Adicionar Alerta de Saúde</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {patients.map((p) => {
          const detail = getMemberDetails(p.memberId);
          return (
            <div key={p.id} className={`p-5 rounded-2xl border flex flex-col justify-between space-y-4 ${
              p.clinicalState === 'Crítico' 
                ? isDarkMode ? 'bg-red-950/15 border-red-900/50' : 'bg-red-50/50 border-red-200'
                : isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-100'
            } shadow-sm`}>
              <div>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    {detail?.photoUrl ? (
                      <img src={detail.photoUrl} alt={p.memberName} referrerPolicy="no-referrer" className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-zinc-800 text-zinc-400 flex items-center justify-center">
                        <User size={18} />
                      </div>
                    )}
                    <div>
                      <h4 className="text-sm font-bold font-sans">{p.memberName}</h4>
                      <span className="text-[10px] text-zinc-500 font-mono">Último diagnóstico: {p.updatedAt}</span>
                    </div>
                  </div>

                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                    p.clinicalState === 'Crítico' ? 'bg-red-500/15 text-red-500 animate-pulse' :
                    p.clinicalState === 'Sério' ? 'bg-amber-500/15 text-amber-500' : 'bg-emerald-500/15 text-emerald-500'
                  }`}>
                    {p.clinicalState}
                  </span>
                </div>

                <div className="space-y-3.5 mt-4 text-xs font-sans">
                  <div>
                    <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block mb-0.5">Diagnóstico Clínico:</span>
                    <p className="font-semibold">{p.diagnosis}</p>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block mb-0.5 font-bold text-red-500">Necessidades Imediatas:</span>
                    <p className="leading-relaxed text-zinc-600 dark:text-zinc-300">{p.needs}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between border-t dark:border-zinc-800 pt-3.5 mt-2">
                <div className="flex items-center gap-1.5 text-xs">
                  <Stethoscope size={13} className="text-zinc-400" />
                  <span className="text-zinc-500 dark:text-zinc-400 font-mono">Cuidadora: <strong>{p.responsibleMemberName}</strong></span>
                </div>

                {canAlter && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleEdit(p)}
                      className={`p-1.5 rounded-lg border cursor-pointer hover:bg-slate-50 dark:hover:bg-zinc-800 ${
                        isDarkMode ? 'border-zinc-800 text-blue-400' : 'border-slate-200 text-blue-600'
                      }`}
                      title="Editar Diagnóstico"
                    >
                      <FileEdit size={12} />
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className={`p-1.5 rounded-lg border cursor-pointer hover:bg-red-600 hover:text-white ${
                        isDarkMode ? 'border-zinc-800 text-red-400' : 'border-slate-200 text-red-500'
                      }`}
                      title="Remover Registro Alerta"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {patients.length === 0 && (
          <div className="text-center font-mono py-10 text-zinc-400 text-xs md:col-span-2">
            Nenhum alerta de enfermidade familiar cadastrado atualmente. Graças a Deus, todos se encontram saudáveis!
          </div>
        )}
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handlesubmit} className={`w-full max-w-md rounded-2xl shadow-2xl p-6 space-y-4 text-xs font-sans ${
            isDarkMode ? 'bg-zinc-900 border border-zinc-800' : 'bg-white border'
          }`}>
            <h4 className="font-bold text-sm uppercase tracking-wider text-zinc-400">Registrar Monitorização Clínica</h4>

            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-1">Membro de Família Afetado</label>
                <select
                  required
                  value={memberId}
                  onChange={(e) => setMemberId(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    isDarkMode ? 'bg-zinc-950 border-zinc-800 text-zinc-200' : 'bg-white border-slate-200'
                  }`}
                >
                  <option value="">Selecione o parente...</option>
                  {members.map(m => (
                    <option key={m.id} value={m.id}>{m.fullName}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-1">Diagnóstico Geral</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Pneumonia Crónica e Diabetes tipo B"
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    isDarkMode ? 'bg-zinc-950 border-zinc-800 text-zinc-200' : 'bg-white border-slate-200'
                  }`}
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-1">Estado do Quadro Clínico</label>
                <select
                  value={clinicalState}
                  onChange={(e) => setClinicalState(e.target.value as any)}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    isDarkMode ? 'bg-zinc-950 border-zinc-800 text-zinc-200' : 'bg-white border-slate-200'
                  }`}
                >
                  <option value="Estável">Estável (Apenas observação)</option>
                  <option value="Sério">Sério (Requer medicação frequente)</option>
                  <option value="Crítico">Crítico (Urgência hospitalar e enfermeira)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-1">Apoios e Necessidades Específicas</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Ex: Medicamento X, visitas diárias, cadeira de rodas especial..."
                  value={needs}
                  onChange={(e) => setNeeds(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    isDarkMode ? 'bg-zinc-950 border-zinc-800 text-zinc-200' : 'bg-white border-slate-200'
                  }`}
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-1">Parente Responsável Principal (Cuidador)</label>
                <select
                  value={responsibleMemberId}
                  onChange={(e) => setResponsibleMemberId(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    isDarkMode ? 'bg-zinc-950 border-zinc-800 text-zinc-200' : 'bg-white border-slate-200'
                  }`}
                >
                  <option value="">Selecione o tutor...</option>
                  {members.map(m => (
                    <option key={m.id} value={m.id}>{m.fullName}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t pt-4 dark:border-zinc-800">
              <button
                type="button"
                onClick={() => {
                  setIsFormOpen(false);
                  setEditingPatient(null);
                }}
                className={`px-3 py-1.5 rounded-lg font-semibold ${
                  isDarkMode ? 'bg-zinc-800 hover:bg-zinc-750 text-zinc-300' : 'bg-slate-100 text-slate-700'
                }`}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded-lg font-semibold cursor-pointer"
              >
                Gravar Alerta
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
