# Status do Banco de Dados - Firestore

## 📊 Estrutura do Banco de Dados

### Collections (Coleções)

1. **`appointments`** - Agendamentos
   - Campos salvos:
     - `customerName` (string) - Nome do cliente
     - `customerPhone` (string) - Telefone do cliente
     - `serviceId` (string) - ID do serviço
     - `serviceName` (string) - Nome do serviço
     - `startTime` (string ISO) - Data/hora do agendamento
   - ⚠️ **Nota**: O campo `customerId` não está sendo salvo atualmente

2. **`roles_barber`** - Papéis de barbeiro
   - Usado para controlar acesso ao painel admin
   - Bloqueado para leitura/escrita do cliente

3. **`customers`** - Perfis de clientes (não usado atualmente)

4. **`services`** - Serviços oferecidos (hardcoded no código, não no banco)

5. **`barbers`** - Perfis de barbeiros (não usado atualmente)

## 🔧 Como Funciona

### Salvamento de Agendamentos
- **Método**: Server Action (`src/lib/actions.ts`)
- **SDK**: Firebase Admin SDK (bypassa regras de segurança)
- **Collection**: `appointments`
- **Processo**:
  1. Cliente preenche formulário
  2. Dados validados com Zod
  3. Salvos via Admin SDK (não precisa autenticação)
  4. Retorna sucesso/erro

### Leitura de Agendamentos
- **Método**: Client-side hook (`useCollection`)
- **SDK**: Firebase Client SDK
- **Query**: Busca agendamentos com `startTime >= hoje`
- **Uso**: 
  - Mostrar horários disponíveis no formulário
  - Listar agendamentos no painel admin

## 🔒 Regras de Segurança (Firestore Rules)

### Appointments
- ✅ **Read**: Qualquer um pode ler (para ver horários disponíveis)
- ✅ **List**: Qualquer um pode listar
- ⚠️ **Create**: Requer autenticação (`isSignedIn()`)
- ⚠️ **Problema**: Como usa Admin SDK, não precisa autenticação, mas as regras esperam

### Roles Barber
- ❌ **Read/Write**: Bloqueado para clientes
- ✅ Apenas Admin SDK pode acessar

## ⚠️ Problemas Identificados

1. **Campo `customerId` ausente**
   - As regras do Firestore esperam `customerId` para validação
   - Atualmente não está sendo salvo
   - **Impacto**: Baixo (Admin SDK bypassa regras)

2. **Regras vs Admin SDK**
   - Admin SDK não precisa de autenticação
   - Regras do Firestore esperam usuário autenticado
   - **Status**: Funciona, mas inconsistente

3. **Leitura de agendamentos**
   - Cliente lê todos os agendamentos para ver horários ocupados
   - Pode ser um problema de privacidade
   - **Solução**: Considerar salvar apenas horários ocupados em collection separada

## ✅ Funcionalidades Funcionando

- ✅ Salvamento de agendamentos via Admin SDK
- ✅ Leitura de agendamentos para verificar disponibilidade
- ✅ Listagem de agendamentos no painel admin
- ✅ Filtro por data (apenas futuros)

## 🔍 Como Verificar se Está Funcionando

1. **Teste de Salvamento**:
   - Preencha o formulário de agendamento
   - Verifique o console do servidor (terminal) para logs
   - Deve aparecer: "--- New Appointment Saved (ID: ...) ---"

2. **Teste de Leitura**:
   - Abra o console do navegador (F12)
   - Verifique se há erros do Firestore
   - Os horários ocupados devem aparecer no formulário

3. **Verificar no Firebase Console**:
   - Acesse: https://console.firebase.google.com
   - Vá em Firestore Database
   - Verifique a collection `appointments`

## 📝 Recomendações

1. Adicionar campo `customerId` mesmo que não autenticado (pode ser hash do telefone)
2. Considerar usar apenas Admin SDK para writes (já está assim)
3. Melhorar privacidade: não expor todos os dados dos agendamentos
4. Adicionar índices no Firestore para queries mais rápidas






