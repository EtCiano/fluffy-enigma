const STORAGE_KEY_FICHA = 'ficha';
const STORAGE_KEY_ORDEM = 'ordem_atributos';

// ─── Estado ───────────────────────────────────────────────────────────────────

let fichas = [
  {
    'nome': null,
    'vida': [null, null]
  }
];

let ordensAtributos = [[]];
let fichaAtiva = 0;
let indiceAtributoSendoEditado = null;
let modoReordenar = false;

// ─── Persistência ─────────────────────────────────────────────────────────────

function carregarFicha() {
  const salvo = localStorage.getItem(STORAGE_KEY_FICHA);
  if (salvo) {
    fichas = JSON.parse(salvo);
    const salvoOrdem = localStorage.getItem(STORAGE_KEY_ORDEM);
    if (salvoOrdem) {
      ordensAtributos = JSON.parse(salvoOrdem);
    } else {
      ordensAtributos = fichas.map(f => Object.keys(f).filter(k => k !== 'nome'));
    }
    return true;
  }
  return false;
}

function salvarFicha() {
  localStorage.setItem(STORAGE_KEY_FICHA, JSON.stringify(fichas));
  localStorage.setItem(STORAGE_KEY_ORDEM, JSON.stringify(ordensAtributos));
}

// ─── Renderização ─────────────────────────────────────────────────────────────

function mostrarAtributos() {
  const avisoEl = document.getElementById('aviso-vazio');
  const nomeEl  = document.getElementById('nome-personagem');
  const listaEl = document.getElementById('atributos-lista');
  const btnModoEdicao = document.getElementById('btn-modo-edicao');

  if (!fichas[fichaAtiva]) {
    avisoEl.hidden = false;
    nomeEl.textContent = '';
    listaEl.innerHTML  = '';
    return;
  }

  avisoEl.hidden = true;
  if (btnModoEdicao) {
    btnModoEdicao.textContent = modoReordenar ? '✓ Concluir Edição' : 'deletar/ordenar atributos';
    btnModoEdicao.classList.toggle('ativo', modoReordenar);
  }

  const ficha = fichas[fichaAtiva];
  nomeEl.textContent = ficha['nome'];
  listaEl.innerHTML  = '';

  const ordem = ordensAtributos[fichaAtiva] || [];
  const chaves = ordem.filter(k => ficha[k] !== undefined);
  
  for (const chave of chaves) {
    const valor = ficha[chave];

    const item = document.createElement('div');
    item.className = 'atributo' + (modoReordenar ? ' reordenavel' : '');
    item.dataset.chave = chave;

    if (Array.isArray(valor)) {
      item.innerHTML += `
        <span class="atributo-nome">${capitalizar(chave)}:</span>
        <span class="atributo-valor barra">${valor[0]} / ${valor[1]}</span>`;
    } else {
      item.innerHTML += `
        <span class="atributo-nome">${capitalizar(chave)}:</span>
        <span class="atributo-valor">${valor}</span>`;
    }

    if (modoReordenar) {
      const btnDel = document.createElement('button');
      btnDel.className = 'btn-deletar-atributo';
      btnDel.textContent = '×';
      btnDel.title = `Remover ${capitalizar(chave)}`;
      btnDel.addEventListener('click', (e) => {
        e.stopPropagation();
        delete fichas[fichaAtiva][chave];
        salvarFicha();
        gerarControlesArrays();
        preencherSelectAtributos();
        mostrarAtributos();
      });
      item.appendChild(btnDel);
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
    btn.onclick = () => appFichas.alterarAtributoValor(chave, document.getElementById(`entrada-${chave}`).value);

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

  const container = document.getElementById('modal-atributo-inputs');
  container.innerHTML = '';

  if (Array.isArray(valor)) {
    const div = document.createElement('div');
    div.className = 'campo-barra';

    const inputAtual = document.createElement('input');
    inputAtual.type = 'number';
    inputAtual.id = 'modal-atributo-entrada-atual';
    inputAtual.placeholder = 'Atual';
    inputAtual.value = valor[0];

    const inputTotal = document.createElement('input');
    inputTotal.type = 'number';
    inputTotal.id = 'modal-atributo-entrada-total';
    inputTotal.placeholder = 'Total';
    inputTotal.value = valor[1];

    div.appendChild(inputAtual);
    div.appendChild(document.createTextNode(' / '));
    div.appendChild(inputTotal);
    container.appendChild(div);
  } else {
    const input = document.createElement('input');
    input.type = 'text';
    input.id = 'modal-atributo-entrada';
    input.placeholder = 'Novo valor';
    input.value = valor ?? '';
    container.appendChild(input);
  }

  abrirModal('modal-atributo');
}

function salvarAtributo() {
  const ficha = fichas[fichaAtiva];
  
  if (Array.isArray(ficha[indiceAtributoSendoEditado])) {
    const inputAtual = document.getElementById('modal-atributo-entrada-atual');
    const inputTotal = document.getElementById('modal-atributo-entrada-total');
    
    if (!inputAtual || !inputTotal || inputAtual.value === '' || inputTotal.value === '') {
      alert('Digite valores válidos.');
      return;
    }
    
    ficha[indiceAtributoSendoEditado][0] = parseInt(inputAtual.value, 10) || 0;
    ficha[indiceAtributoSendoEditado][1] = parseInt(inputTotal.value, 10) || 0;
  } else {
    const input = document.getElementById('modal-atributo-entrada');
    const valor = input.value.trim();
    
    if (valor === '') {
      alert('Digite um valor.');
      return;
    }
    
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

function abrirModalPrimeiraVez() {
  const container = document.getElementById('modal-ficha-campos-primeira');
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

  abrirModal('modal-ficha-primeira');
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
  fecharModal('modal-ficha-primeira')
}

function abrirModalAdicionaratributo() {
  // Limpa campos ao abrir
  document.getElementById('nome-novo-atributo').value   = '';
  document.getElementById('valor-novo-atributo').value  = '';
  document.getElementById('valor-novo-atributo-atual').value = '';
  document.getElementById('valor-novo-atributo-max').value = '';
  document.getElementById('atributo-novo-texto').checked = false;
  document.getElementById('atributo-novo-array').checked = false;
  document.getElementById('valor-novo-atributo').type   = 'number';
  document.getElementById('valor-novo-atributo').placeholder = 'Valor';
  document.getElementById('container-valor').style.display = 'block';
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
      parseInt(document.getElementById('valor-novo-atributo-atual').value, 10) || 0,
      parseInt(document.getElementById('valor-novo-atributo-max').value, 10) || 0,
    ];
  } else {
    fichas[fichaAtiva][nome] = parseInt(document.getElementById('valor-novo-atributo').value, 10) || 0;
  }

  if (!ordensAtributos[fichaAtiva]) ordensAtributos[fichaAtiva] = [];
  ordensAtributos[fichaAtiva].push(nome);

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
  
  if (select.options.length === 0) {
    alert('Não há atributos para remover (exceto o nome).');
    return;
  }
  
  abrirModal('modal-remover-atributo');
}

function removerAtributo() {
  const chave = document.getElementById('select-remover-atributo').value;
  if (chave === 'nome') {
    alert('Não é possível remover o atributo "nome".');
    return;
  }
  if (chave && fichas[fichaAtiva][chave] !== undefined) {
    delete fichas[fichaAtiva][chave];
    salvarFicha();
    gerarControlesArrays();
    mostrarAtributos();
    preencherSelectAtributos();
    fecharModal('modal-remover-atributo');
  }
}

function fichaAnterior() {
  if (fichaAtiva > 0) {
    fichaAtiva--;
    preencherSelectAtributos();
    gerarControlesArrays();
    mostrarAtributos();
  } else {
    fichaAtiva = fichas.length - 1;
    preencherSelectAtributos();
    gerarControlesArrays();
    mostrarAtributos();
  }
}

function proximaFicha() {
  if (fichaAtiva < fichas.length - 1) {
    fichaAtiva++;
    preencherSelectAtributos();
    gerarControlesArrays();
    mostrarAtributos();
  } else {
    fichaAtiva = 0;
    preencherSelectAtributos();
    gerarControlesArrays();
    mostrarAtributos();
  }
}

function criarFicha() {
  fichaAtiva = fichas.length;
  fichas.push({'nome': null, 'vida': [null, null]});
  ordensAtributos.push(['vida']);
  abrirModalFichaCompleta();
}

let certeza = 0

function deletarFicha() {
  const botao = document.getElementById("botao-deletar");
  certeza++;
  if (certeza == 1) {
    botao.classList.add('botao-certeza');
    botao.innerHTML = 'Tem certeza?'
  }
  if (certeza == 2) {
    certeza = 0;
    botao.classList.remove('botao-certeza');
    botao.innerHTML = 'DELETAR'
    
    fichas.splice(fichaAtiva, 1);
    ordensAtributos.splice(fichaAtiva, 1);
    
    if (fichas.length === 0) {
      fichaAtiva = 0;
      fichas.push({'nome': '', 'vida': [0, 0]});
      ordensAtributos.push(['vida']);
      salvarFicha();
      abrirModalFichaCompleta();
    } else {
      if (fichaAtiva >= fichas.length) {
        fichaAtiva = fichas.length - 1;
      }
      salvarFicha();
      preencherSelectAtributos();
      gerarControlesArrays();
      mostrarAtributos();
    }
  }
  setTimeout(() => {
    certeza = 0;
    botao.classList.remove('botao-certeza');
    botao.innerHTML = 'DELETAR'
  }, 5000)
}

function toggleModoReordenar() {
  if (modoReordenar) {
    const lista = document.getElementById('atributos-lista');
    const novaOrdem = [...lista.querySelectorAll('.atributo')].map(el => el.dataset.chave);
    ordensAtributos[fichaAtiva] = novaOrdem;
    salvarFicha();
    preencherSelectAtributos();
    gerarControlesArrays();
  }
  modoReordenar = !modoReordenar;
  mostrarAtributos();
}

function exportarFicha() {
  const nomeArquivo = `ficha_${(fichas[fichaAtiva].nome).normalize("NFD")
                                                        .replace(/[\u0300-\u036f]/g, "")
                                                        .split(' ')
                                                        .map(palavra => palavra.charAt(0).toUpperCase() + palavra.slice(1))
                                                        .join('')}`;

  const conteudoFicha = Object.entries(fichas[fichaAtiva])
    .map(([chave, valor]) => `${chave}: ${Array.isArray(valor) ? valor.join("/") : valor}`)
    .join('\n');

  const zip = new JSZip();
  zip.file('ficha.txt', conteudoFicha);
  zip.file('itens.txt', appItens.exportarItensFicha());

  zip.generateAsync({ type: 'blob' }).then(blob => {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${nomeArquivo}.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });
}

function importarFicha() {
  const fileInput = document.getElementById('fileInput');
  fileInput.value = '';
  fileInput.click();

  fileInput.addEventListener('change', (event) => {
    const arquivo = event.target.files[0];
    if (!arquivo) return;

    const leitor = new FileReader();
    leitor.onload = (e) => {
      JSZip.loadAsync(e.target.result).then(zip => {
        const fichaPromise = zip.file('ficha.txt').async('string');
        const itensPromise = zip.file('itens.txt').async('string');
        return Promise.all([fichaPromise, itensPromise]);
      }).then(([fichaStr, itensStr]) => {
        let fichaImportada = {};
        fichaStr.split('\n').forEach(linha => {
          const partes = linha.split(':');
          const chave = partes[0].trim();
          const valor = partes.slice(1).join(':').trim();
          if (isStringInt(valor)) {
            fichaImportada[chave] = parseInt(valor, 10);
          } else if (valor.includes("/")) {
            fichaImportada[chave] = valor.split("/").map(element => parseInt(element, 10));
          } else {
            fichaImportada[chave] = valor;
          }
        });

        fichas.push(fichaImportada);
        ordensAtributos.push(Object.keys(fichaImportada).filter(k => k !== 'nome'));
        fichaAtiva = fichas.indexOf(fichaImportada);

        appItens.importarItensFicha(itensStr);

        gerarControlesArrays();
        mostrarAtributos();
        preencherSelectAtributos();
        salvarFicha();
      });
    };
    leitor.readAsArrayBuffer(arquivo);
  }, { once: true });
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

function isStringInt(str) {
  return /^-?\d+$/.test(str);
}

function debugarFicha() {
  console.log(fichas)
  console.log(fichaAtiva)
  console.log(JSON.stringify(fichas, null, 2));
}

// ─── Inicialização ────────────────────────────────────────────────────────────

const appFichas = {
  alterarAtributoValor,
  abrirModalAtributo,
  salvarAtributo,
  abrirModalFichaCompleta,
  abrirModalPrimeiraVez,
  salvarFichaCompleta,
  fecharModal,
  abrirModalAdicionaratributo,
  adicionarAtributo,
  abrirModalRemoverAtributo,
  removerAtributo,
  toggleModoReordenar,
  fichaAnterior,
  proximaFicha,
  criarFicha,
  exportarFicha,
  importarFicha,
  deletarFicha,
  get fichaAtiva() { return fichaAtiva; },
  get fichas() { return fichas; }
};

(function init() {
  const fichaExiste = carregarFicha();
  if (!fichaExiste || fichas.length === 0 || !fichas[fichaAtiva]) {
    abrirModalPrimeiraVez();
  } else {
    preencherSelectAtributos();
    gerarControlesArrays();
    mostrarAtributos();
  }
})();
