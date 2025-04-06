// Initialize particles.js
document.addEventListener('DOMContentLoaded', function() {
    
    // Particles.js configuration
    if (document.getElementById('particles-js')) {
        particlesJS('particles-js', {
            particles: {
                number: {
                    value: 80,
                    density: {
                        enable: true,
                        value_area: 800
                    }
                },
                color: {
                    value: '#5c6ac4'
                },
                shape: {
                    type: 'circle',
                    stroke: {
                        width: 0,
                        color: '#000000'
                    }
                },
                opacity: {
                    value: 0.5,
                    random: false,
                    anim: {
                        enable: false,
                        speed: 1,
                        opacity_min: 0.1,
                        sync: false
                    }
                },
                size: {
                    value: 3,
                    random: true,
                    anim: {
                        enable: false,
                        speed: 40,
                        size_min: 0.1,
                        sync: false
                    }
                },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: '#5c6ac4',
                    opacity: 0.4,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 2,
                    direction: 'none',
                    random: false,
                    straight: false,
                    out_mode: 'out',
                    bounce: false,
                    attract: {
                        enable: false,
                        rotateX: 600,
                        rotateY: 1200
                    }
                }
            },
            interactivity: {
                detect_on: 'canvas',
                events: {
                    onhover: {
                        enable: true,
                        mode: 'grab'
                    },
                    onclick: {
                        enable: true,
                        mode: 'push'
                    },
                    resize: true
                },
                modes: {
                    grab: {
                        distance: 140,
                        line_linked: {
                            opacity: 1
                        }
                    },
                    push: {
                        particles_nb: 4
                    }
                }
            },
            retina_detect: true
        });
    }
  
    // Testimonial carousel functionality
    const testimonialSlides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    let currentSlide = 0;
  
    // Set initial active slide
    function showSlide(index) {
        // Hide all slides
        testimonialSlides.forEach(slide => {
            slide.classList.remove('active');
        });
        
        // Remove active class from all dots
        dots.forEach(dot => {
            dot.classList.remove('active');
        });
        
        // Show the selected slide and dot
        testimonialSlides[index].classList.add('active');
        dots[index].classList.add('active');
    }
  
    // Next slide function
    function nextSlide() {
        currentSlide++;
        if (currentSlide >= testimonialSlides.length) {
            currentSlide = 0;
        }
        showSlide(currentSlide);
    }
  
    // Previous slide function
    function prevSlide() {
        currentSlide--;
        if (currentSlide < 0) {
            currentSlide = testimonialSlides.length - 1;
        }
        showSlide(currentSlide);
    }
  
    // Set up event listeners for carousel controls
    if (nextBtn && prevBtn) {
        nextBtn.addEventListener('click', nextSlide);
        prevBtn.addEventListener('click', prevSlide);
    }
  
    // Set up dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentSlide = index;
            showSlide(currentSlide);
        });
    });
  
    // Auto-advance the carousel every 5 seconds
    setInterval(nextSlide, 5000);
  
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('nav a, .logo a, .learn-more-btn, .footer-col a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Check if the href is an anchor link
            if (href && href.startsWith('#') && href.length > 1) {
                e.preventDefault();
                
                const targetSection = document.querySelector(href);
                
                if (targetSection) {
                    window.scrollTo({
                        top: targetSection.offsetTop - 80, // Adjust for header height
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
  
    // Get Started button functionality
    const getStartedBtns = document.querySelectorAll('.get-started-btn');
    
    getStartedBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Redirect to signup page or open modal
            // For now, we'll just scroll to the contact section
            const contactSection = document.getElementById('contact');
            if (contactSection) {
                window.scrollTo({
                    top: contactSection.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
  
    // Form submission handling
    const contactForm = document.querySelector('.contact-form form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const school = document.getElementById('school').value;
            const message = document.getElementById('message').value;
            
            // Validate form (simple validation)
            if (!name || !email || !message) {
                alert('Please fill in all required fields.');
                return;
            }
            
            // Here you would normally send the data to a server
            // For now, we'll just show a success message
            
            // Create success message
            const successMessage = document.createElement('div');
            successMessage.className = 'success-message';
            successMessage.textContent = 'Thanks for reaching out! We\'ll get back to you soon.';
            
            // Replace form with success message
            contactForm.innerHTML = '';
            contactForm.appendChild(successMessage);
        });
    }
  
    // Animation on scroll
    window.addEventListener('scroll', function() {
        const animatedElements = document.querySelectorAll('.feature-card, .problem-card, .benefit-item, .team-member');
        
        animatedElements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;
            
            if (elementPosition < screenPosition) {
                element.classList.add('animate');
            }
        });
    });
  
    // Mobile menu functionality
    const mobileMenuToggle = document.createElement('div');
    mobileMenuToggle.className = 'mobile-menu-toggle';
    mobileMenuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    
    const headerNav = document.querySelector('header nav');
    
   
  });
  // Add this to the existing welcome.js file
  document.addEventListener('DOMContentLoaded', function() {
      const scrollDownIcon = document.querySelector('.scroll-down-icon');
      
      if (scrollDownIcon) {
          scrollDownIcon.addEventListener('click', function() {
              // Scroll to the next section after the hero section
              const heroSection = document.querySelector('.hero');
              const nextSection = heroSection.nextElementSibling;
              
              if (nextSection) {
                  nextSection.scrollIntoView({
                      behavior: 'smooth',
                      block: 'start'
                  });
              }
          });
  
          // Cursor movement shining effect
          scrollDownIcon.addEventListener('mousemove', function(e) {
              const rect = this.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const y = e.clientY - rect.top;
  
              this.style.setProperty('--x', `${x}px`);
              this.style.setProperty('--y', `${y}px`);
          });
      }
  });
  // Mouse movement for shine effect
  document.addEventListener('mousemove', function(e) {
    const cards = document.querySelectorAll('.shine-effect');
    cards.forEach(card => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      if (x > 0 && x < rect.width && y > 0 && y < rect.height) {
        if (!card.classList.contains('active')) {
          card.classList.add('active');
          setTimeout(() => {
            card.classList.remove('active');
          }, 1500);
        }
      }
    });
  });
  
  // Intersection Observer for scroll animations
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
      }
    });
  }, {
    threshold: 0.1
  });
  
  // Observe all sections
  sections.forEach(section => {
    observer.observe(section);
  });
  
  // Parallax scrolling effect
  window.addEventListener('scroll', function() {
      const parallaxElements = document.querySelectorAll('.parallax-bg');

      parallaxElements.forEach(element => {
        const speed = parseFloat(element.getAttribute('data-speed')) || 0.5;
        element.style.transform = `translateY(${scrolly*speed}px)`;
      });
    });

    // Scroll Indicator Visibility
    if (scrollIndicator) {
      window.addEventListener('scroll', function () {
        if (window.scrollY > 100) {
          scrollIndicator.classList.add('hidden');
        } else {
          scrollIndicator.classList.remove('hidden');
        }
      });
    }

    // Smooth Scrolling for Navigation Links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          window.scrollTo({
            top: target.offsetTop - header.offsetHeight,
            behavior: 'smooth',
          });
        }
      });
    });