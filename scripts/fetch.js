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
})

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