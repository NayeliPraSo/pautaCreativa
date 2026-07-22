# Fuentes: Fira Sans + Barlow (self-hosted)

Las fuentes se sirven localmente desde esta carpeta y se declaran en
`src/styles/fonts.css`, importado desde `src/layouts/BaseLayout.astro`.

## Estructura esperada

```
src/assets/fonts/
├── Fira_Sans/
│   ├── FiraSans-Regular.ttf
│   ├── FiraSans-Italic.ttf
│   ├── FiraSans-Medium.ttf
│   ├── FiraSans-MediumItalic.ttf
│   ├── FiraSans-SemiBold.ttf
│   ├── FiraSans-SemiBoldItalic.ttf
│   ├── FiraSans-Bold.ttf
│   ├── FiraSans-BoldItalic.ttf
│   ├── ... (Black, ExtraBold, ExtraLight, Light, Thin, y sus itálicas)
│   └── OFL.txt
│
└── Barlow/
    ├── Barlow-Medium.otf
    ├── Barlow-SemiBold.otf
    ├── Barlow-Bold.otf
    ├── Barlow-ExtraBold.otf
    ├── Barlow-Black.otf
    ├── ... (Thin, ExtraLight, Light, Regular, y sus itálicas/condensadas)
    └── SIL Open Font License.txt
```

## Pesos actualmente declarados

`fonts.css` solo declara los pesos que se usan hoy en el sitio:

| Familia    | Pesos                              |
|------------|-------------------------------------|
| Fira Sans  | 400, 500, 600, 700 (+ itálicas)     |
| Barlow     | 500, 600, 700, 800, 900             |

Si una sección necesita un peso adicional (ej. Fira Sans Light 300, o
Barlow Thin 100), hay que:

1. Agregar el `@font-face` correspondiente en `src/styles/fonts.css`
   apuntando al archivo ya existente en esta carpeta (no hace falta
   descargar nada nuevo, ya están todos los pesos disponibles).
2. Usar el peso vía `font-weight` en la sección correspondiente.

No se usan las variantes *Condensed* / *SemiCondensed* de Barlow por
ahora; quedan disponibles en la carpeta si se necesitan más adelante.
