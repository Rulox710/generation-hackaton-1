/* Video controlado por scroll (uno por sección) */
/*
 * Crea una lista con los elementos relevantes para manejar el video
 * con el scroll.
 * 
 * Estos elementos son el propio video, la barra de progreso del video
 * y el encabezado de la sección
 */
const BLOCKS = [...document.querySelectorAll(".scroll-video")].map(el => ({
  el,
  video: el.querySelector("video"),
  bar: el.querySelector(".progress-bar"),
  title: el.querySelector("h2"),
  target: 0, current: 0
}));

/**
 * Función que actualiza los elementos relacionados al video.
 * Revisa que tanto se ha desplazado el scroll y con base a eso decide
 * qué porcentaje del video se reproduce.
 * Si llega hasta el 85% del video, el encabezado se desvanece.
 */
function update(){
  BLOCKS.forEach(b => {
    const scrollable = b.el.offsetHeight - window.innerHeight;
    const p = Math.max(0, Math.min(1, -b.el.getBoundingClientRect().top / scrollable));
    b.target = p;
    b.bar.style.width = (p * 100) + "%";
    b.title.style.opacity = p > .85 ? 1 - (p - .85) / .15 : 1;
  });
}
addEventListener("scroll", update, {passive:true});
addEventListener("resize", update);
update();

/**
 * Se crea una función que se ejecuta de inmediato y crea un bucle con
 * ella misma para reproducir videos de manera continua y suave
 */
(function loop(){
  BLOCKS.forEach(b => {
    const v = b.video;
    if (!v.duration) return;
    b.current += (b.target - b.current) * 0.18;
    const t = b.current * v.duration;
    if (Math.abs(v.currentTime - t) > 0.03) v.currentTime = t;
  });
  requestAnimationFrame(loop);
})();