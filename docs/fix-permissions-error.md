# Como Resolver o Erro "Missing or insufficient permissions"

## 🔴 Problema

O erro `FirebaseError: Missing or insufficient permissions` ocorre quando:
1. O Admin SDK não tem credenciais adequadas
2. As regras do Firestore não permitem a operação
3. O Client SDK está tentando criar documentos sem permissão

## ✅ Solução 1: Deploy das Regras do Firestore (Recomendado)

As regras já foram atualizadas no arquivo `firestore.rules` para permitir criação de agendamentos. Você precisa fazer o deploy:

### Opção A: Via Firebase CLI

```bash
# Instalar Firebase CLI (se não tiver)
npm install -g firebase-tools

# Fazer login
firebase login

# Deploy das regras
firebase deploy --only firestore:rules
```

### Opção B: Via Firebase Console

1. Acesse: https://console.firebase.google.com
2. Selecione o projeto: `studio-5687123868-61f5f`
3. Vá em **Firestore Database** → **Rules**
4. Cole as regras atualizadas (já estão no arquivo `firestore.rules`)
5. Clique em **Publish**

## ✅ Solução 2: Configurar Credenciais do Admin SDK

Se o Admin SDK não estiver funcionando, você precisa configurar credenciais:

### Para Desenvolvimento Local:

1. Acesse: https://console.firebase.google.com
2. Vá em **Project Settings** → **Service Accounts**
3. Clique em **Generate New Private Key**
4. Salve o arquivo JSON
5. Configure a variável de ambiente:

**Windows (PowerShell):**
```powershell
$env:FIREBASE_SERVICE_ACCOUNT_KEY = Get-Content "caminho/para/serviceAccountKey.json" -Raw
```

**Windows (CMD):**
```cmd
set FIREBASE_SERVICE_ACCOUNT_KEY=<conteúdo do JSON>
```

**Ou crie um arquivo `.env.local`:**
```
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account",...}
```

## ✅ Solução 3: Usar Firebase Emulator (Desenvolvimento)

Para desenvolvimento local sem precisar de credenciais:

```bash
# Instalar Firebase CLI
npm install -g firebase-tools

# Iniciar emulador
firebase emulators:start --only firestore
```

Depois configure o código para usar o emulador em desenvolvimento.

## 🔍 Verificar se Está Funcionando

1. **Verifique os logs do servidor** ao tentar agendar
2. Procure por: `--- New Appointment Saved (ID: ...) ---`
3. Se aparecer, está funcionando!
4. Se não aparecer, verifique os erros no console

## 📝 Status Atual

- ✅ Removido fallback do Client SDK que causava erro de permissão
- ✅ Admin SDK configurado com logs detalhados
- ⚠️ Precisa fazer deploy das regras do Firestore OU configurar credenciais

## 🚀 Próximos Passos

1. **Escolha uma solução acima** (recomendo Solução 1 - Deploy das Regras)
2. **Teste novamente** o agendamento
3. **Verifique os logs** do servidor para confirmar






