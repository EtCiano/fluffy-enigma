const indiceAtual = appFichas.fichaAtiva;
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