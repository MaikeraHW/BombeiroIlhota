document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("donationForm");
    const modal = document.getElementById("successModal");
    const modalTitle = document.getElementById("modalTitle");
    const modalMessage = document.getElementById("modalMessage");

    if (!form) {
        console.error("Form donationForm não encontrado.");
        return;
    }

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const formData = new FormData(form);

        try {
            const response = await fetch("/phparchives/mensaldonations.php", {
                method: "POST",
                body: formData
            });

            const result = await response.json();

            console.log("Resposta backend:", result);

            if (Boolean(result.success)) {
                showModal("success", result.message || "Enviado com sucesso!");
                form.reset();
            } else {
                showModal("error", result.message || "Erro ao enviar.");
            }

        } catch (error) {
            console.error(error);
            showModal("error", "Erro de conexão com o servidor.");
        }
    });

    function showModal(type, message) {
        modal.classList.remove("hidden");

        modalTitle.textContent = type === "success" ? "Sucesso!" : "Erro!";
        modalTitle.className = type;

        modalMessage.textContent = message;
    }

    window.closeModal = function () {
        modal.classList.add("hidden");
    };
});

//mascaras

const phoneInput = document.getElementById("tel");

phoneInput.addEventListener("input", (e) => {
    let value = e.target.value;

    // remove tudo que não for número
    value = value.replace(/\D/g, "");

    // limita tamanho
    value = value.slice(0, 11);

    // aplica máscara
    if (value.length > 6) {
        value = value.replace(/^(\d{2})(\d{5})(\d{0,4}).*/, "($1) $2-$3");
    } else if (value.length > 2) {
        value = value.replace(/^(\d{2})(\d{0,5})/, "($1) $2");
    } else if (value.length > 0) {
        value = value.replace(/^(\d*)/, "($1");
    }

    e.target.value = value;
});

const docInput = document.getElementById("cpf");

docInput.addEventListener("input", (e) => {
    let value = e.target.value;

    // remove tudo que não for número
    value = value.replace(/\D/g, "");

    // limita até 14 dígitos
    value = value.slice(0, 14);

    // CPF (até 11 dígitos)
    if (value.length <= 11) {
        value = value
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    }
    // CNPJ (12 a 14 dígitos)
    else {
        value = value
            .replace(/^(\d{2})(\d)/, "$1.$2")
            .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
            .replace(/\.(\d{3})(\d)/, ".$1/$2")
            .replace(/(\d{4})(\d{1,2})$/, "$1-$2");
    }

    e.target.value = value;
});

const moneyInput = document.getElementById("valor");

moneyInput.addEventListener("input", (e) => {
    let value = e.target.value;

    // remove tudo que não for número
    value = value.replace(/\D/g, "");

    // evita vazio quebrado
    if (!value) {
        e.target.value = "";
        return;
    }

    // transforma em centavos
    value = (parseInt(value, 10) / 100).toFixed(2);

    // formata BRL
    value = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL"
    }).format(value);

    e.target.value = value;
});