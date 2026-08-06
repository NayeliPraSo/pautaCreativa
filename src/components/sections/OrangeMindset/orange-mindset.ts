/**
 * OrangeMindset — animaciones y lógica
 * Toda la interacción/animación de esta sección vive aquí.
 */

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const initHorizontalScroll = () => {
  const section = document.querySelector<HTMLElement>("#orange-mindset");
  const slider = section?.querySelector<HTMLElement>(".om-slider");

  if (!section || !slider) return;

  const totalScroll = slider.scrollWidth - window.innerWidth;

  gsap.to(slider, {
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

window.addEventListener("load", () => {
  initHorizontalScroll();
});

export {};