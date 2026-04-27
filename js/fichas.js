// ─── Configuração ────────────────────────────────────────────────────────────

const LOCAIS = [
  'nome',
  'vida total',
  'vida atual',
  'sanidade total',
  'sanidade atual',
  'esgrima',
  'inteligencia',
  'resistencia',
  'reflexos',
  'agilidade',
  'regeneração',
  'força',
  'velocidade',
  'energia',
  'precisão',
  'furtividade'
];

const STORAGE_KEY = 'war_ficha';

// ─── Estado ───────────────────────────────────────────────────────────────────

let linhas = []; // array de strings, uma por atributo (sem '\n')
let indiceAtributoSendoEditado = null;

// ─── Persistência (localStorage) ─────────────────────────────────────────────

function carregarFicha() {
  const salvo = localStorage.getItem(STORAGE_KEY);
  if (salvo) {
    linhas = JSON.parse(salvo);
    return true;
  }
  return false;
}

function salvarFicha() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(linhas));
}

// ─── Renderização ─────────────────────────────────────────────────────────────

function mostrarAtributos() {
  const avisoEl = document.getElementById('aviso-vazio');
  const nomeEl = document.getElementById('nome-personagem');
  const listaEl = document.getElementById('atributos-lista');

  if (linhas.length < LOCAIS.length) {
    avisoEl.hidden = false;
    nomeEl.textContent = '';
    listaEl.innerHTML = '';
    return;
  }

  avisoEl.hidden = true;

  nomeEl.textContent = linhas[0];

  // Demais atributos
  listaEl.innerHTML = '';

  for (let i = 1; i < LOCAIS.length; i++) {
    // Índice 1: vida total  |  2: vida atual  → exibe juntos
    if (i === 1) {
      const p = document.createElement('p');
      p.className = 'atributo atributo-barra';
      p.dataset.indice = i;
      p.innerHTML =
        `<span class="atributo-nome">Vida</span>` +
        `<span class="atributo-valor">${linhas[2]} / ${linhas[1]}</span>`;
      listaEl.appendChild(p);
      continue;
    }
    if (i === 2) continue; // já exibido junto com 1

    // Índice 3: sanidade total  |  4: sanidade atual → exibe juntos
    if (i === 3) {
      const p = document.createElement('p');
      p.className = 'atributo atributo-barra';
      p.dataset.indice = i;
      p.innerHTML =
        `<span class="atributo-nome">Sanidade</span>` +
        `<span class="atributo-valor">${linhas[4]} / ${linhas[3]}</span>`;
      listaEl.appendChild(p);
      continue;
    }
    if (i === 4) continue; // já exibido junto com 3

    // Demais atributos normais
    const p = document.createElement('p');
    p.className = 'atributo';
    p.dataset.indice = i;
    p.innerHTML =
      `<span class="atributo-nome">${capitalizar(LOCAIS[i])}</span>` +
      `<span class="atributo-valor">${linhas[i]}</span>`;
    listaEl.appendChild(p);
  }
}

function preencherSelectAtributos() {
  const select = document.getElementById('selecao-atributo');
  select.innerHTML = '';
  LOCAIS.forEach((local, i) => {
    const opt = document.createElement('option');
    opt.value = i;
    opt.textContent = capitalizar(local);
    select.appendChild(opt);
  });
}

// ─── Ações ────────────────────────────────────────────────────────────────────

function alterarAtributoValor(indice, valor) {
  const num = parseInt(valor, 10);
  if (isNaN(num)) {
    alert('Digite um número válido.');
    return;
  }
  const atual = parseInt(linhas[indice], 10) || 0;
  linhas[indice] = String(atual + num);
  salvarFicha();
  mostrarAtributos();
}

function abrirModalAtributo() {
  const select = document.getElementById('selecao-atributo');
  indiceAtributoSendoEditado = parseInt(select.value, 10);

  document.getElementById('modal-atributo-titulo').textContent =
    capitalizar(LOCAIS[indiceAtributoSendoEditado]);
  document.getElementById('modal-atributo-atual').textContent =
    'Valor atual: ' + (linhas[indiceAtributoSendoEditado] ?? '—');

  const entrada = document.getElementById('modal-atributo-entrada');
  entrada.value = linhas[indiceAtributoSendoEditado] ?? '';

  abrirModal('modal-atributo');
}

function salvarAtributo() {
  const valor = document.getElementById('modal-atributo-entrada').value.trim();
  if (valor === '') {
    alert('Digite um valor.');
    return;
  }
  linhas[indiceAtributoSendoEditado] = valor;
  salvarFicha();
  mostrarAtributos();
  fecharModal('modal-atributo');
}

function abrirModalFichaCompleta() {
  const container = document.getElementById('modal-ficha-campos');
  container.innerHTML = '';

  LOCAIS.forEach((campo, i) => {
    const label = document.createElement('label');
    label.textContent = capitalizar(campo);
    label.htmlFor = `ficha-campo-${i}`;

    const input = document.createElement('input');
    input.type = 'text';
    input.id = `ficha-campo-${i}`;
    input.placeholder = capitalizar(campo);
    input.value = linhas[i] ?? '';

    container.appendChild(label);
    container.appendChild(input);
  });

  abrirModal('modal-ficha');
}

function salvarFichaCompleta() {
  const novasLinhas = [];
  for (let i = 0; i < LOCAIS.length; i++) {
    const input = document.getElementById(`ficha-campo-${i}`);
    novasLinhas.push(input ? input.value.trim() : '');
  }
  linhas = novasLinhas;
  salvarFicha();
  mostrarAtributos();
  fecharModal('modal-ficha');
}

// ─── Modais ───────────────────────────────────────────────────────────────────

function abrirModal(id) {
  document.getElementById(id).hidden = false;
}

function fecharModal(id) {
  document.getElementById(id).hidden = true;
}

// Fecha modal ao clicar fora do conteúdo
document.addEventListener('click', (e) => {
  ['modal-atributo', 'modal-ficha'].forEach(id => {
    const modal = document.getElementById(id);
    if (!modal.hidden && e.target === modal) {
      modal.hidden = true;
    }
  });
});

// ─── Utilitários ──────────────────────────────────────────────────────────────

function capitalizar(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// ─── Inicialização ────────────────────────────────────────────────────────────

const app = {
  alterarAtributoValor,
  abrirModalAtributo,
  salvarAtributo,
  abrirModalFichaCompleta,
  salvarFichaCompleta,
  fecharModal,
};

(function init() {
  preencherSelectAtributos();

  const fichaExiste = carregarFicha();

  if (!fichaExiste || linhas.length < LOCAIS.length) {
    // Abre modal de criação automaticamente se não houver ficha
    abrirModalFichaCompleta();
  } else {
    mostrarAtributos();
  }
})();
