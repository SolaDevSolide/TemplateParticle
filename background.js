const backgroundCanvas = document.getElementById('backgroundCanvas');
const ctxBackground = backgroundCanvas.getContext('2d', { willReadFrequently: true });
const BACKGROUND_DENSITY = 50; // Lower value means more particles. Suggested range: 1 - 10

let backgroundParticlesArray = [];

const backgroundMouse = {
    x: null,
    y: null,
    radius: 200
}

window.addEventListener('mousemove', function(event) {
    backgroundMouse.x = event.x;
    backgroundMouse.y = event.y;
});

class BackgroundParticle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 2;
        this.baseX = this.x;
        this.baseY = this.y;
        this.density = (Math.random() * 10) + 1;
        this.color = getRandomColor();
        this.velocityX = (Math.random() - 0.5) * 0.5; // Adjust particle velocity
        this.velocityY = (Math.random() - 0.5) * 0.5; // Adjust particle velocity
        this.originalX = x;
        this.originalY = y;
        this.originalXValue = x; // Store the initial originalX value
        this.originalYValue = y; // Store the initial originalY value
        this.maxDistance = Math.random() * 150 + 50; // Adjust reaction radius
        this.speedLimit = 1.5; // Speed limit for particles
    }

    // draw() {
    //     ctxBackground.fillStyle = this.color;
    //     ctxBackground.beginPath();
    //     ctxBackground.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    //     ctxBackground.closePath();
    //     ctxBackground.fill();
    // }

    draw() {
        // Calculate the distance between the particle and the mouse cursor
        let dx = this.x - backgroundMouse.x;
        let dy = this.y - backgroundMouse.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
    
        // Calculate a brightness factor based on the distance
        let brightness = 1 - distance / (backgroundMouse.radius * 1.5);
        brightness = Math.max(0.2, brightness); // Ensure brightness is never negative
    
        // Parse the particle's color values
        let colorValues = this.color.match(/\d+/g);
        let r = parseInt(colorValues[0]);
        let g = parseInt(colorValues[1]);
        let b = parseInt(colorValues[2]);
    
        // Adjust the particle's color based on brightness
        let newR = Math.floor(r * brightness);
        let newG = Math.floor(g * brightness);
        let newB = Math.floor(b * brightness);
    
        ctxBackground.fillStyle = `rgb(${newR},${newG},${newB})`;
    
        // Draw the particle as a filled circle
        ctxBackground.beginPath();
        ctxBackground.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctxBackground.closePath();
        ctxBackground.fill();
    }

    update() {
        this.x += this.velocityX;
        this.y += this.velocityY;
    
        // Check if particles are out of bounds and reset
        // if (this.x > backgroundCanvas.width || this.x < 0 || this.y > backgroundCanvas.height || this.y < 0) {
        //     this.x = this.originalX;
        //     this.y = this.originalY;
        //     this.velocityX = (Math.random() - 0.5) * 0.5; // Reset particle velocity
        //     this.velocityY = (Math.random() - 0.5) * 0.5; // Reset particle velocity
        // }
    
        let dx = backgroundMouse.x - this.x;
        let dy = backgroundMouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
    
        if (distance < this.maxDistance) {
            let force = (1 - distance / this.maxDistance) * 0.5; // Adjust reaction strength
            this.velocityX += force * (dx / distance) * this.density;
            this.velocityY += force * (dy / distance) * this.density;
        }
    
        else {
            let dx = 0;
            let dy = 0;
            if (this.x !== this.originalX) {
                dx = this.originalXValue - this.x; // Use the stored initial originalXValue
            }
            if (this.y !== this.originalY) {
                dy = this.originalYValue - this.y; // Use the stored initial originalYValue
            }
            if (this.y !== this.originalY || this.x !== this.originalX) {
                let force = 1; // Adjust reaction strength
                this.velocityX += force * dx * this.density;
                this.velocityY += force * dy * this.density;
            }
        }
    
        // Apply speed limit
        const speed = Math.sqrt(this.velocityX * this.velocityX + this.velocityY * this.velocityY);
        if (speed > this.speedLimit) {
            const ratio = this.speedLimit / speed;
            this.velocityX *= ratio;
            this.velocityY *= ratio;
        }
    
        // Introduce dampening to slow down particles
        const dampeningFactor = 0.98; // Increase dampening for slower movement
        this.velocityX *= dampeningFactor;
        this.velocityY *= dampeningFactor;
    }
}

function getRandomColor() {
    const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary');
    const secondaryColor = getComputedStyle(document.documentElement).getPropertyValue('--secondary');
    const randomFactor = Math.random();
    const r = Math.floor((1 - randomFactor) * parseInt(primaryColor.slice(1, 3), 16) + randomFactor * parseInt(secondaryColor.slice(1, 3), 16));
    const g = Math.floor((1 - randomFactor) * parseInt(primaryColor.slice(3, 5), 16) + randomFactor * parseInt(secondaryColor.slice(3, 5), 16));
    const b = Math.floor((1 - randomFactor) * parseInt(primaryColor.slice(5, 7), 16) + randomFactor * parseInt(secondaryColor.slice(5, 7), 16));
    return `rgb(${r},${g},${b})`;
}

window.addEventListener('resize', resizeBackgroundCanvas);

function drawBackgroundCanvas() {
    backgroundCanvas.width = window.innerWidth; // Set canvas width to match window width
    backgroundCanvas.height = window.innerHeight; // Set canvas height to match window height

    // Draw your background content here, e.g., gradients, shapes, or images
    ctxBackground.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--background');
    ctxBackground.fillRect(0, 0, backgroundCanvas.width, backgroundCanvas.height);

    // Create and update particles
    for (let i = 0; i < backgroundParticlesArray.length; i++) {
        backgroundParticlesArray[i].draw();
        backgroundParticlesArray[i].update();
    }
}

function resizeBackgroundCanvas() {
    backgroundCanvas.width = window.innerWidth; // Set canvas width to match window width
    backgroundCanvas.height = window.innerHeight; // Set canvas height to match window height

    // Calculate the number of particles that fit within the canvas without creating an extra margin
    const particlesXCount = Math.floor((backgroundCanvas.width) / BACKGROUND_DENSITY);
    const particlesYCount = Math.floor((backgroundCanvas.height) / BACKGROUND_DENSITY);

    // Calculate the actual margin values to center the grid
    const xOffset = (backgroundCanvas.width - particlesXCount * BACKGROUND_DENSITY) / 2;
    const yOffset = (backgroundCanvas.height - particlesYCount * BACKGROUND_DENSITY) / 2;

    // Calculate the compensation offset to fill the blank space at the end
    const xCompensationOffset = xOffset % BACKGROUND_DENSITY;
    const yCompensationOffset = yOffset % BACKGROUND_DENSITY;

    // Clear the existing particles and recreate them with the calculated offset and compensation
    backgroundParticlesArray = [];
    for (let y = yOffset - yCompensationOffset; y < backgroundCanvas.height - yCompensationOffset; y += BACKGROUND_DENSITY) {
        for (let x = xOffset - xCompensationOffset; x < backgroundCanvas.width - xCompensationOffset; x += BACKGROUND_DENSITY) {
            backgroundParticlesArray.push(new BackgroundParticle(x, y));
        }
    }

    drawBackgroundCanvas(); // Redraw the background when the window is resized
}


resizeBackgroundCanvas(); // Initial call to set canvas sizes and draw the background

// Animation loop
function animateBackground() {
    ctxBackground.fillStyle = 'rgba(0, 0, 0, 0.1)'; // Adjust the alpha value as needed
    ctxBackground.fillRect(0, 0, backgroundCanvas.width, backgroundCanvas.height);
    drawBackgroundCanvas();
    requestAnimationFrame(animateBackground);
}

animateBackground(); // Start the animation loop
