# 🚀 GUIA RÁPIDO - Troubleshooting de Agendamento

## ⚡ SOLUÇÃO RÁPIDA (MAIS COMUM)

### O servidor está rodando?

```bash
# Execute este comando na pasta do projeto:
npm run dev
```

**Aguarde aparecer:**
```
✓ Ready in 2.5s
○ Local:    http://localhost:3000
```

**Depois acesse:** `http://localhost:3000` e teste novamente.

---

## 🔍 CHECKLIST RÁPIDO

Antes de fazer um agendamento, verifique:

- [ ] ✅ Servidor está rodando (`npm run dev`)
- [ ] ✅ Navegador aberto em `http://localhost:3000`
- [ ] ✅ DevTools aberto (F12)
- [ ] ✅ Aba "Console" selecionada no DevTools
- [ ] ✅ Todos os campos do formulário preenchidos:
  - Nome (mínimo 2 caracteres)
  - Telefone (mínimo 10 dígitos)
  - Serviço selecionado
  - Data selecionada (não pode ser domingo)
  - Horário selecionado

---

## 🐛 IDENTIFICANDO O ERRO

### Cenário 1: Nada acontece ao clicar em "Confirmar Agendamento"

**Verifique:**
1. O botão está desabilitado/cinza? → Campos não preenchidos corretamente
2. Console do navegador mostra erro? → Copie e analise o erro

---

### Cenário 2: Mensagem de erro aparece

**Se a mensagem for:**
- `"Erro ao salvar agendamento"` → Veja logs no terminal do servidor
- `"Dados incompletos"` → Algum campo está vazio
- `"Serviço não encontrado"` → Problema com seleção de serviço

---

### Cenário 3: Página não carrega

**Verifique:**
1. Servidor está rodando?
2. Porta 3000 está livre?
3. Há erros no terminal ao iniciar o servidor?

---

## 📋 COMO COLETAR INFORMAÇÕES PARA SUPORTE

### 1. Logs do Servidor (Terminal)
```
Copie TUDO que aparece no terminal após tentar fazer um agendamento.
Procure por linhas com 🔵, ✅ ou ❌
```

### 2. Logs do Navegador (Console)
```
1. Abra DevTools (F12)
2. Aba "Console"
3. Tente fazer agendamento
4. Copie TODOS os logs que aparecem
```

### 3. Logs da Rede (Network)
```
1. Abra DevTools (F12)
2. Aba "Network"
3. Tente fazer agendamento
4. Procure por requisição para "create"
5. Clique nela e veja o status e resposta
```

---

## 🔧 TESTES MANUAIS

### Teste 1: Banco de Dados Funciona?
```bash
npx tsx scripts/test-appointment.ts
```
**Esperado:** ✅ TESTE CONCLUÍDO COM SUCESSO!

---

### Teste 2: API Funciona?
```bash
# Primeiro inicie o servidor:
npm run dev

# Em outro terminal:
npx tsx scripts/test-api.ts
```
**Esperado:** ✅ Agendamento criado com sucesso!

---

## 💡 DICAS

### Limpar Cache do Navegador
```
1. Abra DevTools (F12)
2. Clique com botão direito no ícone de reload
3. Selecione "Limpar cache e recarregar página"
```

### Verificar Arquivo de Banco
```
Abra: data/barbers.json
Procure a seção "appointments"
Veja se há agendamentos lá
```

### Reiniciar Servidor
```
1. No terminal, pressione Ctrl+C
2. Digite: npm run dev
3. Aguarde iniciar
4. Teste novamente
```

---

## ⚠️ PROBLEMAS CONHECIDOS

### Domingo Bloqueado
- Barbearia não funciona aos domingos
- Sistema bloqueia agendamentos neste dia
- **Solução:** Escolha outro dia

### Horários Ocupados
- Horários já agendados não aparecem
- **Solução:** Escolha outro horário ou data

### Porto 3000 em Uso
- Erro: `Port 3000 is already in use`
- **Solução:** 
  ```bash
  # Pare o processo que está usando a porta
  # Ou use outra porta:
  PORT=3001 npm run dev
  ```

---

## 📞 PRECISA DE AJUDA?

**Antes de pedir ajuda, tenha em mãos:**

1. ✅ Logs do terminal (servidor)
2. ✅ Logs do console do navegador
3. ✅ Screenshot do erro (se houver)
4. ✅ Descrição exata do que acontece
5. ✅ Resultado dos testes manuais

**Com essas informações, o diagnóstico será muito mais rápido!**

---

**Última atualização:** 10 de dezembro de 2025
