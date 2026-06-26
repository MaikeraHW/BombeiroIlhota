const form = document.getElementById("occurrenceForm");
const modal = document.getElementById("successModal");
const modalTitle = document.getElementById("modalTitle");
const modalMessage = document.getElementById("modalMessage");
const submitButton = form.querySelector("button[type='submit']");

form.addEventListener("submit", async function(e){

    e.preventDefault();

    // 🔒 bloqueia botão (AQUI entra antes do fetch)
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

        } else {

            modalTitle.innerHTML = "❌ Falha!";
            modalTitle.className = "error";

            modalMessage.innerHTML = "Solicitação não concluída. Tente novamente";

        }

    } catch (error) {

        modalTitle.innerHTML = "Erro";
        modalTitle.className = "error";

        modalMessage.innerHTML = "Falha na conexão. Tente novamente.";

    }

    // 🔓 libera botão (SEMPRE no final)
    submitButton.disabled = false;
    submitButton.innerText = "Enviar Ocorrência";

    modal.classList.remove("hidden");
});

function closeModal(){
    modal.classList.add("hidden");
}