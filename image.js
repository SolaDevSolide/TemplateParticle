const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray = [];
const numberOfParticles = 5000; // Adjust the number of particles here

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
    constructor(x, y, color, size) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.size = size;
        this.baseX = this.x;
        this.baseY = this.y;
        this.density = (Math.random() * 40) + 5;
    }

    draw() {
        ctx.fillStyle = this.color;
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

function init() {
    particlesArray = [];
    const image = new Image();
    image.src = 'assets/Banner.png'; // Replace with your image path

    image.onload = function() {
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        let grid = Math.ceil(Math.sqrt(numberOfParticles));
        let gridWidth = canvas.width / grid;
        let gridHeight = canvas.height / grid;

        for (let y = 0; y < canvas.height; y += gridHeight) {
            for (let x = 0; x < canvas.width; x += gridWidth) {
                let pixel = imageData.data[(y * 4 * imageData.width) + (x * 4)];
                let red = imageData.data[(y * 4 * imageData.width) + (x * 4)];
                let green = imageData.data[(y * 4 * imageData.width) + (x * 4) + 1];
                let blue = imageData.data[(y * 4 * imageData.width) + (x * 4) + 2];
                let color = 'rgba(' + red + ',' + green + ',' + blue + ')';
                particlesArray.push(new Particle(x, y, color, 2));
            }
        }
    };
}

init();

function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].draw();
        particlesArray[i].update();
    }
}

animate();
