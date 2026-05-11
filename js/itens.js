const indiceAtual = appFichas.fichaAtiva;
const gridItens = document.getElementById('grid-itens');
// const fichaAtual = appFichas.fichas[appFichas.fichaAtiva]; // não necessário até agora

let itens = {
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

let categorias = {
    'consumiveis': ['nome', 'tipo', 'efeito', 'quantidade'],
    'tesouros': ['nome', 'tipo', 'valor', 'peso'],
    'armas': ['nome', 'tipo', 'dano', 'peso'],
    'equipamentos': ['nome', 'tipo', 'bonus', 'peso']
}


Object.entries(itens).forEach(([chave, valor]) => {
    const divCategoria = document.createElement('div');
    divCategoria.classList.add('categoria-itens');
    gridItens.appendChild(divCategoria);
    divCategoria.innerHTML = `<h3>${chave}</h3>`;

    const gridCategoria = document.createElement('div');
    gridCategoria.classList.add('grid-categoria');
    divCategoria.appendChild(gridCategoria);

    gridCategoria.style.gridTemplateColumns = `repeat(${categorias[chave].length}, 1fr)`
    
    categorias[chave].forEach((nomeChave) => { // Cabeçalho
        const divCabecalho = document.createElement('div');
        divCabecalho.classList.add('itens', 'cabecalho');
        gridCategoria.appendChild(divCabecalho);
        divCabecalho.innerHTML = `<strong>${nomeChave}</strong>`;
    });

    valor.forEach((item, indice) => {
        Object.entries(item).forEach(([chaveItem, valorItem]) => {
            const divItem = document.createElement('div');
            divItem.classList.add('itens');
            gridCategoria.appendChild(divItem);
            divItem.innerHTML = `${valorItem}`;
        });
    });
});
