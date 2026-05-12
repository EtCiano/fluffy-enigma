const gridItens = document.getElementById('grid-itens');
const STORAGE_KEY_ITENS = 'itens'

// ─── Estado ───────────────────────────────────────────────────────────────────

const indiceAtual = appFichas.fichaAtiva;

let itens = [
    [
        {
            'nome': 'Poção de Vida',
            'tipo': 'Consumível',
            'efeito': '+20pv',
            'quantidade': 3
        },
        {
            'nome': 'Moedas',
            'tipo': 'Tesouro',
            'valor': 50,
            'peso': 0
        },
        {
            'nome': 'Espada Curta',
            'tipo': 'Arma',
            'dano': '1d6',
            'peso': 3
        },
        {
            'nome': 'Armadura de Couro',
            'tipo': 'Equipamento',
            'bonus': '+1pv',
            'peso': 5
        }
    ]
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

// ─── Ações ────────────────────────────────────────────────────────────────────

let detalhesItem = [];

function abrirModalAdicionarItem() {
    document.getElementById('item-nome').value = '';
    document.getElementById('item-valor').value = '';
    document.getElementById('item-tipo').value = '';
    document.getElementById('detalhes-item').innerHTML = '';
    const coresDestaque = document.getElementById('item-cor')
    coresDestaque.innerHTML = '';
    Object.entries(cores).forEach(([chave, valor]) => {
        const option = document.createElement('option');
        option.value = chave;
        option.textContent = chave;
        coresDestaque.appendChild(option);
    })
    coresDestaque.value = 'padrao';
    detalhesItem = [];
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

    const container = document.getElementById('detalhes-item');
    const div = document.createElement('div');
    div.className = 'detalhe-item';
    div.innerHTML = `
        <label for="detalhe-${idParaNome(nome)}">${nome}</label>
        <input type="text" id="detalhe-${idParaNome(nome)}" placeholder="${nome}">
    `;
    container.appendChild(div);

    fecharModal('modal-novo-detalhe');
    document.getElementById(`detalhe-${idParaNome(nome)}`).focus();
}

function idParaNome(str) {
    return str.replace(/[^a-zA-Z0-9À-ÿ]/g, '_');
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

    const descricaoAnterior = document.querySelector('.descricao-suspensa');
    if (descricaoAnterior) descricaoAnterior.remove();

    const divDescricao = document.createElement('div');
    divDescricao.classList.add('descricao-suspensa');

    const item = itens[indiceAtual][indiceItem];
    let conteudoHTML = '';
    Object.entries(item).forEach(([chave, valor]) => {
        conteudoHTML += `<div><strong>${chave}:</strong> ${valor}</div>`;
    });
    divDescricao.innerHTML = conteudoHTML;

    divDescricao.style.left = `${event.pageX}px`;
    divDescricao.style.top = `${event.pageY - 10}px`;

    document.body.appendChild(divDescricao);

    setTimeout(() => {
        document.addEventListener('click', function removerDescricao(e) {
            if (!divDescricao.contains(e.target)) {
                divDescricao.remove();
                document.removeEventListener('click', removerDescricao);
            }
        });
    }, 0);
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
    ['modal-adicionar-item', 'modal-novo-detalhe'].forEach(id => {
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
    fecharModal
}

const ItensExiste = carregarItens();
mostrarItens();