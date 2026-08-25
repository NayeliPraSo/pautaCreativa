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

  ScrollTrigger.getAll().forEach((trigger) => {
    const triggerElement = trigger.trigger;

    if (
      triggerElement === section ||
      (triggerElement instanceof Node && section.contains(triggerElement))
    ) {
      trigger.kill();
    }
  });

  gsap.set(slider, {
    clearProps: "transform",
  });

  /* =========================================
     MOBILE
     ========================================= */

  if (isMobile) {
    gsap.set(slider, {
      x: 0,
      clearProps: "transform",
    });

    ScrollTrigger.refresh();

    return;
  }

  /* =========================================
     DESKTOP
     ========================================= */

  const getTotalScroll = () =>
    slider.scrollWidth - section.clientWidth;

  if (getTotalScroll() <= 0) return;

  orangeTween = gsap.to(slider, {
    x: () => -getTotalScroll(),

    ease: "none",

    scrollTrigger: {
      trigger: section,

      start: "top top",

      end: () => `+=${getTotalScroll()}`,

      pin: true,

      scrub: 1,

      anticipatePin: 1,

      invalidateOnRefresh: true,
    },
  });

  ScrollTrigger.refresh();
};

/* =========================================
   INICIALIZACIÓN
   ========================================= */

window.addEventListener("load", () => {
  initHorizontalScroll();

  requestAnimationFrame(() => {
    ScrollTrigger.refresh();
  });
});

/* =========================================
   RESIZE
   ========================================= */

let resizeTimer: number;

window.addEventListener("resize", () => {
  window.clearTimeout(resizeTimer);

  resizeTimer = window.setTimeout(() => {
    initHorizontalScroll();
  }, 150);
});

export {};