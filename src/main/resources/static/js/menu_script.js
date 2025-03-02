document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".accordion-button").forEach(button => {
        button.addEventListener("click", function () {
            let content = this.nextElementSibling;

            // Alternar la visibilidad del contenido del acordeón
            if (content.style.display === "block") {
                content.style.display = "none";
            } else {
                content.style.display = "block";
            }
        });
    });

    // Seleccionar todas las imágenes expandibles
    document.querySelectorAll(".expandable").forEach(image => {
        image.addEventListener("touchstart", expandImage);  // Para dispositivos táctiles
        image.addEventListener("mousedown", expandImage);   // Para mouse en PC
        image.addEventListener("touchend", resetImage);     // Para dispositivos táctiles
        image.addEventListener("mouseup", resetImage);      // Para mouse en PC
        image.addEventListener("mouseleave", resetImage);   // Si se sale del área con el mouse
    });

    function expandImage(event) {
        event.preventDefault();
        this.classList.add("expanded");
    }

    function resetImage(event) {
        event.preventDefault();
        this.classList.remove("expanded");
    }
});
