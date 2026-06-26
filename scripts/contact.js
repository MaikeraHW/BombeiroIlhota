// Modal
const modal = document.getElementById("successModal");
const modalMessage = document.getElementById("modalMessage");
const modalTitle = document.getElementById("modalTitle");

// Formulário de contato
const contactForm = document.getElementById("contactForm");

if (contactForm) {

    contactForm.addEventListener("submit", function (event) {

        event.preventDefault();

        fetch("/phparchives/send.php", {
            method: "POST",
            body: new FormData(contactForm)
        })
        .then(res => res.json())
        .then(data => {

        modal.classList.remove("hidden");

        modalTitle.classList.remove("success", "error");

        if (data.success) {

            modalTitle.classList.add("success");
            modalTitle.innerHTML = "✔ Sucesso!";
            modalMessage.innerHTML = "Envio realizado.";

            contactForm.reset();

        } else {

            modalTitle.classList.add("error");
            modalTitle.innerHTML = "❌ Falha!";
            modalMessage.innerHTML = data.message || "Falha ao enviar.";
        }
    })
        .catch(() => {

            modal.classList.remove("hidden");

            modalTitle.classList.remove("success", "error");
            modalTitle.classList.add("error");

            modalTitle.innerHTML = "❌ Falha!";
            modalMessage.innerHTML = "Erro inesperado.<br>Tente novamente mais tarde.";
        });

    });

}

function closeModal() {
    modal.classList.add("hidden");
}