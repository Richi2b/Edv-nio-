/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { FamilyMember, UserRole } from '../types';
import { 
  Search, 
  UserPlus, 
  Download, 
  FileSpreadsheet, 
  FileText, 
  Eye, 
  Edit, 
  Trash2, 
  ArrowLeft,
  X,
  User,
  Heart,
  Briefcase,
  Phone,
  Mail,
  MapPin,
  Calendar,
  GraduationCap
} from 'lucide-react';

interface CadastroFamiliarProps {
  members: FamilyMember[];
  setMembers: (m: FamilyMember[]) => void;
  activeRole: UserRole;
  isDarkMode: boolean;
}

export default function CadastroFamiliar({
  members,
  setMembers,
  activeRole,
  isDarkMode
}: CadastroFamiliarProps) {
  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [genderFilter, setGenderFilter] = useState('');
  const [maritalFilter, setMaritalFilter] = useState('');
  const [lineageFilter, setLineageFilter] = useState('');
  const [educationFilter, setEducationFilter] = useState('');

  // Selected view member / editing member
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<FamilyMember | null>(null);

  // Form states
  const [fullName, setFullName] = useState('');
  const [gender, setGender] = useState<'M' | 'F'>('M');
  const [birthDate, setBirthDate] = useState('');
  const [maritalStatus, setMaritalStatus] = useState<'Solteiro' | 'Casado' | 'Divorciado' | 'Viúvo'>('Solteiro');
  const [profession, setProfession] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [bio, setBio] = useState('');
  const [relationshipDegree, setRelationshipDegree] = useState('');
  const [lineage, setLineage] = useState('Linhagem Manuel Kinjango');
  const [educationLevel, setEducationLevel] = useState<FamilyMember['educationLevel']>('Básico');
  const [parentId, setParentId] = useState('');
  const [motherId, setMotherId] = useState('');
  const [spouseId, setSpouseId] = useState('');
  const [isDeceased, setIsDeceased] = useState(false);

  // Filter logic
  const filteredMembers = members.filter(m => {
    const matchesSearch = m.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          m.profession.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          m.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGender = genderFilter ? m.gender === genderFilter : true;
    const matchesMarital = maritalFilter ? m.maritalStatus === maritalFilter : true;
    const matchesLineage = lineageFilter ? m.lineage === lineageFilter : true;
    const matchesEducation = educationFilter ? m.educationLevel === educationFilter : true;
    return matchesSearch && matchesGender && matchesMarital && matchesLineage && matchesEducation;
  });

  // Open Form for Adding New Member
  const handleOpenAddForm = () => {
    setEditingMember(null);
    setFullName('');
    setGender('M');
    setBirthDate('1995-01-01');
    setMaritalStatus('Solteiro');
    setProfession('');
    setPhone('');
    setEmail('');
    setAddress('');
    setBio('');
    setRelationshipDegree('Neto');
    setLineage('Linhagem Manuel Kinjango');
    setEducationLevel('Básico');
    setParentId('');
    setMotherId('');
    setSpouseId('');
    setIsDeceased(false);
    setIsFormOpen(true);
  };

  // Open Form for Editing Member
  const handleOpenEditForm = (member: FamilyMember) => {
    setEditingMember(member);
    setFullName(member.fullName);
    setGender(member.gender);
    setBirthDate(member.birthDate);
    setMaritalStatus(member.maritalStatus);
    setProfession(member.profession);
    setPhone(member.phone);
    setEmail(member.email);
    setAddress(member.address);
    setBio(member.bio);
    setRelationshipDegree(member.relationshipDegree);
    setLineage(member.lineage);
    setEducationLevel(member.educationLevel);
    setParentId(member.parentId || '');
    setMotherId(member.motherId || '');
    setSpouseId(member.spouseId || '');
    setIsDeceased(!!member.isDeceased);
    setIsFormOpen(true);
  };

  // Handle Form Submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName) return;

    if (editingMember) {
      // Edit mode
      const updated = members.map(m => {
        if (m.id === editingMember.id) {
          return {
            ...m,
            fullName,
            gender,
            birthDate,
            maritalStatus,
            profession,
            phone,
            email,
            address,
            bio,
            relationshipDegree,
            lineage,
            educationLevel,
            parentId: parentId || undefined,
            motherId: motherId || undefined,
            spouseId: spouseId || undefined,
            isDeceased
          };
        }
        return m;
      });
      setMembers(updated);
    } else {
      // Add mode
      const newMember: FamilyMember = {
        id: "m" + (members.length + 1),
        fullName,
        photoUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(fullName)}&backgroundColor=${gender === 'M' ? '3b82f6' : 'ec4899'}`,
        gender,
        birthDate,
        maritalStatus,
        profession,
        phone,
        email,
        address,
        bio,
        relationshipDegree,
        lineage,
        educationLevel,
        parentId: parentId || undefined,
        motherId: motherId || undefined,
        spouseId: spouseId || undefined,
        isDeceased
      };
      setMembers([...members, newMember]);
    }
    setIsFormOpen(false);
    setEditingMember(null);
  };

  // Delete Member
  const handleDeleteMember = (id: string) => {
    if (confirm("Tem a certeza de que deseja remover este parente do cadastro familiar?")) {
      setMembers(members.filter(m => m.id !== id));
      if (selectedMember?.id === id) {
        setSelectedMember(null);
      }
    }
  };

  // Excel CSV exporter
  const exportExcelCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "ID,Nome Completo,Sexo,Nascimento,Estado Civil,Profissao,Contacto,Email,Endereco,Grau Parentesco,Linhagem,Escolaridade,Deceased\n";
    
    members.forEach(m => {
      csvContent += `"${m.id}","${m.fullName}","${m.gender}","${m.birthDate}","${m.maritalStatus}","${m.profession}","${m.phone}","${m.email}","${m.address}","${m.relationshipDegree}","${m.lineage}","${m.educationLevel}","${m.isDeceased ? 'SIM' : 'NAO'}"\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "Cadastro_Familia_Kinjango.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Helper for member Name mapping
  const getMemberName = (id?: string) => {
    if (!id) return null;
    return members.find(m => m.id === id)?.fullName || 'N/A';
  };

  // check if role can alter data
  const canAlter = activeRole === UserRole.SUPER_ADMIN || activeRole === UserRole.CONSELHO_FAMILIAR || activeRole === UserRole.SECRETARIO;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-sans tracking-tight">Cadastro Oficial de Pessoas</h2>
          <p className="text-xs text-zinc-500">Gestão integrada do registo de parentes, contactabilidade, formação académica e profissões.</p>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          {canAlter && (
            <button
              onClick={handleOpenAddForm}
              className="flex items-center justify-center gap-2 bg-indigo-600 font-semibold text-white px-4 py-2.5 rounded-xl text-xs hover:bg-indigo-700 transition-all cursor-pointer shadow-lg shadow-indigo-600/10 shrink-0"
            >
              <UserPlus size={15} />
              <span>Cadastrar Membro</span>
            </button>
          )}

          <button
            onClick={exportExcelCSV}
            className={`flex items-center justify-center gap-2 border px-4 py-2.5 rounded-xl text-xs font-semibold hover:bg-slate-100 dark:hover:bg-zinc-800 transition-all cursor-pointer ${
              isDarkMode ? 'border-zinc-800 text-zinc-300' : 'border-slate-200 text-slate-700'
            }`}
            title="Exportar base de dados para CSV/Excel"
          >
            <FileSpreadsheet size={15} className="text-emerald-500" />
            <span>Exportar Excel</span>
          </button>
        </div>
      </div>

      {/* FILTER PANEL */}
      <div className={`p-4 rounded-xl border grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 ${
        isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-slate-50 border-slate-200/60'
      }`}>
        <div className="relative">
          <input
            type="text"
            placeholder="Pesquisa avançada..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-8 pr-3 py-2 text-xs rounded-lg border focus:outline-none focus:ring-1 focus:ring-indigo-500 ${
              isDarkMode ? 'bg-zinc-950 border-zinc-700 text-zinc-200' : 'bg-white border-slate-200 text-slate-800'
            }`}
          />
          <Search size={14} className="absolute left-2.5 top-2.5 text-zinc-400" />
        </div>

        <div>
          <select
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value)}
            className={`w-full px-2.5 py-2 text-xs rounded-lg border focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer ${
              isDarkMode ? 'bg-zinc-950 border-zinc-700 text-zinc-200' : 'bg-white border-slate-200 text-slate-800'
            }`}
          >
            <option value="">Todos os Sexos</option>
            <option value="M">Masculino</option>
            <option value="F">Feminino</option>
          </select>
        </div>

        <div>
          <select
            value={maritalFilter}
            onChange={(e) => setMaritalFilter(e.target.value)}
            className={`w-full px-2.5 py-2 text-xs rounded-lg border focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer ${
              isDarkMode ? 'bg-zinc-950 border-zinc-700 text-zinc-200' : 'bg-white border-slate-200 text-slate-800'
            }`}
          >
            <option value="">Todos os Estados Civis</option>
            <option value="Solteiro">Solteiro</option>
            <option value="Casado">Casado</option>
            <option value="Divorciado">Divorciado</option>
            <option value="Viúvo">Viúvo</option>
          </select>
        </div>

        <div>
          <select
            value={lineageFilter}
            onChange={(e) => setLineageFilter(e.target.value)}
            className={`w-full px-2.5 py-2 text-xs rounded-lg border focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer ${
              isDarkMode ? 'bg-zinc-950 border-zinc-700 text-zinc-200' : 'bg-white border-slate-200 text-slate-800'
            }`}
          >
            <option value="">Linhagens de Sangue</option>
            <option value="Linhagem Manuel Kinjango">Linhagem Manuel Kinjango</option>
            <option value="Linhagem Externa">Linhagem Externa (Laços/Cônjuges)</option>
          </select>
        </div>

        <div>
          <select
            value={educationFilter}
            onChange={(e) => setEducationFilter(e.target.value)}
            className={`w-full px-2.5 py-2 text-xs rounded-lg border focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer ${
              isDarkMode ? 'bg-zinc-950 border-zinc-700 text-zinc-200' : 'bg-white border-slate-200 text-slate-800'
            }`}
          >
            <option value="">Níveis de Escolaridade</option>
            <option value="Básico">Básico</option>
            <option value="Médio">Médio</option>
            <option value="Licenciatura">Licenciatura</option>
            <option value="Mestrado">Mestrado</option>
            <option value="Doutoramento">Doutoramento</option>
          </select>
        </div>
      </div>

      {/* TABLE DESCRIPTIVE SECTION */}
      <div className={`rounded-xl border overflow-x-auto ${
        isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-100'
      }`}>
        <table className="w-full text-left font-sans text-xs border-collapse">
          <thead>
            <tr className={`border-b font-mono uppercase tracking-wider text-zinc-400 text-[10px] ${
              isDarkMode ? 'border-zinc-800 bg-zinc-950/50' : 'border-slate-100 bg-slate-50/50'
            }`}>
              <th className="p-4 font-semibold">Família</th>
              <th className="p-4 font-semibold">Nome Completo</th>
              <th className="p-4 font-semibold">Nascimento</th>
              <th className="p-4 font-semibold">Nível Académico</th>
              <th className="p-4 font-semibold">Profissão</th>
              <th className="p-4 font-semibold">Linhagem</th>
              <th className="p-4 font-semibold text-center">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/20 dark:divide-zinc-800/50">
            {filteredMembers.map((member) => (
              <tr 
                key={member.id} 
                className={`hover:bg-slate-50/50 dark:hover:bg-zinc-800/10 transition-colors ${
                  member.isDeceased ? 'opacity-65 grayscale bg-zinc-950/[0.02]' : ''
                }`}
              >
                <td className="p-4">
                  <img 
                    src={member.photoUrl} 
                    alt={member.fullName} 
                    referrerPolicy="no-referrer"
                    className="w-8 h-8 rounded-full object-cover shrink-0 ring-1 ring-indigo-500/10" 
                  />
                </td>
                <td className="p-4">
                  <div className="font-semibold">{member.fullName}</div>
                  <div className="text-[10px] text-zinc-500 font-mono mt-0.5">{member.relationshipDegree}</div>
                </td>
                <td className="p-4 font-mono">{member.birthDate}</td>
                <td className="p-4">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                    ['Licenciatura', 'Mestrado', 'Doutoramento'].includes(member.educationLevel)
                      ? 'bg-indigo-500/10 text-indigo-500 dark:bg-indigo-500/15'
                      : 'bg-zinc-500/10 text-zinc-500'
                  }`}>
                    {member.educationLevel}
                  </span>
                </td>
                <td className="p-4 text-zinc-600 dark:text-zinc-300 truncate max-w-[120px]" title={member.profession}>
                  {member.profession || 'N/A'}
                </td>
                <td className="p-4 text-zinc-500 text-[10px] truncate max-w-[150px]">
                  {member.lineage}
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-center gap-1.5">
                    <button
                      onClick={() => setSelectedMember(member)}
                      className={`p-1.5 rounded-lg border transition-all hover:bg-slate-50 dark:hover:bg-zinc-800 cursor-pointer ${
                        isDarkMode ? 'border-zinc-800 text-zinc-400' : 'border-slate-200 text-slate-600'
                      }`}
                      title="Vizualizar biografia e contatos"
                    >
                      <Eye size={13} />
                    </button>

                    {canAlter && (
                      <>
                        <button
                          onClick={() => handleOpenEditForm(member)}
                          className={`p-1.5 rounded-lg border transition-all hover:bg-slate-50 dark:hover:bg-zinc-800 cursor-pointer ${
                            isDarkMode ? 'border-zinc-800 text-blue-400' : 'border-slate-200 text-blue-600'
                          }`}
                          title="Editar Cadastro"
                        >
                          <Edit size={13} />
                        </button>
                        <button
                          onClick={() => handleDeleteMember(member.id)}
                          className={`p-1.5 rounded-lg border transition-all hover:bg-red-500 hover:text-white cursor-pointer ${
                            isDarkMode ? 'border-zinc-800 text-red-400' : 'border-slate-200 text-red-500'
                          }`}
                          title="Remover Registro"
                        >
                          <Trash2 size={13} />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredMembers.length === 0 && (
          <div className="text-center py-10 text-zinc-400 font-mono text-xs">
            Nenhum membro familiar localizado com as filtros aplicados.
          </div>
        )}
      </div>

      {/* VIEW MEMBER DETAILS DRAWER PANEL */}
      {selectedMember && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex justify-end">
          <div className={`w-full max-w-md h-full shadow-2xl flex flex-col justify-between animate-slide-left p-6 ${
            isDarkMode ? 'bg-zinc-900 border-l border-zinc-800 text-zinc-100' : 'bg-white border-l border-slate-200 text-slate-800'
          }`}>
            <div className="space-y-6 overflow-y-auto pr-1">
              <div className="flex items-center justify-between border-b pb-4 dark:border-zinc-800">
                <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-zinc-400">Biografia e Contatos</h3>
                <button 
                  onClick={() => setSelectedMember(null)}
                  className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 text-zinc-400 cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Bio Header */}
              <div className="flex flex-col items-center text-center space-y-3.5">
                <img 
                  src={selectedMember.photoUrl} 
                  alt={selectedMember.fullName} 
                  referrerPolicy="no-referrer"
                  className="w-20 h-20 rounded-full object-cover ring-2 ring-indigo-500/20" 
                />
                <div>
                  <h4 className="text-base font-bold">{selectedMember.fullName}</h4>
                  <span className="text-[10px] font-mono uppercase text-indigo-500 font-bold tracking-widest">{selectedMember.relationshipDegree}</span>
                  {selectedMember.isDeceased && (
                    <span className="ml-2 bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded text-[9px] font-mono tracking-wider">Falecido</span>
                  )}
                </div>
              </div>

              <div className="space-y-4 text-xs">
                {/* Descriptive stats */}
                <div className={`p-4 rounded-xl space-y-3 border ${
                  isDarkMode ? 'bg-zinc-950 border-zinc-800' : 'bg-slate-50 border-slate-200/60'
                }`}>
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-zinc-400 shrink-0" />
                    <span>Nascimento: <strong>{selectedMember.birthDate}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Heart size={14} className="text-zinc-400 shrink-0" />
                    <span>Estado Civil: <strong>{selectedMember.maritalStatus}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Briefcase size={14} className="text-zinc-400 shrink-0" />
                    <span>Profissão: <strong className="truncate max-w-[250px]">{selectedMember.profession || 'Não declarada'}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <GraduationCap size={14} className="text-zinc-400 shrink-0" />
                    <span>Nível de Ensino: <strong>{selectedMember.educationLevel}</strong></span>
                  </div>
                </div>

                {/* Biography */}
                <div>
                  <h5 className="font-mono text-[10px] text-zinc-400 uppercase tracking-wider mb-1.5">Resumo Biográfico</h5>
                  <p className="leading-relaxed text-zinc-600 dark:text-zinc-300">{selectedMember.bio || 'Biografia em processo de compilação histórica.'}</p>
                </div>

                {/* Pedigree tree parameters */}
                <div>
                  <h5 className="font-mono text-[10px] text-zinc-400 uppercase tracking-wider mb-2">Conexões Genealógicas</h5>
                  <div className="grid grid-cols-2 gap-2 font-mono text-[10px] text-zinc-500 leading-tight">
                    <div className="p-2 border dark:border-zinc-800 rounded bg-zinc-950/20">
                      <span className="block mb-0.5 text-zinc-400">Pai / Ascendente:</span>
                      <strong className="text-zinc-300 text-xs">{getMemberName(selectedMember.parentId) || 'Desconhecido'}</strong>
                    </div>
                    <div className="p-2 border dark:border-zinc-800 rounded bg-zinc-950/20">
                      <span className="block mb-0.5 text-zinc-400">Mãe / Ascendente:</span>
                      <strong className="text-zinc-300 text-xs">{getMemberName(selectedMember.motherId) || 'Desconhecido'}</strong>
                    </div>
                    <div className="p-2 border dark:border-zinc-800 rounded bg-zinc-950/20 col-span-2">
                      <span className="block mb-0.5 text-zinc-400">Cônjuge do Membro:</span>
                      <strong className="text-indigo-400 text-xs">{getMemberName(selectedMember.spouseId) || 'Nenhum / Não registrado'}</strong>
                    </div>
                  </div>
                </div>

                {/* Contacts */}
                {!selectedMember.isDeceased && (
                  <div className="space-y-2 border-t pt-4 dark:border-zinc-800">
                    <h5 className="font-mono text-[10px] text-zinc-400 uppercase tracking-wider mb-1">Canais de Contato</h5>
                    {selectedMember.phone && (
                      <a href={`tel:${selectedMember.phone}`} className="flex items-center gap-2 text-zinc-400 hover:text-indigo-400 font-mono text-[11px]">
                        <Phone size={12} />
                        <span>{selectedMember.phone}</span>
                      </a>
                    )}
                    {selectedMember.email && (
                      <a href={`mailto:${selectedMember.email}`} className="flex items-center gap-2 text-zinc-400 hover:text-indigo-400 font-mono text-[11px] break-all">
                        <Mail size={12} />
                        <span>{selectedMember.email}</span>
                      </a>
                    )}
                    {selectedMember.address && (
                      <div className="flex items-start gap-2 text-zinc-400 font-mono text-[11px] leading-relaxed">
                        <MapPin size={12} className="mt-0.5 shrink-0" />
                        <span>{selectedMember.address}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <button
               onClick={() => setSelectedMember(null)}
               className="w-full bg-zinc-800 hover:bg-zinc-700 py-2.5 rounded-xl text-xs font-semibold font-sans cursor-pointer mt-4"
            >
              Fechar Detalhes
            </button>
          </div>
        </div>
      )}

      {/* ADD / EDIT DIALOG FORM MODAL */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl p-6 ${
            isDarkMode ? 'bg-zinc-900 text-zinc-100 border border-zinc-800' : 'bg-white text-slate-800 border'
          }`}>
            <div className="flex items-center justify-between border-b pb-3 mb-4 dark:border-zinc-800">
              <h3 className="font-sans font-bold text-sm uppercase tracking-wider text-zinc-400">
                {editingMember ? `Editar Cadastro: ${editingMember.fullName}` : 'Adicionar Novo Familiar'}
              </h3>
              <button 
                onClick={() => setIsFormOpen(false)}
                className="p-1 rounded hover:bg-slate-100 dark:hover:bg-zinc-800 text-zinc-400 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Nome */}
                <div>
                  <label className="block text-[10px] font-mono text-zinc-400 uppercase tracking-wider mb-1">Nome Completo</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-1 focus:ring-indigo-500 ${
                      isDarkMode ? 'bg-zinc-950 border-zinc-800 text-zinc-200' : 'bg-white border-slate-200 text-slate-800'
                    }`}
                  />
                </div>

                {/* Sexo */}
                <div>
                  <label className="block text-[10px] font-mono text-zinc-400 uppercase tracking-wider mb-1">Sexo / Gênero</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as 'M' | 'F')}
                    className={`w-full px-3 py-2 rounded-lg border focus:outline-none ${
                        isDarkMode ? 'bg-zinc-950 border-zinc-800 text-zinc-200' : 'bg-white border-slate-200 text-slate-800'
                    }`}
                  >
                    <option value="M">Masculino</option>
                    <option value="F">Feminino</option>
                  </select>
                </div>

                {/* Nascimento */}
                <div>
                  <label className="block text-[10px] font-mono text-zinc-400 uppercase tracking-wider mb-1">Data de Nascimento</label>
                  <input
                    type="date"
                    required
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border focus:outline-none ${
                        isDarkMode ? 'bg-zinc-950 border-zinc-800 text-zinc-200' : 'bg-white border-slate-200 text-slate-800'
                    }`}
                  />
                </div>

                {/* Estado Civil */}
                <div>
                  <label className="block text-[10px] font-mono text-zinc-400 uppercase tracking-wider mb-1">Estado Civil</label>
                  <select
                    value={maritalStatus}
                    onChange={(e) => setMaritalStatus(e.target.value as any)}
                    className={`w-full px-3 py-2 rounded-lg border focus:outline-none ${
                        isDarkMode ? 'bg-zinc-950 border-zinc-800 text-zinc-200' : 'bg-white border-slate-200 text-slate-800'
                    }`}
                  >
                    <option value="Solteiro">Solteiro</option>
                    <option value="Casado">Casado</option>
                    <option value="Divorciado">Divorciado</option>
                    <option value="Viúvo">Viúvo</option>
                  </select>
                </div>

                {/* Profissao */}
                <div>
                  <label className="block text-[10px] font-mono text-zinc-400 uppercase tracking-wider mb-1">Profissão / Atividade</label>
                  <input
                    type="text"
                    value={profession}
                    onChange={(e) => setProfession(e.target.value)}
                    placeholder="Ex: Engenheiro de Software"
                    className={`w-full px-3 py-2 rounded-lg border ${
                        isDarkMode ? 'bg-zinc-950 border-zinc-800 text-zinc-200' : 'bg-white border-slate-200 text-slate-800'
                    }`}
                  />
                </div>

                {/* Escolaridade */}
                <div>
                  <label className="block text-[10px] font-mono text-zinc-400 uppercase tracking-wider mb-1">Nível de Escolaridade</label>
                  <select
                    value={educationLevel}
                    onChange={(e) => setEducationLevel(e.target.value as any)}
                    className={`w-full px-3 py-2 rounded-lg border focus:outline-none ${
                        isDarkMode ? 'bg-zinc-950 border-zinc-800 text-zinc-200' : 'bg-white border-slate-200 text-slate-800'
                    }`}
                  >
                    <option value="Básico">Básico (Ensino Primário/Geral)</option>
                    <option value="Médio">Médio Técnico / Geral</option>
                    <option value="Licenciatura">Licenciatura</option>
                    <option value="Mestrado">Mestrado</option>
                    <option value="Doutoramento">Doutoramento</option>
                  </select>
                </div>

                {/* Parentesco */}
                <div>
                  <label className="block text-[10px] font-mono text-zinc-400 uppercase tracking-wider mb-1">Grau de Parentesco</label>
                  <input
                    type="text"
                    value={relationshipDegree}
                    required
                    onChange={(e) => setRelationshipDegree(e.target.value)}
                    placeholder="Ex: Filho, Cônjuge, Neto"
                    className={`w-full px-3 py-2 rounded-lg border ${
                        isDarkMode ? 'bg-zinc-950 border-zinc-800 text-zinc-200' : 'bg-white border-slate-200 text-slate-800'
                    }`}
                  />
                </div>

                {/* Linhagem */}
                <div>
                  <label className="block text-[10px] font-mono text-zinc-400 uppercase tracking-wider mb-1">Linhagem Familiar</label>
                  <select
                    value={lineage}
                    onChange={(e) => setLineage(e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border focus:outline-none ${
                        isDarkMode ? 'bg-zinc-950 border-zinc-800 text-zinc-200' : 'bg-white border-slate-200 text-slate-800'
                    }`}
                  >
                    <option value="Linhagem Manuel Kinjango">Linhagem Manuel Kinjango</option>
                    <option value="Linhagem Externa">Linhagem Externa / Laços Secundários</option>
                  </select>
                </div>

                {/* Contacto */}
                <div>
                  <label className="block text-[10px] font-mono text-zinc-400 uppercase tracking-wider mb-1">Contacto Telefónico</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+244 9..."
                    className={`w-full px-3 py-2 rounded-lg border ${
                        isDarkMode ? 'bg-zinc-950 border-zinc-800 text-zinc-200' : 'bg-white border-slate-200 text-slate-800'
                    }`}
                  />
                </div>

                {/* E-mail */}
                <div>
                  <label className="block text-[10px] font-mono text-zinc-400 uppercase tracking-wider mb-1">Endereço de E-mail</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="exemplo@email.com"
                    className={`w-full px-3 py-2 rounded-lg border ${
                        isDarkMode ? 'bg-zinc-950 border-zinc-800 text-zinc-200' : 'bg-white border-slate-200 text-slate-800'
                    }`}
                  />
                </div>

                {/* Endereço */}
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-mono text-zinc-400 uppercase tracking-wider mb-1">Endereço Residencial</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Cidade, Bairro, Rua..."
                    className={`w-full px-3 py-2 rounded-lg border ${
                        isDarkMode ? 'bg-zinc-950 border-zinc-800 text-zinc-200' : 'bg-white border-slate-200 text-slate-800'
                    }`}
                  />
                </div>

                {/* Pai Selector */}
                <div>
                  <label className="block text-[10px] font-mono text-zinc-400 uppercase tracking-wider mb-1">Pai / Ascendente Masculino</label>
                  <select
                    value={parentId}
                    onChange={(e) => setParentId(e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border ${
                        isDarkMode ? 'bg-zinc-950 border-zinc-800 text-zinc-200' : 'bg-white border-slate-200 text-slate-800'
                    }`}
                  >
                    <option value="">Nenhum / Desconhecido</option>
                    {members.filter(m => m.gender === 'M').map(m => (
                      <option key={m.id} value={m.id}>{m.fullName}</option>
                    ))}
                  </select>
                </div>

                {/* Mãe Selector */}
                <div>
                  <label className="block text-[10px] font-mono text-zinc-400 uppercase tracking-wider mb-1">Mãe / Ascendente Feminino</label>
                  <select
                    value={motherId}
                    onChange={(e) => setMotherId(e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border ${
                        isDarkMode ? 'bg-zinc-950 border-zinc-800 text-zinc-200' : 'bg-white border-slate-200 text-slate-800'
                    }`}
                  >
                    <option value="">Nenhuma / Desconhecida</option>
                    {members.filter(m => m.gender === 'F').map(m => (
                      <option key={m.id} value={m.id}>{m.fullName}</option>
                    ))}
                  </select>
                </div>

                {/* Cônjuge selector */}
                <div>
                  <label className="block text-[10px] font-mono text-zinc-400 uppercase tracking-wider mb-1">Cônjuge (Marido / Mulher)</label>
                  <select
                    value={spouseId}
                    onChange={(e) => setSpouseId(e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border ${
                        isDarkMode ? 'bg-zinc-950 border-zinc-800 text-zinc-200' : 'bg-white border-slate-200 text-slate-800'
                    }`}
                  >
                    <option value="">Nenhum</option>
                    {members.map(m => (
                      <option key={m.id} value={m.id}>{m.fullName}</option>
                    ))}
                  </select>
                </div>

                {/* Deceased checkpoint */}
                <div className="flex items-center gap-2 pt-4">
                  <input
                    type="checkbox"
                    id="isDeceasedInput"
                    checked={isDeceased}
                    onChange={(e) => setIsDeceased(e.target.checked)}
                    className="w-4 h-4 rounded border-zinc-800 accent-indigo-600 focus:ring-0 checked:bg-indigo-600 cursor-pointer"
                  />
                  <label htmlFor="isDeceasedInput" className="text-zinc-600 dark:text-zinc-300 font-semibold cursor-pointer">
                    Declarar o parente como Falecido (Memorial)
                  </label>
                </div>

                {/* Biografia */}
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-mono text-zinc-400 uppercase tracking-wider mb-1">Síntese Biográfica / Notas</label>
                  <textarea
                    rows={3}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Destaques inspiradores, percurso profissional ou histórico especial..."
                    className={`w-full px-3 py-2 rounded-lg border focus:outline-none ${
                        isDarkMode ? 'bg-zinc-950 border-zinc-800 text-zinc-200' : 'bg-white border-slate-200 text-slate-800'
                    }`}
                  />
                </div>

              </div>

              <div className="flex justify-end gap-2 border-t pt-4 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer ${
                    isDarkMode ? 'bg-zinc-800 hover:bg-zinc-750 text-zinc-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-xl text-xs font-semibold cursor-pointer shadow-lg shadow-indigo-600/10"
                >
                  Gravar Cadastro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
