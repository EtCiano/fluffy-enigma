const normal = document.getElementById('normal');
const vantagem = document.getElementById('vantagem');
const desvantagem = document.getElementById('desvantagem');

const dados = [];
for (let i = 1; i <= 7; i++) {
    const dado = document.getElementById(`dados${i}`);
    dados.push(dado);
}
const input1 = document.getElementById('quantidade-dados');
const input2 = document.getElementById('modificador');
const resultado = document.getElementById('resultado');

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
            resultado.textContent = total;
            return;
        }
        else if (vantagem.checked) {
            let roladas = []
            for (let i = 0; i < quantidade; i++) {
                const roll = Math.floor(Math.random() * lados) + 1;
                roladas.push(roll)
            }
            resultado_vantagem = Math.max(...roladas)
            resultado.textContent = resultado_vantagem;
            return;
        }
        else if (desvantagem.checked) {
            let roladas = []
            for (let i = 0; i < quantidade; i++) {
                const roll = Math.floor(Math.random() * lados) + 1;
                roladas.push(roll)
            }
            resultado_vantagem = Math.min(...roladas)
            resultado.textContent = resultado_vantagem;
            return;
        }
    });
});
