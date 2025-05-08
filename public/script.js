document.addEventListener('DOMContentLoaded', () => {
    const serviceStatus = document.getElementById('serviceStatus');
    const sendEmailBtn = document.getElementById('sendEmailBtn');
    const sendStatus = document.getElementById('sendStatus');

    // Função para verificar o status do serviço
    async function checkServiceStatus() {
        try {
            const response = await fetch('/health');
            const data = await response.json();
            
            if (data.status === 'ok') {
                serviceStatus.className = 'alert alert-success';
                serviceStatus.textContent = 'Serviço funcionando normalmente';
            } else {
                serviceStatus.className = 'alert alert-warning';
                serviceStatus.textContent = 'Serviço com problemas';
            }
        } catch (error) {
            serviceStatus.className = 'alert alert-danger';
            serviceStatus.textContent = 'Erro ao verificar status do serviço';
        }
    }

    // Função para enviar email manualmente
    async function sendManualEmail() {
        try {
            sendEmailBtn.disabled = true;
            sendEmailBtn.textContent = 'Enviando...';
            sendStatus.style.display = 'none';

            const response = await fetch('/send-email', {
                method: 'POST'
            });
            const data = await response.json();

            if (data.success) {
                sendStatus.className = 'alert alert-success';
                sendStatus.textContent = 'E-mail enviado com sucesso!';
            } else {
                sendStatus.className = 'alert alert-danger';
                sendStatus.textContent = 'Erro ao enviar e-mail: ' + data.message;
            }
        } catch (error) {
            sendStatus.className = 'alert alert-danger';
            sendStatus.textContent = 'Erro ao enviar e-mail. Tente novamente.';
        } finally {
            sendStatus.style.display = 'block';
            sendEmailBtn.disabled = false;
            sendEmailBtn.textContent = 'Enviar E-mail Agora';
        }
    }

    // Verificar status inicial
    checkServiceStatus();

    // Verificar status a cada 5 minutos
    setInterval(checkServiceStatus, 5 * 60 * 1000);

    // Adicionar evento de clique ao botão
    sendEmailBtn.addEventListener('click', sendManualEmail);
}); 