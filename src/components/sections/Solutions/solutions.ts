/**
 * Solutions — animaciones y lógica
 * Toda la interacción de esta sección vive aquí.
 */

import { solutions, solutionsById } from "./solutions.data";

const section = document.querySelector<HTMLElement>("#soluciones");
const diagram = document.querySelector<HTMLElement>(".solutions-diagram");

const background = document.querySelector<HTMLElement>(
  "[data-solutions-background]"
);

const title = document.querySelector<HTMLElement>("#solution-title");
const subtitle = document.querySelector<HTMLElement>("#solution-subtitle");
const description = document.querySelector<HTMLElement>(
  "#solution-description"
);
const icon = document.querySelector<HTMLImageElement>("#solution-icon");

const nodes = Array.from(
  document.querySelectorAll<HTMLElement>("[data-solution]")
);

const dots = Array.from(
  document.querySelectorAll<HTMLButtonElement>("[data-dot]")
);

let activeSolutionId: string | null = null;

/**
 * Muestra una solución
 */
function showSolution(id: string) {
  const solution = solutionsById[id];

  if (!solution) return;

  activeSolutionId = id;

  section?.classList.add("is-active");
  diagram?.classList.add("is-active");

  if (background) {
    background.style.backgroundImage = `url("${solution.background.src}")`;
  }

  if (title) {
    title.textContent = solution.title;
  }

  if (subtitle) {
    subtitle.textContent = solution.subtitle;
  }

  if (description) {
    description.textContent = solution.description;
  }

  if (icon) {
    icon.src = solution.icon.src;
  }

  nodes.forEach((node) => {
    node.classList.toggle("is-selected", node.dataset.solution === id);
  });

  dots.forEach((dot) => {
    dot.classList.toggle("is-active", dot.dataset.dot === id);
  });
}

/**
 * Regresa a la vista inicial
 */
function hideSolution() {
  activeSolutionId = null;

  section?.classList.remove("is-active");
  diagram?.classList.remove("is-active");

  if (background) {
    background.style.backgroundImage = "";
  }

  if (title) {
    title.textContent = "";
  }

  if (subtitle) {
    subtitle.textContent = "";
  }

  if (description) {
    description.textContent = "";
  }

  if (icon) {
    icon.src = "";
    icon.alt = "";
  }

  nodes.forEach((node) => {
    node.classList.remove("is-selected");
  });

  dots.forEach((dot) => {
    dot.classList.toggle("is-active", dot.dataset.dot === "");
  });
}

/**
 * Eventos — clic (desktop y móvil)
 */
nodes.forEach((node) => {
  node.addEventListener("click", () => {
    const id = node.dataset.solution;

    if (!id) return;

    if (activeSolutionId === id) {
      hideSolution();
      return;
    }

    showSolution(id);
  });
});

dots.forEach((dot) => {
  dot.addEventListener("click", () => {
    const id = dot.dataset.dot;

    // data-dot="" es el dot del diagrama: siempre regresa a la vista inicial.
    if (!id) {
      hideSolution();
      return;
    }

    showSolution(id);
  });
});

/* ============================================================
   MOBILE — Carrusel por swipe
   Desliza el dedo sobre el diagrama para pasar a la
   solución siguiente/anterior, reutilizando showSolution().
   El breakpoint DEBE coincidir con el usado en solutions-diagram.css
   ============================================================ */

const MOBILE_QUERY = "(max-width: 768px)";
const SWIPE_THRESHOLD = 50; // px mínimos para contar como swipe intencional

let touchStartX = 0;
let touchStartY = 0;
let isTouchActive = false;

function getCurrentIndex(): number {
  // 0 = vista del diagrama (sin solución activa)
  if (!activeSolutionId) return 0;

  const solutionIndex = solutions.findIndex((s) => s.id === activeSolutionId);

  // +1 porque el índice 0 queda reservado para el diagrama
  return solutionIndex === -1 ? 0 : solutionIndex + 1;
}

function goToRelativeSolution(step: 1 | -1) {
  const totalSlides = solutions.length + 1; // +1 = vista del diagrama
  const currentIndex = getCurrentIndex();
  const nextIndex = (currentIndex + step + totalSlides) % totalSlides;

  if (nextIndex === 0) {
    hideSolution();
    return;
  }

  const nextSolution = solutions[nextIndex - 1];

  if (nextSolution) {
    showSolution(nextSolution.id);
  }
}

function onTouchStart(event: TouchEvent) {
  if (event.touches.length !== 1) return;

  touchStartX = event.touches[0].clientX;
  touchStartY = event.touches[0].clientY;
  isTouchActive = true;
}

function onTouchEnd(event: TouchEvent) {
  if (!isTouchActive) return;
  isTouchActive = false;

  const touch = event.changedTouches[0];
  const deltaX = touch.clientX - touchStartX;
  const deltaY = touch.clientY - touchStartY;

  // Gesto mayormente vertical: probablemente el usuario quiere
  // hacer scroll de la página, no cambiar de solución.
  if (Math.abs(deltaX) < Math.abs(deltaY)) return;

  if (Math.abs(deltaX) < SWIPE_THRESHOLD) return;

  // Deslizar a la izquierda (deltaX negativo) = siguiente solución
  goToRelativeSolution(deltaX < 0 ? 1 : -1);
}

let swipeListenersBound = false;

function bindSwipeListeners() {
  if (!diagram || swipeListenersBound) return;

  // passive: true porque no llamamos preventDefault en touchmove;
  // el scroll vertical nativo de la página sigue funcionando normal.
  diagram.addEventListener("touchstart", onTouchStart, { passive: true });
  diagram.addEventListener("touchend", onTouchEnd, { passive: true });
  swipeListenersBound = true;
}

function unbindSwipeListeners() {
  if (!diagram || !swipeListenersBound) return;

  diagram.removeEventListener("touchstart", onTouchStart);
  diagram.removeEventListener("touchend", onTouchEnd);
  swipeListenersBound = false;
}

function syncSwipeListeners() {
  const isMobile = window.matchMedia(MOBILE_QUERY).matches;

  if (isMobile) {
    bindSwipeListeners();
  } else {
    unbindSwipeListeners();
  }
}

syncSwipeListeners();

let resizeTimeout: ReturnType<typeof setTimeout>;

window.addEventListener("resize", () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(syncSwipeListeners, 200);
});

export {};