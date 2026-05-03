const STORAGE_KEY = 'ficha';

// ─── Estado ───────────────────────────────────────────────────────────────────

let fichas = [
  {
    'nome': null,
    'vida': [null, null]
  }
];
let fichaAtiva = 0;
let indiceAtributoSendoEditado = null;
let modoReordenar = false;

// ─── Persistência ─────────────────────────────────────────────────────────────

function carregarFicha() {
  const salvo = localStorage.getItem(STORAGE_KEY);
  if (salvo) {
    fichas = JSON.parse(salvo);
    return true;
  }
  return false;
}

function salvarFicha() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(fichas));
}

// ─── Renderização ─────────────────────────────────────────────────────────────

function mostrarAtributos() {
  const avisoEl = document.getElementById('aviso-vazio');
  const nomeEl  = document.getElementById('nome-personagem');
  const listaEl = document.getElementById('atributos-lista');
  const btnReordenar = document.getElementById('btn-reordenar');

  if (!fichas[fichaAtiva]) {
    avisoEl.hidden = false;
    nomeEl.textContent = '';
    listaEl.innerHTML  = '';
    return;
  }

  avisoEl.hidden = true;
  if (btnReordenar) {
    btnReordenar.textContent = modoReordenar ? '✓ Concluir Reordenação' : 'Reordenar Atributos';
    btnReordenar.classList.toggle('ativo', modoReordenar);
  }

  const ficha = fichas[fichaAtiva];
  nomeEl.textContent = ficha['nome'];
  listaEl.innerHTML  = '';

  for (const [chave, valor] of Object.entries(ficha)) {
    if (chave === 'nome') continue;

    const item = document.createElement('div');
    item.className = 'atributo' + (modoReordenar ? ' reordenavel' : '');
    item.dataset.chave = chave;

    if (Array.isArray(valor)) {
      item.innerHTML += `
        <span class="atributo-nome">${capitalizar(chave)}</span>
        <span class="atributo-valor barra">${valor[0]} / ${valor[1]}</span>`;
    } else {
      item.innerHTML += `
        <span class="atributo-nome">${capitalizar(chave)}</span>
        <span class="atributo-valor">${valor}</span>`;
    }

    listaEl.appendChild(item);
  }

  if (modoReordenar) {
    iniciarSortable(listaEl);
  }
}

function preencherSelectAtributos() {
  const select = document.getElementById('selecao-atributo');
  select.innerHTML = '';
  const ficha = fichas[fichaAtiva];
  Object.keys(ficha).forEach((chave) => {
    const opt = document.createElement('option');
    opt.value = chave;
    opt.textContent = capitalizar(chave);
    select.appendChild(opt);
  });
}

function gerarControlesArrays() {
  const container = document.getElementById('controles-arrays');
  if (!container) return;

  container.innerHTML = '';
  const ficha = fichas[fichaAtiva];

  Object.entries(ficha).forEach(([chave, valor]) => {
    if (!Array.isArray(valor)) return;

    const fieldset = document.createElement('fieldset');
    fieldset.innerHTML = `<legend>Alterar ${capitalizar(chave)}</legend>`;

    const input = document.createElement('input');
    input.type = 'number';
    input.id   = `entrada-${chave}`;
    input.placeholder = 'ex: -10 ou +5';

    const btn = document.createElement('button');
    btn.textContent = `Aplicar`;
    btn.onclick = () => app.alterarAtributoValor(chave, document.getElementById(`entrada-${chave}`).value);

    fieldset.appendChild(input);
    fieldset.appendChild(btn);
    container.appendChild(fieldset);
  });
}

// ─── Drag-and-drop para reordenar (API nativa HTML5) ─────────────────────────

function iniciarSortable(lista) {
  let arrastando = null;

  lista.querySelectorAll('.atributo.reordenavel').forEach(item => {
    item.setAttribute('draggable', 'true');

    item.addEventListener('dragstart', (e) => {
      arrastando = item;
      e.dataTransfer.effectAllowed = 'move';
      // Pequeno delay para o estilo ser aplicado após o ghost ser capturado
      setTimeout(() => item.classList.add('arrastando'), 0);
    });

    item.addEventListener('dragend', () => {
      item.classList.remove('arrastando');
      lista.querySelectorAll('.atributo').forEach(el => el.classList.remove('drag-over'));

      // Salva a nova ordem na ficha
      const ficha = fichas[fichaAtiva];
      const novaOrdem = [...lista.querySelectorAll('.atributo')].map(el => el.dataset.chave);
      const novaFicha = { nome: ficha['nome'] };
      novaOrdem.forEach(chave => { novaFicha[chave] = ficha[chave]; });
      fichas[fichaAtiva] = novaFicha;
      salvarFicha();

      arrastando = null;
    });

    item.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      if (item === arrastando) return;

      const rect   = item.getBoundingClientRect();
      const metade = rect.top + rect.height / 2;
      const antes  = e.clientY < metade;

      lista.querySelectorAll('.atributo').forEach(el => el.classList.remove('drag-over'));
      item.classList.add('drag-over');

      if (antes) {
        lista.insertBefore(arrastando, item);
      } else {
        lista.insertBefore(arrastando, item.nextSibling);
      }
    });

    item.addEventListener('dragleave', () => {
      item.classList.remove('drag-over');
    });

    item.addEventListener('drop', (e) => {
      e.preventDefault();
      item.classList.remove('drag-over');
    });
  });
}

// ─── Ações ────────────────────────────────────────────────────────────────────

function alterarAtributoValor(chave, valor) {
  const num = parseInt(valor, 10);
  if (isNaN(num)) { alert('Digite um número válido.'); return; }

  const ficha = fichas[fichaAtiva];
  if (Array.isArray(ficha[chave])) {
    ficha[chave][0] = Math.max(0, ficha[chave][0] + num);
  } else {
    ficha[chave] = (parseInt(ficha[chave], 10) || 0) + num;
  }
  salvarFicha();
  mostrarAtributos();
}

function abrirModalAtributo() {
  const select = document.getElementById('selecao-atributo');
  indiceAtributoSendoEditado = select.value;

  const ficha = fichas[fichaAtiva];
  const valor = ficha[indiceAtributoSendoEditado];

  document.getElementById('modal-atributo-titulo').textContent = capitalizar(indiceAtributoSendoEditado);
  document.getElementById('modal-atributo-atual').textContent  =
    'Valor atual: ' + (Array.isArray(valor) ? `${valor[0]} / ${valor[1]}` : (valor ?? '—'));

  const entrada = document.getElementById('modal-atributo-entrada');
  entrada.value = Array.isArray(valor) ? valor[0] : (valor ?? '');

  abrirModal('modal-atributo');
}

function salvarAtributo() {
  const valor = document.getElementById('modal-atributo-entrada').value.trim();
  if (valor === '') { alert('Digite um valor.'); return; }

  const ficha = fichas[fichaAtiva];
  if (Array.isArray(ficha[indiceAtributoSendoEditado])) {
    ficha[indiceAtributoSendoEditado][0] = parseInt(valor, 10) || 0;
  } else {
    ficha[indiceAtributoSendoEditado] = isNaN(valor) ? valor : parseInt(valor, 10);
  }
  salvarFicha();
  mostrarAtributos();
  fecharModal('modal-atributo');
}

function abrirModalFichaCompleta() {
  const container = document.getElementById('modal-ficha-campos');
  container.innerHTML = '';

  const ficha = fichas[fichaAtiva] || {};

  Object.keys(ficha).forEach((chave) => {
    const valor = ficha[chave];
    const label = document.createElement('label');
    label.textContent = capitalizar(chave);

    if (Array.isArray(valor)) {
      const div = document.createElement('div');
      div.className = 'campo-barra';

      const iAtual = document.createElement('input');
      iAtual.type  = 'number';
      iAtual.id    = `ficha-campo-${chave}-atual`;
      iAtual.value = valor[0];
      iAtual.placeholder = 'Atual';

      const iTotal = document.createElement('input');
      iTotal.type  = 'number';
      iTotal.id    = `ficha-campo-${chave}-total`;
      iTotal.value = valor[1];
      iTotal.placeholder = 'Total';

      div.appendChild(iAtual);
      div.appendChild(document.createTextNode(' / '));
      div.appendChild(iTotal);

      container.appendChild(label);
      container.appendChild(div);
    } else {
      const input = document.createElement('input');
      if (chave === 'nome') {
        input.type = 'text';
      } else {
        input.type = isNaN(valor) ? 'text' : 'number';
      }
      input.id    = `ficha-campo-${chave}`;
      input.value = valor ?? '';
      input.placeholder = capitalizar(chave);

      container.appendChild(label);
      container.appendChild(input);
    }
  });

  abrirModal('modal-ficha');
}

function salvarFichaCompleta() {
  const novaFicha = {};
  const ficha = fichas[fichaAtiva] || {};

  Object.keys(ficha).forEach((chave) => {
    const valor = ficha[chave];
    if (Array.isArray(valor)) {
      const iAtual = document.getElementById(`ficha-campo-${chave}-atual`);
      const iTotal = document.getElementById(`ficha-campo-${chave}-total`);
      novaFicha[chave] = [parseInt(iAtual?.value, 10) || 0, parseInt(iTotal?.value, 10) || 0];
    } else {
      const input = document.getElementById(`ficha-campo-${chave}`);
      const val = input?.value.trim() || '';
      novaFicha[chave] = isNaN(val) || val === '' ? val : parseInt(val, 10);
    }
  });

  fichas[fichaAtiva] = novaFicha;
  salvarFicha();
  gerarControlesArrays();
  mostrarAtributos();
  preencherSelectAtributos();
  fecharModal('modal-ficha');
}

function abrirModalAdicionaratributo() {
  // Limpa campos ao abrir
  document.getElementById('nome-novo-atributo').value   = '';
  document.getElementById('valor-novo-atributo').value  = '';
  document.getElementById('valor-novo-atributo-max').value = '';
  document.getElementById('atributo-novo-texto').checked = false;
  document.getElementById('atributo-novo-array').checked = false;
  document.getElementById('valor-novo-atributo').type   = 'number';
  document.getElementById('valor-novo-atributo').placeholder = 'Valor';
  document.getElementById('container-array').style.display = 'none';
  abrirModal('modal-add-atributo');
}

function adicionarAtributo() {
  const inputNome = document.getElementById('nome-novo-atributo');
  const nome = inputNome.value.trim();
  if (!nome) return;

  const eTexto = document.getElementById('atributo-novo-texto').checked;
  const eArray = document.getElementById('atributo-novo-array').checked;

  if (eTexto) {
    fichas[fichaAtiva][nome] = document.getElementById('valor-novo-atributo').value;
  } else if (eArray) {
    fichas[fichaAtiva][nome] = [
      parseInt(document.getElementById('valor-novo-atributo').value,     10) || 0,
      parseInt(document.getElementById('valor-novo-atributo-max').value, 10) || 0,
    ];
  } else {
    fichas[fichaAtiva][nome] = parseInt(document.getElementById('valor-novo-atributo').value, 10) || 0;
  }

  salvarFicha();
  gerarControlesArrays();
  mostrarAtributos();
  preencherSelectAtributos();
  fecharModal('modal-add-atributo');
}

function abrirModalRemoverAtributo() {
  const select = document.getElementById('select-remover-atributo');
  select.innerHTML = '';
  Object.keys(fichas[fichaAtiva]).forEach((chave) => {
    if (chave === 'nome') return;
    const opt = document.createElement('option');
    opt.value = chave;
    opt.textContent = capitalizar(chave);
    select.appendChild(opt);
  });
  abrirModal('modal-remover-atributo');
}

function removerAtributo() {
  const chave = document.getElementById('select-remover-atributo').value;
  if (chave && fichas[fichaAtiva][chave] !== undefined) {
    delete fichas[fichaAtiva][chave];
    salvarFicha();
    gerarControlesArrays();
    mostrarAtributos();
    preencherSelectAtributos();
    fecharModal('modal-remover-atributo');
  }
}

function toggleModoReordenar() {
  modoReordenar = !modoReordenar;
  mostrarAtributos();
}

// ─── Modais ───────────────────────────────────────────────────────────────────

function abrirModal(id)  { document.getElementById(id).hidden = false; }
function fecharModal(id) { document.getElementById(id).hidden = true;  }

document.addEventListener('click', (e) => {
  ['modal-atributo', 'modal-ficha', 'modal-add-atributo', 'modal-remover-atributo'].forEach(id => {
    const modal = document.getElementById(id);
    if (modal && !modal.hidden && e.target === modal) modal.hidden = true;
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
  abrirModalAdicionaratributo,
  adicionarAtributo,
  abrirModalRemoverAtributo,
  removerAtributo,
  toggleModoReordenar,
};

(function init() {
  const fichaExiste = carregarFicha();
  if (!fichaExiste || !fichas[fichaAtiva]) {
    abrirModalFichaCompleta();
  } else {
    preencherSelectAtributos();
    gerarControlesArrays();
    mostrarAtributos();
  }
})();
