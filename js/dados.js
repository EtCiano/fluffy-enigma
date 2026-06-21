// ─── Dados ────────────────────────────────────────────────────────────────────

function rolarDado(lados) {
  const quantidade = parseInt(document.getElementById('quantidade-dados').value) || 1;
  const modificador = parseInt(document.getElementById('modificador').value) || 0;
  const normal = document.getElementById('normal').checked;
  const vantagem = document.getElementById('vantagem').checked;
  const desvantagem = document.getElementById('desvantagem').checked;
  const resultado = document.getElementById('resultado');
  const historico = document.getElementById('historico-dados')
  
  let roladas = [];

  let total = 0;

  const quantidadeParaLoop = quantidade === 1? quantidade + 1 : quantidade

  if (normal) {
    for (let i = 0; i < quantidade; i++) {
      let dadoAtual = Math.floor(Math.random() * lados) + 1;
      roladas.push(dadoAtual)
      total += dadoAtual;
    }
    resultado.textContent = total + modificador;
  } else if (vantagem) {
    roladas = [];
    for (let i = 0; i < quantidadeParaLoop; i++) {
      let dadoAtual = Math.floor(Math.random() * lados) + 1;
      roladas.push(dadoAtual)
    }

    total = Math.max(...roladas);
  } else if (desvantagem) {
    roladas = [];
    for (let i = 0; i < quantidadeParaLoop; i++) {
      let dadoAtual = Math.floor(Math.random() * lados) + 1;
      roladas.push(dadoAtual)
    }

    total = Math.min(...roladas);
  }
  
  resultado.textContent = total + modificador;

  const dadoHistorico = document.createElement('div');

  console.log(roladas)
  if (roladas.length === 1) {
    dadoHistorico.innerHTML = total;
  } else {
    dadoHistorico.innerHTML = normal ? `${total} <span class="dado-cinza">(${roladas.join('+')})</span>` : `${total} <span class="dado-cinza">(${roladas.join(' , ')})</span>`;
  }
  dadoHistorico.classList.add('dado-no-historico');
  historico.append(dadoHistorico)
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
