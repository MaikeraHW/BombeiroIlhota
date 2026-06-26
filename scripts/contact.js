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

            if (data.status === "success") {

                modalTitle.classList.add("success");
                modalTitle.innerHTML = "✔ Sucesso!";
                modalMessage.innerHTML = "Envio realizado.";

                contactForm.reset();

            } else {

                modalTitle.classList.add("error");
                modalTitle.innerHTML = "❌ Falha!";
                modalMessage.innerHTML = "Falha ao enviar. <br> Entre em contato.";

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

// Modal

const modal = document.getElementById("successModal");
const modalMessage = document.getElementById("modalMessage");
const modalTitle = document.getElementById("modalTitle");

function closeModal() {
    modal.classList.add("hidden");
}