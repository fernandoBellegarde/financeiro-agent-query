import Fastify from "fastify";
import { PrismaClient } from "@prisma/client";
import cors from "@fastify/cors";
import { GoogleGenerativeAI } from "@google/generative-ai";
import * as dotenv from "dotenv";

dotenv.config();

const fastify = Fastify({ logger: true });
fastify.register(cors, {
  origin: "*",
});
const prisma = new PrismaClient();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

fastify.post("/clientes", async (request, reply) => {
  const { id, nome, email, dataAbertura } = request.body as any;
  try {
    const novoCliente = await prisma.cliente.create({
      data: {
        client_origin_id: id,
        nome,
        email,
        dataContaAberta: new Date(dataAbertura),
      },
    });
    return novoCliente;
  } catch (err) {
    return reply.status(400).send({
      error: "Erro ao cadastrar cliente. Verifique se o ID já existe.",
    });
  }
});

// --- ROTA DO AGENTE (Onde a mágica acontece) ---
fastify.post("/ask", async (request, reply) => {
  const { pergunta } = request.body as { pergunta: string };

  try {
    const genAI = new GoogleGenerativeAI(
      "AIzaSyDHqXg4VtMuZ1LADmM08tb7dfu4dc0lnqc",
    );

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      Você é um assistente de banco de dados financeiro.
      Analise a pergunta do usuário e classifique-a em uma das seguintes intenções:
      - "listar_clientes": se ele quiser saber quais empresas ou clientes estão cadastrados.
      - "extrato_geral": se ele quiser ver todas as transações ou movimentações.
      - "resumo_financeiro": se ele quiser saber totais, quanto entrou (credito) ou quanto saiu (debito).
      - "desconhecido": para qualquer outro assunto.

      Pergunta: "${pergunta}"

      Responda APENAS um JSON: {"intent": "nome_da_intencao"}. 
      Não use blocos de código ou texto extra.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();

    // Converte a resposta da IA em objeto
    const { intent } = JSON.parse(text);

    // --- LÓGICA DE EXECUÇÃO DO PRISMA ---
    switch (intent) {
      case "listar_clientes":
        const clientes = await prisma.cliente.findMany({
          include: { _count: { select: { transacoes: true } } }, // Mostra quantos registros cada um tem
        });
        return {
          intent,
          mensagem: "Aqui estão os clientes cadastrados:",
          dados: clientes,
        };

      case "extrato_geral":
        const transacoes = await prisma.transacao.findMany({
          include: { cliente: { select: { nome: true } } }, // Traz o nome da empresa junto
          orderBy: { authorizedAt: "desc" },
        });
        return {
          intent,
          mensagem: "Exibindo as últimas movimentações:",
          dados: transacoes,
        };

      case "resumo_financeiro":
        const resumo = await prisma.transacao.groupBy({
          by: ["tipoTransacao"],
          _sum: { valor: true },
          _count: { id: true },
        });
        return {
          intent,
          mensagem: "Aqui está o resumo financeiro por tipo:",
          dados: resumo,
        };

      default:
        return {
          intent: "desconhecido",
          mensagem:
            "Ainda não sei como processar essa informação na V0. Tente perguntar sobre clientes ou transações.",
        };
    }
  } catch (error) {
    fastify.log.error(error);
    return reply
      .status(500)
      .send({ error: "Falha no processamento da IA ou do Banco." });
  }
});

const start = async () => {
  try {
    await fastify.listen({ port: 3333 });
    console.log("🚀 Agente Online em http://localhost:3333");
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
