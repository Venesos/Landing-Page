// Funções auxiliares para exibir/limpar mensagens de erro
 function displayError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
    }
}

function clearError(elementId) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = '';
    }
}

// --- Validação e Interatividade ---

// 1. Nome: Não pode ter números
document.getElementById('nome').addEventListener('input', function() {
    const nomeInput = this;
    const nomeValue = nomeInput.value;
    if (/\d/.test(nomeValue)) {
        displayError('nomeError', 'O nome não pode conter números.');
        nomeInput.setCustomValidity('O nome não pode conter números.');
    } else {
        clearError('nomeError');
        nomeInput.setCustomValidity('');
    }
});

// 2. Nacionalidade: Exibir campo para estrangeiro
const nacionalidadeRadios = document.querySelectorAll('input[name="Nacionalidade"]');
const nacionalidadeOutraInput = document.getElementById('nacionalidadeOutra');
nacionalidadeRadios.forEach(radio => {
    radio.addEventListener('change', function() {
        if (this.value === 'Estrangeiro') {
            nacionalidadeOutraInput.style.display = 'block';
            nacionalidadeOutraInput.setAttribute('required', 'true');
        } else {
            nacionalidadeOutraInput.style.display = 'none';
            nacionalidadeOutraInput.removeAttribute('required');
            nacionalidadeOutraInput.value = ''; // Limpa o campo se mudar para brasileiro
        }
    });
});

// 3. CPF: Máscara e Validação
document.getElementById('cpf').addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, ''); // Remove tudo que não é dígito
    if (value.length > 11) value = value.slice(0, 11); // Limita a 11 dígitos
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    e.target.value = value;
});

document.getElementById('cpf').addEventListener('blur', function() {
    const cpfInput = this;
    const cpfValue = cpfInput.value.replace(/\D/g, '');

    if (cpfValue.length === 0 && cpfInput.hasAttribute('required')) {
        displayError('cpfError', 'Por favor, preencha o campo CPF.');
        cpfInput.setCustomValidity('Por favor, preencha o campo CPF.');
        return;
    }

    if (cpfValue.length !== 11) {
        displayError('cpfError', 'CPF deve ter 11 dígitos.');
        cpfInput.setCustomValidity('CPF deve ter 11 dígitos.');
        return;
    }

    if (!validateCPF(cpfValue)) {
        displayError('cpfError', 'CPF inválido.');
        cpfInput.setCustomValidity('CPF inválido.');
    } else {
        clearError('cpfError');
        cpfInput.setCustomValidity('');
    }
});

// Função de validação de CPF (algoritmo padrão)
function validateCPF(cpf) {
    cpf = cpf.replace(/[^\d]+/g, ''); // Remove caracteres não numéricos
    if (cpf == '') return false;
    // Elimina CPFs com todos os dígitos iguais
    if (cpf.length != 11 ||
        cpf == "00000000000" ||
        cpf == "11111111111" ||
        cpf == "22222222222" ||
        cpf == "33333333333" ||
        cpf == "44444444444" ||
        cpf == "55555555555" ||
        cpf == "66666666666" ||
        cpf == "77777777777" ||
        cpf == "88888888888" ||
        cpf == "99999999999")
        return false;
    // Valida 1º dígito
    let add = 0;
    for (let i = 0; i < 9; i++)
        add += parseInt(cpf.charAt(i)) * (10 - i);
    let rev = 11 - (add % 11);
    if (rev == 10 || rev == 11)
        rev = 0;
    if (rev != parseInt(cpf.charAt(9)))
        return false;
    // Valida 2º dígito
    add = 0;
    for (let i = 0; i < 10; i++)
        add += parseInt(cpf.charAt(i)) * (11 - i);
    rev = 11 - (add % 11);
    if (rev == 10 || rev == 11)
        rev = 0;
    if (rev != parseInt(cpf.charAt(10)))
        return false;
    return true;
}

// 4. CEP: Máscara e Preenchimento automático (ViaCEP)
document.getElementById('cep').addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, ''); // Remove tudo que não é dígito
    if (value.length > 8) value = value.slice(0, 8); // Limita a 8 dígitos
    if (value.length > 5) value = value.replace(/^(\d{5})(\d)/, '$1-$2');
    e.target.value = value;
});

document.getElementById('cep').addEventListener('blur', function() {
    const cepInput = this;
    const cepValue = cepInput.value.replace(/\D/g, ''); // Somente dígitos

    clearError('cepError');
    clearError('ruaError');
    clearError('bairroError');
    clearError('cidadeError');
    clearError('ufError');

    document.getElementById('rua').value = '';
    document.getElementById('bairro').value = '';
    document.getElementById('cidade').value = '';
    document.getElementById('uf').value = '';

    if (cepValue.length === 8) {
        fetch(`https://viacep.com.br/ws/${cepValue}/json/`)
            .then(response => response.json())
            .then(data => {
                if (!data.erro) {
                    document.getElementById('rua').value = data.logradouro;
                    document.getElementById('bairro').value = data.bairro;
                    document.getElementById('cidade').value = data.localidade;
                    document.getElementById('uf').value = data.uf;
                    cepInput.setCustomValidity('');
                } else {
                    displayError('cepError', 'CEP não encontrado ou inválido.');
                    cepInput.setCustomValidity('CEP não encontrado ou inválido.');
                }
            })
            .catch(error => {
                console.error('Erro ao buscar CEP:', error);
                displayError('cepError', 'Erro ao buscar CEP. Tente novamente.');
                cepInput.setCustomValidity('Erro ao buscar CEP.');
            });
    } else if (cepValue.length > 0 && cepValue.length < 8) {
        displayError('cepError', 'CEP deve ter 8 dígitos.');
        cepInput.setCustomValidity('CEP deve ter 8 dígitos.');
    } else if (cepValue.length === 0 && cepInput.hasAttribute('required')) {
         displayError('cepError', 'Por favor, preencha o campo CEP.');
         cepInput.setCustomValidity('Por favor, preencha o campo CEP.');
    }
});

// 5. Telefone/Celular: Máscara e não permitir letras
document.getElementById('telefone').addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, ''); // Remove tudo que não é dígito
    const input = e.target;

    // Remove qualquer letra que o usuário tente digitar
    if (/[a-zA-Z]/.test(e.data)) {
        displayError('telefoneError', 'Números são permitidos apenas neste campo.');
        input.value = value; // Mantém apenas os dígitos
        input.setCustomValidity('Números são permitidos apenas neste campo.');
        return;
    } else {
         clearError('telefoneError');
         input.setCustomValidity('');
    }

    // Aplica a máscara
    if (value.length > 0) {
        value = '(' + value; // Adiciona o parêntese inicial
        if (value.length > 3) {
            value = value.slice(0, 3) + ') ' + value.slice(3); // Fecha o DDD
        }
        // Lógica para 9 dígitos (celular) ou 8 dígitos (fixo/antigo)
        if (value.length > 9) { // Se já temos pelo menos (DD) XXXXX-
            // Verifica se o primeiro dígito após o DDD é 9 (formato de celular 9xxxx-xxxx)
            // Ou se o número completo (sem DDD) tem 9 dígitos
            const digitsAfterDDD = value.replace(/\D/g, '').slice(2); // Pega os dígitos após o DDD
            
            if (digitsAfterDDD.length > 4 && digitsAfterDDD[0] === '9') { // Se for 9 dígitos (celular)
                value = value.slice(0, 10) + '-' + value.slice(10, 14); // (DD) 9XXXX-XXXX
            } else if (digitsAfterDDD.length > 4) { // Se for 8 dígitos (fixo/celular antigo)
                value = value.slice(0, 9) + '-' + value.slice(9, 13); // (DD) XXXX-XXXX
            }
        }
    }
    e.target.value = value;
});

// A função de blur é importante para revalidar no final
document.getElementById('telefone').addEventListener('blur', function() {
    const telefoneInput = this;
    const telefoneValue = telefoneInput.value.replace(/\D/g, '');

    if (telefoneValue.length === 0 && telefoneInput.hasAttribute('required')) {
         displayError('telefoneError', 'Por favor, preencha o campo Telefone/Celular.');
         telefoneInput.setCustomValidity('Por favor, preencha o campo Telefone/Celular.');
         return;
    }

    // Validação de comprimento mínimo (ex: 10 para fixo, 11 para celular)
    if (telefoneValue.length < 10) { // Considerando (XX) XXXX-XXXX (10 dígitos) como mínimo
        displayError('telefoneError', 'Telefone/Celular incompleto.');
        telefoneInput.setCustomValidity('Telefone/Celular incompleto.');
        return;
    }

    if (/[a-zA-Z]/.test(telefoneInput.value)) { // Garante que não há letras no blur também
        displayError('telefoneError', 'Telefone não pode conter letras.');
        telefoneInput.setCustomValidity('Telefone não pode conter letras.');
    } else {
        clearError('telefoneError');
        telefoneInput.setCustomValidity('');
    }
});

// 6. E-mail: Validação básica de formato
document.getElementById('email').addEventListener('input', function() {
    const emailInput = this;
    const emailValue = emailInput.value;
    // Regex simples para email (pode ser mais complexo se necessário)
    if (emailValue.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
        displayError('emailError', 'Formato de e-mail inválido.');
        emailInput.setCustomValidity('Formato de e-mail inválido.');
    } else {
        clearError('emailError');
        emailInput.setCustomValidity('');
    }
});

// --- Lógica do Modal para Cláusulas ---
const modal = document.getElementById('clausulaModal');
const closeButton = document.querySelector('.close-button');
const modalTitle = document.getElementById('modalClausulaTitle');
const modalText = document.getElementById('modalClausulaText');

// Abre o modal
document.querySelectorAll('.clausula').forEach(clausulaDiv => {
    clausulaDiv.addEventListener('click', function() {
        modal.style.display = 'flex'; // Usamos flex para centralizar
        modalTitle.textContent = this.previousElementSibling ? this.previousElementSibling.textContent : 'Cláusula'; // Pega o título anterior (h3)
        modalText.innerHTML = this.innerHTML; // Pega o conteúdo HTML da cláusula
    });
});

// Fecha o modal ao clicar no X
closeButton.addEventListener('click', function() {
    modal.style.display = 'none';
});

// Fecha o modal ao clicar fora do conteúdo
window.addEventListener('click', function(event) {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
});


// --- Validação final ao enviar o formulário ---
document.getElementById('cadastroForm').addEventListener('submit', function(event) {
    // Re-executa as validações nos eventos de blur para garantir que os CustomValidity estão corretos
    document.getElementById('nome').dispatchEvent(new Event('blur'));
    document.getElementById('cpf').dispatchEvent(new Event('blur'));
    document.getElementById('cep').dispatchEvent(new Event('blur'));
    document.getElementById('telefone').dispatchEvent(new Event('blur'));
    document.getElementById('email').dispatchEvent(new Event('input')); // Para e-mail, input é melhor pois valida em tempo real

    // Validação para nacionalidade "estrangeiro"
    const nacionalidadeEstrangeiroChecked = document.getElementById('nacionalidadeEstrangeiro').checked;
    const nacionalidadeOutraValue = document.getElementById('nacionalidadeOutra').value.trim();
    if (nacionalidadeEstrangeiroChecked && nacionalidadeOutraValue === '') {
        displayError('nacionalidadeError', 'Por favor, digite sua nacionalidade.');
        document.getElementById('nacionalidadeOutra').setCustomValidity('Por favor, digite sua nacionalidade.');
    } else {
        clearError('nacionalidadeError');
        document.getElementById('nacionalidadeOutra').setCustomValidity('');
    }

    // Validação de campos required padrão HTML5
    const requiredInputs = this.querySelectorAll('input:required, select:required, textarea:required');
    let allRequiredFieldsValid = true;
    requiredInputs.forEach(input => {
        if (!input.checkValidity()) {
            // input.reportValidity(); // Mostra a mensagem de erro padrão do navegador
            displayError(input.id + 'Error', input.validationMessage);
            allRequiredFieldsValid = false;
        } else {
            clearError(input.id + 'Error');
        }
    });

    // Validação de todas as checkboxes das cláusulas
    const clausulaCheckboxes = this.querySelectorAll('input[type="checkbox"][name^="clausula-"]');
    let allClausulasAccepted = true;
    clausulaCheckboxes.forEach(checkbox => {
        if (!checkbox.checked) {
            allClausulasAccepted = false;
            // Pode adicionar um erro visual específico se quiser, mas o required do HTML5 já ajuda
        }
    });

    // Se alguma validação falhar (incluindo as de CustomValidity setadas acima)
    if (!this.checkValidity() || !allClausulasAccepted) {
        event.preventDefault(); // Impede o envio do formulário
        alert('Por favor, preencha todos os campos obrigatórios e corrija os erros antes de enviar.');
    } else {
        // Se tudo estiver OK, o formulário será enviado pelo FormSubmit.co
        alert('Formulário enviado com sucesso! Você será redirecionado.');
        // O formsubmit.co fará o redirecionamento automaticamente
    }
});