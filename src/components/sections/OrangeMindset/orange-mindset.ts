import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const mm = gsap.matchMedia();

function initOrangeMindset() {
  const section = document.querySelector<HTMLElement>("#orange-mindset");
  const slider = section?.querySelector<HTMLElement>(".om-slider");

  if (!section || !slider) return;

  // El breakpoint DEBE coincidir exactamente con orange-mindset.css (max-width: 768px)
  mm.add("(min-width: 769px)", () => {
    const getTotalScroll = () => slider.scrollWidth - section.clientWidth;

    if (getTotalScroll() <= 0) return;

    const tween = gsap.to(slider, {
      x: () => -getTotalScroll(),
      ease: "none",
      scrollTrigger: {
        id: "orange-mindset-pin",
        trigger: section,
        start: "top top",
        end: () => `+=${getTotalScroll()}`,
        pin: true,
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });

    // Esta función de "cleanup" la ejecuta gsap.matchMedia()
    // automáticamente en cuanto se cruza a móvil o el contexto se destruye.
    // Revierte pin, spacer y transform sin dejar residuos.
    return () => {
      tween.scrollTrigger?.kill(true);
      tween.kill();
      gsap.set(slider, { clearProps: "transform" });
    };
  });
}

/* =========================================
   RESIZE — solo refresca, nunca reconstruye
   ========================================= */

let resizeTimer: number;

window.addEventListener("resize", () => {
  window.clearTimeout(resizeTimer);

  resizeTimer = window.setTimeout(() => {
    // gsap.matchMedia ya revierte/reactiva solo al cruzar el breakpoint.
    // Para resizes dentro del mismo breakpoint, refresh() basta porque
    // end y x son funciones (se recalculan solas gracias a invalidateOnRefresh).
    ScrollTrigger.refresh();
  }, 150);
});

window.addEventListener("load", () => {
  initOrangeMindset();
  requestAnimationFrame(() => ScrollTrigger.refresh());
});

export {};