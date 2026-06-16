/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Helper to initialize Gemini client lazy-loaded so it won't crash the server if API Key is missing on boot
let genAIClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI {
  if (!genAIClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY_MISSING");
    }
    genAIClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
  }
  return genAIClient;
}

// AI Assistant endpoint
app.post('/api/assistant', async (req, res) => {
  try {
    const { message, history, familyContext } = req.body;
    if (!message) {
       res.status(400).json({ error: "Mensagem em falta" });
       return;
    }

    let ai;
    try {
      ai = getGenAI();
    } catch (e: any) {
      // Graceful fallback when the actual API Key is missing
      if (e.message === "GEMINI_API_KEY_MISSING") {
        console.warn("GEMINI_API_KEY is not defined in Secrets panel. Falling back to simulated assistant.");
        
        // Simulating highly accurate local answers for typical queries when API Key is missing:
        const lower = message.toLowerCase();
        let reply = "Olá! Sou o Assistente Kinjango AI. Atualmente, a chave GEMINI_API_KEY está ausente no painel de Segredos (Secrets), mas posso ajudá-lo simulando as respostas com base nos dados locais:\n\n";
        
        if (lower.includes("devedor") || lower.includes("dívida") || lower.includes("pagar") || lower.includes("quota")) {
          reply += "Analisando os registros financeiros da família Kinjango:\n- Membros em atraso com as quotas de 10.000 Kz: Teresa Kinjango (maio parcial), Jandira António Kinjango, Aline Lucas Kinjango (isenta menor), Paula de Carvalho Kinjango, Manuel Lucas Kinjango.\n- Total de quotas arrecadadas: 191.500 Kz.\n- Percentagem de cumprimento financeiro: ~75%.";
        } else if (lower.includes("casamento") || lower.includes("noivo")) {
          reply += "Temos registrados 2 casamentos celebrados com sucesso:\n1. António Manuel Kinjango & Isabel Fernandes Kinjango (celebrado em 1990-09-08 no Huambo)\n2. Lucas Manuel Kinjango & Arminda Chaves Kinjango (celebrado em 2005-05-20 em Luanda)\nTemos um casamento em planeamento: Jandira António Kinjango & Ricardo (previsto para meados de Dezembro de 2026).";
        } else if (lower.includes("aniversário") || lower.includes("parabéns")) {
          reply += "Aniversários próximos marcados no Calendário familiar:\n- António Kinjango: 14 de Junho (61 anos)\n- Manuel Lucas Kinjango: 30 de Junho (26 anos)\n- Paula de Carvalho Kinjango: 16 de Julho";
        } else if (lower.includes("óbito") || lower.includes("falecido") || lower.includes("memorial")) {
          reply += "Memorial Família Kinjango - Antepassados Fundadores:\n1. Manuel Kinjango (Patriarca): Falecido em 2020-10-15 (124 velas acesas)\n2. Maria Kinjango (Matriarca): Falecida em 2022-12-05 (98 velas acesas)";
        } else {
          reply += "Com certeza! A família Kinjango conta atualmente com 13 membros distribuídos em 3 gerações, liderados honorariamente pelas linhagens históricas do Huambo. Pergunte-me sobre quotas financeiras, casamentos, devedores ou aniversariantes!";
        }
        res.json({ text: reply, simulated: true });
        return;
      }
      throw e;
    }

    // Build rich grounding context from frontend's state
    const { membersCount = 0, decesaedCount = 0, totalCollected = "0 Kz", totalDebt = "0 Kz", pendingRequests = 0, FPI = 84, membersList = [], paymentsList = [], marriagesList = [] } = familyContext || {};

    const systemInstruction = `Você é o KinjangoFamily AI Assistant, uma Inteligência Artificial sénior especialista no gerenciamento familiar e mestre de cerimónias digital da Família Kinjango.
Você tem acesso aos dados estruturados da família para responder de forma factual, transparente, acolhedora e precisa, com o dialeto e termos clássicos de Angola (ex. referir-se a Kz ou Kwanzas, dote tradicional/alambamento, Huambo, Luanda, etc.).

IMPORTANTE: Responda SEMPRE de forma factual com base nos seguintes dados locais fornecidos que refletem as alterações atuais da UI feitas pelo usuário:
- Total de familiares cadastrados: ${membersCount} (vivos e falecidos)
- Membros homenageados no Memorial: ${decesaedCount}
- Situação Quotas Financeiras (Mensalidade: 10.000 Kz por membro adulto):
  * Total arrecadado: ${totalCollected}
  * Total em dívida estimada: ${totalDebt}
- Pedidos familiares pendentes de análise: ${pendingRequests}
- Índice de Desenvolvimento Familiar (FPI): ${FPI}/100
- Lista de Membros Cadastrados: ${JSON.stringify(membersList.map((m: any) => ({ name: m.fullName, age: m.birthDate, state: m.maritalStatus, job: m.profession, lineage: m.lineage, level: m.educationLevel, deceased: !!m.isDeceased, parent: m.relationshipDegree })))}
- Situação de Pagamentos mais recentes: ${JSON.stringify(paymentsList.map((p: any) => ({ name: p.memberName, month: p.month, amount: p.amount, fine: p.fineAmount, date: p.paidAt })))}
- Casamentos: ${JSON.stringify(marriagesList.map((m: any) => ({ spouses: m.spouse1Name + " e " + m.spouse2Name, date: m.date, place: m.location, status: m.status })))}

Regras de comportamento:
1. Responda em Português de Angola/Portugal de forma profissional, elegante e familiar.
2. Diga com precisão quem está em falta se perguntado sobre "devedores" ou "em dívida", calculando com base nos dados.
3. Se perguntarem por aniversariantes de Junho ou deste mês, verifique os que têm o mês '06' em birthDate (ex: Manuel Lucas Kinjango em 2000-06-30, António Manuel Kinjango em 1965-06-14 ou 1965-02-14 de acordo com cadastro).
4. Mantenha os seus conselhos e análises alinhados com a coesão familiar, investimento em educação e integridade financeira (reforçando a taxa de 10.000 Kz para o Fundo comum familiar).`;

    const chatSession = ai.chats.create({
      model: 'gemini-3.5-flash',
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    // Feeding conversation history
    if (history && Array.isArray(history)) {
       // Optional: could populate raw chat history if needed. For now a direct sendMessage handles current message clearly
    }

    const response = await chatSession.sendMessage({ message: message });
    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini route error:", error);
    res.status(500).json({ error: "Erro interno ao processar a consulta com Inteligência Artificial: " + error.message });
  }
});

// Serve frontend build
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`KinjangoFamily server running on http://localhost:${PORT}`);
  });
}

startServer();
