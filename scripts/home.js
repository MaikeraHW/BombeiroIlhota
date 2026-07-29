const track = document.querySelector(".carousel-track");
const cards = document.querySelectorAll(".news-card");

let index = 0;
let interval;

function moveCarousel() {
    const isMobile = window.innerWidth <= 600;

    if (isMobile) return;

    const totalCards = cards.length;

    index++;

    if (index > totalCards - 3) {
        index = 0;
    }

    const cardWidth = cards[0].offsetWidth + 32;
    track.style.transform = `translateX(-${index * cardWidth}px)`;
}

function startCarousel() {
    const isMobile = window.innerWidth <= 600;

    if (isMobile) return; // desliga no mobile

    interval = setInterval(moveCarousel, 5000);
}

function stopCarousel() {
    clearInterval(interval);
}

startCarousel();

// se redimensionar a tela, ajusta comportamento
window.addEventListener("resize", () => {
    stopCarousel();
    startCarousel();
});

document.addEventListener("DOMContentLoaded", () => {
    const track = document.querySelector(".carousel-track");
    const cards = document.querySelectorAll(".news-card");
    const prevBtn = document.querySelector(".news-btn.prev");
    const nextBtn = document.querySelector(".news-btn.next");

    let index = 0;

    function getVisibleCards() {
        if (window.innerWidth <= 768) return 1;
        if (window.innerWidth <= 1024) return 2;
        return 3;
    }

    function updateCarousel() {
        const visible = getVisibleCards();
        const cardWidth = cards[0].offsetWidth + 32; // 32 = gap (2rem)
        const maxIndex = Math.max(0, cards.length - visible);

        if (index > maxIndex) index = maxIndex;
        if (index < 0) index = 0;

        track.style.transform = `translateX(-${index * cardWidth}px)`;
    }

    nextBtn.addEventListener("click", () => {
        index++;
        updateCarousel();
    });

    prevBtn.addEventListener("click", () => {
        index--;
        updateCarousel();
    });

    window.addEventListener("resize", updateCarousel);

    updateCarousel();
});

document.addEventListener("DOMContentLoaded", function () {

    const modal = document.getElementById("eventoModal");
    const fechar = document.getElementById("fecharEvento");

    // Abre o modal automaticamente
    modal.style.display = "flex";

    // Fechar pelo botão X
    fechar.addEventListener("click", function () {
        modal.style.display = "none";
    });

    // Fechar clicando fora do conteúdo
    modal.addEventListener("click", function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });

});