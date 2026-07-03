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