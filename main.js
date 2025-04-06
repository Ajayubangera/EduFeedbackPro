document.addEventListener('DOMContentLoaded', function() {
    // Apply entrance animations to role buttons
    const teacherBtn = document.querySelector('.teacher-btn');
    const studentBtn = document.querySelector('.student-btn');
    
    if (teacherBtn && studentBtn) {
        anime({
            targets: '.teacher-btn',
            translateX: [-50, 0],
            opacity: [0, 1],
            easing: 'easeOutQuad',
            duration: 800
        });
        
        anime({
            targets: '.student-btn',
            translateX: [50, 0],
            opacity: [0, 1],
            easing: 'easeOutQuad',
            duration: 800,
            delay: 100
        });
    }

    // Apply entrance animation to logo
    const logoContainer = document.querySelector('.logo-container');
    if (logoContainer) {
        anime({
            targets: '.logo-container',
            translateY: [-30, 0],
            opacity: [0, 1],
            easing: 'easeOutQuad',
            duration: 800
        });
    }

    // Apply entrance animation to tagline
    const tagline = document.querySelector('.tagline');
    if (tagline) {
        anime({
            targets: '.tagline',
            translateY: [-20, 0],
            opacity: [0, 1],
            easing: 'easeOutQuad',
            duration: 800,
            delay: 200
        });
    }

    // Apply entrance animation to register link
    const registerLink = document.querySelector('.register-link');
    if (registerLink) {
        anime({
            targets: '.register-link',
            translateY: [20, 0],
            opacity: [0, 1],
            easing: 'easeOutQuad',
            duration: 800,
            delay: 300
        });
    }
});
