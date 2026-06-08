let currentIndex = 0;
const slides = document.querySelector('.slides');
const dots = document.querySelectorAll('.dot');
const totalSlides = document.querySelectorAll('.slide').length;

function updateSlider() {
  slides.style.transform = `translateX(-${currentIndex * 100}%)`;

  dots.forEach(dot => dot.classList.remove('active'));
  dots[currentIndex].classList.add('active');
}

function goToSlide(index) {
  currentIndex = index;
  updateSlider();
  resetAutoSlide();
}

// Auto slide
let interval = setInterval(nextSlide, 5000);

function nextSlide() {
  currentIndex = (currentIndex + 1) % totalSlides;
  updateSlider();
}

function resetAutoSlide() {
  clearInterval(interval);
  interval = setInterval(nextSlide, 4000);
}

//hamburger menu

const hamburger = document.getElementById("hamburger");
const nav = document.querySelector(".headerNav");

hamburger.addEventListener("click", () => {
    nav.classList.toggle("active");
});