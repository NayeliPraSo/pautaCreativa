/**
 * Utilidad compartida: scroll suave a una sección por id.
 * Ejemplo de utilidad genérica que cualquier sección puede reutilizar.
 */

export function scrollToSection(id: string): void {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}
