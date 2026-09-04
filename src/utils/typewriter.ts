/**
 * Typewriter — utilidad de timing
 *
 * Problema que resuelve:
 * Todos los efectos "máquina de escribir" del sitio usaban un
 * `stagger.each` FIJO (0.022s–0.035s por letra). Eso funciona bien
 * en textos cortos, pero en párrafos largos (ej. Soluciones, ~200
 * caracteres) el efecto tardaba 4–5s completos en revelarse, lo
 * que se siente muy lento — sobre todo porque el resto de la
 * timeline de entrada (círculos, divisores, iconos...) espera a
 * que el texto termine para encadenarse.
 *
 * Solución:
 * En vez de un stagger fijo, calculamos el stagger a partir de una
 * DURACIÓN TOTAL objetivo. Así, sin importar cuántas letras tenga
 * el texto, el efecto completo tarda aproximadamente lo mismo
 * (rápido y consistente en todas las secciones), y los párrafos
 * largos ya no "explotan" en duración.
 *
 * Los límites (MIN/MAX) evitan dos extremos:
 * - Textos muy largos con un stagger absurdamente pequeño
 *   (letras casi simultáneas, sin efecto visible).
 * - Textos muy cortos con un stagger absurdamente grande
 *   (letras separadas, se ve lento/roto).
 */

/** Duración total objetivo del efecto, en segundos. */
const TARGET_DURATION = 0.45;

/** Stagger mínimo por letra (texto muy largo). */
const MIN_STAGGER = 0.008;

/** Stagger máximo por letra (texto muy corto). */
const MAX_STAGGER = 0.025;

/**
 * Devuelve el `stagger.each` a usar para que el efecto de
 * `letterCount` letras dure aproximadamente `TARGET_DURATION`.
 */
export const getTypewriterStagger = (
  letterCount: number,
): number => {
  if (letterCount <= 0) {
    return MAX_STAGGER;
  }

  const raw = TARGET_DURATION / letterCount;

  return Math.min(
    MAX_STAGGER,
    Math.max(MIN_STAGGER, raw),
  );
};