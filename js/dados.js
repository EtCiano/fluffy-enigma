// ─── Dados ────────────────────────────────────────────────────────────────────

function rolarDado(lados) {
  const quantidade = parseInt(document.getElementById('quantidade-dados').value) || 1;
  const modificador = parseInt(document.getElementById('modificador').value) || 0;
  const normal = document.getElementById('normal').checked;
  const vantagem = document.getElementById('vantagem').checked;
  const desvantagem = document.getElementById('desvantagem').checked;
  const resultado = document.getElementById('resultado');

  if (normal) {
    let total = 0;
    for (let i = 0; i < quantidade; i++) {
      total += Math.floor(Math.random() * lados) + 1;
    }
    resultado.textContent = total + modificador;
  } else if (vantagem) {
    let roladas = [];
    for (let i = 0; i < quantidade; i++) {
      roladas.push(Math.floor(Math.random() * lados) + 1);
    }
    resultado.textContent = Math.max(...roladas) + modificador;
  } else if (desvantagem) {
    let roladas = [];
    for (let i = 0; i < quantidade; i++) {
      roladas.push(Math.floor(Math.random() * lados) + 1);
    }
    resultado.textContent = Math.min(...roladas) + modificador;
  }
}

const appDados = {
  rolarDado
};

(function init() {
  const dados = [
    { id: 'dados1', lados: 3 },
    { id: 'dados2', lados: 6 },
    { id: 'dados3', lados: 8 },
    { id: 'dados4', lados: 10 },
    { id: 'dados5', lados: 12 },
    { id: 'dados6', lados: 20 },
    { id: 'dados7', lados: 100 }
  ];

  dados.forEach(dado => {
    const btn = document.getElementById(dado.id);
    if (btn) {
      btn.onclick = () => appDados.rolarDado(dado.lados);
    }
  });
})();
