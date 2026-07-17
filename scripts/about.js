const modal = document.getElementById("imageModal");
const modalImage = document.getElementById("modalImage");
const closeModal = document.querySelector(".closeModal");

document.querySelectorAll(".zoomImage").forEach(img => {

    img.addEventListener("click", () => {

        modalImage.src = img.src;
        modal.classList.add("active");

        document.body.style.overflow = "hidden";
    });

});

closeModal.addEventListener("click", fecharModal);

modal.addEventListener("click", (e) => {

    if (e.target === modal) {
        fecharModal();
    }

});

document.addEventListener("keydown", (e) => {

    if (e.key === "Escape") {
        fecharModal();
    }

});

function fecharModal() {

    modal.classList.remove("active");
    document.body.style.overflow = "";

}