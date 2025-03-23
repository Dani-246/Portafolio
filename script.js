document.addEventListener("DOMContentLoaded", () => {
    console.log("Portafolio de Josue cargado correctamente.");

    // Configuración de ScrollReveal
    ScrollReveal().reveal("header", { delay: 300, duration: 1000, origin: "top", distance: "50px" });
    ScrollReveal().reveal("section", { delay: 300, duration: 1000, origin: "bottom", distance: "50px", reset: true });
    ScrollReveal().reveal(".proyecto", { delay: 300, duration: 1000, origin: "left", distance: "50px", interval: 200 });

    // Botón animado
    document.querySelector(".boton").addEventListener("mouseover", () => {
        console.log("El usuario está interesado en contactarte.");
    });
});
