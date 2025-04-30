# Automação de Lições de Phrasal Verbs via Email

Este projeto automatiza o envio diário de lições de phrasal verbs em inglês via email, utilizando a API da DeepSeek para gerar conteúdo educativo e o Nodemailer para envio das mensagens.

## Funcionalidades

- Envio automático de lições diárias às 8h da manhã (horário de Brasília)
- Conteúdo gerado por IA incluindo:
  - Definição e significados
  - Contextos de uso
  - Exemplos em frases
  - Diálogo usando o phrasal verb
  - Cena de filme/série
  - Dicas de memorização
- Lista de phrasal verbs configurável
- Horário de envio personalizável
- Modo de desenvolvimento para testes

## Configuração

1. Clone o repositório
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:
   ```
   DEEPSEEK_API_KEY=sua_chave_api_deepseek
   GMAIL_USER=seu_email@gmail.com
   GMAIL_APP_PASSWORD=sua_senha_de_app_gmail
   ```

   > **Importante**: Para o Gmail, você precisa usar uma "Senha de App" e não sua senha normal. Para criar uma:
   > 1. Ative a verificação em duas etapas na sua conta Google
   > 2. Vá para [Senhas de App](https://myaccount.google.com/apppasswords)
   > 3. Gere uma nova senha para o aplicativo

4. Configure o arquivo `config.json` com seu email:
   ```json
   "email": {
     "subject": "🇬🇧 Lição Diária de Phrasal Verb: {phrasalVerb}",
     "from": "seu-email@gmail.com",
     "to": "seu-email@gmail.com",
     "html": true
   }
   ```

## Personalização

### Adicionar/Remover Phrasal Verbs

Para adicionar ou remover phrasal verbs, você pode:

1. Editar diretamente o arquivo `phrasal-verbs.json`
2. Usar as funções exportadas do módulo:
   ```javascript
   const { addPhrasalVerb, removePhrasalVerb } = require('./index.js');
   
   // Adicionar novo phrasal verb
   await addPhrasalVerb('new phrasal verb');
   
   // Remover phrasal verb
   await removePhrasalVerb('phrasal verb to remove');
   ```

### Alterar Horário de Envio

Para alterar o horário de envio, edite o arquivo `config.json`:

```json
{
  "schedule": {
    "time": "0 8 * * *",  // Formato cron (minuto hora dia mês dia-semana)
    "timezone": "America/Sao_Paulo"
  }
}
```

## Uso

### Iniciar o Serviço

```bash
npm start
```

### Testar em Modo de Desenvolvimento

```bash
npm run dev
```

## Estrutura do Projeto

- `index.js` - Script principal
- `config.json` - Configurações do sistema
- `phrasal-verbs.json` - Lista de phrasal verbs
- `.env` - Variáveis de ambiente (não versionado)

## Dependências

- axios
- dotenv
- node-cron
- nodemailer
- cross-env

## Licença

MIT 