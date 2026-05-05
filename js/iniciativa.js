// ─── Iniciativa ───────────────────────────────────────────────────────────────

function adicionarIniciativa() {
  const iniciativaInput = document.getElementById('iniciativa-input');
  const nomeInput = document.getElementById('iniciativa-nome');
  const iniciativa = parseInt(iniciativaInput.value);
  const nome = nomeInput.value.trim();

  if (isNaN(iniciativa) || nome === '') {
    alert('Por favor, insira um valor válido para iniciativa e nome.');
    return;
  }

  const listaIniciativa = document.getElementById('lista-iniciativa');
  const novoItem = document.createElement('div');
  novoItem.className = 'item-iniciativa';
  novoItem.textContent = `${String(iniciativa).padStart(2, '0')} - ${nome}`;
  novoItem.style.padding = '5px 0 5px 10px';
  listaIniciativa.appendChild(novoItem);

  const itens = Array.from(listaIniciativa.children);
  itens.sort((a, b) => {
    const iniA = parseInt(a.textContent.split(' - ')[0]);
    const iniB = parseInt(b.textContent.split(' - ')[0]);
    return iniB - iniA;
  });

  listaIniciativa.innerHTML = '';
  itens.forEach(item => listaIniciativa.appendChild(item));

  iniciativaInput.value = '';
  nomeInput.value = '';
}

function limparIniciativa() {
  const listaIniciativa = document.getElementById('lista-iniciativa');
  const itens = Array.from(listaIniciativa.children);
  const currentIndex = itens.findIndex(item => item.classList.contains('current-turn'));
  
  if (currentIndex !== -1) {
    itens[currentIndex].remove();
  }
}

function proximoTurno() {
  const itens = Array.from(document.getElementById('lista-iniciativa').children);
  if (itens.length === 0) return;

  const currentIndex = itens.findIndex(item => item.classList.contains('current-turn'));

  if (currentIndex !== -1) {
    itens[currentIndex].classList.remove('current-turn');
  }

  const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % itens.length;
  itens[nextIndex].classList.add('current-turn');
}

const appIniciativa = {
  adicionarIniciativa,
  limparIniciativa,
  proximoTurno
};

(function init() {
  const btnAdicionar = document.getElementById('adicionar-button');
  const btnLimpar = document.getElementById('limpar-button');
  const btnProximo = document.getElementById('iniciativa-proximo-button');

  if (btnAdicionar) btnAdicionar.onclick = appIniciativa.adicionarIniciativa;
  if (btnLimpar) btnLimpar.onclick = appIniciativa.limparIniciativa;
  if (btnProximo) btnProximo.onclick = appIniciativa.proximoTurno;
})();
