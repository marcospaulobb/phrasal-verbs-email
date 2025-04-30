// Script de teste para envio de email
const nodemailer = require('nodemailer');
require('dotenv').config();

// Carregar configurações
const config = require('./config.json');

// Configurações do Gmail
const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD;

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

// Função principal para testar o envio de email
async function testEmailSending() {
  try {
    console.log('Iniciando teste de envio de email...');
    
    // Conteúdo de exemplo para o email
    const phrasalVerb = "look up";
    const sampleContent = `
      <h3>Definição e Significados:</h3>
      <p>"Look up" significa procurar informações em um livro, dicionário, ou fonte de referência.</p>
      
      <h3>Contextos de Uso:</h3>
      <p>Este phrasal verb é comumente usado quando precisamos verificar ou encontrar informações.</p>
      
      <h3>Exemplos:</h3>
      <ul>
        <li>I need to look up the meaning of this word in the dictionary.</li>
        <li>She looked up the restaurant's address on her phone.</li>
        <li>If you don't know the answer, you can look it up online.</li>
      </ul>
      
      <h3>Diálogo:</h3>
      <p><strong>Alice:</strong> Do you know what "serendipity" means?</p>
      <p><strong>Bob:</strong> I'm not sure, but I can look it up for you.</p>
      <p><strong>Alice:</strong> Thanks! I've been wondering about that word.</p>
      <p><strong>Bob:</strong> According to the dictionary, it means "the occurrence and development of events by chance in a happy or beneficial way."</p>
      <p><strong>Alice:</strong> Oh, that's a beautiful word! Finding this definition was quite serendipitous.</p>
      
      <h3>Cena de Filme:</h3>
      <p>Em "The Social Network", Mark Zuckerberg (Jesse Eisenberg) diz a Eduardo Saverin: "I need to look up some information about the Winklevoss twins." Esta cena mostra Zuckerberg pesquisando informações sobre os irmãos que o acusaram de roubar a ideia do Facebook.</p>
      
      <h3>Dica para Memorizar:</h3>
      <p>Pense em "look up" como "olhar para cima" em um livro ou tela para encontrar informações. A ação física de levantar os olhos para ler algo em um livro ou tela ajuda a memorizar este phrasal verb.</p>
    `;
    
    // Formatar o conteúdo do email
    const htmlContent = config.message.format
      .replace('{phrasalVerb}', phrasalVerb.toUpperCase())
      .replace('{content}', sampleContent);
    
    // Formatar o assunto do email
    const subject = config.email.subject
      .replace('{phrasalVerb}', phrasalVerb.toUpperCase());
    
    console.log('Enviando email de teste...');
    await sendEmail(subject, htmlContent);
    
    console.log('Teste concluído com sucesso!');
  } catch (error) {
    console.error('Falha no teste:', error.message);
  }
}

// Executar o teste
testEmailSending(); 