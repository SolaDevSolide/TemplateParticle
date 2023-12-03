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
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
    }

    update() {
        // Particle movement logic here if needed
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

function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let particle of particlesArray) {
        particle.draw();
    }
}

// Load and process image
const image = new Image();
image.src = 'assets/Banner.png'; // Your image path
image.onload = function() {
    ctx.drawImage(image, 0, 0);
    let pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let imageData = [];
    for (let i = 0; i < pixels.length; i += 4) {
        imageData.push([pixels[i], pixels[i + 1], pixels[i + 2]]);
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    init(imageData, canvas.width, canvas.height);
    animate();
};
