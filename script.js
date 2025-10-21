// Modern Carousel Implementation
class Carousel {
    constructor(container) {
        this.container = container;
        this.carousel = container.querySelector('.carousel');
        this.slides = container.querySelectorAll('.carousel-slide');
        this.prevBtn = container.querySelector('.prev');
        this.nextBtn = container.querySelector('.next');
        this.dotsContainer = container.querySelector('.carousel-dots');
        this.currentIndex = 0;
        this.autoplayInterval = null;

        this.init();
    }

    init() {
        // Create dots
        this.createDots();

        // Add event listeners
        this.prevBtn.addEventListener('click', () => this.prev());
        this.nextBtn.addEventListener('click', () => this.next());

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.prev();
            if (e.key === 'ArrowRight') this.next();
        });

        // Touch/Swipe support
        this.addTouchSupport();

        // Auto-play
        this.startAutoplay();
        this.container.addEventListener('mouseenter', () => this.stopAutoplay());
        this.container.addEventListener('mouseleave', () => this.startAutoplay());
    }

    createDots() {
        this.slides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('carousel-dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => this.goToSlide(index));
            this.dotsContainer.appendChild(dot);
        });
        this.dots = this.dotsContainer.querySelectorAll('.carousel-dot');
    }

    goToSlide(index) {
        // Remove active class from current slide and dot
        this.slides[this.currentIndex].classList.remove('active');
        this.dots[this.currentIndex].classList.remove('active');

        // Update current index
        this.currentIndex = index;

        // Add active class to new slide and dot
        this.slides[this.currentIndex].classList.add('active');
        this.dots[this.currentIndex].classList.add('active');
    }

    next() {
        const nextIndex = (this.currentIndex + 1) % this.slides.length;
        this.goToSlide(nextIndex);
    }

    prev() {
        const prevIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
        this.goToSlide(prevIndex);
    }

    startAutoplay() {
        this.autoplayInterval = setInterval(() => this.next(), 4000);
    }

    stopAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
            this.autoplayInterval = null;
        }
    }

    addTouchSupport() {
        let startX = 0;
        let endX = 0;

        this.carousel.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });

        this.carousel.addEventListener('touchmove', (e) => {
            endX = e.touches[0].clientX;
        });

        this.carousel.addEventListener('touchend', () => {
            const diff = startX - endX;
            if (Math.abs(diff) > 50) { // Minimum swipe distance
                if (diff > 0) {
                    this.next();
                } else {
                    this.prev();
                }
            }
        });
    }
}

// Initialize all carousels on the page
document.addEventListener('DOMContentLoaded', () => {
    const carouselContainers = document.querySelectorAll('.carousel-container');
    carouselContainers.forEach(container => new Carousel(container));
});

// Smooth scroll with offset for sticky nav
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            const navHeight = document.querySelector('.nav-bar').offsetHeight;
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Active nav link on scroll with elegant transitions
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

function updateActiveNavLink() {
    const scrollPosition = window.scrollY + 200;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.style.color = '#d4af37';
                } else {
                    link.style.color = '#2c2c2c';
                }
            });
        }
    });
}

window.addEventListener('scroll', updateActiveNavLink);
window.addEventListener('load', updateActiveNavLink);

// Scroll reveal animation with Intersection Observer
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all cards and sections
const animatedElements = document.querySelectorAll('.accommodation-card, .activity-card, .tip-card, .timeline-item');
animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    observer.observe(el);
});

// Countdown to trip
function updateCountdown() {
    const tripDate = new Date('December 25, 2025 09:45:00').getTime();
    const now = new Date().getTime();
    const distance = tripDate - now;

    if (distance > 0) {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

        // Add countdown to hero if it doesn't exist
        if (!document.querySelector('.countdown')) {
            const countdown = document.createElement('div');
            countdown.className = 'countdown';
            countdown.style.cssText = `
                font-size: 1.3rem;
                margin-top: 2rem;
                padding: 1.5rem 2.5rem;
                background: rgba(255, 255, 255, 0.15);
                border-radius: 20px;
                backdrop-filter: blur(20px);
                border: 2px solid rgba(255, 255, 255, 0.3);
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
                animation: fadeInUp 1.5s ease 0.5s both;
            `;
            document.querySelector('.hero-overlay').appendChild(countdown);
        }

        const countdownEl = document.querySelector('.countdown');
        countdownEl.innerHTML = `
            <div style="font-weight: 700; font-size: 1.1em; margin-bottom: 0.5rem;">⏰ Countdown to Adventure</div>
            <div style="font-size: 1.8em; font-weight: 800; letter-spacing: 2px;">
                ${days}<span style="font-size: 0.6em; opacity: 0.9;">d</span>
                ${hours}<span style="font-size: 0.6em; opacity: 0.9;">h</span>
                ${minutes}<span style="font-size: 0.6em; opacity: 0.9;">m</span>
            </div>
        `;
    } else {
        const countdownEl = document.querySelector('.countdown');
        if (countdownEl) {
            countdownEl.innerHTML = '<div style="font-size: 1.5em;">🎉 Adventure Time! 🎉</div>';
        }
    }
}

// Update countdown every minute
updateCountdown();
setInterval(updateCountdown, 60000);

// Floating action buttons with elegant styling
const createFloatingButton = (icon, text, onClick, position) => {
    const button = document.createElement('button');
    button.innerHTML = icon;
    button.title = text;
    button.style.cssText = `
        position: fixed;
        ${position};
        padding: 1rem;
        background: rgba(255, 255, 255, 0.95);
        color: #2c2c2c;
        border: 1px solid #e5e5e5;
        width: 50px;
        height: 50px;
        font-size: 1.2rem;
        cursor: pointer;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        z-index: 999;
        opacity: 0;
        transition: all 0.3s ease;
        pointer-events: none;
        display: flex;
        align-items: center;
        justify-content: center;
    `;

    button.addEventListener('mouseover', function() {
        this.style.transform = 'translateY(-3px)';
        this.style.background = '#d4af37';
        this.style.color = '#ffffff';
        this.style.borderColor = '#d4af37';
        this.style.boxShadow = '0 6px 25px rgba(212, 175, 55, 0.3)';
    });

    button.addEventListener('mouseout', function() {
        this.style.transform = 'translateY(0)';
        this.style.background = 'rgba(255, 255, 255, 0.95)';
        this.style.color = '#2c2c2c';
        this.style.borderColor = '#e5e5e5';
        this.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
    });

    button.addEventListener('click', onClick);
    document.body.appendChild(button);
    return button;
};

// Scroll to top button
const scrollTopButton = createFloatingButton(
    '↑',
    'Scroll to top',
    () => window.scrollTo({ top: 0, behavior: 'smooth' }),
    'bottom: 2rem; left: 2rem;'
);

// Print button
const printButton = createFloatingButton(
    '🖨️',
    'Print itinerary',
    () => window.print(),
    'bottom: 2rem; right: 2rem;'
);

// Show/hide floating buttons based on scroll
window.addEventListener('scroll', function() {
    const showButtons = window.scrollY > 500;

    [scrollTopButton, printButton].forEach(button => {
        if (showButtons) {
            button.style.opacity = '1';
            button.style.pointerEvents = 'auto';
        } else {
            button.style.opacity = '0';
            button.style.pointerEvents = 'none';
        }
    });
});

// Add parallax effect to hero
window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const hero = document.querySelector('.hero');
    if (hero && scrolled < window.innerHeight) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Image loading animation
document.querySelectorAll('.carousel-slide img').forEach(img => {
    img.style.opacity = '0';
    img.style.transition = 'opacity 0.6s ease';

    img.addEventListener('load', function() {
        this.style.opacity = '1';
    });

    // Fallback if image is already loaded
    if (img.complete) {
        img.style.opacity = '1';
    }
});

// Add loading state for carousel images
document.querySelectorAll('.carousel-container').forEach(container => {
    const loader = document.createElement('div');
    loader.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 50px;
        height: 50px;
        border: 4px solid rgba(255, 255, 255, 0.3);
        border-top-color: white;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        z-index: 5;
    `;
    container.appendChild(loader);

    // Remove loader when first image loads
    const firstImg = container.querySelector('.carousel-slide img');
    if (firstImg) {
        firstImg.addEventListener('load', () => {
            loader.style.opacity = '0';
            setTimeout(() => loader.remove(), 300);
        });

        if (firstImg.complete) {
            loader.style.opacity = '0';
            setTimeout(() => loader.remove(), 300);
        }
    }
});

// Add spin animation for loaders
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        to { transform: translate(-50%, -50%) rotate(360deg); }
    }
`;
document.head.appendChild(style);

// Console message - Professional
console.log(
    '%cFrench Polynesia Christmas Adventure 2025',
    'font-size: 16px; font-weight: 300; color: #1a1a1a; letter-spacing: 0.1em;'
);
console.log(
    '%cExperience the extraordinary.',
    'font-size: 14px; color: #d4af37; font-style: italic;'
);
