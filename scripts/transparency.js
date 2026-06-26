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