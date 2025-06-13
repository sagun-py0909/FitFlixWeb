// Fitflix Main JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initializeNavbar();
    initializeAnimations();
    initializeForms();
    initializeCityModal();
    initializeScrollEffects();
});

// Navbar functionality
function initializeNavbar() {
    const navbar = document.querySelector('.navbar');
    
    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile menu close on link click
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navbarCollapse.classList.contains('show')) {
                const bsCollapse = new bootstrap.Collapse(navbarCollapse);
                bsCollapse.hide();
            }
        });
    });
}

// Background animations
function initializeAnimations() {
    // Hero background animation
    const heroAnimation = document.querySelector('.hero-bg-animation');
    if (heroAnimation) {
        // Add floating particles effect
        createFloatingParticles(heroAnimation);
    }

    // Card hover animations
    const cards = document.querySelectorAll('.gym-card, .trainer-card, .feature-card, .service-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Button ripple effect
    const buttons = document.querySelectorAll('.btn-fitflix');
    buttons.forEach(button => {
        button.addEventListener('click', createRippleEffect);
    });
}

// Create floating particles for hero section
function createFloatingParticles(container) {
    const particleCount = 20;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'floating-particle';
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 4 + 2}px;
            height: ${Math.random() * 4 + 2}px;
            background: rgba(234, 30, 37, ${Math.random() * 0.5 + 0.2});
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: float ${Math.random() * 10 + 10}s linear infinite;
            pointer-events: none;
        `;
        container.appendChild(particle);
    }

    // Add CSS animation for floating particles
    if (!document.querySelector('#particle-styles')) {
        const style = document.createElement('style');
        style.id = 'particle-styles';
        style.textContent = `
            @keyframes float {
                0% {
                    transform: translateY(100vh) rotate(0deg);
                    opacity: 0;
                }
                10% {
                    opacity: 1;
                }
                90% {
                    opacity: 1;
                }
                100% {
                    transform: translateY(-100px) rotate(360deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Ripple effect for buttons
function createRippleEffect(e) {
    const button = e.currentTarget;
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
    `;
    
    button.style.position = 'relative';
    button.style.overflow = 'hidden';
    button.appendChild(ripple);
    
    // Add ripple animation CSS if not exists
    if (!document.querySelector('#ripple-styles')) {
        const style = document.createElement('style');
        style.id = 'ripple-styles';
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Form enhancements
function initializeForms() {
    // Form validation
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            if (!form.checkValidity()) {
                e.preventDefault();
                e.stopPropagation();
            }
            form.classList.add('was-validated');
        });
    });

    // Booking form enhancements
    const bookingForm = document.querySelector('.booking-form form');
    if (bookingForm) {
        const serviceSelect = bookingForm.querySelector('#service');
        const dateInput = bookingForm.querySelector('#date');
        
        // Set minimum date to today
        if (dateInput) {
            const today = new Date().toISOString().split('T')[0];
            dateInput.min = today;
        }

        // Update pricing based on service selection
        if (serviceSelect) {
            serviceSelect.addEventListener('change', updateBookingPrice);
        }
    }
}

// Update booking price based on service
function updateBookingPrice() {
    const service = document.querySelector('#service').value;
    const duration = document.querySelector('#duration').value;
    
    let basePrice = 0;
    switch (service) {
        case 'gym':
            basePrice = 500;
            break;
        case 'trainer':
            basePrice = 1500;
            break;
        case 'class':
            basePrice = 800;
            break;
    }

    if (duration) {
        const hours = parseInt(duration) / 60;
        basePrice *= hours;
    }

    const platformFee = 50;
    const total = basePrice + platformFee;

    // Update summary
    const summary = document.querySelector('.booking-summary');
    if (summary && basePrice > 0) {
        summary.innerHTML = `
            <h5 class="fw-bold mb-3">Booking Summary</h5>
            <div class="d-flex justify-content-between mb-2">
                <span>Service Fee:</span>
                <span>₹${basePrice}</span>
            </div>
            <div class="d-flex justify-content-between mb-2">
                <span>Platform Fee:</span>
                <span>₹${platformFee}</span>
            </div>
            <hr>
            <div class="d-flex justify-content-between fw-bold">
                <span>Total:</span>
                <span>₹${total}</span>
            </div>
        `;
    }
}

// City selection modal
function initializeCityModal() {
    // Auto-detect user location (mock implementation)
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function(position) {
                // Mock city detection based on coordinates
                console.log('Location detected:', position.coords);
            },
            function(error) {
                console.log('Location detection failed:', error);
            }
        );
    }
}

// Scroll effects
function initializeScrollEffects() {
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('loading');
                
                // Stagger animation for cards
                if (entry.target.classList.contains('gym-card') || 
                    entry.target.classList.contains('trainer-card')) {
                    const cards = entry.target.parentElement.children;
                    Array.from(cards).forEach((card, index) => {
                        setTimeout(() => {
                            card.classList.add('loading');
                        }, index * 100);
                    });
                }
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll(
        '.gym-card, .trainer-card, .feature-card, .service-card, .membership-card'
    );
    
    animatedElements.forEach(el => {
        observer.observe(el);
    });

    // Smooth scroll for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Utility functions
function showToast(message, type = 'success') {
    // Create toast notification
    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-white bg-${type} border-0`;
    toast.setAttribute('role', 'alert');
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">${message}</div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
    `;

    // Add to page
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container position-fixed bottom-0 end-0 p-3';
        document.body.appendChild(toastContainer);
    }

    toastContainer.appendChild(toast);
    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();

    // Remove after hiding
    toast.addEventListener('hidden.bs.toast', () => {
        toast.remove();
    });
}

// Search functionality
function initializeSearch() {
    const searchButton = document.querySelector('.btn-outline-light');
    if (searchButton) {
        searchButton.addEventListener('click', function() {
            // Mock search functionality
            showToast('Search feature coming soon!', 'info');
        });
    }
}

// Initialize search
document.addEventListener('DOMContentLoaded', initializeSearch);

// Export functions for global use
window.FitflixApp = {
    showToast,
    updateBookingPrice
};