# Troubleshooting - Agendamento Não Está Confirmando

## 🔍 Diagnóstico

Se o agendamento não está sendo confirmado, siga estes passos:

### 1. Verificar Logs do Servidor

Abra o terminal onde o servidor Next.js está rodando e procure por:

- ✅ **Sucesso**: `--- New Appointment Saved (ID: ...) ---`
- ❌ **Erro**: Mensagens de erro do Firebase Admin SDK

### 2. Verificar Console do Navegador

Abra o DevTools (F12) e verifique:

- **Console**: Procure por erros em vermelho
- **Network**: Verifique se a requisição para `/api` ou server action está sendo feita

### 3. Possíveis Problemas e Soluções

#### Problema 1: Firebase Admin SDK sem Credenciais

**Sintoma**: Erro `permission-denied` ou `unavailable`

**Solução**: 
- Em desenvolvimento, o Admin SDK pode não ter credenciais
- Opção 1: Configurar variável de ambiente `FIREBASE_SERVICE_ACCOUNT_KEY`
- Opção 2: Usar Firebase Emulator
- Opção 3: Modificar para usar Client SDK (requer mudança nas regras)

#### Problema 2: Firestore Rules Bloqueando

**Sintoma**: Erro `permission-denied` mesmo com Admin SDK

**Solução**: 
- Admin SDK deveria bypassar regras, mas verifique se as regras estão publicadas
- Acesse: Firebase Console → Firestore → Rules
- Certifique-se que as regras estão deployadas

#### Problema 3: Erro de Validação

**Sintoma**: Mensagem "Dados inválidos"

**Solução**:
- Verifique os logs do servidor para ver qual campo está inválido
- Certifique-se que todos os campos estão preenchidos corretamente

### 4. Teste Manual

Execute este teste no console do navegador:

```javascript
// Teste se o formulário está funcionando
const form = document.querySelector('form');
console.log('Form encontrado:', !!form);

// Teste se os campos estão preenchidos
const nameInput = document.querySelector('input[name="name"]');
console.log('Nome:', nameInput?.value);
```

### 5. Verificar Firebase Console

1. Acesse: https://console.firebase.google.com
2. Selecione o projeto: `studio-5687123868-61f5f`
3. Vá em **Firestore Database**
4. Verifique se a collection `appointments` existe
5. Veja se há documentos sendo criados

## 🛠️ Soluções Rápidas

### Solução 1: Habilitar Logs Detalhados

Os logs já foram melhorados no código. Verifique o terminal do servidor.

### Solução 2: Testar Conexão Firebase

Crie um arquivo de teste temporário para verificar a conexão.

### Solução 3: Usar Client SDK como Fallback

Se o Admin SDK não funcionar, podemos modificar para usar Client SDK diretamente.

## 📝 Próximos Passos

1. Verifique os logs do servidor ao tentar agendar
2. Copie a mensagem de erro completa
3. Verifique o Firebase Console para ver se os dados estão sendo salvos
4. Compartilhe os erros encontrados para diagnóstico mais preciso






