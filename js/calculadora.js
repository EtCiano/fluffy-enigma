const input = document.getElementById('tela-calculadora')

function addCalc(operador) {
    input.value += operador;
}

function tirarCalc() {
    input.value = input.value.slice(0, -1);
}

function limparCalc() {
    input.value = "";
}

function executarCalc() {
    try {
        const expressao = input.value;
        if (!/^[0-9+\-*/.()\s]+$/.test(expressao)) {
            alert('Erro: A expressão contém caracteres inválidos!');
            return;
        }
        let resultado = eval(expressao);
        input.value = resultado;
    } catch (error) {
        alert('Erro: Expressão matemática inválida!');
    }
}


const appCalc = {
    addCalc,
    tirarCalc,
    limparCalc,
    executarCalc
}