const indiceAtual = appFichas.fichaAtiva;
const gridItens = document.getElementById('grid-itens');
// const fichaAtual = appFichas.fichas[appFichas.fichaAtiva]; // não necessário até agora

let itens = [
        {
        'consumiveis': [
            {
                'nome': 'Poção de Vida',
                'tipo': 'Consumível',
                'efeito': '+20pv',
                'quantidade': 3
            }
        ],
        'tesouros': [
            {
                'nome': 'Moedas',
                'tipo': 'Tesouro',
                'valor': 50,
                'peso': 0
            }
        ],
        'armas': [
            {
                'nome': 'Espada Curta',
                'tipo': 'Arma',
                'dano': '1d6',
                'peso': 3
            }
        ],
        'equipamentos': [
            {
                'nome': 'Armadura de Couro',
                'tipo': 'Equipamento',
                'bonus': '+1pv',
                'peso': 5
            }
        ]
    }
]

// let categorias = {
//     'consumiveis': ['nome', 'tipo', 'efeito', 'quantidade'],
//     'tesouros': ['nome', 'tipo', 'valor', 'peso'],
//     'armas': ['nome', 'tipo', 'dano', 'peso'],
//     'equipamentos': ['nome', 'tipo', 'bonus', 'peso']
// }

// let itensDiv = []

function mostrarItens() {
    itens.forEach((ficha, indice) => {
        Object.entries(ficha).forEach(([categoria, itensCategoria]) => {
            itensCategoria.forEach((item, indice) => {
                    const divItem = document.createElement('div');
                    divItem.classList.add('itens');
                    gridItens.appendChild(divItem);
                    divItem.innerHTML = `${item['nome']}`;
                    // itensDiv.push(divItem);
                    divItem.onclick = (event) => mostrarDescricao(categoria, indice, event)
            });
        });
    });
}

function mostrarDescricao(categoria, indice, event) {
    console.log(categoria, indice, itens[indiceAtual][categoria][indice]);
    
    const descricaoAnterior = document.querySelector('.descricao-suspensa');
    if (descricaoAnterior) descricaoAnterior.remove();
    
    const divDescricao = document.createElement('div');
    divDescricao.classList.add('descricao-suspensa');
    
    const item = itens[indiceAtual][categoria][indice];
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


const appItens = {
    mostrarItens,
    mostrarDescricao
}

mostrarItens();