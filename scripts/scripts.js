//fetch dos componentes

document.addEventListener("DOMContentLoaded", async () => {
    const components = document.querySelectorAll("[data-component]");

    for (const component of components) {
        const componentName = component.dataset.component;

        try {
            const response = await fetch(
                `/componentes/${componentName}/index.html`
            );

            if (!response.ok) {
                throw new Error(
                    `Componente "${componentName}" não encontrado`
                );
            }

            component.innerHTML = await response.text();
        } catch (error) {
            console.error(error);
        }
    }

    iniciarmenu();
    initSlider();

    // BOTÃO COPIAR PIX
    const copyBtn = document.getElementById("copyBtn");

    if (copyBtn) {
    copyBtn.addEventListener("click", async () => {
        try {
            await navigator.clipboard.writeText(codigoPix);
            alert("Código PIX copiado!");
        } catch (err) {
            console.error("Erro ao copiar:", err);
        }
    });
}

    //habilitar btn form

    const checkbox = document.getElementById("accept");
    const submitBtn = document.getElementById("formButton");

    checkbox.addEventListener("change", () => {
        submitBtn.disabled = !checkbox.checked;
    });

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

});

//hamburger menu

function iniciarmenu() {
    const hamburger = document.getElementById("hamburger");
    const nav = document.querySelector(".headerNav");

    if (!hamburger || !nav) return;

    hamburger.addEventListener("click", () => {
        nav.classList.toggle("active");
    });
}

//slides banner

function initSlider() {
    const slides = document.querySelector(".slides");

    if (!slides) return;

    const dots = document.querySelectorAll(".dot");
    const totalSlides = document.querySelectorAll(".slide").length;

    let currentIndex = 0;

    function updateSlider() {
        slides.style.transform = `translateX(-${currentIndex * 100}%)`;

        dots.forEach(dot => dot.classList.remove("active"));

        if (dots[currentIndex]) {
            dots[currentIndex].classList.add("active");
        }
    }

    function goToSlide(index) {
        currentIndex = index;
        updateSlider();
    }

    window.goToSlide = goToSlide;

    function nextSlide() {
        currentIndex = (currentIndex + 1) % totalSlides;
        updateSlider();
    }

    setInterval(nextSlide, 5000);
}

// CÓDIGO PIX

const codigoPix = `00020101021126980014br.gov.bcb.pix01362be2e93c-ba13-4801-a20e-7ae2a13fa1c30236A sua doacao salva vidas. Obrigado! 5204000053039865802BR5925BOMBEIROS VOLUNTARIOS DE 6009SAO PAULO62290525XvQjTo5C0we4kt9ayaxqhVQtN63043994`;


// Abrir e fechar categoria principal

document.querySelectorAll(".transparencyListIcon").forEach(header => {

    header.addEventListener("click", () => {

        const block = header.closest(".transparencyBlock");

        block.classList.toggle("active");

    });

});


// Abrir e fechar subcategorias

document.querySelectorAll(".transparencyListIcon2").forEach(subList => {

    subList.addEventListener("click", (event) => {

        event.stopPropagation();

        const parentItem = subList.closest(".transparencyListItem");

        parentItem.classList.toggle("active");

    });

});

// Modal

const modal = document.getElementById("successModal");
const modalMessage = document.getElementById("modalMessage");
const modalTitle = document.getElementById("modalTitle");

function closeModal() {
    modal.classList.add("hidden");
}

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
                modalMessage.innerHTML = data.message || "Inscrição realizada!";

                volunteerForm.reset();

            } else {

                modalTitle.classList.add("error");
                modalTitle.innerHTML = "❌ Falha!";
                modalMessage.innerHTML = data.message || "Falha ao enviar.<br>Entre em contato.";

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
                modalMessage.innerHTML = data.message || "Envio realizado.";

                contactForm.reset();

            } else {

                modalTitle.classList.add("error");
                modalTitle.innerHTML = "❌ Falha!";
                modalMessage.innerHTML = data.message || "Falha ao enviar.<br>Entre em contato.";

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