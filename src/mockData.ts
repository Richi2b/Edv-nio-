/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FamilyMember, Marriage, FamilyRequest, DeathRecord, PatientRecord, Payment, Notice, FamilyEvent, UserRole, FPIRecommendation } from './types';

export const INITIAL_MEMBERS: FamilyMember[] = [
  {
    id: "m1",
    fullName: "Manuel Kinjango",
    photoUrl: "https://api.dicebear.com/7.x/initials/svg?seed=Manuel%20Kinjango&backgroundColor=4f46e5",
    gender: "M",
    birthDate: "1935-05-12",
    maritalStatus: "Casado",
    profession: "Agricultor / Líder Comunitário",
    phone: "",
    email: "",
    address: "Huambo, Angola",
    bio: "Patriarca fundador da Família Kinjango. Um homem de fé, trabalho e princípios rígidos que sempre uniu os familiares.",
    relationshipDegree: "Patriarca (Fundador)",
    lineage: "Linhagem Manuel Kinjango",
    isDeceased: true,
    educationLevel: "Básico"
  },
  {
    id: "m2",
    fullName: "Maria Kinjango",
    photoUrl: "https://api.dicebear.com/7.x/initials/svg?seed=Maria%20Kinjango&backgroundColor=db2777",
    gender: "F",
    birthDate: "1940-08-20",
    maritalStatus: "Viúva",
    profession: "Comerciante",
    phone: "",
    email: "",
    address: "Huambo, Angola",
    bio: "Matriarca da família. Conhecida pela sua imensa generosidade, sabedoria tradicional e receitas culinárias que animavam os encontros familiares.",
    relationshipDegree: "Matriarca",
    lineage: "Linhagem Manuel Kinjango",
    isDeceased: true,
    educationLevel: "Básico"
  },
  {
    id: "m3",
    fullName: "António Manuel Kinjango",
    photoUrl: "https://api.dicebear.com/7.x/initials/svg?seed=Antonio%20Kinjango&backgroundColor=1d4ed8",
    gender: "M",
    birthDate: "1965-02-14",
    maritalStatus: "Casado",
    profession: "Engenheiro Civil",
    phone: "+244 923 456 789",
    email: "antonio.kinjango@email.com",
    address: "Luanda, Alvalade",
    bio: "Filho mais velho de Manuel e Maria. Atua como o líder atual do Conselho Familiar, coordenando o desenvolvimento estratégico da família.",
    relationshipDegree: "Filho",
    lineage: "Linhagem Manuel Kinjango",
    parentId: "m1",
    motherId: "m2",
    spouseId: "m4",
    childrenIds: ["m6", "m7"],
    educationLevel: "Licenciatura"
  },
  {
    id: "m4",
    fullName: "Isabel Fernandes Kinjango",
    photoUrl: "https://api.dicebear.com/7.x/initials/svg?seed=Isabel%20Kinjango&backgroundColor=9333ea",
    gender: "F",
    birthDate: "1970-11-03",
    maritalStatus: "Casado",
    profession: "Professora Universitária",
    phone: "+244 912 789 123",
    email: "isabel.fernandes@email.com",
    address: "Luanda, Alvalade",
    bio: "Casada com António. Doutorada em Sociologia, muito empenhada em promover a formação académica de todos os jovens da família.",
    relationshipDegree: "Cônjuge",
    lineage: "Linhagem Externa",
    spouseId: "m3",
    childrenIds: ["m6", "m7"],
    educationLevel: "Doutoramento"
  },
  {
    id: "m5",
    fullName: "Teresa Manuel Kinjango",
    photoUrl: "https://api.dicebear.com/7.x/initials/svg?seed=Teresa%20Kinjango&backgroundColor=059669",
    gender: "F",
    birthDate: "1972-04-22",
    maritalStatus: "Solteira",
    profession: "Médica Pediatra",
    phone: "+244 931 111 222",
    email: "teresa.kinjango@email.com",
    address: "Benguela, Centro",
    bio: "Filha de Manuel e Maria. Atua como Secretária da família, zelando pelo registo histórico, memórias de óbitos, casamentos e saúde familiar.",
    relationshipDegree: "Filha",
    lineage: "Linhagem Manuel Kinjango",
    parentId: "m1",
    motherId: "m2",
    spouseId: undefined,
    childrenIds: ["m8"],
    educationLevel: "Mestrado"
  },
  {
    id: "m6",
    fullName: "Bernardo António Kinjango",
    photoUrl: "https://api.dicebear.com/7.x/initials/svg?seed=Bernardo%20Kinjango&backgroundColor=ea580c",
    gender: "M",
    birthDate: "1994-01-15",
    maritalStatus: "Solteiro",
    profession: "Engenheiro de Software",
    phone: "+244 945 999 000",
    email: "bernardo.kinjango@email.com",
    address: "Luanda, Talatona",
    bio: "Filho de António e Isabel. Responsável pela criação do sistema KinjangoFamily. Apaixonado por tecnologia e empreendedorismo.",
    relationshipDegree: "Neto",
    lineage: "Linhagem Manuel Kinjango",
    parentId: "m3",
    motherId: "m4",
    educationLevel: "Licenciatura"
  },
  {
    id: "m7",
    fullName: "Jandira António Kinjango",
    photoUrl: "https://api.dicebear.com/7.x/initials/svg?seed=Jandira%20Kinjango&backgroundColor=06b6d4",
    gender: "F",
    birthDate: "1998-09-10",
    maritalStatus: "Solteira",
    profession: "Estudante de Medicina",
    phone: "+244 923 888 777",
    email: "jandira.kinjango@email.com",
    address: "Coimbra, Portugal",
    bio: "Filha de António e Isabel. Atualmente a estudar em Portugal com bolsa de mérito apoiada pela contribuição familiar.",
    relationshipDegree: "Neta",
    lineage: "Linhagem Manuel Kinjango",
    parentId: "m3",
    motherId: "m4",
    educationLevel: "Básico"
  },
  {
    id: "m8",
    fullName: "Manuel Lucas Kinjango",
    photoUrl: "https://api.dicebear.com/7.x/initials/svg?seed=Manuel%20Lucas%20Kinjango&backgroundColor=2563eb",
    gender: "M",
    birthDate: "2000-06-30",
    maritalStatus: "Solteiro",
    profession: "Designer Gráfico",
    phone: "+244 929 123 456",
    email: "manuel.lucas@email.com",
    address: "Benguela, Centro",
    bio: "Filho de Teresa. Jovem artista que desenhou o logotipo tradicional da família. Entusiasta de artes e música tradicional angolana.",
    relationshipDegree: "Neto",
    lineage: "Linhagem Manuel Kinjango",
    parentId: "m5",
    educationLevel: "Médio"
  },
  {
    id: "m9",
    fullName: "Lucas Manuel Kinjango",
    photoUrl: "https://api.dicebear.com/7.x/initials/svg?seed=Lucas%20Kinjango&backgroundColor=b45309",
    gender: "M",
    birthDate: "1975-10-12",
    maritalStatus: "Casado",
    profession: "Contabilista Sénior",
    phone: "+244 923 777 666",
    email: "lucas.contabil@email.com",
    address: "Luanda, Mutamba",
    bio: "Filho mais novo de Manuel e Maria. Atua como Tesoureiro da família. Tem um controlo exímio sobre as quotas de 10.000 Kz e fundos de emergência.",
    relationshipDegree: "Filho",
    lineage: "Linhagem Manuel Kinjango",
    parentId: "m1",
    motherId: "m2",
    spouseId: "m10",
    childrenIds: ["m11"],
    educationLevel: "Licenciatura"
  },
  {
    id: "m10",
    fullName: "Arminda Chaves Kinjango",
    photoUrl: "https://api.dicebear.com/7.x/initials/svg?seed=Arminda%20Kinjango&backgroundColor=15803d",
    gender: "F",
    birthDate: "1980-03-08",
    maritalStatus: "Casado",
    profession: "Enfermeira Chefe",
    phone: "+244 912 555 444",
    email: "arminda.chaves@email.com",
    address: "Luanda, Mutamba",
    bio: "Casada com Lucas Kinjango. Ajuda imensamente a monitorar a saúde dos idosos e comorbidades familiares.",
    relationshipDegree: "Cônjuge",
    lineage: "Linhagem Externa",
    spouseId: "m9",
    childrenIds: ["m11"],
    educationLevel: "Licenciatura"
  },
  {
    id: "m11",
    fullName: "Aline Lucas Kinjango",
    photoUrl: "https://api.dicebear.com/7.x/initials/svg?seed=Aline%20Kinjango&backgroundColor=db2777",
    gender: "F",
    birthDate: "2010-04-05",
    maritalStatus: "Solteira",
    profession: "Estudante",
    phone: "",
    email: "",
    address: "Luanda, Mutamba",
    bio: "Filha de Lucas e Arminda. A caçula da geração dos netos em Luanda. Atleta escolar de ginástica artística.",
    relationshipDegree: "Neta",
    lineage: "Linhagem Manuel Kinjango",
    parentId: "m9",
    motherId: "m10",
    educationLevel: "Básico"
  },
  {
    id: "m12",
    fullName: "Paula de Carvalho Kinjango",
    photoUrl: "https://api.dicebear.com/7.x/initials/svg?seed=Paula%20Kinjango&backgroundColor=84cc16",
    gender: "F",
    birthDate: "1954-07-16",
    maritalStatus: "Viúva",
    profession: "Reformada",
    phone: "+244 911 333 444",
    email: "",
    address: "Huambo, Caala",
    bio: "Irmã mais nova do patriarca Manuel. Uma enciclopédia viva das lendas e provérbios familiares da Linhagem Kinjango.",
    relationshipDegree: "Irmã do Patriarca",
    lineage: "Linhagem Manuel Kinjango",
    educationLevel: "Básico"
  },
  {
    id: "m13",
    fullName: "Mateus Pedro Kinjango",
    photoUrl: "https://api.dicebear.com/7.x/initials/svg?seed=Mateus%20Kinjango&backgroundColor=7c2d12",
    gender: "M",
    birthDate: "1960-03-30",
    maritalStatus: "Solteiro",
    profession: "Mestre de Obras",
    phone: "+244 929 888 111",
    email: "mateus.obras@email.com",
    address: "Huambo, Centro",
    bio: "Sobrinho de Manuel Kinjango. Conhecido pelo seu espírito de ajuda mútua, sempre pronto para reparações e auxílio nas infraestruturas da terra.",
    relationshipDegree: "Sobrinho",
    lineage: "Linhagem Manuel Kinjango",
    educationLevel: "Médio"
  }
];

export const INITIAL_MARRIAGES: Marriage[] = [
  {
    id: "mar1",
    spouse1Id: "m3",
    spouse2Id: "m4",
    spouse1Name: "António Manuel Kinjango",
    spouse2Name: "Isabel Fernandes Kinjango",
    date: "1990-09-08",
    location: "Igreja da Sé, Huambo",
    photos: ["https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=600"],
    status: "Celebrado"
  },
  {
    id: "mar2",
    spouse1Id: "m9",
    spouse2Id: "m10",
    spouse1Name: "Lucas Manuel Kinjango",
    spouse2Name: "Arminda Chaves Kinjango",
    date: "2005-05-20",
    location: "Conservatória de Luanda",
    photos: ["https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=600"],
    status: "Celebrado"
  }
];

export const INITIAL_REQUESTS: FamilyRequest[] = [
  {
    id: "req1",
    title: "Pedido de Apoio para Estudos Universitários",
    type: "Apoio Financeiro",
    requesterId: "m7",
    requesterName: "Jandira António Kinjango",
    description: "Solicitação ao fundo familiar para aquisição de livros de pediatria avançada em Coimbra e alojamento estudantil para este semestre.",
    amountRequested: 150000,
    submittedAt: "2026-06-01",
    status: "Em Análise",
    remarks: "Em avaliação pelo Conselho Familiar. O Tesoureiro avaliou disponibilidade de caixa favorável."
  },
  {
    id: "req2",
    title: "Pedido de Apoio para Medicamentos",
    type: "Apoio de Saúde",
    requesterId: "m12",
    requesterName: "Paula de Carvalho Kinjango",
    description: "Pedida ajuda de custo para tratamento crónico de hipertensão e fisioterapia articular na província do Huambo.",
    amountRequested: 45000,
    submittedAt: "2026-06-10",
    status: "Aprovado",
    remarks: "Aprovado por unanimidade. Lucas Kinjango (Tesoureiro) transferirá o valor do Fundo Familiar de Saúde hoje."
  }
];

export const INITIAL_DEATHS: DeathRecord[] = [
  {
    id: "d1",
    memberId: "m1",
    memberName: "Manuel Kinjango",
    date: "2020-10-15",
    cause: "Causas Naturais / Idade Avançada",
    location: "Hospital Geral do Huambo",
    ceremonies: "Velório na residência familiar (Huambo), seguido de Santa Missa na Sé Catedral e enterro no Cemitério de Calomanda.",
    tributes: [
      "Um guerreiro que nos ensinou o valor da terra e o respeito mútuo. - António",
      "Sempre no meu coração, avô Manuel. O teu cajado de líder guia-nos. - Bernardo",
      "O fundador da nossa harmonia. Descanse em paz. - Teresa"
    ],
    candlesLit: 124
  },
  {
    id: "d2",
    memberId: "m2",
    memberName: "Maria Kinjango",
    date: "2022-12-05",
    cause: "Insuficiência Cardíaca",
    location: "Residência Familiar, Huambo",
    ceremonies: "Missa de corpo presente na Paróquia de Nossa Senhora de Fátima. O funeral reuniu mais de 300 pessoas da comunidade.",
    tributes: [
      "A doçura em pessoa. Deixou-nos um legado de fé indelével. - Teresa",
      "Saudades eternas da nossa matriarca querida. - Lucas"
    ],
    candlesLit: 98
  }
];

export const INITIAL_PATIENTS: PatientRecord[] = [
  {
    id: "p1",
    memberId: "m12",
    memberName: "Paula de Carvalho Kinjango",
    diagnosis: "Artrite Reumatóide Severa e Hipertensão",
    clinicalState: "Sério",
    needs: "Cadeira de rodas atualizada, acompanhamento semanal de enfermagem local e medicamentos específicos de circulação.",
    responsibleMemberId: "m13",
    responsibleMemberName: "Mateus Pedro Kinjango",
    updatedAt: "2026-06-12"
  }
];

export const INITIAL_PAYMENTS: Payment[] = [
  // Payments for March 2026
  { id: "pay1", memberId: "m3", memberName: "António Manuel Kinjango", month: "2026-03", amount: 10000, paidAt: "2026-03-05", receiptNumber: "REC-2026-012", hasFine: false, fineAmount: 0 },
  { id: "pay2", memberId: "m4", memberName: "Isabel Fernandes Kinjango", month: "2026-03", amount: 10000, paidAt: "2026-03-05", receiptNumber: "REC-2026-013", hasFine: false, fineAmount: 0 },
  { id: "pay3", memberId: "m5", memberName: "Teresa Manuel Kinjango", month: "2026-03", amount: 10000, paidAt: "2026-03-08", receiptNumber: "REC-2026-014", hasFine: false, fineAmount: 0 },
  { id: "pay4", memberId: "m6", memberName: "Bernardo António Kinjango", month: "2026-03", amount: 10000, paidAt: "2026-03-02", receiptNumber: "REC-2026-015", hasFine: false, fineAmount: 0 },
  { id: "pay5", memberId: "m7", memberName: "Jandira António Kinjango", month: "2026-03", amount: 10000, paidAt: "2026-03-12", receiptNumber: "REC-2026-016", hasFine: false, fineAmount: 0 },
  { id: "pay6", memberId: "m9", memberName: "Lucas Manuel Kinjango", month: "2026-03", amount: 10000, paidAt: "2026-03-04", receiptNumber: "REC-2026-017", hasFine: false, fineAmount: 0 },
  { id: "pay7", memberId: "m10", memberName: "Arminda Chaves Kinjango", month: "2026-03", amount: 10000, paidAt: "2026-03-04", receiptNumber: "REC-2026-018", hasFine: false, fineAmount: 0 },
  { id: "pay8", memberId: "m13", memberName: "Mateus Pedro Kinjango", month: "2026-03", amount: 10000, paidAt: "2026-03-10", receiptNumber: "REC-2026-019", hasFine: false, fineAmount: 0 },

  // Payments for April 2026
  { id: "pay9", memberId: "m3", memberName: "António Manuel Kinjango", month: "2026-04", amount: 10000, paidAt: "2026-04-05", receiptNumber: "REC-2026-034", hasFine: false, fineAmount: 0 },
  { id: "pay10", memberId: "m4", memberName: "Isabel Fernandes Kinjango", month: "2026-04", amount: 10000, paidAt: "2026-04-05", receiptNumber: "REC-2026-035", hasFine: false, fineAmount: 0 },
  { id: "pay11", memberId: "m5", memberName: "Teresa Manuel Kinjango", month: "2026-04", amount: 10000, paidAt: "2026-04-09", receiptNumber: "REC-2026-036", hasFine: false, fineAmount: 0 },
  { id: "pay12", memberId: "m6", memberName: "Bernardo António Kinjango", month: "2026-04", amount: 10000, paidAt: "2026-04-01", receiptNumber: "REC-2026-037", hasFine: false, fineAmount: 0 },
  { id: "pay13", memberId: "m9", memberName: "Lucas Manuel Kinjango", month: "2026-04", amount: 10000, paidAt: "2026-04-05", receiptNumber: "REC-2026-038", hasFine: false, fineAmount: 0 },
  { id: "pay14", memberId: "m10", memberName: "Arminda Chaves Kinjango", month: "2026-04", amount: 10000, paidAt: "2026-04-05", receiptNumber: "REC-2026-039", hasFine: false, fineAmount: 0 },

  // Payments for May 2026
  { id: "pay15", memberId: "m3", memberName: "António Manuel Kinjango", month: "2026-05", amount: 10000, paidAt: "2026-05-02", receiptNumber: "REC-2026-067", hasFine: false, fineAmount: 0 },
  { id: "pay16", memberId: "m4", memberName: "Isabel Fernandes Kinjango", month: "2026-05", amount: 10000, paidAt: "2026-05-02", receiptNumber: "REC-2026-068", hasFine: false, fineAmount: 0 },
  { id: "pay17", memberId: "m6", memberName: "Bernardo António Kinjango", month: "2026-05", amount: 10000, paidAt: "2026-05-01", receiptNumber: "REC-2026-069", hasFine: false, fineAmount: 0 },
  { id: "pay18", memberId: "m9", memberName: "Lucas Manuel Kinjango", month: "2026-05", amount: 10000, paidAt: "2026-05-10", receiptNumber: "REC-2026-070", hasFine: false, fineAmount: 0 },
  
  // Late Payment showing Fine
  { id: "pay19", memberId: "m5", memberName: "Teresa Manuel Kinjango", month: "2026-05", amount: 11500, paidAt: "2026-05-28", receiptNumber: "REC-2026-071", hasFine: true, fineAmount: 1500 }
];

export const INITIAL_NOTICES: Notice[] = [
  {
    id: "not1",
    title: "Mesa Redonda sobre Plano Estratégico Família Kinjango 2026-2028",
    content: "Caros familiares, convidamos todos a participar na reunião magna do Conselho para debatermos o direcionamento financeiro das bolsas de estudo, o monitoramento dos idosos no Huambo e novas regras de adesão à quota de proteção social. Sua presença é fundamental para o fortalecimento da nossa linhagem.",
    authorName: "António Manuel Kinjango",
    authorRole: "Conselho Familiar",
    publishedAt: "2026-06-10 14:00",
    reactions: { "❤️": 8, "👍": 12, "🎯": 5 },
    comments: [
      { id: "com1", authorName: "Bernardo António Kinjango", content: "Excelente iniciativa! Apresentarei a demonstração do nosso sistema web.", timestamp: "2026-06-10 15:30" },
      { id: "com2", authorName: "Teresa Manuel Kinjango", content: "Lá estarei para reportar o estado geral de saúde de nossos idosos.", timestamp: "2026-06-11 09:12" }
    ]
  },
  {
    id: "not2",
    title: "Preparativos do Casamento de Jandira: Encontro Especial em Julho",
    content: "Queremos partilhar a alegria do vosso apoio para o dote de noivado (Alambamento) de nossa querida neta Jandira. O dote tradicional ocorrerá no Huambo em meados de Dezembro, mas daremos início às reuniões de planeamento em Julho por Zoom e presencial.",
    authorName: "Isabel Fernandes Kinjango",
    authorRole: "Familiar / Mãe de Noiva",
    publishedAt: "2026-06-14 18:45",
    reactions: { "🎉": 15, "❤️": 20 },
    comments: [
      { id: "com3", authorName: "Jandira António Kinjango", content: "Muito obrigada a todos pelo amor infindável! ❤️", timestamp: "2026-06-14 20:00" }
    ]
  }
];

export const INITIAL_EVENTS: FamilyEvent[] = [
  { id: "evt1", title: "Aniversário de António Kinjango", description: "Celebração do 61º aniversário do nosso prezado conselheiro António", date: "2026-06-14", type: "Aniversário", location: "Residência em Alvalade, Luanda" },
  { id: "evt2", title: "Mesa Redonda Kinjango 2026", description: "Assembleia ordinária anual para planeamento estratégico e votação do FPI", date: "2026-06-25", type: "Reunião", location: "Videoconferência Teams / Presencial Luanda" },
  { id: "evt3", title: "Missa de Homenagem Patriarca Manuel", description: "6 anos de falecimento do Patriarca Manuel Kinjango", date: "2026-10-15", type: "Aviso", location: "Catedral da Sé, Huambo" },
  { id: "evt4", title: "Casamento Jandira & Ricardo", description: "Festa de Matrimónio oficial", date: "2026-12-18", type: "Casamento", location: "Salão Nobre Luanda" }
];

export const INITIAL_RECOMMENDATIONS: FPIRecommendation[] = [
  { id: "rec1", category: "Educação", impact: "Alto", description: "Atingir 70% de membros adultos com ensino superior completo. Propomos criar parcerias de bolsas de estudo usando 5% da quota acumulada." },
  { id: "rec2", category: "Financeiro", impact: "Alto", description: "Reduzir a taxa de devedores de quotas. Implementar notificações automáticas SMS/WhatsApp de aviso de vencimento de quotas de 10.000 Kz." },
  { id: "rec3", category: "Emprego", impact: "Médio", description: "Fomentar o empreendedorismo jovem e estágios de tecnologia gerados por membros experientes da própria família." },
  { id: "rec4", category: "Participação", impact: "Baixo", description: "Promover encontros regionais trimestrais (Benguela, Luanda e Huambo) para integrar cônjuges externos e linhagens periféricas." }
];

// Helper functions for state
export function getStoredState<T>(key: string, defaultValue: T): T {
  try {
    const value = localStorage.getItem(`kinjango_${key}`);
    return value ? JSON.parse(value) : defaultValue;
  } catch {
    return defaultValue;
  }
}

export function setStoredState<T>(key: string, value: T): void {
  try {
    localStorage.setItem(`kinjango_${key}`, JSON.stringify(value));
  } catch (e) {
    console.error("Localstorage save failed:", e);
  }
}
