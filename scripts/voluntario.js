document.addEventListener("DOMContentLoaded", async () => {

    //habilitar btn form

    const checkbox = document.getElementById("accept");
    const submitBtn = document.getElementById("formButton");

    if (checkbox && submitBtn) {
        checkbox.addEventListener("change", () => {
            submitBtn.disabled = !checkbox.checked;
        });
}

    //mascaras para os inputs

    const cpf = document.getElementById("cpf");
    cpf.addEventListener("input", (e) => {
        let value = e.target.value;

        value = value.replace(/\D/g, ""); // remove tudo que não é número
        value = value.replace(/(\d{3})(\d)/, "$1.$2");
        value = value.replace(/(\d{3})(\d)/, "$1.$2");
        value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");

        e.target.value = value;
    });



    const tel = document.getElementById("tel");
    tel.addEventListener("input", (e) => {
        let value = e.target.value;

        value = value.replace(/\D/g, "");
        value = value.replace(/^(\d{2})(\d)/g, "($1) $2");
        value = value.replace(/(\d{5})(\d)/, "$1-$2");

        e.target.value = value;
});



const birth = document.getElementById("birth");
birth.addEventListener("input", (e) => {
    let value = e.target.value;

    value = value.replace(/\D/g, "");
    value = value.replace(/(\d{2})(\d)/, "$1/$2");
    value = value.replace(/(\d{2})(\d)/, "$1/$2");

    e.target.value = value;
});



})

// Formulário de voluntários

const volunteerForm = document.getElementById("volunteerForm");

if (volunteerForm) {

    volunteerForm.addEventListener("submit", function (e) {

        e.preventDefault();

        const formData = new FormData(volunteerForm);

        fetch("/phparchives/setinfos.php", {
            method: "POST",
            body: formData
        })
        .then(res => res.json())
        .then(data => {

            modal.classList.remove("hidden");

            modalTitle.classList.remove("success", "error");

            if (data.status === "success") {

                modalTitle.classList.add("success");
                modalTitle.innerHTML = "✔ Sucesso!";
                modalMessage.innerHTML = "Inscrição realizada!";

                volunteerForm.reset();

            } else {

                modalTitle.classList.add("error");
                modalTitle.innerHTML = "❌ Falha!";
                modalMessage.innerHTML = "Falha ao enviar.<br>Entre em contato.";

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