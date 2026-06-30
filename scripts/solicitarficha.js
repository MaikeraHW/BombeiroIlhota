const form = document.getElementById("occurrenceForm");
const modal = document.getElementById("successModal");
const modalTitle = document.getElementById("modalTitle");
const modalMessage = document.getElementById("modalMessage");
const submitButton = form.querySelector("button[type='submit']");
const fileInput = document.getElementById("documento");
const uploadButton = document.getElementById("uploadButton");

// Evento para alterar aparência ao selecionar arquivo
fileInput.addEventListener("change", () => {

    if (fileInput.files.length) {

        uploadButton.classList.add("success");
        uploadButton.innerHTML = "✔ Documento anexado";

    } else {

        uploadButton.classList.remove("success");
        uploadButton.innerHTML = "📄 Selecionar documento";

    }

});

form.addEventListener("submit", async function(e){

    e.preventDefault();

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

            modalTitle.innerHTML = "✔ Sucesso!";
            modalTitle.className = "success";

            modalMessage.innerHTML = "A solicitação foi enviada.";

            form.reset();

            // Volta o botão ao estado inicial
            uploadButton.classList.remove("success");
            uploadButton.innerHTML = "📄 Selecionar documento";

        } else {

            modalTitle.innerHTML = "❌ Falha!";
            modalTitle.className = "error";

            modalMessage.innerHTML = "Solicitação não concluída. Tente novamente.";

        }

    } catch (error) {

        modalTitle.innerHTML = "Erro";
        modalTitle.className = "error";

        modalMessage.innerHTML = "Falha na conexão. Tente novamente.";

    }

    submitButton.disabled = false;
    submitButton.innerText = "Enviar solicitação";

    modal.classList.remove("hidden");

});

function closeModal(){
    modal.classList.add("hidden");
}