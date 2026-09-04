/**
 * Hero — animaciones
 * Toda animación del Hero vive aquí.
 */

import gsap from "gsap";

/* ============================================================
   HERO
   ============================================================ */

const hero =
  document.querySelector<HTMLElement>("#hero");

if (hero) {
  const prefersReducedMotion =
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

  const heroBg =
    hero.querySelector<HTMLElement>(
      ".hero-bg"
    );

  const index =
    hero.querySelector<HTMLElement>(
      ".hero-index"
    );

  const titleSmall =
    hero.querySelector<HTMLElement>(
      ".hero-title-small"
    );

  const titleMain =
    hero.querySelector<HTMLElement>(
      ".hero-title-main"
    );

  const subtitle =
    hero.querySelector<HTMLElement>(
      ".hero-subtitle"
    );

  const plusGroups =
    hero.querySelectorAll<HTMLElement>(
      ".hero-plus-group"
    );

  const plusIcons =
    hero.querySelectorAll<HTMLElement>(
      ".hero-plus"
    );

  const scroll =
    hero.querySelector<HTMLElement>(
      ".hero-scroll"
    );

  /* ============================================================
     REDUCED MOTION
     ============================================================ */

  if (!prefersReducedMotion) {
    /* ============================================================
       MÁQUINA DE ESCRIBIR
       ============================================================ */

    const splitTextIntoLetters = (
      element: HTMLElement | null
    ): HTMLElement[] => {
      if (!element) return [];

      /*
       * Si ya fue dividido, reutilizamos
       * las letras existentes.
       */
      if (
        element.dataset.split === "true"
      ) {
        return Array.from(
          element.querySelectorAll<HTMLElement>(
            ".hero-letter"
          )
        );
      }

      const text =
        element.textContent ?? "";

      /*
       * Conservamos el texto completo
       * para lectores de pantalla.
       */
      element.setAttribute(
        "aria-label",
        text
      );

      element.textContent = "";

      const letters:
        HTMLSpanElement[] = [];

      /*
       * Separamos palabras y espacios.
       *
       * Ejemplo:
       *
       * "TRANSFORMAMOS RETOS EN"
       *
       * →
       *
       * [
       *   "TRANSFORMAMOS",
       *   " ",
       *   "RETOS",
       *   " ",
       *   "EN"
       * ]
       *
       * Los espacios permanecen como
       * nodos de texto normales.
       *
       * Así el navegador puede hacer
       * salto de línea ENTRE palabras,
       * pero nunca dentro de una palabra.
       */
      const parts =
        text.split(/(\s+)/);

      parts.forEach((part) => {
        /*
         * Espacios.
         *
         * No los convertimos en spans
         * ni utilizamos &nbsp;.
         *
         * Esto permite los saltos de
         * línea naturales.
         */
        if (/^\s+$/.test(part)) {
          element.appendChild(
            document.createTextNode(
              part
            )
          );

          return;
        }

        if (!part) return;

        /*
         * Cada palabra queda agrupada
         * dentro de .hero-word.
         *
         * CSS:
         *
         * .hero-word {
         *   display: inline-block;
         *   white-space: nowrap;
         * }
         */
        const word =
          document.createElement(
            "span"
          );

        word.classList.add(
          "hero-word"
        );

        word.setAttribute(
          "aria-hidden",
          "true"
        );

        /*
         * Dentro de cada palabra,
         * cada letra continúa siendo
         * independiente.
         *
         * Por eso GSAP puede seguir
         * haciendo el efecto máquina
         * de escribir letra por letra.
         */
        [...part].forEach(
          (character) => {
            const span =
              document.createElement(
                "span"
              );

            span.classList.add(
              "hero-letter"
            );

            span.setAttribute(
              "aria-hidden",
              "true"
            );

            span.textContent =
              character;

            word.appendChild(
              span
            );

            letters.push(span);
          }
        );

        element.appendChild(word);
      });

      element.dataset.split =
        "true";

      return letters;
    };

    /* ============================================================
       LETRAS
       ============================================================ */

    const indexLetters =
      splitTextIntoLetters(index);

    const subtitleLetters =
      splitTextIntoLetters(
        subtitle
      );

    /* ============================================================
       PLUS — CONFIGURACIÓN
       ============================================================ */

    plusIcons.forEach((plus) => {
      gsap.set(plus, {
        transformOrigin:
          "50% 50%",
      });

      /*
       * Hover:
       * únicamente modifica rotation.
       *
       * Así no pelea con el pulso,
       * que controla scale + y.
       */
      plus.addEventListener(
        "mouseenter",
        () => {
          gsap.to(plus, {
            rotation: "+=180",

            duration: 0.4,

            ease:
              "back.out(1.7)",
          });
        }
      );
    });

    /* ============================================================
       ESTADO INICIAL
       ============================================================ */

    gsap.set(
      indexLetters,
      {
        autoAlpha: 0,
        y: 15,
      }
    );

    if (titleSmall) {
      gsap.set(
        titleSmall,
        {
          autoAlpha: 0,
          y: 25,
        }
      );
    }

    if (titleMain) {
      gsap.set(
        titleMain,
        {
          autoAlpha: 0,

          scale: 0.65,

          transformOrigin:
            "left center",
        }
      );
    }

    gsap.set(
      subtitleLetters,
      {
        autoAlpha: 0,
        y: 16,
      }
    );

    gsap.set(
      plusGroups,
      {
        autoAlpha: 0,
        y: 14,
      }
    );

    if (scroll) {
      gsap.set(
        scroll,
        {
          autoAlpha: 0,
          y: 8,
        }
      );
    }

    /*
     * El fondo ahora es video.
     *
     * Ya no hacemos scale animado porque
     * el propio video aporta movimiento
     * y evitamos trabajo adicional
     * al navegador.
     */
    if (heroBg) {
      gsap.set(
        heroBg,
        {
          scale: 1,
        }
      );
    }

    /* ============================================================
       ANIMACIÓN AMBIENTAL DE LOS PLUS
       ============================================================ */

    const plusPulse =
      gsap.timeline({
        paused: true,

        repeat: -1,

        yoyo: true,
      });

    plusIcons.forEach(
      (plus, index) => {
        plusPulse.fromTo(
          plus,

          {
            scale: 1,
            y: 0,
          },

          {
            scale: 1.5,

            y: -8,

            duration: 0.8,

            ease:
              "sine.inOut",

            immediateRender:
              false,
          },

          index * 0.2
        );
      }
    );

    /* ============================================================
       TIMELINE DE ENTRADA
       ============================================================ */

    const entranceTl =
      gsap.timeline({
        paused: true,

        defaults: {
          ease:
            "power3.out",
        },
      });

    /*
     * IMPORTANTE:
     *
     * Ya no animamos el video
     * de fondo.
     *
     * La entrada comienza
     * directamente con los
     * elementos gráficos.
     */

    /* ----------------------------------------------------------
       ÍNDICE
       ---------------------------------------------------------- */

    entranceTl.to(
      indexLetters,

      {
        autoAlpha: 1,

        y: 0,

        duration: 0.3,

        stagger: {
          each: 0.025,

          from: "start",
        },
      },

      0
    );

    /* ----------------------------------------------------------
       SOMOS
       ---------------------------------------------------------- */

    if (titleSmall) {
      entranceTl.to(
        titleSmall,

        {
          autoAlpha: 1,

          y: 0,

          duration: 0.45,
        },

        "-=0.15"
      );
    }

    /* ----------------------------------------------------------
       CREADORES DE SOLUCIONES
       ---------------------------------------------------------- */

    if (titleMain) {
      entranceTl.to(
        titleMain,

        {
          autoAlpha: 1,

          scale: 1,

          duration: 0.9,

          ease:
            "power3.out",
        },

        "-=0.15"
      );
    }

    /* ----------------------------------------------------------
       SUBTÍTULO
       ---------------------------------------------------------- */

    entranceTl.to(
      subtitleLetters,

      {
        autoAlpha: 1,

        y: 0,

        duration: 0.25,

        stagger: {
          each: 0.025,

          from: "start",
        },

        ease:
          "power3.out",
      },

      "-=0.25"
    );

    /* ----------------------------------------------------------
       PLUS
       ---------------------------------------------------------- */

    entranceTl.to(
      plusGroups,

      {
        autoAlpha: 1,

        y: 0,

        duration: 0.4,

        stagger: {
          each: 0.08,

          from: "start",
        },
      },

      "-=0.2"
    );

    /* ----------------------------------------------------------
       SCROLL
       ---------------------------------------------------------- */

    if (scroll) {
      entranceTl.to(
        scroll,

        {
          autoAlpha: 1,

          y: 0,

          duration: 0.4,
        },

        "-=0.2"
      );
    }

    /* ============================================================
       AL TERMINAR LA ENTRADA
       ============================================================ */

    entranceTl.eventCallback(
      "onComplete",

      () => {
        /*
         * Una vez terminada
         * la entrada,
         * comienzan los movimientos
         * permanentes.
         */
        plusPulse.restart();
      }
    );

    /* ============================================================
       CONTROL DE ESTADO
       ============================================================ */

    let hasPlayed = false;

    /*
     * Evita rearmar el Hero
     * apenas cruza unos pocos
     * píxeles.
     *
     * Solo lo hacemos cuando
     * realmente ha salido
     * de pantalla.
     */
    let isArmedForReplay =
      true;

    /* ============================================================
       PLAY
       ============================================================ */

    const playHero =
      (): void => {
        if (
          !isArmedForReplay
        ) {
          return;
        }

        isArmedForReplay =
          false;

        hasPlayed = true;

        /*
         * Primero detenemos el
         * movimiento ambiental
         * para garantizar que la
         * entrada empiece limpia.
         */
        plusPulse.pause(0);

        entranceTl.restart();
      };

    /* ============================================================
       RESET
       ============================================================ */

    const resetHero =
      (): void => {
        if (!hasPlayed) {
          return;
        }

        if (
          isArmedForReplay
        ) {
          return;
        }

        isArmedForReplay =
          true;

        hasPlayed = false;

        /*
         * Detenemos animaciones
         * ambientales.
         */
        plusPulse.pause(0);

        /*
         * Regresamos la timeline
         * al segundo 0.
         *
         * Como utilizamos gsap.set
         * + .to() en lugar de
         * .from(), el estado inicial
         * es completamente controlado.
         */
        entranceTl.pause(0);
      };

    /* ============================================================
       DETECCIÓN DE VISIBILIDAD
       ============================================================ */

    const checkHeroPosition =
      (): void => {
        const rect =
          hero.getBoundingClientRect();

        const viewportHeight =
          window.innerHeight;

        /*
         * Hero está completamente
         * por encima de la pantalla.
         *
         * Damos un pequeño margen
         * para evitar resets justo
         * en el límite.
         */
        const completelyAbove =
          rect.bottom < -80;

        /*
         * Por si en algún momento
         * pudiera llegarse al Hero
         * desde arriba.
         */
        const completelyBelow =
          rect.top >
          viewportHeight + 80;

        if (
          completelyAbove ||
          completelyBelow
        ) {
          resetHero();

          return;
        }

        /*
         * Entrada.
         *
         * Para Hero no necesitamos
         * esperar hasta 75%-80%
         * del viewport porque es
         * la primera sección.
         */
        const isVisible =
          rect.bottom > 0 &&
          rect.top <
            viewportHeight;

        if (isVisible) {
          playHero();
        }
      };

    /* ============================================================
       LISTENERS
       ============================================================ */

    window.addEventListener(
      "scroll",

      checkHeroPosition,

      {
        passive: true,
      }
    );

    window.addEventListener(
      "resize",

      checkHeroPosition,

      {
        passive: true,
      }
    );

    /* ============================================================
       PRIMERA CARGA
       ============================================================ */

    requestAnimationFrame(
      () => {
        checkHeroPosition();
      }
    );
  }
}

export {};