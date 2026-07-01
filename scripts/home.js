const track = document.querySelector(".carousel-track");
const cards = document.querySelectorAll(".news-card");

let index = 0;
let interval;

// imagens (depois pode vir do PHP)
const images = [
    "uploads/noticias/incendio1.jpg",
    "uploads/noticias/viatura.jpg",
    "uploads/noticias/simulado.jpg",
    "uploads/noticias/curso.jpg",
    "uploads/noticias/acidente.jpg"
];

// aplica imagens
cards.forEach((card, i) => {
    if (images[i]) {
        card.style.backgroundImage = `url('${images[i]}')`;
    }
});

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