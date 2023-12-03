const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d', { willReadFrequently: true });
const WIDTH_PERCENTAGE = 0.5; // 80% of the viewport width
const HEIGHT_PERCENTAGE = 0.4; // 80% of the viewport height
const TEXT = 'DEV/INCI';
const TEXT_COLOR = 'white';
const PARTICLE_COLOR = getComputedStyle(document.documentElement).getPropertyValue('--primary');
const DENSITY = 5; // Lower value means more particles. Suggested range: 1 - 10


let particlesArray = [];

const mouse = {
    x: null,
    y: null,
    radius: 150
}

window.addEventListener('mousemove', function(event) {
    mouse.x = event.x;
    mouse.y = event.y;
});

class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 3;
        this.baseX = this.x;
        this.baseY = this.y;
        this.density = (Math.random() * 30) + 1;
    }

    draw() {
        ctx.fillStyle = PARTICLE_COLOR;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
    }

    update() {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        let forceDirectionX = dx / distance;
        let forceDirectionY = dy / distance;
        let maxDistance = mouse.radius;
        let force = (maxDistance - distance) / maxDistance;
        let directionX = forceDirectionX * force * this.density;
        let directionY = forceDirectionY * force * this.density;

        if (distance < mouse.radius) {
            this.x -= directionX;
            this.y -= directionY;
        } else {
            if (this.x !== this.baseX) {
                let dx = this.x - this.baseX;
                this.x -= dx / 10;
            }
            if (this.y !== this.baseY) {
                let dy = this.y - this.baseY;
                this.y -= dy / 10;
            }
        }
    }
}

window.addEventListener('resize', resizeCanvas);

function resizeCanvas() {
    canvas.width = window.innerWidth * WIDTH_PERCENTAGE;
    canvas.height = window.innerHeight * HEIGHT_PERCENTAGE;

    // Adjust font size relative to canvas size
    ctx.fillStyle = TEXT_COLOR;
    const fontSize = Math.floor(canvas.width / 10); // Adjust as needed
    ctx.font = `${fontSize}px Verdana`;
    const textWidth = ctx.measureText('DEV/INCI').width;
    const startX = (canvas.width - textWidth) / 2;
    const startY = canvas.height / 2;
    ctx.fillText('DEV/INCI', startX, startY);

    init(); // Reinitialize particles
}



resizeCanvas()

function init() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillText(TEXT, (canvas.width - ctx.measureText(TEXT).width) / 2, canvas.height / 2);
    const textCoordinates = ctx.getImageData(0, 0, canvas.width, canvas.height);

    particlesArray = [];
    for (let y = 0; y < textCoordinates.height; y += DENSITY) {
        for (let x = 0; x < textCoordinates.width; x += DENSITY) {
            if (textCoordinates.data[(y * 4 * textCoordinates.width) + (x * 4) + 3] > 128) {
                let positionX = x + (canvas.width - textCoordinates.width) / 2;
                let positionY = y + (canvas.height - textCoordinates.height) / 2;
                particlesArray.push(new Particle(positionX, positionY));
            }
        }
    }
}



init();

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].draw();
        particlesArray[i].update();
    }
    requestAnimationFrame(animate);
}

function connect() {
    let opacityValue = 1;
    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
            let dx = particlesArray[a].x - particlesArray[b].x;
            let dy = particlesArray[a].y - particlesArray[b].y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 20) {
                opacityValue = 1 - (distance / 20);
                ctx.strokeStyle = 'rgba(255,255,255,' + opacityValue + ')';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                ctx.stroke();
            }
        }
    }
}

function testDraw() {
    ctx.fillStyle = 'red'; // Use a clearly visible color
    ctx.beginPath();
    ctx.arc(100, 100, 10, 0, Math.PI * 2); // Draw a circle at (100,100) with radius 10
    ctx.closePath();
    ctx.fill();
}

console.log("here")

animate();