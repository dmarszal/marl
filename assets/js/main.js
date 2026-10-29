// Content is fully visible without JS; this file only adds motion and the menu toggle.
// The `js` class on <html> is set by an inline script in <head>.
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.addEventListener('DOMContentLoaded', function() {
    initializeMobileMenu();
    initializeCompactHeader();
    initializeHeroSlideshow();
    initializeReveal();
    initializeFooterYear();
    initializeConsent();
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

// Consent for Google services. Google Analytics and the embedded Google Maps set cookies,
// so neither loads until the visitor agrees. A map can also be shown once by clicking it.
// The choice is kept in localStorage and can be changed from the footer.
const CONSENT_KEY = 'marl-consent';
const GA_ID = 'G-NR3J2W5EFD';

function readConsent() {
    try { return localStorage.getItem(CONSENT_KEY); } catch { return null; }
}

function saveConsent(value) {
    try { localStorage.setItem(CONSENT_KEY, value); } catch { /* private mode: ask again next time */ }
}

function loadAnalytics() {
    if (window.gtag) return;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function() { dataLayer.push(arguments); };
    gtag('js', new Date());
    gtag('config', GA_ID);
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    document.head.appendChild(script);
}

function removeAnalyticsCookies() {
    const host = location.hostname;
    const domains = ['', host, '.' + host, '.' + host.split('.').slice(-2).join('.')];
    document.cookie.split(';').map(c => c.split('=')[0].trim())
        .filter(name => name === '_ga' || name.startsWith('_ga_'))
        .forEach(name => domains.forEach(d => {
            document.cookie = `${name}=; Max-Age=0; path=/${d ? '; domain=' + d : ''}`;
        }));
}

function loadMap(placeholder) {
    const iframe = document.createElement('iframe');
    iframe.title = placeholder.dataset.mapTitle;
    iframe.src = placeholder.dataset.mapSrc;
    iframe.loading = 'lazy';
    iframe.allowFullscreen = true;
    iframe.referrerPolicy = 'no-referrer-when-downgrade';
    placeholder.replaceWith(iframe);
}

function loadAllMaps() {
    document.querySelectorAll('[data-map-src]').forEach(loadMap);
}

function showConsentBanner() {
    if (document.querySelector('.consent')) return;
    const banner = document.createElement('section');
    banner.className = 'consent';
    banner.setAttribute('aria-label', 'Zgoda na pliki cookies');
    banner.innerHTML = `
        <div class="wrap consent-inner">
            <p>Za Twoją zgodą używamy Google Analytics do statystyk odwiedzin i pokazujemy Mapy Google.
            Obie usługi zapisują pliki cookies. Szczegóły w <a href="polityka-prywatnosci.html">polityce prywatności</a>.</p>
            <div class="consent-actions">
                <button type="button" class="btn" data-consent="granted">Akceptuję</button>
                <button type="button" class="btn" data-consent="denied">Odrzucam</button>
            </div>
        </div>`;
    banner.addEventListener('click', e => {
        const choice = e.target.dataset && e.target.dataset.consent;
        if (!choice) return;
        const previous = readConsent();
        saveConsent(choice);
        banner.remove();
        if (choice === 'granted') {
            loadAnalytics();
            loadAllMaps();
        } else if (previous === 'granted') {
            // Withdrawing: drop the cookies and reload so the loaded scripts are gone too.
            removeAnalyticsCookies();
            location.reload();
        }
    });
    document.body.appendChild(banner);
}

function initializeConsent() {
    const consent = readConsent();
    if (consent === 'granted') {
        loadAnalytics();
        loadAllMaps();
    } else if (consent !== 'denied') {
        showConsentBanner();
    }

    document.querySelectorAll('[data-map-load]').forEach(button => {
        button.addEventListener('click', () => loadMap(button.closest('[data-map-src]')));
    });
    document.querySelectorAll('[data-consent-open]').forEach(button => {
        button.addEventListener('click', showConsentBanner);
    });
}
