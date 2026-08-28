/**
 * Cases — animaciones y lógica
 * Toda la interacción/animación de esta sección vive aquí.
 */

import gsap from "gsap";

/* ============================================================
   ELEMENTOS BASE
   ============================================================ */

const casesSection =
  document.querySelector<HTMLElement>(".cases");

const grid =
  document.querySelector<HTMLElement>(".cases-grid");

const detailsContainer =
  document.querySelector<HTMLElement>(".cases-details");

const cards =
  document.querySelectorAll<HTMLButtonElement>(".case-card");

const detailWrappers =
  document.querySelectorAll<HTMLElement>(".case-detail-wrapper");

/* ============================================================
   MÁQUINA DE ESCRIBIR
   ============================================================ */

function splitTextIntoLetters(
  element: HTMLElement
): HTMLElement[] {
  const letters: HTMLElement[] = [];

  const processNode = (node: Node): void => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent ?? "";

      const fragment =
        document.createDocumentFragment();

      [...text].forEach((char) => {
        if (char === " ") {
          fragment.appendChild(
            document.createTextNode(" ")
          );

          return;
        }

        const letter =
          document.createElement("span");

        letter.className = "cases-letter";
        letter.textContent = char;
        letter.style.display = "inline-block";

        fragment.appendChild(letter);

        letters.push(letter);
      });

      node.parentNode?.replaceChild(
        fragment,
        node
      );

      return;
    }

    Array.from(node.childNodes).forEach(
      processNode
    );
  };

  processNode(element);

  return letters;
}

/* ============================================================
   ANIMACIÓN DE ENTRADA
   ============================================================ */

function initCasesIntroAnimation(): void {
  if (!casesSection) return;

  const counter =
    casesSection.querySelector<HTMLElement>(
      ".cases-counter"
    );

  const intro =
    casesSection.querySelector<HTMLElement>(
      ".cases-intro"
    );

  const introText =
    casesSection.querySelector<HTMLElement>(
      ".cases-intro > span"
    );

  const plus =
    casesSection.querySelector<HTMLElement>(
      ".cases-plus"
    );

  const title =
    casesSection.querySelector<HTMLElement>(
      ".cases-title"
    );

  const caseCards =
    casesSection.querySelectorAll<HTMLButtonElement>(
      ".case-card"
    );

  const caseCardInners =
    casesSection.querySelectorAll<HTMLElement>(
      ".case-card__inner"
    );

  if (
    !counter ||
    !intro ||
    !introText ||
    !title ||
    caseCards.length === 0 ||
    caseCardInners.length === 0
  ) {
    return;
  }

  /* ==========================================================
     REDUCED MOTION
     ========================================================== */

  const prefersReducedMotion =
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

  if (prefersReducedMotion) return;

  /* ==========================================================
     TEXTO
     ========================================================== */

  const letters =
    splitTextIntoLetters(introText);

  /* ==========================================================
     ESTADOS INICIALES
     ========================================================== */

  gsap.set(counter, {
    autoAlpha: 0,
    x: -35,
  });

  gsap.set(intro, {
    autoAlpha: 1,
  });

  if (plus) {
    gsap.set(plus, {
      autoAlpha: 0,
      scale: 0.5,
      rotation: -20,
      transformOrigin: "center center",
    });
  }

  gsap.set(letters, {
    autoAlpha: 0,
    y: 8,
  });

  gsap.set(title, {
    autoAlpha: 0,
    y: 40,
  });

  gsap.set(caseCards, {
    autoAlpha: 0,
  });

  gsap.set(caseCardInners, {
    y: 55,
  });

  /* ==========================================================
     TIMELINE
     ========================================================== */

  const tl = gsap.timeline({
    paused: true,
  });

  /* ----------------------------------------------------------
     CONTADOR
     ---------------------------------------------------------- */

  tl.to(counter, {
    autoAlpha: 1,
    x: 0,
    duration: 1,
    ease: "power3.out",
  });

  /* ----------------------------------------------------------
     PLUS
     ---------------------------------------------------------- */

  if (plus) {
    tl.to(
      plus,
      {
        autoAlpha: 1,
        scale: 1,
        rotation: 0,
        duration: 0.8,
        ease: "back.out(1.8)",
      },
      "-=0.3"
    );
  }

  /* ----------------------------------------------------------
     MÁQUINA DE ESCRIBIR
     ---------------------------------------------------------- */

  tl.to(
    letters,
    {
      autoAlpha: 1,
      y: 0,

      duration: 0.04,

      stagger: {
        each: 0.035,
        from: "start",
      },

      ease: "none",
    },
    "-=0.08"
  );

  /* ----------------------------------------------------------
     QUÉ LOGRAMOS
     ---------------------------------------------------------- */

  tl.to(
    title,
    {
      autoAlpha: 1,
      y: 0,

      duration: 1.2,

      ease: "power3.out",
    },
    "-=0.15"
  );

  /* ----------------------------------------------------------
     CARDS — OPACITY
     ---------------------------------------------------------- */

  tl.to(
    caseCards,
    {
      autoAlpha: 1,

      duration: 0.9,

      stagger: {
        each: 0.18,
        from: "start",
      },

      ease: "power3.out",
    },
    "-=0.35"
  );

  /* ----------------------------------------------------------
     CARDS — MOVIMIENTO INTERNO
     ---------------------------------------------------------- */

  tl.to(
    caseCardInners,
    {
      y: 0,

      duration: 0.75,

      stagger: {
        each: 0.12,
        from: "start",
      },

      ease: "power3.out",

      onComplete: () => {
        gsap.set(caseCardInners, {
          clearProps: "transform",
        });
      },
    },
    "<"
  );

  /* ==========================================================
     PULSO DEL PLUS
     Empieza SOLO cuando termina la entrada.
     ========================================================== */

  if (plus) {
    tl.call(() => {
      gsap.killTweensOf(plus);

      gsap.to(plus, {
        scale: 1.15,
        duration: 1.2,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        transformOrigin: "center center",
      });
    });
  }

  /* ==========================================================
     DISPARO REAL DE ENTRADA

     No usamos ScrollTrigger aquí porque Orange Mindset tiene
     un pin horizontal que puede alterar el cálculo de las
     posiciones de las secciones posteriores.

     IntersectionObserver espera a que Cases esté físicamente
     dentro del viewport.
     ========================================================== */

  let hasPlayed = false;

  const observer = new IntersectionObserver(
    (entries) => {
      const entry = entries[0];

      if (
        hasPlayed ||
        !entry?.isIntersecting ||
        entry.intersectionRatio < 0.1
      ) {
        return;
      }

      hasPlayed = true;

      observer.disconnect();

      tl.play(0);
    },
    {
      root: null,
      threshold: 0.1,
      rootMargin: "0px 0px -20% 0px",
    }
  );

  observer.observe(casesSection);
}

/* ============================================================
   CARDS / DETALLES
   ============================================================ */

if (
  casesSection &&
  grid &&
  detailsContainer
) {
  cards.forEach((card) => {
    card.addEventListener("click", () => {
      const caseId =
        card.dataset.caseId;

      if (!caseId) return;

      const selectedDetail =
        document.querySelector<HTMLElement>(
          `.case-detail[data-case-id="${caseId}"]`
        );

      if (!selectedDetail) return;

      const selectedWrapper =
        selectedDetail.closest<HTMLElement>(
          ".case-detail-wrapper"
        );

      if (!selectedWrapper) return;

      casesSection.classList.add(
        "is-detail-open"
      );

      detailWrappers.forEach(
        (wrapper) => {
          wrapper.style.display = "none";
        }
      );

      selectedWrapper.style.display =
        "block";
    });
  });

  /* ==========================================================
     CERRAR DETALLE
     ========================================================== */

  detailWrappers.forEach((wrapper) => {
    const closeButton =
      wrapper.querySelector<HTMLButtonElement>(
        ".case-detail__close"
      );

    closeButton?.addEventListener(
      "click",
      () => {
        const videoContainer =
          wrapper.querySelector<HTMLElement>(
            ".case-detail__video"
          );

        if (videoContainer) {
          const originalContent =
            videoContainer.dataset
              .originalContent;

          if (originalContent) {
            videoContainer.innerHTML =
              originalContent;
          }
        }

        wrapper.style.display = "none";

        casesSection.classList.remove(
          "is-detail-open"
        );
      }
    );
  });
}

/* ============================================================
   VIDEO
   ============================================================ */

const videoContainers =
  document.querySelectorAll<HTMLElement>(
    ".case-detail__video"
  );

videoContainers.forEach((container) => {
  const originalContent =
    container.innerHTML;

  const playVideo = (): void => {
    const videoUrl =
      container.dataset.video;

    if (!videoUrl) return;

    const videoId =
      getYouTubeVideoId(videoUrl);

    if (!videoId) return;

    const iframe =
      document.createElement("iframe");

    iframe.className =
      "case-detail__iframe";

    iframe.src =
      `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;

    iframe.title =
      "Video del caso";

    iframe.allow =
      "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";

    iframe.allowFullscreen = true;

    container.innerHTML = "";

    container.appendChild(iframe);
  };

  container.addEventListener(
    "click",
    playVideo
  );

  container.addEventListener(
    "keydown",
    (event) => {
      if (
        event.key === "Enter" ||
        event.key === " "
      ) {
        event.preventDefault();

        playVideo();
      }
    }
  );

  container.dataset.originalContent =
    originalContent;
});

/* ============================================================
   OBTENER ID DE YOUTUBE
   ============================================================ */

function getYouTubeVideoId(
  url: string
): string | null {
  try {
    const parsedUrl =
      new URL(url);

    if (
      parsedUrl.hostname ===
        "www.youtube.com" ||
      parsedUrl.hostname ===
        "youtube.com"
    ) {
      return parsedUrl.searchParams.get(
        "v"
      );
    }

    if (
      parsedUrl.hostname ===
      "youtu.be"
    ) {
      return parsedUrl.pathname.substring(
        1
      );
    }

    return null;
  } catch (error) {
    console.error(
      "URL de YouTube inválida:",
      url,
      error
    );

    return null;
  }
}

/* ============================================================
   MOBILE — DOTS DEL CARRUSEL
   ============================================================ */

const dots = Array.from(
  document.querySelectorAll<HTMLButtonElement>(
    "[data-case-dot]"
  )
);

if (grid && dots.length) {
  /* ==========================================================
     CLICK EN DOT
     ========================================================== */

  dots.forEach((dot) => {
    dot.addEventListener(
      "click",
      () => {
        const caseId =
          dot.dataset.caseDot;

        if (!caseId) return;

        const targetCard =
          grid.querySelector<HTMLElement>(
            `.case-card[data-case-id="${caseId}"]`
          );

        targetCard?.scrollIntoView({
          behavior: "smooth",
          inline: "center",
          block: "nearest",
        });
      }
    );
  });

  /* ==========================================================
     DOT ACTIVO
     ========================================================== */

  const activeCardObserver =
    new IntersectionObserver(
      (entries) => {
        entries.forEach(
          (entry) => {
            if (!entry.isIntersecting) {
              return;
            }

            const caseId =
              (
                entry.target as HTMLElement
              ).dataset.caseId;

            dots.forEach((dot) => {
              dot.classList.toggle(
                "is-active",

                dot.dataset.caseDot ===
                  caseId
              );
            });
          }
        );
      },

      {
        root: grid,
        threshold: 0.6,
      }
    );

  cards.forEach((card) => {
    activeCardObserver.observe(card);
  });
}

/* ============================================================
   INICIALIZACIÓN
   ============================================================ */

initCasesIntroAnimation();

