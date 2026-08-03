/**
 * Contact — dos vistas independientes (mismo patrón que Cases: grid <-> detalle).
 * Vista "default": título grande + tabs, sin formulario.
 * Vista "active": título angosto/rotado + tabs + el panel del servicio elegido.
 */

const defaultView = document.querySelector<HTMLElement>(
  '.contact-view[data-view="default"]',
);
const activeView = document.querySelector<HTMLElement>(
  '.contact-view[data-view="active"]',
);

const triggers = document.querySelectorAll<HTMLButtonElement>(
  "[data-tab-target]",
);
const panels = document.querySelectorAll<HTMLFormElement>(".contact-panel");

function openService(targetId: string) {
  defaultView?.setAttribute("hidden", "");
  activeView?.removeAttribute("hidden");

  triggers.forEach((trigger) => {
    const isActive = trigger.dataset.tabTarget === targetId;
    trigger.classList.toggle("is-active", isActive);
    trigger.setAttribute("aria-selected", String(isActive));
  });

  panels.forEach((panel) => {
    const isTarget = panel.dataset.panel === targetId;
    panel.classList.toggle("is-active", isTarget);
    panel.hidden = !isTarget;
  });
}

triggers.forEach((trigger) => {
  trigger.addEventListener("click", () => {
    const target = trigger.dataset.tabTarget;
    if (target) openService(target);
  });
});

export {};