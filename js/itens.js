const gridItens = document.getElementById('grid-itens');
const STORAGE_KEY_ITENS = 'itens'

// ─── Estado ───────────────────────────────────────────────────────────────────

let indiceAtual = 0;

setInterval(() => {
  if (typeof state !== 'undefined' && indiceAtual !== state.fichaAtiva) {
    indiceAtual = state.fichaAtiva;
    if (itens[indiceAtual] === undefined) {
      itens[indiceAtual] = [];
    }
    mostrarItens();
  }
}, 100);

let itens = [
    []
]

let cores = {
    'padrao': 'white',
    'azul': 'rgba(0, 0, 255, 0.5)',
    'verde': 'rgba(0, 255, 0, 0.5)',
    'vermelho': 'rgba(255, 0, 0, 0.5)',
    'roxo': 'rgba(128, 0, 128, 0.5)',
    'amarelo': 'rgba(255, 255, 0, 0.5)',
    'laranja': 'rgba(255, 165, 0, 0.5)',
    'rosa': 'rgba(255, 192, 203, 0.5)',
    'ciano': 'rgba(0, 255, 255, 0.5)',
    'magenta': 'rgba(255, 0, 255, 0.5)',
    'marrom': 'rgba(139, 69, 19, 0.5)',
    'cinza': 'rgba(128, 128, 128, 0.5)',
    'dourado': 'rgba(255, 215, 0, 0.5)',
    'prateado': 'rgba(192, 192, 192, 0.5)',
    'verde-escuro': 'rgba(0, 100, 0, 0.5)',
    'azul-escuro': 'rgba(0, 0, 139, 0.5)',
    'vermelho-escuro': 'rgba(139, 0, 0, 0.5)'
}

let indiceItemArrastando = null;
let indiceItemVisivel = null;

// ─── Persistência ─────────────────────────────────────────────────────────────

function salvarItens() {
    localStorage.setItem(STORAGE_KEY_ITENS, JSON.stringify(itens));
}

function carregarItens() {
  const salvo = localStorage.getItem(STORAGE_KEY_ITENS);
  if (salvo) {
    itens = JSON.parse(salvo);
    return true;
  }
  return false;
}

function mudarItensFicha() {
    if (indiceAtual > itens.length - 1) {
        itens.push([])
    }
    mostrarItens()
    salvarItens()
}

// ─── Interceptar troca de ficha ───────────────────────────────────────────────

['fichaAnterior', 'proximaFicha', 'criarFicha', 'deletarFicha', 'importarFicha'].forEach(nome => {
    const original = appFichas[nome];
    if (typeof original !== 'function') return;
    appFichas[nome] = function(...args) {
        const result = original.apply(this, args);
        const novoIndice = appFichas.fichaAtiva;
        if (novoIndice !== indiceAtual) {
            indiceAtual = novoIndice;
            setTimeout(() => mudarItensFicha(), 0);
        }
        return result;
    };
});



// ─── Ações ────────────────────────────────────────────────────────────────────

let detalhesItem = [];
let detalhesContainer = null;

function popularCores(idSelect) {
    const select = document.getElementById(idSelect);
    select.innerHTML = '';
    Object.entries(cores).forEach(([chave]) => {
        const option = document.createElement('option');
        option.value = chave;
        option.textContent = chave;
        select.appendChild(option);
    });
}

function abrirModalAdicionarItem() {
    document.getElementById('item-nome').value = '';
    document.getElementById('item-valor').value = '';
    document.getElementById('item-tipo').value = '';
    document.getElementById('detalhes-item').innerHTML = '';
    popularCores('item-cor');
    document.getElementById('item-cor').value = 'padrao';
    detalhesItem = [];
    detalhesContainer = document.getElementById('detalhes-item');
    abrirModal('modal-adicionar-item');
}

function salvarItem() {
    const nome = document.getElementById('item-nome').value.trim();
    if (!nome) { alert('Digite um nome para o item.'); return; }

    const item = {
        nome: nome,
        valor: parseFloat(document.getElementById('item-valor').value) || 0,
        tipo: document.getElementById('item-tipo').value,
        cor: document.getElementById('item-cor').value
    };

    detalhesItem.forEach(chave => {
        const input = document.getElementById(`detalhe-${idParaNome(chave)}`);
        item[chave] = input ? input.value : '';
    });

    itens[indiceAtual].push(item);
    salvarItens();
    mostrarItens();
    fecharModal('modal-adicionar-item');
}

function abrirModalNovoDetalhe() {
    document.getElementById('novo-detalhe-nome').value = '';
    abrirModal('modal-novo-detalhe');
}

function adicionarDetalhe() {
    const nome = document.getElementById('novo-detalhe-nome').value.trim();
    if (!nome) { alert('Digite um nome para o detalhe.'); return; }

    const jaExiste = detalhesItem.some(d => d.toLowerCase() === nome.toLowerCase());
    if (jaExiste) { alert('Este detalhe já foi adicionado.'); return; }

    detalhesItem.push(nome);

    const div = document.createElement('div');
    div.className = 'detalhe-item';
    const id = `detalhe-${idParaNome(nome)}`;
    div.innerHTML = `
        <div class="detalhe-item-header">
            <label for="${id}">${nome}</label>
            <button type="button" class="btn-remover-detalhe">×</button>
        </div>
        <input type="text" id="${id}" placeholder="${nome}">
    `;
    div.querySelector('.btn-remover-detalhe').onclick = () => removerDetalhe(nome);

    detalhesContainer.appendChild(div);

    fecharModal('modal-novo-detalhe');
    document.getElementById(id).focus();
}

function idParaNome(str) {
    return str.replace(/[^a-zA-Z0-9À-ÿ]/g, '_');
}

function removerDetalhe(nome) {
    const idx = detalhesItem.indexOf(nome);
    if (idx !== -1) detalhesItem.splice(idx, 1);

    const input = document.getElementById(`detalhe-${idParaNome(nome)}`);
    if (input) {
        const div = input.closest('.detalhe-item');
        if (div) div.remove();
    }
}

const chavesBase = ['nome', 'valor', 'tipo', 'cor'];

function abrirModalModificarItem() {
    if (indiceItemVisivel === null) return;

    const item = itens[indiceAtual][indiceItemVisivel];

    document.getElementById('item-nome-modificar').value = item['nome'] || '';
    document.getElementById('item-valor-modificar').value = item['valor'] ?? '';
    document.getElementById('item-tipo-modificar').value = item['tipo'] || '';
    popularCores('item-cor-modificar');
    document.getElementById('item-cor-modificar').value = item['cor'] || 'padrao';

    const container = document.getElementById('detalhes-item-modificar');
    container.innerHTML = '';
    detalhesItem = [];
    detalhesContainer = container;

    Object.entries(item).forEach(([chave, valor]) => {
        if (chavesBase.includes(chave)) return;
        detalhesItem.push(chave);
        const div = document.createElement('div');
        div.className = 'detalhe-item';
        const id = `detalhe-${idParaNome(chave)}`;
        div.innerHTML = `
            <div class="detalhe-item-header">
                <label for="${id}">${chave}</label>
                <button type="button" class="btn-remover-detalhe">×</button>
            </div>
            <input type="text" id="${id}" placeholder="${chave}" value="${String(valor ?? '')}">
        `;
        div.querySelector('.btn-remover-detalhe').onclick = () => removerDetalhe(chave);
        container.appendChild(div);
    });

    document.getElementById('descricao-item').hidden = true;
    abrirModal('modal-modificar-item');
}

function salvarModificarItem() {
    if (indiceItemVisivel === null) return;

    const nome = document.getElementById('item-nome-modificar').value.trim();
    if (!nome) { alert('Digite um nome para o item.'); return; }

    const item = {
        nome: nome,
        valor: document.getElementById('item-valor-modificar').value,
        tipo: document.getElementById('item-tipo-modificar').value,
        cor: document.getElementById('item-cor-modificar').value
    };

    detalhesItem.forEach(chave => {
        const input = document.getElementById(`detalhe-${idParaNome(chave)}`);
        item[chave] = input ? input.value : '';
    });

    itens[indiceAtual][indiceItemVisivel] = item;
    salvarItens();
    mostrarItens();
    fecharModal('modal-modificar-item');
}

function deletarItem() {
    if (indiceItemVisivel === null) return;

    itens[indiceAtual].splice(indiceItemVisivel, 1);
    indiceItemVisivel = null;
    salvarItens();
    mostrarItens();
    document.getElementById('descricao-item').hidden = true;
}

// ─── Drag-and-drop para reordenar (API nativa HTML5) ─────────────────────────

function aoArrastar(e) {
    const div = e.target.closest('.itens');
    indiceItemArrastando = parseInt(div.dataset.indice);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', '');
    setTimeout(() => div.classList.add('arrastando'), 0);
}

function aoPararArrastar() {
    document.querySelectorAll('.itens').forEach(el => el.classList.remove('arrastando'));

    if (indiceItemArrastando === null) { mostrarItens(); return; }

    const divs = [...gridItens.querySelectorAll('.itens')];
    const novaOrdem = divs.map(d => parseInt(d.dataset.indice));
    itens[indiceAtual] = novaOrdem.map(i => itens[indiceAtual][i]);
    indiceItemArrastando = null;
    mostrarItens();
}

gridItens.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';

    const target = e.target.closest('.itens');
    if (!target || indiceItemArrastando === null) return;

    const divs = [...gridItens.querySelectorAll('.itens')];
    const posAlvo = divs.indexOf(target);
    const posFonte = divs.findIndex(d => parseInt(d.dataset.indice) === indiceItemArrastando);

    if (posAlvo === posFonte) return;

    const rect = target.getBoundingClientRect();
    const antes = e.clientX - rect.left < rect.width / 2;

    const elFonte = gridItens.children[posFonte];

    antes
        ? gridItens.insertBefore(elFonte, target)
        : gridItens.insertBefore(elFonte, target.nextSibling);
});

gridItens.addEventListener('dragenter', (e) => e.preventDefault());

// ─── Renderização ─────────────────────────────────────────────────────────────

function mostrarDescricao(indiceItem, event) {
    console.log(indiceItem, itens[indiceAtual][indiceItem]);

    indiceItemVisivel = indiceItem;

    const descDiv = document.getElementById('descricao-item');
    const desc = document.getElementById('descricao-item-interna');

    const item = itens[indiceAtual][indiceItem];

    let conteudoHTML = '';
    Object.entries(item).forEach(([chave, valor]) => {
        conteudoHTML += `<div><strong>${chave}:</strong> ${valor}</div>`;
    });
    desc.innerHTML = conteudoHTML;

    descDiv.style.left = `${event.pageX}px`;
    descDiv.style.top = `${event.pageY - 10}px`;
    descDiv.hidden = false;
}

function mostrarItens() {
    gridItens.innerHTML = '';

    itens[indiceAtual].forEach((item, idx) => {
        const divItem = document.createElement('div');
        divItem.className = 'itens';
        divItem.style.backgroundColor = item['cor'] ? cores[item['cor']] : cores['padrao'];
        divItem.draggable = true;
        divItem.dataset.indice = idx;
        divItem.textContent = item['nome'];

        divItem.addEventListener('dragstart', aoArrastar);
        divItem.addEventListener('dragend', aoPararArrastar);
        divItem.addEventListener('click', (e) => mostrarDescricao(idx, e));

        gridItens.appendChild(divItem);
    });
}

// ─── Modais ───────────────────────────────────────────────────────────────────

function abrirModal(id)  { document.getElementById(id).hidden = false; }
function fecharModal(id) { document.getElementById(id).hidden = true;  }

document.addEventListener('click', (e) => {
    const desc = document.getElementById('descricao-item');
    if (!desc.hidden && !desc.contains(e.target) && !e.target.closest('.itens')) {
        desc.hidden = true;
    }

    ['modal-adicionar-item', 'modal-novo-detalhe', 'modal-modificar-item'].forEach(id => {
        const modal = document.getElementById(id);
        if (modal && !modal.hidden && e.target === modal) modal.hidden = true;
    });
});

const appItens = {
    mostrarItens,
    mostrarDescricao,
    abrirModalAdicionarItem,
    salvarItem,
    abrirModalNovoDetalhe,
    adicionarDetalhe,
    removerDetalhe,
    fecharModal,
    deletarItem,
    abrirModalModificarItem,
    salvarModificarItem
}

const ItensExiste = carregarItens();
mostrarItens();