import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

let orangeTween: gsap.core.Tween | null = null;

const initHorizontalScroll = () => {
  const section = document.querySelector<HTMLElement>("#orange-mindset");
  const slider = section?.querySelector<HTMLElement>(".om-slider");

  if (!section || !slider) return;

  const isMobile = window.matchMedia("(max-width: 768px)").matches;


  /* =========================================
     LIMPIAR COMPLETAMENTE ORANGE MINDSET
     ========================================= */

  if (orangeTween) {
    orangeTween.kill();
    orangeTween = null;
  }

  /*
   * Buscar solamente los ScrollTriggers
   * pertenecientes a esta sección.
   */
  ScrollTrigger.getAll().forEach((trigger) => {
    const triggerElement = trigger.trigger;

    if (
      triggerElement === section ||
      (triggerElement instanceof Node && section.contains(triggerElement))
    ) {
      trigger.kill();
    }
  });

  /*
   * Eliminar cualquier transformación
   * aplicada previamente por GSAP.
   */
  gsap.set(slider, {
    clearProps: "all",
  });


  /* =========================================
     MOBILE
     ========================================= */

  if (isMobile) {

    /*
     * Aseguramos que el slider esté
     * completamente en su posición natural.
     */
    gsap.set(slider, {
      x: 0,
      clearProps: "transform",
    });

    return;
  }


  /* =========================================
     DESKTOP
     ========================================= */

  const totalScroll =
    slider.scrollWidth - window.innerWidth;

  if (totalScroll <= 0) return;

  orangeTween = gsap.to(slider, {
    x: -totalScroll,

    ease: "none",

    scrollTrigger: {
      trigger: section,

      start: "top top",

      end: () => `+=${totalScroll}`,

      pin: true,

      scrub: 1,

      anticipatePin: 1,
    },
  });
};


window.addEventListener("load", initHorizontalScroll);

window.addEventListener("resize", () => {
  initHorizontalScroll();
});


export {};