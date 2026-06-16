/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum UserRole {
  SUPER_ADMIN = "SUPER_ADMIN",
  CONSELHO_FAMILIAR = "CONSELHO_FAMILIAR",
  TESOUREIRO = "TESOUREIRO",
  SECRETARIO = "SECRETARIO",
  FAMILIAR = "FAMILIAR"
}

export interface FamilyMember {
  id: string;
  fullName: string;
  photoUrl: string;
  gender: 'M' | 'F';
  birthDate: string; // YYYY-MM-DD
  maritalStatus: 'Solteiro' | 'Solteira' | 'Casado' | 'Divorciado' | 'Viúvo' | 'Viúva';
  profession: string;
  phone: string;
  email: string;
  address: string;
  bio: string;
  relationshipDegree: string; // e.g., "Patriarca", "Filho", "Neto", "Cônjuge", "Bisneto"
  lineage: string; // e.g., "Linhagem Manuel Kinjango" or "Linhagem Externa"
  parentId?: string; // Father or primary parent
  motherId?: string; // Mother
  spouseId?: string; // Spouse
  childrenIds?: string[];
  educationLevel: 'Nenhum' | 'Básico' | 'Médio' | 'Licenciatura' | 'Mestrado' | 'Doutoramento';
  isDeceased?: boolean;
}

export interface Marriage {
  id: string;
  spouse1Id: string;
  spouse2Id: string;
  spouse1Name: string;
  spouse2Name: string;
  date: string;
  location: string;
  photos: string[];
  invitationUrl?: string;
  status: 'Planeado' | 'Celebrado' | 'Em processo';
}

export interface FamilyRequest {
  id: string;
  title: string;
  type: 'Casamento' | 'Apoio Financeiro' | 'Apoio de Saúde' | 'Outro';
  requesterId: string;
  requesterName: string;
  description: string;
  amountRequested?: number; // For support
  submittedAt: string;
  status: 'Submetido' | 'Em Análise' | 'Aprovado' | 'Concluído';
  remarks?: string;
}

export interface DeathRecord {
  id: string;
  memberId: string;
  memberName: string;
  date: string;
  cause: string;
  location: string;
  ceremonies: string;
  tributes: string[];
  candlesLit: number;
}

export interface PatientRecord {
  id: string;
  memberId: string;
  memberName: string;
  diagnosis: string;
  clinicalState: 'Estável' | 'Sério' | 'Crítico';
  needs: string;
  responsibleMemberId: string;
  responsibleMemberName: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  memberId: string;
  memberName: string;
  month: string; // YYYY-MM
  amount: number; // Defaults to 10000
  paidAt: string; // YYYY-MM-DD
  receiptNumber: string;
  hasFine: boolean;
  fineAmount: number;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  authorName: string;
  authorRole: string;
  publishedAt: string;
  reactions: { [key: string]: number }; // emoji -> count
  comments: Array<{
    id: string;
    authorName: string;
    content: string;
    timestamp: string;
  }>;
}

export interface FamilyEvent {
  id: string;
  title: string;
  description: string;
  date: string; // YYYY-MM-DD
  type: 'Aniversário' | 'Casamento' | 'Reunião' | 'Aviso';
  location?: string;
}

export interface FPIRecommendation {
  id: string;
  category: 'Participação' | 'Financeiro' | 'Educação' | 'Emprego';
  impact: 'Alto' | 'Médio' | 'Baixo';
  description: string;
}
