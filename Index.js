// Automação de Lições Diárias de Phrasal Verbs via Email
// Este script utiliza a API da OpenAI para gerar conteúdo educativo sobre phrasal verbs
// e o Nodemailer para enviar automaticamente por email às 8h da manhã.

const axios = require('axios');
const cron = require('node-cron');
const fs = require('fs').promises;
const nodemailer = require('nodemailer');
const http = require('http');
const path = require('path');
const express = require('express');
const app = express();
require('dotenv').config();

// Carregar configurações
const config = require('./config.json');
const { phrasalVerbs } = require('./phrasal-verbs.json');

// Configurações das APIs
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD;

// Função para gerar prompt para a API OpenAI
function generatePhrasalVerbPrompt(phrasalVerb) {
  return `
    Crie uma lição completa sobre o phrasal verb "${phrasalVerb}" em inglês que inclua:

    Comece sempre dizendo: Olá, Marcos Paulo! How are you doing today?
    
    1. Definição e significados do phrasal verb "${phrasalVerb}"
    2. Em quais contextos este phrasal verb é mais comumente utilizado
    3. 3 exemplos de frases com o phrasal verb em contextos diferentes (em inglês e traduzido abaixo)
    4. Um diálogo curto (5-6 falas) entre duas pessoas usando o phrasal verb (em inglês e traduzido abaixo)
    5. Uma cena famosa de filme, série ou livro onde este phrasal verb (phrasal verb precisa ter sido dita literalmente) é utilizado (ou uma cena fictícia se não houver uma famosa) (em inglês e traduzido abaixo)
    6. Uma dica para memorizar este phrasal verb
    7. 3 exercícios de gramática para praticar o phrasal verb
    8. Sentido etimológico do phrasal verb
    
    Formate o conteúdo de forma clara e organizada para ser enviado como email.

    Assine como: Seu professor de inglês.
  `;
}

// Função para selecionar um phrasal verb aleatório
function getRandomPhrasalVerb() {
  const randomIndex = Math.floor(Math.random() * phrasalVerbs.length);
  return phrasalVerbs[randomIndex];
}

// Função para gerar o conteúdo da lição usando a API da OpenAI
async function generateLessonContent() {
  try {
    const phrasalVerb = getRandomPhrasalVerb();
    const prompt = generatePhrasalVerbPrompt(phrasalVerb);
    
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: config.api.openai.model,
        messages: [{ role: "user", content: prompt }],
        temperature: config.api.openai.temperature,
        max_tokens: config.api.openai.max_tokens
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        }
      }
    );
    
    return {
      phrasalVerb,
      content: response.data.choices[0].message.content
    };
  } catch (error) {
    console.error('Erro ao gerar conteúdo:', error.message);
    throw new Error(`Falha ao gerar conteúdo: ${error.message}`);
  }
}

// Função para enviar email via Gmail
async function sendEmail(subject, htmlContent) {
  try {
    // Criar um transporter do Nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: GMAIL_USER,
        pass: GMAIL_APP_PASSWORD
      }
    });
    
    // Configurar o email
    const mailOptions = {
      from: config.email.from,
      to: config.email.to,
      subject: subject,
      html: htmlContent
    };
    
    // Enviar o email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email enviado com sucesso:', info.messageId);
    return info;
  } catch (error) {
    console.error('Erro ao enviar email:', error.message);
    throw new Error(`Falha ao enviar email: ${error.message}`);
  }
}

// Função principal que executa todo o processo
async function sendDailyPhrasalVerbLesson() {
  try {
    console.log('Gerando lição de phrasal verb...');
    const lessonData = await generateLessonContent();
    
    // Formatar o conteúdo do email
    const htmlContent = config.message.format
      .replace('{phrasalVerb}', lessonData.phrasalVerb.toUpperCase())
      .replace('{content}', lessonData.content.replace(/\n/g, '<br>'));
    
    // Formatar o assunto do email
    const subject = config.email.subject
      .replace('{phrasalVerb}', lessonData.phrasalVerb.toUpperCase());
    
    console.log('Enviando lição por email...');
    await sendEmail(subject, htmlContent);
    
    console.log('Lição enviada com sucesso!');
  } catch (error) {
    console.error('Falha no processo:', error.message);
    // Aqui você pode adicionar notificações de erro adicionais se desejar
  }
}

// Função para adicionar novo phrasal verb à lista
async function addPhrasalVerb(newPhrasalVerb) {
  try {
    if (!phrasalVerbs.includes(newPhrasalVerb)) {
      phrasalVerbs.push(newPhrasalVerb);
      await fs.writeFile('./phrasal-verbs.json', JSON.stringify({ phrasalVerbs }, null, 2));
      console.log(`Phrasal verb "${newPhrasalVerb}" adicionado com sucesso!`);
    } else {
      console.log(`Phrasal verb "${newPhrasalVerb}" já existe na lista.`);
    }
  } catch (error) {
    console.error('Erro ao adicionar phrasal verb:', error.message);
    throw error;
  }
}

// Função para remover phrasal verb da lista
async function removePhrasalVerb(phrasalVerbToRemove) {
  try {
    const index = phrasalVerbs.indexOf(phrasalVerbToRemove);
    if (index > -1) {
      phrasalVerbs.splice(index, 1);
      await fs.writeFile('./phrasal-verbs.json', JSON.stringify({ phrasalVerbs }, null, 2));
      console.log(`Phrasal verb "${phrasalVerbToRemove}" removido com sucesso!`);
    } else {
      console.log(`Phrasal verb "${phrasalVerbToRemove}" não encontrado na lista.`);
    }
  } catch (error) {
    console.error('Erro ao remover phrasal verb:', error.message);
    throw error;
  }
}

// Função para enviar email de status
async function sendStatusEmail(status) {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: GMAIL_USER,
        pass: GMAIL_APP_PASSWORD
      }
    });
    
    const mailOptions = {
      from: config.email.from,
      to: config.email.to,
      subject: 'Status do Serviço de Phrasal Verbs',
      html: `
        <h1>Status do Serviço</h1>
        <p>Data: ${new Date().toISOString()}</p>
        <p>Status: ${status}</p>
        <p>Última execução: ${new Date().toISOString()}</p>
        <p>Próxima execução: ${new Date().toLocaleString('pt-BR', { timeZone: config.schedule.timezone })}</p>
      `
    };
    
    await transporter.sendMail(mailOptions);
    console.log(`[${new Date().toISOString()}] Email de status enviado`);
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Erro ao enviar email de status:`, error);
  }
}

// Servir arquivos estáticos da pasta public
app.use(express.static('public'));

// Endpoint para envio manual de email
app.post('/send-email', async (req, res) => {
    try {
        await sendDailyPhrasalVerbLesson();
        res.json({ success: true });
    } catch (error) {
        console.error(`[${new Date().toISOString()}] Erro no envio manual:`, error);
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
});

// Endpoint de saúde
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        lastExecution: new Date().toISOString(),
        nextScheduled: config.schedule.times
    });
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`[${new Date().toISOString()}] Servidor rodando na porta ${PORT}`);
});

// Agendar email de status diário às 6h
cron.schedule('0 6 * * *', () => {
  sendStatusEmail('Serviço em execução');
}, {
  timezone: config.schedule.timezone
});

// Agendamento para executar nos horários configurados
config.schedule.times.forEach(cronTime => {
  cron.schedule(cronTime, () => {
    const now = new Date();
    console.log(`[${now.toISOString()}] Iniciando execução agendada para ${cronTime}...`);
    sendDailyPhrasalVerbLesson()
      .then(() => {
        console.log(`[${new Date().toISOString()}] Tarefa agendada concluída com sucesso`);
      })
      .catch(error => {
        console.error(`[${new Date().toISOString()}] Erro na tarefa agendada:`, error);
      });
  }, {
    timezone: config.schedule.timezone
  });
  console.log(`[${new Date().toISOString()}] Agendamento configurado para: ${cronTime} (${config.schedule.timezone})`);
});

// Para testar o script imediatamente
if (process.env.NODE_ENV === 'development') {
  console.log(`[${new Date().toISOString()}] Ambiente de desenvolvimento detectado. Executando teste imediato...`);
  sendDailyPhrasalVerbLesson();
}

// Exportar funções para uso externo
module.exports = {
  sendDailyPhrasalVerbLesson,
  addPhrasalVerb,
  removePhrasalVerb
};

// Manter o processo rodando
console.log(`[${new Date().toISOString()}] Serviço iniciado. Aguardando os horários agendados...`);