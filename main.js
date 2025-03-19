const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');

// Pseudocódigo:
// 1. Configurar el canvas para que ocupe toda la ventana
// 2. Dibujar un rectángulo vertical que contendrá el póster
// 3. Dibujar las letras de fondo "SLEEPLESS" en 8 filas con gamas distintas de rojo
// 4. Crear un círculo invisible que invierta los colores de las letras según el movimiento del mouse
// 5. Mostrar la información del evento en la esquina inferior izquierda
// 6. Manejar eventos de mouse y teclado

let colors = ['#FF0000', '#FF3333', '#FF6666', '#FF9999', '#FFCCCC', '#FF6666', '#FF3333', '#FF0000'];
const originalColors = [...colors];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    drawFigures();
}

function drawFigures() {
    // Limpiar el canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dibujar el rectángulo vertical
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Dibujar las letras de fondo "SLEEPLESS"
    ctx.font = 'bold 100px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (let i = 0; i < 8; i++) {
        let gradient = ctx.createLinearGradient(0, (i + 1) * 100 - 50, canvas.width, (i + 1) * 100 + 50);
        gradient.addColorStop(0, colors[i]);
        gradient.addColorStop(1, colors[(i + 1) % colors.length]);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2; // Ajusta el grosor del borde del texto
        ctx.strokeText('SLEEPLESS', canvas.width / 2, (i + 1) * 100);
    }

    // Dibujar la información del evento
    ctx.font = 'bold 20px Arial';
    ctx.fillStyle = '#FFF';
    ctx.textAlign = 'left';
    ctx.fillText('Nu Aspect', 40, canvas.height - 100);
    ctx.fillText('21 de abril 2:30am', 40, canvas.height - 80);
    ctx.fillText('Palacio de los Deportes.', 40, canvas.height - 60);
    ctx.fillText('Please keep my heart on fire', 40, canvas.height - 40);
}

function invertColors(x, y) {
    // Invertir los colores de las letras según la posición del mouse
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
        const dx = (i / 4) % canvas.width - x;
        const dy = Math.floor(i / 4 / canvas.width) - y;
        if (dx * dx + dy * dy < 10000) { // Radio del círculo invisible
            data[i] = 255 - data[i];     // Invertir rojo
            data[i + 1] = 255 - data[i + 1]; // Invertir verde
            data[i + 2] = 255 - data[i + 2]; // Invertir azul
        }
    }
    ctx.putImageData(imageData, 0, 0);
}

function changeColors() {
    // Generar nuevos tonos de rojo aleatorios
    colors = colors.map(() => {
        let red = Math.floor(Math.random() * 256);
        return `#${red.toString(16).padStart(2, '0')}0000`;
    });
    drawFigures();
}

function resetColors() {
    // Volver a los colores originales
    colors = [...originalColors];
    drawFigures();
}

canvas.addEventListener('mousemove', (e) => {
    drawFigures();
    invertColors(e.clientX, e.clientY);
});

window.addEventListener('resize', resizeCanvas);

window.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        changeColors();
    } else if (e.code === 'KeyA') {
        resetColors();
    }
});

resizeCanvas();