import { addAppointment, getAppointments, readDb } from '../src/lib/db';

console.log('=== TESTE DE AGENDAMENTO ===\n');

// 1. Verificar estado atual do banco
console.log('1. Verificando estado atual do banco de dados...');
const dbBefore = readDb();
console.log('Barbeiros:', dbBefore.barbers.length);
console.log('Agendamentos:', dbBefore.appointments.length);
console.log('');

// 2. Tentar adicionar um agendamento de teste
console.log('2. Tentando adicionar um agendamento de teste...');
try {
  const testAppointment = {
    customerName: 'João Teste',
    customerPhone: '37991234567',
    serviceId: 'haircut',
    serviceName: 'Corte Simples',
    startTime: new Date(Date.now() + 86400000).toISOString(), // Amanhã
  };
  
  console.log('Dados do agendamento:', testAppointment);
  
  const newAppointment = addAppointment(testAppointment);
  console.log('✅ Agendamento criado com sucesso!');
  console.log('ID:', newAppointment.id);
  console.log('Criado em:', newAppointment.createdAt);
  console.log('');
  
  // 3. Verificar se foi salvo
  console.log('3. Verificando se o agendamento foi salvo...');
  const appointments = getAppointments();
  console.log('Total de agendamentos:', appointments.length);
  console.log('Último agendamento:', appointments[appointments.length - 1]);
  console.log('');
  
  console.log('✅ TESTE CONCLUÍDO COM SUCESSO!');
} catch (error) {
  console.error('❌ ERRO AO CRIAR AGENDAMENTO:');
  console.error(error);
  process.exit(1);
}
