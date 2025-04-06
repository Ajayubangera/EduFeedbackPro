document.addEventListener('DOMContentLoaded', function () {
    // Always enable dark mode
    document.body.classList.add('dark-mode');document.body.style.background = 'linear-gradient(to bottom, #001f3f, #000000)';



    // Initialize particles (same amount, no increase)
    createParticles();
});

// Create particles once and reuse them
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;

    const neonColors = ['#ff073a', '#08f7fe', '#ffdd1c', '#d400ff', '#00ff66'];
    const particleCount = 50; // Keeping the count fixed

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';

        const size = Math.random() * 6 + 3;
        const color = neonColors[Math.floor(Math.random() * neonColors.length)];

        particle.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: ${color};
            box-shadow: 0 0 8px ${color}, 0 0 16px ${color}; /* Neon glow */
            border-radius: 50%;
            opacity: ${Math.random() * 0.6 + 0.3};
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            pointer-events: none;
        `;

       
    }
}



