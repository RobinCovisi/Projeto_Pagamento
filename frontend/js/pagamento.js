// URL base da API do backend
const API_BASE_URL = "http://127.0.0.1:8000/api";

// Elementos do formulário
const formPagamento = document.getElementById("formPagamento");
const errorDiv = document.getElementById("error");
const loadingDiv = document.getElementById("loading");

// Evento para enviar o formulário de pagamento
if (formPagamento) {
    formPagamento.addEventListener("submit", processarPagamento);
}

/**
 * Processa o pagamento enviando os dados do cartão para o backend
 */
async function processarPagamento(event) {
    event.preventDefault();

    // Recupera o ID do usuário do localStorage
    const usuario_id = localStorage.getItem("usuario_id");

    if (!usuario_id) {
        mostrarErro("Erro: Usuário não encontrado. Por favor, faça o cadastro novamente.");
        return;
    }

    // Coleta os dados do formulário
    const numero_cartao = document.getElementById("numero_cartao").value;
    const nome_titular = document.getElementById("nome_titular").value;
    const mes = parseInt(document.getElementById("mes").value);
    const ano = parseInt(document.getElementById("ano").value);
    const cvv = document.getElementById("cvv").value;

    // Valida os dados do cartão
    if (!validarDadosPagamento(numero_cartao, nome_titular, mes, ano, cvv)) {
        mostrarErro("Por favor, preencha todos os campos do cartão corretamente");
        return;
    }

    // Prepara os dados para enviar
    const dados = {
        usuario_id: parseInt(usuario_id),
        numero_cartao: numero_cartao,
        nome_titular: nome_titular,
        mes: mes,
        ano: ano,
        cvv: cvv,
    };

    try {
        mostrarCarregamento(true);

        const response = await fetch(`${API_BASE_URL}/pagamentos`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(dados),
        });

        const resultado = await response.json();

        if (!response.ok) {
            // Se houver erro, exibe a mensagem de erro
            throw new Error(resultado.detail || "Erro ao processar pagamento");
        }

        mostrarCarregamento(false);

        // Se o pagamento foi bem-sucedido, redireciona para a página de sucesso
        window.location.href = "sucesso.html";
    } catch (erro) {
        mostrarErro("Erro no pagamento: " + erro.message);
        mostrarCarregamento(false);
    }
}

/**
 * Valida os dados do cartão
 */
function validarDadosPagamento(numero_cartao, nome_titular, mes, ano, cvv) {
    // Remove espaços do número do cartão
    numero_cartao = numero_cartao.replace(/\s/g, "");

    // Valida o número do cartão (deve ter entre 13 e 19 dígitos)
    if (!/^\d{13,19}$/.test(numero_cartao)) {
        mostrarErro("Número do cartão inválido");
        return false;
    }

    // Valida o nome do titular
    if (!nome_titular || nome_titular.trim() === "") {
        mostrarErro("Nome do titular é obrigatório");
        return false;
    }

    // Valida o mês (deve estar entre 1 e 12)
    if (mes < 1 || mes > 12) {
        mostrarErro("Mês de validade inválido");
        return false;
    }

    // Valida o ano (deve ser maior ou igual ao ano atual)
    const anoAtual = new Date().getFullYear();
    if (ano < anoAtual) {
        mostrarErro("Ano de validade inválido");
        return false;
    }

    // Valida o CVV (deve ter 3 ou 4 dígitos)
    if (!/^\d{3,4}$/.test(cvv)) {
        mostrarErro("CVV inválido");
        return false;
    }

    return true;
}

/**
 * Volta para a página de cadastro
 */
function voltar() {
    window.location.href = "cadastro.html";
}

/**
 * Exibe mensagem de erro
 */
function mostrarErro(mensagem) {
    if (errorDiv) {
        if (mensagem) {
            errorDiv.textContent = mensagem;
            errorDiv.classList.add("show");
        } else {
            errorDiv.classList.remove("show");
        }
    }
}

/**
 * Exibe ou oculta o indicador de carregamento
 */
function mostrarCarregamento(mostrar) {
    if (loadingDiv) {
        if (mostrar) {
            loadingDiv.classList.add("show");
        } else {
            loadingDiv.classList.remove("show");
        }
    }
}

// Formata o número do cartão conforme o usuário digita
const inputNumeroCartao = document.getElementById("numero_cartao");
if (inputNumeroCartao) {
    inputNumeroCartao.addEventListener("input", function (e) {
        let valor = e.target.value.replace(/\s/g, "");
        let valorFormatado = valor.replace(/(\d{4})(?=\d)/g, "$1 ");
        e.target.value = valorFormatado;
    });
}
