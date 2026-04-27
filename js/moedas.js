const quantidade = document.getElementById('inputmoeda');
const moedainicial = document.getElementById('moedainicial');
const moedafinal = document.getElementById('moedafinal');
const convertermoeda = document.getElementById('convertermoeda');

convertermoeda.addEventListener('click', () => {
    const valor = parseFloat(quantidade.value);
    if (isNaN(valor) || valor < 0) {
        alert('Por favor, insira uma quantidade válida.');
        return;
    }
    const taxas = {
        'PP': 10,   // 1 PP = 10 GP
        'GP': 1,    // 1 GP = 1 GP
        'EP': 0.5,  // 1 EP = 0.5 GP
        'SP': 0.1,  // 1 SP = 0.1 GP
        'CP': 0.01  // 1 CP = 0.01 GP
    };
    const valorEmGP = valor * taxas[moedainicial.value];
    const valorConvertido = valorEmGP / taxas[moedafinal.value];
    const resultadoElemento = document.querySelector('.resultadoconversao');
    resultadoElemento.textContent = `${valor} ${moedainicial.options[moedainicial.selectedIndex].text} = ${valorConvertido.toFixed(2)} ${moedafinal.options[moedafinal.selectedIndex].text}`;
});