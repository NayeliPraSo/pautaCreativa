/**
 * Hero — animaciones
 * Toda animación del Hero vive aquí.
 */

import gsap from "gsap";

const hero = document.querySelector<HTMLElement>("#hero");

if (hero) {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const heroBg = hero.querySelector<HTMLElement>(".hero-bg");

  const index = hero.querySelector<HTMLElement>(".hero-index");
  const titleSmall = hero.querySelector<HTMLElement>(".hero-title-small");
  const titleMain = hero.querySelector<HTMLElement>(".hero-title-main");
  const subtitle = hero.querySelector<HTMLElement>(".hero-subtitle");
  const plusGroups = hero.querySelectorAll<HTMLElement>(".hero-plus-group");
  const plusIcons = hero.querySelectorAll<HTMLElement>(".hero-plus");
  const scroll = hero.querySelector<HTMLElement>(".hero-scroll");

  /**
   * Divide un texto en letras conservando espacios.
   */
  const splitTextIntoLetters = (element: HTMLElement | null) => {
    if (!element) return [];

    const text = element.textContent ?? "";

    element.setAttribute("aria-label", text);
    element.textContent = "";

    const letters: HTMLSpanElement[] = [];

    [...text].forEach((character) => {
      const span = document.createElement("span");

      span.classList.add("hero-letter");
      span.setAttribute("aria-hidden", "true");

      if (character === " ") {
        span.innerHTML = "&nbsp;";
      } else {
        span.textContent = character;
      }

      element.appendChild(span);
      letters.push(span);
    });

    return letters;
  };

  if (!prefersReducedMotion) {
    /* =========================================
       FONDO — Ken Burns
       ========================================= */

    if (heroBg) {
      window.addEventListener("load", () => {
        gsap.fromTo(
          heroBg,
          {
            scale: 1.28,
          },
          {
            scale: 1,
            duration: 3.5,
            ease: "power1.out",
          }
        );
      });
    }

    /* =========================================
       TEXTOS
       ========================================= */

    const indexLetters = splitTextIntoLetters(index);
    const subtitleLetters = splitTextIntoLetters(subtitle);

    /* =========================================
       TIMELINE DE ENTRADA
       ========================================= */

    const tl = gsap.timeline({
      defaults: {
        ease: "power3.out",
      },
    });

    tl.from(indexLetters, {
      opacity: 0,
      y: 15,
      duration: 0.4,
      stagger: 0.04,
    })

      .from(
        titleSmall,
        {
          opacity: 0,
          y: 30,
          duration: 0.7,
        },
        "-=0.2"
      )

      .from(
        titleMain,
        {
          opacity: 0,
          scale: 0.5,
          transformOrigin: "left center",
          duration: 1.4,
          ease: "power3.out",
        },
        "-=0.25"
      )

      .from(
        subtitleLetters,
        {
          opacity: 0,
          y: 20,
          duration: 0.35,
          stagger: 0.06,
        },
        "-=0.35"
      )

      .from(
        plusGroups,
        {
          opacity: 0,
          y: 16,
          duration: 0.5,
          stagger: 0.1,
        },
        "-=0.15"
      )

      .from(
        scroll,
        {
          opacity: 0,
          y: 10,
          duration: 0.5,
        },
        "-=0.2"
      );

    /* =========================================
       PLUS — movimiento continuo
       ========================================= */

    plusIcons.forEach((plus, index) => {
      gsap.set(plus, {
        transformOrigin: "50% 50%",
      });

      /*
       * Pulsación constante.
       * Aquí NO animamos rotation para que
       * no interfiera con el hover.
       */
      gsap.to(plus, {
        scale: 1.5,
        y: -8,
        duration: 0.8,
        delay: index * 0.2,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });

      /*
       * Hover: solamente controla rotation.
       */
      plus.addEventListener("mouseenter", () => {
        gsap.to(plus, {
          rotation: "+=180",
          duration: 0.45,
          ease: "back.out(1.7)",
        });
      });
    });
  }
}

export {};