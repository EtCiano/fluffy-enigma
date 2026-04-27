const canvas = document.getElementById('fundo');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const rects = [];
for (let i = 0; i < 50; i++) {
    const size = Math.random() * 250 + 20;
    rects.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5),
        vy: (Math.random() - 0.5),
        size: size,
        color: `rgba(0, 0, 0, ${Math.random() * 0.1 + 0.1})`
    });
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    rects.forEach(rect => {
        rect.x += rect.vx;
        rect.y += rect.vy;

        if (rect.x < -rect.size) rect.x = canvas.width;
        if (rect.x > canvas.width) rect.x = -rect.size;
        if (rect.y < -rect.size) rect.y = canvas.height;
        if (rect.y > canvas.height) rect.y = -rect.size;

        ctx.fillStyle = rect.color;
        ctx.fillRect(rect.x, rect.y, rect.size, rect.size);
    });
    requestAnimationFrame(animate);
}
animate();