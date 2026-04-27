const tempoatual = document.getElementById('tempoatual');
const temporestante = document.getElementById('temporestante');
const mostrartempoatual = document.getElementById('mostrartempoatual');
const mostrartemporestante = document.getElementById('mostrartemporestante');
const adicionarturno = document.getElementById('adicionarturno');

tempoatual.addEventListener('change', () => {
    const valor = tempoatual.value;
    mostrartempoatual.textContent = valor ? valor : '00:00:00';
});
temporestante.addEventListener('change', () => {
    const valor = temporestante.value;
    mostrartemporestante.textContent = valor ? valor : '00:00:00';
});
adicionarturno.addEventListener('click', () => {
    let [horas, minutos, segundos] = (tempoatual.value || '00:00:00').split(':').map(Number);
    segundos += 6;
    if (segundos >= 60) {
        segundos -= 60;
        minutos += 1;
    }
    if (minutos >= 60) {
        minutos -= 60;
        horas += 1;
    }
    horas = horas % 24;
    const novoTempo = [horas, minutos, segundos].map(num => String(num).padStart(2, '0')).join(':');
    tempoatual.value = novoTempo;
    mostrartempoatual.textContent = novoTempo;

    let [restHoras, restMinutos, restSegundos] = (temporestante.value || '00:00:00').split(':').map(Number);
    restSegundos -= 6;
    if (restSegundos < 0) {
        restSegundos += 60;
        restMinutos -= 1;
    }
    if (restMinutos < 0) {
        restMinutos += 60;
        restHoras -= 1;
    }
    if (restHoras < 0) {
        restHoras = 0;
        restMinutos = 0;
        restSegundos = 0;
    }
    const novoTempoRestante = [restHoras, restMinutos, restSegundos].map(num => String(num).padStart(2, '0')).join(':');
    if (novoTempoRestante === '00:00:00') {
        mostrartemporestante.style.color = 'red';
    } else {
        mostrartemporestante.style.color = 'var(--text-color)';
    }
    temporestante.value = novoTempoRestante;
    mostrartemporestante.textContent = novoTempoRestante;
});