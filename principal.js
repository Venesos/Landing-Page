document.addEventListener('DOMContentLoaded', function() {
    // Seleciona todos os botões com a classe 'botao-expansivel'
    const botoesExpansivel = document.querySelectorAll('.botao-expansivel');

    // Itera sobre cada botão para adicionar o evento de clique
    botoesExpansivel.forEach(function(botao) {
        botao.addEventListener('click', function() {
            // 'this' se refere ao botão clicado
            // .nextElementSibling pega o próximo irmão do botão, que é a div .conteudo-expansivel
            const conteudoExpansivel = this.nextElementSibling;

            // Alterna a classe 'ativo' no elemento de conteúdo.
            // Se 'ativo' existe, remove. Se não existe, adiciona.
            conteudoExpansivel.classList.toggle('ativo');

            // Muda o texto do botão baseado no estado do conteúdo
            if (conteudoExpansivel.classList.contains('ativo')) {
                this.textContent = 'Ver Menos';
            } else {
                this.textContent = 'Ver Detalhes';
            }
        });
    });
});