// Este arquivo é o ponto de entrada para o Render
const app = require('./Index.js');

// Adicionar um pequeno servidor web para manter o serviço ativo
const http = require('http');
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Phrasal Verbs Service is running!\n');
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
}); 