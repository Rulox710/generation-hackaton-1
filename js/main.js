/* Video controlado por scroll (uno por sección) */
const blocks = [...document.querySelectorAll(".scroll-video")].map(el => ({
  el,
  video: el.querySelector("video"),
  bar: el.querySelector(".progress-bar"),
  title: el.querySelector("h2"),
  target: 0, current: 0
}));

function update(){
  blocks.forEach(b => {
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

(function loop(){
  blocks.forEach(b => {
    const v = b.video;
    if (!v.duration) return;
    b.current += (b.target - b.current) * 0.18;
    const t = b.current * v.duration;
    if (Math.abs(v.currentTime - t) > 0.03) v.currentTime = t;
  });
  requestAnimationFrame(loop);
})();

/* Las secciones se crean con JS, así que ScrollSpy se refresca después */
bootstrap.ScrollSpy.getOrCreateInstance(document.body).refresh();