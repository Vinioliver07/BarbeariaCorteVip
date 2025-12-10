import bcrypt from 'bcryptjs';
import { getBarberByEmail } from '../src/lib/db';

async function testLogin() {
  const email = 'admin@cortevip.com';
  const password = '123456';
  
  console.log('Testando login...');
  console.log('Email:', email);
  console.log('Senha:', password);
  
  const barber = getBarberByEmail(email);
  
  if (!barber) {
    console.log('❌ Barbeiro não encontrado!');
    return;
  }
  
  console.log('\n✅ Barbeiro encontrado:');
  console.log('Nome:', barber.name);
  console.log('Email:', barber.email);
  console.log('Hash armazenado:', barber.password);
  
  // Testar senha
  const isValid = await bcrypt.compare(password, barber.password);
  
  console.log('\n🔐 Teste de senha:');
  console.log('Senha válida?', isValid ? '✅ SIM' : '❌ NÃO');
  
  if (!isValid) {
    console.log('\n🔄 Gerando novo hash...');
    const newHash = await bcrypt.hash(password, 10);
    console.log('Novo hash:', newHash);
  }
}

testLogin().catch(console.error);
