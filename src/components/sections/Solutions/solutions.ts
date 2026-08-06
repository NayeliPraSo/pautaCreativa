/**
 * Solutions — animaciones y lógica
 * Toda la interacción de esta sección vive aquí.
 */

import { solutionsById } from "./solutions.data";

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

const nodes = Array.from(
  document.querySelectorAll<HTMLElement>("[data-solution]")
);

let activeSolutionId: string | null = null;

/**
 * Muestra una solución
 */
function showSolution(id: string) {
  const solution = solutionsById[id];

  if (!solution) return;

  activeSolutionId = id;

  // Activa segunda vista
  section?.classList.add("is-active");
  diagram?.classList.add("is-active");

  // Cambia el fondo
  if (background) {
    background.style.backgroundImage = `url("${solution.background.src}")`;
  }

  // Actualiza la tarjeta
  if (title) {
    title.textContent = solution.title;
  }

  if (subtitle) {
    subtitle.textContent = solution.subtitle;
  }

  if (description) {
    description.textContent = solution.description;
  }

  // Nodo activo
  nodes.forEach((node) => {
    node.classList.toggle(
      "is-selected",
      node.dataset.solution === id
    );
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

  nodes.forEach((node) => {
    node.classList.remove("is-selected");
  });
}

/**
 * Eventos
 */
nodes.forEach((node) => {
  node.addEventListener("click", () => {
    const id = node.dataset.solution;

    if (!id) return;

    // Si vuelve a dar clic en la misma solución, cerrar
    if (activeSolutionId === id) {
      hideSolution();
      return;
    }

    // Mostrar nueva solución
    showSolution(id);
  });
});