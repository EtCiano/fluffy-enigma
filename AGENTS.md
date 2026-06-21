# Lagartixos

Single-page RPG character sheet manager (vanilla HTML/CSS/JS, Portuguese).

## Quick start

Open `index.html` in any browser. No build step. State persisted to `localStorage` — keys `'ficha'` + `'ordem_atributos'` (`fichas.js`), `'itens'` (`itens.js`), `'theme'` (dark/light mode).

## Script load order (`index.html`)

```
fichas.js → dados.js → iniciativa.js → (fundo.js commented out) → calculadora.js → itens.js
```

`fichas.js` must be before `itens.js` — `itens.js` reads `appFichas.fichaAtiva` at module level and monkey-patches it. New script: after `fichas.js` if it depends on `appFichas`.

## Architecture

- **JS modules** each export a global namespace: `appFichas`, `appCalc`, `appDados`, `appIniciativa`, `appItens`. No module bundler — plain `<script>` tags.
- **`fichas.js`** is core (character sheet CRUD). Defines `appFichas` with getters `fichaAtiva` and `fichas`.
- **`itens.js`** monkey-patches `appFichas.fichaAnterior`, `proximaFicha`, `criarFicha`, `deletarFicha` (but **not** `importarFicha` — items are handled explicitly inside the async import flow). When any of these changes `fichaAtiva`, `mudarItensFicha()` syncs the items view.
- **`tema.js`** exists but is **not loaded** in `index.html` — dead code. The dark/light toggle UI elements it references (`#modoclaro`, `#modoescuro`) don't exist in the DOM. Don't uncomment or fix without understanding the intent.
- **`fundo.js`** decorative animated canvas background, commented out. Don't uncomment without checking performance.

### Itens (`itens.js`)

- Data: `itens[indiceFicha][indiceItem]` — 2D array, `localStorage` key `'itens'`.
- Item keys: `nome` (required), `valor`, `tipo`, `cor` (selects from a 16-color palette), plus any dynamic detail keys added via `modal-novo-detalhe`.
- CRUD modals: `modal-adicionar-item`, `modal-modificar-item`, `modal-novo-detalhe`.
- Description popup (`#descricao-item`): positioned at click coordinates, populated via `mostrarDescricao()`, with **modificar** and **deletar** buttons.
- Drag-and-drop reorder via HTML5 DnD API.

### Export / Import

- **Export** (`exportarFicha`): generates `.zip` via JSZip CDN containing `ficha.txt` (key: value) and `itens.txt` (JSON array of current ficha's items).
- **Import** (`importarFicha`): reads a `.zip` with JSZip, parses both files, pushes ficha + items to respective arrays, syncs `indiceAtual`.
- JSZip loaded from CDN (`index.html:8`).

## Conventions

- Branch names: descriptive lowercase with hyphens (e.g. `feature-equipamentos`).
- Origin: `https://github.com/EtCiano/lagartixos.git`
- No tests, no linting, no formatting, no CI. No `package.json`.
