import bcrypt from 'bcryptjs';
import { addBarber, getBarberByEmail } from '../src/lib/db';

/**
 * Script para criar um usuário barbeiro no banco de dados local
 */

async function createBarber() {
  // Dados do barbeiro - MUDE AQUI CONFORME NECESSÁRIO
  const email = 'admin@cortevip.com'; 
  const password = '123456'; 
  const name = 'Administrador CorteVip';
  
  // Verificar se já existe
  const existing = getBarberByEmail(email);
  if (existing) {
    console.log('\n⚠️  Barbeiro já existe com este email!');
    console.log('Email:', existing.email);
    console.log('Nome:', existing.name);
    return;
  }
  
  // Hash da senha
  const hashedPassword = await bcrypt.hash(password, 10);
  
  // Adicionar ao banco
  const barber = addBarber({
    name,
    email,
    password: hashedPassword,
  });
  
  console.log('\n✅ Barbeiro criado com sucesso!\n');
  console.log('📋 DADOS:');
  console.log('ID:', barber.id);
  console.log('Nome:', barber.name);
  console.log('Email:', barber.email);
  console.log('Criado em:', barber.createdAt);
  console.log('\n🔐 CREDENCIAIS DE LOGIN:');
  console.log('Email:', email);
  console.log('Senha:', password);
  console.log('\n⚠️ IMPORTANTE: Mude a senha após o primeiro login!\n');
}

createBarber().catch(console.error);
