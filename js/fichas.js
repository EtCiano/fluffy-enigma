const STORAGE_KEY = 'ficha';

// ─── Estado ───────────────────────────────────────────────────────────────────

let fichas = [
  {
    'nome': "Taiyo Suki",
    'vida': [60, 60],
    'sanidade': [22, 50],
    'esgrima': 21,
    'inteligencia': 13,
    'resistencia': 12,
    'reflexos': 16,
    'agilidade': 15,
    'regeneração': 10,
    'força': 12,
    'velocidade': 13,
    'energia': 13,
    'precisão': 11,
    'furtividade': 11
  }
]
let fichaAtiva = 0
let indiceAtributoSendoEditado = null;

// ─── Persistência (localStorage) ─────────────────────────────────────────────

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
  const nomeEl = document.getElementById('nome-personagem');
  const listaEl = document.getElementById('atributos-lista');

  if (!fichas[fichaAtiva]) {
    avisoEl.hidden = false;
    nomeEl.textContent = '';
    listaEl.innerHTML = '';
    return;
  }

  avisoEl.hidden = true;

  const ficha = fichas[fichaAtiva];
  nomeEl.textContent = ficha['nome'];

  listaEl.innerHTML = '';

  for (const [chave, valor] of Object.entries(ficha)) {
    if (chave === 'nome') continue;
    const p = document.createElement('p');
    p.dataset.chave = chave;

    if (Array.isArray(valor)) {
      p.className = 'atributo atributo-barra';
      p.innerHTML =
        `<span class="atributo-nome">${capitalizar(chave)}</span>` +
        `<span class="atributo-valor">${valor[0]} / ${valor[1]}</span>`;
    } else {
      p.className = 'atributo';
      p.innerHTML =
        `<span class="atributo-nome">${capitalizar(chave)}</span>` +
        `<span class="atributo-valor">${valor}</span>`;
    }

    listaEl.appendChild(p);
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
    if (Array.isArray(valor)) {
      const fieldset = document.createElement('fieldset');
      const legend = document.createElement('legend');
      legend.textContent = `Alterar ${capitalizar(chave)}`;
      
      const input = document.createElement('input');
      input.type = 'number';
      input.id = `entrada-${chave}`;
      input.placeholder = 'Valor (ex: -10 ou +5)';
      
      const button = document.createElement('button');
      button.textContent = `Mudar ${capitalizar(chave)}`;
      button.onclick = () => {
        app.alterarAtributoValor(chave, document.getElementById(`entrada-${chave}`).value);
      };
      
      fieldset.appendChild(legend);
      fieldset.appendChild(input);
      fieldset.appendChild(button);
      container.appendChild(fieldset);
    }
  });
}

// ─── Ações ────────────────────────────────────────────────────────────────────

function alterarAtributoValor(chave, valor) {
  const num = parseInt(valor, 10);
  if (isNaN(num)) {
    alert('Digite um número válido.');
    return;
  }
  const ficha = fichas[fichaAtiva];
  if (Array.isArray(ficha[chave])) {
    ficha[chave][0] = Math.max(0, ficha[chave][0] + num);
  } else {
    const atual = parseInt(ficha[chave], 10) || 0;
    ficha[chave] = atual + num;
  }
  salvarFicha();
  mostrarAtributos();
}

function abrirModalAtributo() {
  const select = document.getElementById('selecao-atributo');
  indiceAtributoSendoEditado = select.value;

  const ficha = fichas[fichaAtiva];
  const valor = ficha[indiceAtributoSendoEditado];

  document.getElementById('modal-atributo-titulo').textContent =
    capitalizar(indiceAtributoSendoEditado);
  
  let valorAtual = '—';
  if (Array.isArray(valor)) {
    valorAtual = `${valor[0]} / ${valor[1]}`;
  } else if (valor !== undefined) {
    valorAtual = valor;
  }
  
  document.getElementById('modal-atributo-atual').textContent =
    'Valor atual: ' + valorAtual;

  const entrada = document.getElementById('modal-atributo-entrada');
  entrada.value = Array.isArray(valor) ? valor[0] : (valor ?? '');

  abrirModal('modal-atributo');
}

function salvarAtributo() {
  const valor = document.getElementById('modal-atributo-entrada').value.trim();
  if (valor === '') {
    alert('Digite um valor.');
    return;
  }
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
    label.htmlFor = `ficha-campo-${chave}`;

    if (Array.isArray(valor)) {
      const divBarra = document.createElement('div');
      const inputAtual = document.createElement('input');
      inputAtual.type = 'number';
      inputAtual.id = `ficha-campo-${chave}-atual`;
      inputAtual.placeholder = 'Atual';
      inputAtual.value = valor[0];
      
      const inputTotal = document.createElement('input');
      inputTotal.type = 'number';
      inputTotal.id = `ficha-campo-${chave}-total`;
      inputTotal.placeholder = 'Total';
      inputTotal.value = valor[1];

      divBarra.appendChild(inputAtual);
      divBarra.appendChild(document.createTextNode(' / '));
      divBarra.appendChild(inputTotal);

      container.appendChild(label);
      container.appendChild(divBarra);
    } else {
      const input = document.createElement('input');
      input.type = isNaN(valor) ? 'text' : 'number';
      input.id = `ficha-campo-${chave}`;
      input.placeholder = capitalizar(chave);
      input.value = valor ?? '';

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
      const inputAtual = document.getElementById(`ficha-campo-${chave}-atual`);
      const inputTotal = document.getElementById(`ficha-campo-${chave}-total`);
      novaFicha[chave] = [
        parseInt(inputAtual?.value, 10) || 0,
        parseInt(inputTotal?.value, 10) || 0
      ];
    } else {
      const input = document.getElementById(`ficha-campo-${chave}`);
      const val = input?.value.trim() || '';
      novaFicha[chave] = isNaN(val) ? val : parseInt(val, 10);
    }
  });
  
  fichas[fichaAtiva] = novaFicha;
  salvarFicha();
  gerarControlesArrays();
  mostrarAtributos();
  fecharModal('modal-ficha');
}

function abrirModalAdicionaratributo() {
  abrirModal('modal-add-atributo');
}

function adicionarAtributo() {
  inputNome = document.getElementById('nome-novo-atributo')
  nome = inputNome.value.trim()

  atributoTexto = document.getElementById('atributo-novo-texto')
  eTexto = atributoTexto.checked

  atributoArray = document.getElementById('atributo-novo-array')
  eArray = atributoArray.checked

  if (nome) {
    if (eTexto) {
      fichas[fichaAtiva][nome] = document.getElementById('valor-novo-atributo').value
    } else if (eArray) {
      fichas[fichaAtiva][nome] = [
        parseInt(document.getElementById('valor-novo-atributo').value, 10) || 0,
        parseInt(document.getElementById('valor-novo-atributo-max').value, 10) || 0
      ]
    } else {
      fichas[fichaAtiva][nome] = parseInt(document.getElementById('valor-novo-atributo').value, 10) || 0
    }
    
    salvarFicha();
    gerarControlesArrays();
    mostrarAtributos();
    preencherSelectAtributos();
    fecharModal('modal-add-atributo');
    inputNome.value = ''
  }
}

function abrirModalRemoverAtributo() {
  const select = document.getElementById('select-remover-atributo');
  select.innerHTML = '';
  const ficha = fichas[fichaAtiva];
  
  Object.keys(ficha).forEach((chave) => {
    if (chave !== 'nome') {
      const opt = document.createElement('option');
      opt.value = chave;
      opt.textContent = capitalizar(chave);
      select.appendChild(opt);
    }
  });
  
  abrirModal('modal-remover-atributo');
}

function removerAtributo() {
  const select = document.getElementById('select-remover-atributo');
  const chave = select.value;
  
  if (chave && fichas[fichaAtiva][chave] !== undefined) {
    delete fichas[fichaAtiva][chave];
    salvarFicha();
    gerarControlesArrays();
    mostrarAtributos();
    preencherSelectAtributos();
    fecharModal('modal-remover-atributo');
  }
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
  abrirModalAdicionaratributo,
  adicionarAtributo,
  abrirModalRemoverAtributo,
  removerAtributo
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
