const canvas = document.getElementById('fundo');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const numRects = 30; 
let time = 0;

function calcularXPadrao() {
  const frameControles = document.getElementById('frame-controles');
  if (frameControles) {
    const rect = frameControles.getBoundingClientRect();
    return rect.left + (frameControles.offsetWidth/2);
  }
  return canvas.width - 450;
}

let xPadrao = calcularXPadrao();

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const rectHeight = canvas.height / numRects ;
    
    for (let i = 0; i < numRects; i++) {
        const offset = Math.sin(time + i * 0.3) * 100;
        const y = i * rectHeight;
        
        ctx.fillStyle = `rgba(0, 0, 0, 0.5)`;
        ctx.fillRect(xPadrao + offset, y, 200, rectHeight);
    }
    
    time += 0.05;
    requestAnimationFrame(animate);
}

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  xPadrao = calcularXPadrao();
});

animate();
