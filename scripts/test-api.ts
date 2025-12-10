// Script para testar a API de agendamento

async function testAPI() {
  console.log('=== TESTE DA API DE AGENDAMENTO ===\n');
  
  const baseUrl = 'http://localhost:3000';
  
  // 1. Testar GET /api/appointments
  console.log('1. Testando GET /api/appointments...');
  try {
    const getResponse = await fetch(`${baseUrl}/api/appointments`);
    if (!getResponse.ok) {
      console.error(`❌ Erro: Status ${getResponse.status}`);
      const text = await getResponse.text();
      console.error('Resposta:', text);
    } else {
      const appointments = await getResponse.json();
      console.log('✅ Sucesso! Agendamentos encontrados:', appointments.length);
      console.log('Agendamentos:', appointments);
    }
  } catch (error: any) {
    console.error('❌ Erro ao conectar com a API:', error.message);
    console.error('CERTIFIQUE-SE que o servidor está rodando com: npm run dev');
    process.exit(1);
  }
  
  console.log('');
  
  // 2. Testar POST /api/appointments/create
  console.log('2. Testando POST /api/appointments/create...');
  const testData = {
    customerName: 'Maria Teste API',
    customerPhone: '37998765432',
    serviceId: 'haircut-beard',
    serviceName: 'Corte + Barba',
    startTime: new Date(Date.now() + 2 * 86400000).toISOString(), // Daqui a 2 dias
  };
  
  console.log('Dados enviados:', testData);
  
  try {
    const postResponse = await fetch(`${baseUrl}/api/appointments/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });
    
    const result = await postResponse.json();
    
    if (!postResponse.ok) {
      console.error(`❌ Erro: Status ${postResponse.status}`);
      console.error('Resposta:', result);
    } else {
      console.log('✅ Agendamento criado com sucesso!');
      console.log('Resposta:', result);
    }
  } catch (error: any) {
    console.error('❌ Erro ao criar agendamento:', error.message);
  }
  
  console.log('');
  console.log('=== TESTE CONCLUÍDO ===');
}

testAPI().catch(console.error);
