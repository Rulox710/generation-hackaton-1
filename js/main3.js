const video = document.getElementById("video");

window.addEventListener("scroll", () => {
  const section = document.querySelector(".video-scroll");
  const rect = section.getBoundingClientRect();

  // Distancia recorrida dentro de la sección
  const scrolled = -rect.top;

  // Distancia total disponible para hacer scroll
  const scrollable = section.offsetHeight - window.innerHeight;

  // Progreso entre 0 y 1
  const progress = Math.max(
    0,
    Math.min(1, scrolled / scrollable)
  );

  // Posición del video en segundos
  if (video.duration) {
    video.currentTime = progress * video.duration;
  }
});