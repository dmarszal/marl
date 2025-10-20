// Sample property data (in a real app, this would come from a backend API)
const properties = [
    {
        id: 1,
        title: 'Topaz - Supermarket Spożywczy',
        price: 2500,
        bedrooms: 2,
        bathrooms: 2,
        sqft: 1200,
        location: 'Raciąż',
        image: 'property1.jpg',
        featured: true
    },
    {
        id: 2,
        title: 'Rossmann',
        price: 3500,
        bedrooms: 4,
        bathrooms: 3,
        sqft: 2400,
        location: 'Raciąż',
        image: 'property2.jpg',
        featured: true
    },
    {
        id: 3,
        title: 'Pepco',
        price: 5000,
        bedrooms: 5,
        bathrooms: 4.5,
        sqft: 3800,
        location: 'Raciąż',
        image: 'property3.jpg',
        featured: true
    }
];

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the page
    initializePage();
    
    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Initialize the page
function initializePage() {
    // Load featured properties
    displayFeaturedProperties();
    
    // Initialize any other components
    initializeMobileMenu();
    initializePromoRotator();
    initializeHeroSlideshow();
    initializeTenantReveal();
}

// Display featured properties on the homepage
function displayFeaturedProperties() {
    const propertyGrid = document.querySelector('.property-grid');
    
    if (!propertyGrid) return;
    
    // Clear any existing content
    propertyGrid.innerHTML = '';
    
    // Filter featured properties
    const featuredProperties = properties.filter(property => property.featured);
    
    // Create property cards
    featuredProperties.forEach(property => {
        const propertyCard = createPropertyCard(property);
        propertyGrid.appendChild(propertyCard);
    });
}

// Create a property card element
function createPropertyCard(property) {
    const card = document.createElement('div');
    card.className = 'property-card';
    
    card.innerHTML = `
        <div class="property-image" style="background-image: url('../images/properties/${property.image}')">
            <div class="property-price">${property.price.toLocaleString()} zł/mies.</div>
        </div>
        <div class="property-details">
            <h3>${property.title}</h3>
            <p class="property-location">${property.location}</p>
            <div class="property-features">
                <span>${property.bedrooms} Pokoje</span>
                <span>${property.bathrooms} Łazienki</span>
                <span>${property.sqft.toLocaleString()} m²</span>
            </div>
            <a href="contact.html?property=${property.id}" class="cta-button">Zapytaj o tę nieruchomość</a>
        </div>
    `;
    
    return card;
}

// Initialize mobile menu functionality
function initializeMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle && navLinks) {
        // initialize ARIA state
        menuToggle.setAttribute('aria-expanded', 'false');

        menuToggle.addEventListener('click', function() {
            const isOpen = navLinks.classList.toggle('active');
            this.classList.toggle('active', isOpen);
            this.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });

        // close menu when a link is clicked (use event delegation)
        navLinks.addEventListener('click', function(e) {
            const target = e.target;
            if (target && target.tagName === 'A' && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                menuToggle.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }
}

// Crossfade hero slideshow on pages that contain .hero-slide elements
function initializeHeroSlideshow() {
    const slides = document.querySelectorAll('.hero .hero-slides .hero-slide');
    if (!slides.length) return;

    let index = 0;
    // ensure exactly one active at start
    slides.forEach((s, i) => s.classList.toggle('is-active', i === 0));

    const next = () => {
        const current = slides[index];
        index = (index + 1) % slides.length;
        const upcoming = slides[index];
        if (current) current.classList.remove('is-active');
        if (upcoming) upcoming.classList.add('is-active');
    };

    // rotate every 6 seconds
    setInterval(next, 6000);
}

// Reveal tenant cards and shop sections on scroll (slide-in animation)
function initializeTenantReveal() {
    const revealTargets = document.querySelectorAll('.tenant-card, .shop-logo, .shop-text');
    if (!revealTargets.length) return;

    const observer = new IntersectionObserver(
        (entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    obs.unobserve(entry.target);
                }
            });
        },
        { root: null, rootMargin: '0px 0px -10% 0px', threshold: 0.1 }
    );

    revealTargets.forEach(el => observer.observe(el));
}

// Simple announcements rotator for the promo strip
function initializePromoRotator() {
    const messageEl = document.querySelector('.promo .message');
    if (!messageEl) return;

    const messages = [
        'Nowe godziny otwarcia: Poniedziałek–Sobota 7:00–22:00',
        'Zapraszamy do zakupów!',
        'Bezpłatny parking dla klientów ',
        'Wygodny dojazd',
        'Topaz • Rossmann • Pepco – wszystko w jednym miejscu',
        '24/7 odbiór paczek InPost i Allegro One Box'
    ];

    let idx = 0;
    let timerId = null;

    const update = () => {
        messageEl.style.opacity = '0';
        setTimeout(() => {
            messageEl.textContent = messages[idx];
            messageEl.style.opacity = '1';
            idx = (idx + 1) % messages.length;
        }, 200);
    };

    // Initial paint
    messageEl.style.transition = 'opacity 250ms ease';
    messageEl.textContent = messages[0];
    idx = 1;

    // Auto-rotate
    const start = () => { if (!timerId) timerId = setInterval(update, 5000); };
    const stop = () => { if (timerId) { clearInterval(timerId); timerId = null; } };
    start();

    // Pause on hover for accessibility
    const promo = document.querySelector('.promo');
    if (promo) {
        promo.addEventListener('mouseenter', stop);
        promo.addEventListener('mouseleave', start);
    }
}

// Form validation for contact form
function validateForm(form) {
    let isValid = true;
    const email = form.querySelector('input[type="email"]');
    const phone = form.querySelector('input[type="tel"]');
    const message = form.querySelector('textarea');
    
    // Simple email validation
    if (email && !/\S+@\S+\.\S+/.test(email.value)) {
        showError(email, 'Proszę podać prawidłowy adres email');
        isValid = false;
    }
    
    // Simple phone validation (at least 9 digits for Polish numbers)
    if (phone && phone.value.replace(/\D/g, '').length < 9) {
        showError(phone, 'Proszę podać prawidłowy numer telefonu');
        isValid = false;
    }
    
    // Check if message is not empty
    if (message && message.value.trim() === '') {
        showError(message, 'Proszę wprowadzić wiadomość');
        isValid = false;
    }
    
    return isValid;
}

// Show error message for form fields
function showError(input, message) {
    const formGroup = input.closest('.form-group');
    if (!formGroup) return;
    
    let errorElement = formGroup.querySelector('.error-message');
    
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        formGroup.appendChild(errorElement);
    }
    
    errorElement.textContent = message;
    formGroup.classList.add('has-error');
    
    // Remove error on input
    input.addEventListener('input', function clearError() {
        errorElement.textContent = '';
        formGroup.classList.remove('has-error');
        input.removeEventListener('input', clearError);
    });
}
