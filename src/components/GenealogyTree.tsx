/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { FamilyMember } from '../types';
import { 
  ZoomIn, 
  ZoomOut, 
  Move, 
  Maximize2, 
  User, 
  Heart,
  ChevronDown,
  ChevronUp,
  Search,
  Eye
} from 'lucide-react';

interface GenealogyTreeProps {
  members: FamilyMember[];
  isDarkMode: boolean;
}

export default function GenealogyTree({
  members,
  isDarkMode
}: GenealogyTreeProps) {
  // Tree transform states for zoom and drag simulation
  const [zoom, setZoom] = useState(1);
  const [posX, setPosX] = useState(0);
  const [posY, setPosY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });

  // Focus filter search
  const [searchTerm, setSearchTerm] = useState('');
  const [focusedMemberId, setFocusedMemberId] = useState<string | null>(null);

  // Hidden branch toggle state
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({
    'm1': true, // Patriarch Manuel expanded by default
    'm3': true, // António expanded
    'm9': true, // Lucas expanded
  });

  // Selected preview node
  const [previewMember, setPreviewMember] = useState<FamilyMember | null>(null);

  // Drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStart.current = { x: e.clientX - posX, y: e.clientY - posY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosX(e.clientX - dragStart.current.x);
    setPosY(e.clientY - dragStart.current.y);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.15, 2));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.15, 0.5));
  const handleReset = () => {
    setZoom(1);
    setPosX(0);
    setPosY(0);
  };

  const toggleNode = (id: string) => {
    setExpandedNodes(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const searchResults = searchTerm 
    ? members.filter(m => m.fullName.toLowerCase().includes(searchTerm.toLowerCase()))
    : [];

  // Group members into logical clean trees
  // Root level: Manuel & Maria
  const patriarch = members.find(m => m.id === 'm1');
  const matriarch = members.find(m => m.id === 'm2');
  
  // António, Teresa, Lucas
  const children = members.filter(m => m.parentId === 'm1' || m.motherId === 'm2');

  const getSpouse = (member: FamilyMember) => {
    if (!member.spouseId) return null;
    return members.find(m => m.id === member.spouseId);
  };

  const getChildrenOf = (parentId: string) => {
    return members.filter(m => m.parentId === parentId || m.motherId === parentId);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-sans tracking-tight">Árvore Genealógica Interativa</h2>
          <p className="text-xs text-zinc-500">Mapeamento dinâmico visual e vertical de avós, cônjuges, linhagens de descendência direta.</p>
        </div>

        {/* Tree search bar / spotlight */}
        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Localizar na árvore..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-8 pr-3 py-2 text-xs rounded-lg border focus:outline-none focus:ring-1 focus:ring-indigo-500 ${
              isDarkMode ? 'bg-zinc-900 border-zinc-700 text-zinc-200' : 'bg-slate-100 border-slate-200 text-slate-800'
            }`}
          />
          <Search size={14} className="absolute left-2.5 top-2.5 text-zinc-400" />

          {searchResults.length > 0 && (
            <div className={`absolute top-full left-0 right-0 z-50 mt-1 rounded-lg border shadow-xl p-1 text-xs max-h-48 overflow-y-auto ${
              isDarkMode ? 'bg-zinc-950 border-zinc-800 text-zinc-200' : 'bg-white border-slate-200 text-slate-800'
            }`}>
              {searchResults.map(m => (
                <button
                  key={m.id}
                  onClick={() => {
                    setPreviewMember(m);
                    setSearchTerm('');
                  }}
                  className="w-full text-left px-2.5 py-1.5 hover:bg-indigo-600 hover:text-white transition-colors rounded"
                >
                  {m.fullName} ({m.relationshipDegree})
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* DRAGGABLE & EXPANDABLE SVG CANVAS ENGINE */}
      <div 
        className={`relative h-[550px] w-full border rounded-2xl overflow-hidden select-none cursor-grab ${
          isDragging ? 'cursor-grabbing' : ''
        } ${
          isDarkMode ? 'bg-zinc-950 border-zinc-800' : 'bg-slate-50 border-slate-200/60'
        }`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Canvas Toolbar overlay */}
        <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
          <button 
            onClick={handleZoomIn}
            className={`p-2 rounded-xl border hover:bg-slate-200 dark:hover:bg-zinc-800 transition-colors cursor-pointer ${
              isDarkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-300' : 'bg-white border-slate-200 text-slate-700'
            }`}
            title="Aumentar Zoom"
          >
            <ZoomIn size={16} />
          </button>
          <button 
            onClick={handleZoomOut}
            className={`p-2 rounded-xl border hover:bg-slate-200 dark:hover:bg-zinc-800 transition-colors cursor-pointer ${
              isDarkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-300' : 'bg-white border-slate-200 text-slate-700'
            }`}
            title="Reduzir Zoom"
          >
            <ZoomOut size={16} />
          </button>
          <button 
            onClick={handleReset}
            className={`p-2 rounded-xl border hover:bg-slate-200 dark:hover:bg-zinc-800 transition-colors cursor-pointer ${
              isDarkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-300' : 'bg-white border-slate-200 text-slate-700'
            }`}
            title="Centralizar Visualização"
          >
            <Maximize2 size={16} />
          </button>
        </div>

        {/* Informative Legend overlay */}
        <div className={`absolute bottom-4 right-4 z-20 p-3 rounded-xl border text-[10px] font-mono space-y-1 ${
          isDarkMode ? 'bg-zinc-950/90 border-zinc-800 text-zinc-400' : 'bg-white/95 border-slate-200 text-slate-600'
        }`}>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
            <span>Estirpe Masculina / Patriarcado</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-pink-600"></span>
            <span>Estirpe Feminina / Matriarcado</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-5 h-0.5 border-t-2 border-dashed border-zinc-500 inline-block"></span>
            <span>Laço Matrimonial / Casamento</span>
          </div>
        </div>

        <div 
          className="absolute inset-0 origin-center transition-transform duration-75 flex items-center justify-center"
          style={{
            transform: `translate(${posX}px, ${posY}px) scale(${zoom})`,
          }}
        >
          {/* GENERATION VERTICAL COLS SYSTEM */}
          <div className="flex flex-col items-center space-y-16 p-10 min-w-[900px]">
            
            {/* GENERATION 1: PATRIARCAS (Manuel & Maria) */}
            <div className="flex items-center justify-center gap-6 relative">
              {patriarch && (
                <div 
                  onClick={(e) => { e.stopPropagation(); setPreviewMember(patriarch); }}
                  className={`w-48 p-3 rounded-xl border shadow-md flex items-center gap-3 transition-transform hover:scale-105 duration-200 cursor-pointer ${
                    isDarkMode ? 'bg-zinc-900 border-indigo-500/30 hover:border-indigo-500' : 'bg-white border-indigo-500/20 hover:border-indigo-500'
                  }`}
                >
                  <img src={patriarch.photoUrl} alt={patriarch.fullName} referrerPolicy="no-referrer" className="w-10 h-10 rounded-full" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold truncate leading-tight">{patriarch.fullName}</p>
                    <span className="text-[9px] font-bold font-mono text-indigo-500 block">Patriarca</span>
                  </div>
                </div>
              )}

              {/* Marriage heart bridge */}
              <div className="w-10 flex items-center justify-center border-t-2 border-dashed border-zinc-500 relative shrink-0">
                <div className="bg-zinc-950 p-1 rounded-full border border-zinc-800 -mt-0.5">
                  <Heart size={10} className="text-red-500 animate-pulse" />
                </div>
              </div>

              {matriarch && (
                <div 
                  onClick={(e) => { e.stopPropagation(); setPreviewMember(matriarch); }}
                  className={`w-48 p-3 rounded-xl border shadow-md flex items-center gap-3 transition-transform hover:scale-105 duration-200 cursor-pointer ${
                    isDarkMode ? 'bg-zinc-900 border-pink-500/30 hover:border-pink-500' : 'bg-white border-pink-500/20 hover:border-pink-500'
                  }`}
                >
                  <img src={matriarch.photoUrl} alt={matriarch.fullName} referrerPolicy="no-referrer" className="w-10 h-10 rounded-full" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold truncate leading-tight">{matriarch.fullName}</p>
                    <span className="text-[9px] font-bold font-mono text-pink-500 block">Matriarca</span>
                  </div>
                </div>
              )}
            </div>

            {/* GENERATION 2: FILHOS & CÔNJUGES */}
            <div className="flex items-start justify-center gap-12 relative w-full">
              {children.map((child) => {
                const spouse = getSpouse(child);
                const hasChildren = getChildrenOf(child.id).length > 0;
                const isExpanded = !!expandedNodes[child.id];

                return (
                  <div key={child.id} className="flex flex-col items-center space-y-8">
                    {/* Member and spouse horizontal layout */}
                    <div className="flex items-center gap-2 relative">
                      
                      {/* Main child card */}
                      <div 
                        onClick={(e) => { e.stopPropagation(); setPreviewMember(child); }}
                        className={`w-44 p-3 rounded-xl border shadow-sm flex items-center gap-3 transition-transform hover:scale-105 duration-200 cursor-pointer ${
                          isDarkMode ? 'bg-zinc-90 w-44 hover:border-amber-500 bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200 hover:border-amber-500'
                        }`}
                      >
                        <img src={child.photoUrl} alt={child.fullName} referrerPolicy="no-referrer" className="w-8 h-8 rounded-full" />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold truncate leading-tight">{child.fullName}</p>
                          <span className="text-[8px] font-mono text-zinc-500">{child.relationshipDegree}</span>
                        </div>
                      </div>

                      {/* Connection to Spouse */}
                      {spouse && (
                        <>
                          <div className="w-4 border-t-2 border-dashed border-zinc-600"></div>
                          <div 
                            onClick={(e) => { e.stopPropagation(); setPreviewMember(spouse); }}
                            className={`w-44 p-3 rounded-xl border shadow-sm flex items-center gap-3 transition-transform hover:scale-105 duration-200 cursor-pointer ${
                              isDarkMode ? 'bg-zinc-900 border-zinc-800 hover:border-amber-500' : 'bg-white border-slate-200 hover:border-amber-500'
                            }`}
                          >
                            <img src={spouse.photoUrl} alt={spouse.fullName} referrerPolicy="no-referrer" className="w-8 h-8 rounded-full" />
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-bold truncate leading-tight">{spouse.fullName}</p>
                              <span className="text-[8px] font-mono text-zinc-500">Cônjuge</span>
                            </div>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Expand grandchildren arrow indicator */}
                    {hasChildren && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); toggleNode(child.id); }}
                        className={`p-1 rounded-full border cursor-pointer hover:bg-slate-200 dark:hover:bg-zinc-800 ${
                          isDarkMode ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-slate-200'
                        }`}
                        title="Expandir/Recolher Descendentes"
                      >
                        {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                      </button>
                    )}

                    {/* GENERATION 3: NETOS (expandable) */}
                    {hasChildren && isExpanded && (
                      <div className="flex items-center gap-4 border-t-2 dark:border-zinc-800 pt-6 relative">
                        {getChildrenOf(child.id).map((grandchild) => (
                          <div 
                            key={grandchild.id}
                            onClick={(e) => { e.stopPropagation(); setPreviewMember(grandchild); }}
                            className={`w-40 p-2.5 rounded-xl border shadow-xs flex items-center gap-2 transition-transform hover:scale-105 duration-200 cursor-pointer ${
                              isDarkMode ? 'bg-zinc-900 border-zinc-800 hover:border-indigo-400' : 'bg-white border-slate-200 hover:border-indigo-400'
                            }`}
                          >
                            <img src={grandchild.photoUrl} alt={grandchild.fullName} referrerPolicy="no-referrer" className="w-7 h-7 rounded-full" />
                            <div className="min-w-0 flex-1">
                              <p className="text-[11px] font-bold truncate leading-tight">{grandchild.fullName}</p>
                              <span className="text-[8px] text-zinc-500 block font-mono leading-none mt-0.5">{grandchild.relationshipDegree}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                  </div>
                );
              })}
            </div>

          </div>
        </div>
      </div>

      {/* QUICK PREVIEW DRAWER IF SELECTED NODE IN CHART */}
      {previewMember && (
        <div className={`p-4 rounded-2xl border flex flex-col md:flex-row items-center gap-4 justify-between animate-fade-in ${
          isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center gap-3">
            <img src={previewMember.photoUrl} alt={previewMember.fullName} referrerPolicy="no-referrer" className="w-12 h-12 rounded-full" />
            <div>
              <h4 className="text-sm font-bold">{previewMember.fullName}</h4>
              <p className="text-xs text-zinc-400">{previewMember.relationshipDegree} • {previewMember.lineage} • {previewMember.profession}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono bg-zinc-950/30 px-3 py-1.5 rounded-lg text-zinc-400">
              Escolaridade: <strong>{previewMember.educationLevel}</strong>
            </span>
            <button 
              onClick={() => setPreviewMember(null)}
              className="text-xs bg-zinc-800 font-semibold px-4 py-1.5 rounded-lg hover:bg-zinc-750 cursor-pointer"
            >
              Fechar Visualização
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
