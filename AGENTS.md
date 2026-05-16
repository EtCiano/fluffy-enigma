# Lagartixos

Single-page RPG character sheet manager (vanilla HTML/CSS/JS, Portuguese).

## Quick start

No build step. Open `index.html` in any browser. State persisted to `localStorage` — keys `'ficha'` (character sheets, `fichas.js`) and `'itens'` (inventory, `itens.js`).

## Script load order (`index.html`)

```
fichas.js → dados.js → iniciativa.js → (fundo.js commented out) → calculadora.js → itens.js
```

`fichas.js` must be before `itens.js` — `itens.js` reads `appFichas.fichaAtiva` at module level and proxied functions.

If adding a new script: after `fichas.js` if it depends on `appFichas`, otherwise at the end.

## Architecture

- **Entrypoint:** `index.html` — loads scripts via `<script>` tags (order matters).
- **JS modules** each export a global namespace: `appFichas`, `appCalc`, `appDados`, `appIniciativa`, `appItens`.
- **`fichas.js`** is the core (character sheet CRUD). Defines `appFichas` with getter `fichaAtiva`.
- **`fundo.js`** is a decorative animated background, commented out. Don't uncomment without checking performance.
- **Theme** (`tema.js`) sets CSS custom properties via JS, persisted to `localStorage` key `'theme'`. Not driven by CSS media queries.

## Itens System (`itens.js`)

- Data: `itens[indiceFicha][indiceItem]` — 2D array persisted to `localStorage` key `'itens'`.
- `indiceAtual` (line 6) reads `appFichas.fichaAtiva` on load and is updated by a **monkey-patch** on `appFichas` (line 85). The patch wraps `fichaAnterior`, `proximaFicha`, `criarFicha`, `deletarFicha`, and `importarFicha` — after any of these runs, if `fichaAtiva` changed, `mudarItensFicha()` is called automatically and `indiceAtual` is updated.
- Item obj keys: `nome` (required), `valor`, `tipo`, `cor`, plus any dynamic details.
- `cor` selects background from a 16-color palette (`cores` at line 37).
- C R U D: modals `modal-adicionar-item`, `modal-modificar-item`, `modal-novo-detalhe`. Detail keys are added dynamically via the second modal — tracked in `detalhesItem[]` + `detalhesContainer`.
- Description popup (`#descricao-item`) is a static HTML element with **modificar** and **deletar** buttons. Positioned at click coordinates, populated via `mostrarDescricao()`.
- Drag-and-drop reorder via HTML5 DnD API (same pattern as attribute reorder in `fichas.js`).

## Export / Import

- **Export** (`exportarFicha` in `fichas.js`): generates a `.zip` via JSZip CDN containing `ficha.txt` (key: value, same format) and `itens.txt` (JSON array of current ficha's items).
- **Import** (`importarFicha` in `fichas.js`): reads a `.zip` with JSZip, parses `ficha.txt` and `itens.txt`, pushes the ficha + items to the respective arrays, syncs `indiceAtual`.
- `importarFicha` is **not** monkey-patched (async) — items are handled explicitly inside the import flow.
- JSZip loaded from CDN (`index.html:8`).

## Style quirks (`style.css`)

- Item grid: 5 cols → 4 (≤500px) → 3 (≤400px).
- Items use `::before { padding-bottom: 100% }` for square aspect ratio.
- Font: `clamp(0.4rem, 2vw, 0.7rem)`.

## Git conventions

- Branch names: descriptive lowercase with hyphens (e.g. `feature-equipamentos`).
- Origin: `https://github.com/EtCiano/lagartixos.git`

## Testing / Linting / Formatting

None. No package.json, no build tools, no CI.
