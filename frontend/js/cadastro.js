// URL base da API do backend
const API_BASE_URL = "http://127.0.0.1:8000/api";

// Elementos do formulário
const formCadastro = document.getElementById("formCadastro");
const inputCep = document.getElementById("cep");
const inputRua = document.getElementById("rua");
const inputCidade = document.getElementById("cidade");
const inputEstado = document.getElementById("estado");
const errorDiv = document.getElementById("error");
const loadingDiv = document.getElementById("loading");

// Evento para buscar endereço quando o usuário sai do campo CEP
if (inputCep) {
    inputCep.addEventListener("blur", buscarEndereco);
}

// Evento para enviar o formulário
if (formCadastro) {
    formCadastro.addEventListener("submit", enviarCadastro);
}

/**
 * Busca o endereço usando a API ViaCEP
 */
async function buscarEndereco() {
    const cep = inputCep.value.replace(/\D/g, ""); // Remove caracteres não numéricos

    if (cep.length !== 8) {
        mostrarErro("CEP deve ter 8 dígitos");
        return;
    }

    try {
        mostrarCarregamento(true);
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const dados = await response.json();

        if (dados.erro) {
            mostrarErro("CEP não encontrado");
            limparEndereco();
            return;
        }

        // Preenche os campos automaticamente
        inputRua.value = dados.logradouro || "";
        inputCidade.value = dados.localidade || "";
        inputEstado.value = dados.uf || "";

        mostrarErro(""); // Limpa mensagens de erro
        mostrarCarregamento(false);
    } catch (erro) {
        mostrarErro("Erro ao buscar CEP: " + erro.message);
        mostrarCarregamento(false);
    }
}

/**
 * Envia os dados do cadastro para o backend
 */
async function enviarCadastro(event) {
    event.preventDefault();

    // Coleta os dados do formulário
    const dados = {
        nome: document.getElementById("nome").value,
        estado_civil: document.getElementById("estado_civil").value,
        data_nascimento: document.getElementById("data_nascimento").value,
        cep: document.getElementById("cep").value,
        rua: document.getElementById("rua").value,
        numero: document.getElementById("numero").value,
        complemento: document.getElementById("complemento").value,
        cidade: document.getElementById("cidade").value,
        estado: document.getElementById("estado").value,
    };

    // Valida se todos os campos obrigatórios foram preenchidos
    if (!validarFormulario(dados)) {
        mostrarErro("Por favor, preencha todos os campos obrigatórios");
        return;
    }

    try {
        mostrarCarregamento(true);

        const response = await fetch(`${API_BASE_URL}/usuarios`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(dados),
        });

        if (!response.ok) {
            const erro = await response.json();
            throw new Error(erro.detail || "Erro ao cadastrar usuário");
        }

        const usuario = await response.json();

        // Armazena o ID do usuário no localStorage para usar no pagamento
        localStorage.setItem("usuario_id", usuario.id);

        mostrarCarregamento(false);

        // Redireciona para a página de pagamento
        window.location.href = "pagamento.html";
    } catch (erro) {
        mostrarErro("Erro ao cadastrar: " + erro.message);
        mostrarCarregamento(false);
    }
}

/**
 * Valida se os campos obrigatórios foram preenchidos
 */
function validarFormulario(dados) {
    const camposObrigatorios = [
        "nome",
        "estado_civil",
        "data_nascimento",
        "cep",
        "rua",
        "numero",
        "cidade",
        "estado",
    ];

    for (let campo of camposObrigatorios) {
        if (!dados[campo] || dados[campo].trim() === "") {
            return false;
        }
    }

    return true;
}

/**
 * Limpa os campos de endereço
 */
function limparEndereco() {
    inputRua.value = "";
    inputCidade.value = "";
    inputEstado.value = "";
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
