const enviariniciativa = document.getElementById('enviariniciativa');
const iniciativanumber = document.getElementById('iniciativanumber');
const nomeiniciativa = document.getElementById('nomeiniciativa');
const limpariniciativa = document.getElementById('limpariniciativa');
const proximoiniciativa = document.getElementById('proximoiniciativa');
const dadoiniciativa = document.getElementById('dadoiniciativa');
const modificadoriniciativa = document.getElementById('modificadoriniciativa');

enviariniciativa.addEventListener('click', () => {
    const iniciativa = parseInt(iniciativanumber.value);
    const nome = nomeiniciativa.value.trim();
    if (isNaN(iniciativa) || nome === '') {
        alert('Por favor, insira um valor válido para iniciativa e nome.');
        return;
    }
    const listainiciativa = document.getElementById('listainiciativa');
    const novoItem = document.createElement('div');
    novoItem.className = 'iteminiciativa';
    novoItem.textContent = `${String(iniciativa).padStart(2, '0')} - ${nome}`;
    novoItem.style.padding = '5px 0 5px 10px';
    listainiciativa.appendChild(novoItem);
    const itens = Array.from(listainiciativa.children);
    itens.sort((a, b) => {
        const iniA = parseInt(a.textContent.split(' - ')[0]);
        const iniB = parseInt(b.textContent.split(' - ')[0]);
        return iniB - iniA;
    });
    listainiciativa.innerHTML = '';
    itens.forEach(item => listainiciativa.appendChild(item));
    iniciativanumber.value = '';
    nomeiniciativa.value = '';
});

limpariniciativa.addEventListener('click', () => {
    const listainiciativa = document.getElementById('listainiciativa');
    listainiciativa.innerHTML = '';
});

proximoiniciativa.addEventListener('click', () => {
    const itens = Array.from(document.getElementById('listainiciativa').children);
    if (itens.length === 0) return;
    
    const currentIndex = itens.findIndex(item => item.classList.contains('current-turn'));
    
    if (currentIndex !== -1) {
        itens[currentIndex].classList.remove('current-turn');
    }
    
    const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % itens.length;
    itens[nextIndex].classList.add('current-turn');
});

dadoiniciativa.addEventListener('click', () => {
    const roll = Math.floor(Math.random() * 20) + 1;
    const mod = parseInt(modificadoriniciativa.value) || 0;
    const total = roll + mod;
    iniciativanumber.value = total;
});