# 🔐 NextAuth.js - Instruções de Uso

## ✅ O que foi implementado

NextAuth.js foi configurado para substituir o Firebase Authentication, permitindo autenticação **100% gratuita** com email e senha armazenados no Firestore.

## 📦 Estrutura

- **`/src/lib/auth.ts`** - Configuração do NextAuth.js
- **`/src/app/api/auth/[...nextauth]/route.ts`** - API route de autenticação
- **`/scripts/create-barber.ts`** - Script para criar usuários barbeiros
- **`.env.local`** - Variáveis de ambiente (não versionar no Git!)

## 🚀 Como usar

### 1. Criar o primeiro usuário barbeiro

```powershell
npm run create-barber
```

**Edite o arquivo `scripts/create-barber.ts` antes de executar para definir:**
- Email do barbeiro
- Senha inicial
- Nome

### 2. Fazer login

Acesse: http://localhost:9002/admin/login

Use o email e senha que você definiu no script.

### 3. Criar mais barbeiros (via código)

Você pode executar o script várias vezes mudando os dados, ou criar uma interface admin para isso.

## 🗄️ Estrutura no Firestore

Os usuários são salvos na coleção `/barbers` com a estrutura:

```
/barbers/{email}
  - name: string
  - email: string
  - password: string (hash bcrypt)
  - createdAt: string (ISO date)
```

## 🔒 Segurança

- ✅ Senhas com hash bcrypt (salt rounds: 10)
- ✅ Sessões JWT criptografadas
- ✅ Secret key forte (mude em produção!)
- ✅ Proteção de rotas via middleware

## ⚙️ Variáveis de Ambiente

Arquivo `.env.local`:

```env
NEXTAUTH_SECRET=seu-secret-super-seguro
NEXTAUTH_URL=http://localhost:9002
```

**Em produção, use um secret forte:**
```powershell
# Gerar secret seguro
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## 📝 Notas

- Não é mais necessário Firebase Authentication
- Firestore continua sendo usado para dados (appointments, etc)
- Totalmente gratuito, sem limites
- Pronto para deploy na Vercel
