const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray = [];
const numberOfParticles = 5000;

const mouse = {
    x: null,
    y: null,
    radius: 60
};

let throttleTimer;
window.addEventListener('mousemove', function(event) {
    if (throttleTimer) {
        clearTimeout(throttleTimer);
    }
    throttleTimer = setTimeout(function() {
        mouse.x = event.x;
        mouse.y = event.y;
    }, 10);
});

class Particle {
    constructor(x, y, color, size) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.size = size;
        this.baseX = x;
        this.baseY = y;
        this.density = (Math.random() * 30) + 1;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
    }

    update() {
        if (Math.abs(mouse.x - this.x) < mouse.radius && Math.abs(mouse.y - this.y) < mouse.radius) {
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
            }
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

function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
    }
}


function init(imageData, width, height) {
    particlesArray = [];
    for (let i = 0; i < numberOfParticles; i++) {
        let x = Math.random() * width;
        let y = Math.random() * height;
        let rgb = imageData[Math.floor(y / height * imageData.length)];
        let color = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 1)`;
        particlesArray.push(new Particle(x, y, color, 2));
    }
}

// Load and process image
const image = new Image();
image.src = 'assets/Banner.png';
image.onload = function() {
    const scaleFactor = 0.5; // Adjust this as needed
    const scaledWidth = canvas.width * scaleFactor;
    const scaledHeight = canvas.height * scaleFactor;

    ctx.drawImage(image, 0, 0, scaledWidth, scaledHeight);
    let pixels = ctx.getImageData(0, 0, scaledWidth, scaledHeight).data;
    let imageData = [];

    for (let i = 0; i < pixels.length; i += 4) {
        let alpha = pixels[i + 3];
        if (alpha > 0) { // Check if the pixel is not fully transparent
            let red = pixels[i];
            let green = pixels[i + 1];
            let blue = pixels[i + 2];
            imageData.push([red, green, blue, alpha]);
        }
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    init(imageData, scaledWidth, scaledHeight);
    animate();
};