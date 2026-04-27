const normal = document.getElementById('normal');
const vantagem = document.getElementById('vantagem');
const desvantagem = document.getElementById('desvantagem');

const dados = [];
for (let i = 1; i <= 7; i++) {
    const dado = document.getElementById(`dado${i}`);
    dados.push(dado);
}
const input1 = document.getElementById('input');
const input2 = document.getElementById('modificador');
const resultados = [];
for (let i = 1; i <= 7; i++) {
    const resultado = document.getElementById(`resultado${i}`);
    resultados.push(resultado);
}

dados.forEach((dado, index) => {
    dado.addEventListener('click', () => {
        const quantidade = input1.value || 1;
        let lados;
        switch (index) {
            case 0: lados = 4; break;
            case 1: lados = 6; break;
            case 2: lados = 8; break;
            case 3: lados = 10; break;
            case 4: lados = 12; break;
            case 5: lados = 20; break;
            case 6: lados = 100; break;
        }
        if (normal.checked) {
            let total = 0;
            for (let i = 0; i < quantidade; i++) {
                total += (Math.floor(Math.random() * lados) + 1 + (parseInt(input2.value) || 0));
            }
            resultados[index].textContent = total;
            return;
        }
        else if (vantagem.checked) {
            let total = 0;
            for (let i = 0; i < quantidade; i++) {
                const roll1 = Math.floor(Math.random() * lados) + 1;
                const roll2 = Math.floor(Math.random() * lados) + 1;
                total += (Math.max(roll1, roll2) + (parseInt(input2.value) || 0));
            }
            resultados[index].textContent = total;
            return;
        }
        else if (desvantagem.checked) {
            let total = 0;
            for (let i = 0; i < quantidade; i++) {
                const roll1 = Math.floor(Math.random() * lados) + 1;
                const roll2 = Math.floor(Math.random() * lados) + 1;
                total += (Math.min(roll1, roll2) + (parseInt(input2.value) || 0));
            }
            resultados[index].textContent = total;
            return;
        }
    });
});
