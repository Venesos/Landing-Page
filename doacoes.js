function copyPixKey() {
    const pixKeyElement = document.getElementById('pixKey');
    const pixKey = pixKeyElement.innerText;
    const copyButton = document.querySelector('.copy-button');
    const copyMessage = document.getElementById('copyMessage');

    // Usa a API Clipboard para copiar o texto
    navigator.clipboard.writeText(pixKey).then(() => {
        // Feedback visual
        copyMessage.textContent = 'Chave Pix copiada!';
        copyMessage.classList.add('show');
        copyButton.classList.add('copied');

        // Volta ao estado original após um tempo
        setTimeout(() => {
            copyMessage.classList.remove('show');
            copyButton.classList.remove('copied');
        }, 2000); // 2 segundos
    }).catch(err => {
        console.error('Erro ao copiar a chave Pix: ', err);
        copyMessage.textContent = 'Erro ao copiar. Tente novamente.';
        copyMessage.style.color = '#dc3545'; // Vermelho para erro
        copyMessage.classList.add('show');
        setTimeout(() => {
            copyMessage.classList.remove('show');
            copyMessage.style.color = '#28a745'; // Volta à cor original
        }, 2000);
    });
}