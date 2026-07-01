const form = document.getElementById("occurrenceForm");
const modal = document.getElementById("successModal");
const modalTitle = document.getElementById("modalTitle");
const modalMessage = document.getElementById("modalMessage");
const submitButton = form.querySelector("button[type='submit']");
const fileInput = document.getElementById("documento");
const uploadButton = document.getElementById("uploadButton");
const termsModal = document.getElementById("termsModal");
const openTerms = document.getElementById("termos");
const closeTerms = document.getElementById("closeTerms");
const acceptTerms = document.getElementById("termsCheckbox");

// ==============================
// FUNÇÃO REUTILIZÁVEL DE MODAL
// ==============================
function showModal(title, message, type = "") {
    modalTitle.className = type;
    modalTitle.innerHTML = title;
    modalMessage.innerHTML = message;
    modal.classList.remove("hidden");
}

// ==============================
// FECHAR MODAL GERAL
// ==============================
function closeModal() {
    modal.classList.add("hidden");
}

// ==============================
// UPLOAD DE ARQUIVO
// ==============================
fileInput.addEventListener("change", () => {
    if (fileInput.files.length) {
        uploadButton.classList.add("success");
        uploadButton.innerHTML = "✔ Documento anexado";
    } else {
        uploadButton.classList.remove("success");
        uploadButton.innerHTML = "📄 Selecionar documento";
    }
});

// ==============================
// ENVIO DO FORMULÁRIO
// ==============================
form.addEventListener("submit", async function (e) {
    e.preventDefault();

    // validação do termo
    if (acceptTerms && !acceptTerms.checked) {
        showModal(
            "Atenção",
            "Você precisa aceitar o termo para continuar.",
            "error"
        );
        return;
    }

    submitButton.disabled = true;
    submitButton.innerText = "Enviando...";

    const formData = new FormData(form);

    try {
        const response = await fetch(form.action, {
            method: "POST",
            body: formData
        });

        const data = await response.json();

        if (data.success) {
            showModal(
                "✔ Sucesso!",
                "A solicitação foi enviada.",
                "success"
            );

            form.reset();

            uploadButton.classList.remove("success");
            uploadButton.innerHTML = "📄 Selecionar documento";

        } else {
            showModal(
                "❌ Falha!",
                "Solicitação não concluída. Tente novamente.",
                "error"
            );
        }

    } catch (error) {
        showModal(
            "Erro",
            "Falha na conexão. Tente novamente.",
            "error"
        );
    }

    submitButton.disabled = false;
    submitButton.innerText = "Enviar solicitação";
});

// clique fora do modal principal
modal.addEventListener("click", function (e) {
    if (e.target === modal) {
        modal.classList.add("hidden");
    }
});

// ==============================
// MODAL TERMOS
// ==============================
if (openTerms && termsModal && closeTerms) {

    openTerms.addEventListener("click", function (e) {
        e.preventDefault();
        termsModal.classList.remove("hidden");
    });

    closeTerms.addEventListener("click", function () {
        termsModal.classList.add("hidden");
    });

    termsModal.addEventListener("click", function (e) {
        if (e.target === termsModal) {
            termsModal.classList.add("hidden");
        }
    });

}

// Estado inicial
submitButton.disabled = true;

// Habilita/desabilita o botão conforme o checkbox
acceptTerms.addEventListener("change", function () {
    submitButton.disabled = !this.checked;
});