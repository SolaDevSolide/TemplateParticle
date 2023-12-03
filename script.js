document.addEventListener("DOMContentLoaded", function () {
    const images = document.querySelectorAll('.right-section img');
    let currentImageIndex = 0;

    const showImage = (index) => {
        images.forEach(img => img.classList.remove('active'));
        images[index].classList.add('active');
    };

    const nextImage = () => {
        currentImageIndex = (currentImageIndex + 1) % images.length;
        showImage(currentImageIndex);
    };

    // Show the first image immediately
    showImage(currentImageIndex);

    images.forEach(img => {
        img.addEventListener('click', nextImage);
    });

    // Automatically cycle images every 5 seconds
    setInterval(nextImage, 5000);
});
