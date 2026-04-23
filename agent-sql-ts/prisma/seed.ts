import { PrismaClient } from "@prisma/client";
import process from "process";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando o seed relacional...");

  // 1. Criar um Cliente primeiro
  const cliente1 = await prisma.cliente.upsert({S
    where: { client_origin_id: "CLI-001" },
    update: {},
    create: {
      client_origin_id: "CLI-001",
      nome: "Empresa Alpha Tech",
      email: "contato@alpha.com",
    },
  });

  const cliente2 = await prisma.cliente.upsert({
    where: { client_origin_id: "CLI-002" },
    update: {},
    create: {
      client_origin_id: "CLI-002",
      nome: "Padaria do Bairro",
      email: "pao@padaria.com",
    },
  });

  // 2. Criar Transações ligadas a esses clientes
  // Note que usamos o 'client_origin_id' que definimos acima
  await prisma.transacao.createMany({
    data: [
      {
        client_origin_id: "CLI-001",
        dataContaAberta: new Date("2024-05-01"),
        tipoTransacao: "recebimento",
        valor: 5000.0,
        faturaPaga: true,
      },
      {
        client_origin_id: "CLI-001",
        dataContaAberta: new Date("2024-05-15"),
        tipoTransacao: "pagamento",
        valor: 1200.0,
        faturaPaga: false,
      },
      {
        client_origin_id: "CLI-002",
        dataContaAberta: new Date("2024-05-10"),
        tipoTransacao: "pagamento",
        valor: 450.0,
        faturaPaga: true,
      },
    ],
  });

  console.log("✅ Banco de dados populado com sucesso!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
