// Content is fully visible without JS; this file only adds motion and the menu toggle.
// The `js` class on <html> is set by an inline script in <head>.
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.addEventListener('DOMContentLoaded', function() {
    initializeMobileMenu();
    initializeCompactHeader();
    initializeHeroSlideshow();
    initializeReveal();
    initializeFooterYear();
});

// Initialize mobile menu functionality
function initializeMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        menuToggle.setAttribute('aria-expanded', 'false');

        menuToggle.addEventListener('click', function() {
            const isOpen = navLinks.classList.toggle('active');
            this.classList.toggle('active', isOpen);
            this.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });

        // close menu when a link is clicked (use event delegation)
        navLinks.addEventListener('click', function(e) {
            if (e.target.tagName === 'A' && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                menuToggle.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }
}

// Shrink the sticky header after scrolling. The gap between the two thresholds
// is larger than the height the header loses, so shrinking can't flip it back.
function initializeCompactHeader() {
    const header = document.querySelector('.site-header');
    if (!header) return;

    let ticking = false;
    const update = () => {
        const y = window.scrollY;
        if (y > 100) header.classList.add('is-scrolled');
        else if (y < 20) header.classList.remove('is-scrolled');
        ticking = false;
    };

    window.addEventListener('scroll', () => {
        if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    update();
}

// Crossfade hero slideshow; the first slide is shown by CSS when JS is off
function initializeHeroSlideshow() {
    const slides = document.querySelectorAll('.hero-slides .hero-slide');
    if (!slides.length) return;

    let index = 0;
    slides.forEach((s, i) => s.classList.toggle('is-active', i === 0));
    if (reduceMotion || slides.length < 2) return;

    // rotate every 6 seconds
    setInterval(() => {
        slides[index].classList.remove('is-active');
        index = (index + 1) % slides.length;
        slides[index].classList.add('is-active');
    }, 6000);
}

// Slide-in for elements marked .reveal; CSS hides them only when motion is allowed
function initializeReveal() {
    const targets = document.querySelectorAll('.reveal');
    if (!targets.length) return;

    if (reduceMotion || !('IntersectionObserver' in window)) {
        targets.forEach(el => el.classList.add('in-view'));
        return;
    }

    const observer = new IntersectionObserver(
        (entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    obs.unobserve(entry.target);
                }
            });
        },
        { rootMargin: '0px 0px -10% 0px', threshold: 0.1 }
    );

    targets.forEach(el => observer.observe(el));
}

// Current year in the footer; the markup holds a fallback year
function initializeFooterYear() {
    document.querySelectorAll('[data-year]').forEach(el => {
        el.textContent = new Date().getFullYear();
    });
}
