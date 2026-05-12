# Lagartixos

Single-page RPG character sheet manager (vanilla HTML/CSS/JS, Portuguese).

## Quick start

No build step. Open `index.html` in any browser. All state is persisted to `localStorage` key `'ficha'`.

## Architecture

- **Entrypoint:** `index.html` — loads scripts via `<script>` tags (order matters, see below).
- **JS modules** each export a global namespace object: `appFichas`, `appCalc`, `appDados`, `appIniciativa`, `appItens`.
- **`fichas.js`** is the core (read first for any character sheet logic). Defines `appFichas` which is a dependency of `itens.js`.
- **`itens.js:1`** accesses `appFichas.fichaAtiva` at module level — `fichas.js` must be loaded before `itens.js`.
- **`fundo.js`** is a decorative animated background commented out in `index.html` (line 254). Don't uncomment without checking performance on low-end devices.
- **Theme** (`tema.js`) sets CSS custom properties via JS and persists choice to `localStorage` key `'theme'`. Not driven by CSS media queries.

## Script load order (index.html)

```
fichas.js → dados.js → iniciativa.js → (fundo.js commented out) → calculadora.js → itens.js
```

If adding a new script: add it after `fichas.js` if it depends on `appFichas`, otherwise at the end.

## Testing / Linting / Formatting

None. No package.json, no build tools, no CI.

## Git conventions

- Branch names: descriptive lowercase with hyphens (e.g. `feature-equipamentos`).
- Origin: `https://github.com/EtCiano/lagartixos.git`
