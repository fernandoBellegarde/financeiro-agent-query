import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando a injeção de dados falsos (Mock)...");

  await prisma.transacao.deleteMany();

  await prisma.cliente.upsert({
    where: { client_origin_id: 'CLI-001' },
    update: {},
    create: {
      client_origin_id: 'CLI-001',
      nome: 'Empresa Alpha Tech',
      email: 'financeiro@alphatech.com.br',
      dataContaAberta: new Date('2023-11-01'),
    },
  });

  await prisma.cliente.upsert({
    where: { client_origin_id: 'CLI-002' },
    update: {},
    create: {
      client_origin_id: 'CLI-002',
      nome: 'Padaria do Bairro',
      email: 'contato@padariadobairro.com',
      dataContaAberta: new Date('2024-02-15'),
    },
  });

  await prisma.cliente.upsert({
    where: { client_origin_id: 'CLI-003' },
    update: {},
    create: {
      client_origin_id: 'CLI-003',
      nome: 'Consultoria XYZ',
      email: 'ceo@xyzconsultoria.com',
      dataContaAberta: new Date('2024-05-10'),
    },
  });

  // 3. Cria as Transações
  await prisma.transacao.createMany({
    data: [
      // Movimentações da Alpha Tech (Maior volume)
      { client_origin_id: 'CLI-001', tipoTransacao: 'credito', valor: 15000.00 },
      { client_origin_id: 'CLI-001', tipoTransacao: 'credito', valor: 8500.50 },
      { client_origin_id: 'CLI-001', tipoTransacao: 'debito',  valor: 2300.00 },
      { client_origin_id: 'CLI-001', tipoTransacao: 'debito',  valor: 450.00 },

      // Movimentações da Padaria (Volume menor, mais transações)
      { client_origin_id: 'CLI-002', tipoTransacao: 'credito', valor: 350.00 },
      { client_origin_id: 'CLI-002', tipoTransacao: 'credito', valor: 120.00 },
      { client_origin_id: 'CLI-002', tipoTransacao: 'credito', valor: 85.00 },
      { client_origin_id: 'CLI-002', tipoTransacao: 'debito',  valor: 900.00 }, // Compra de farinha

      // Movimentações da Consultoria
      { client_origin_id: 'CLI-003', tipoTransacao: 'credito', valor: 5000.00 },
      { client_origin_id: 'CLI-003', tipoTransacao: 'debito',  valor: 150.00 }, // Assinatura de software
    ],
  });

  console.log("✅ Dados mockados inseridos com sucesso no SQLite!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });