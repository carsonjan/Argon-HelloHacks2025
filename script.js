// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
}

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    if (hamburger) {
        hamburger.classList.remove('active');
    }
    if (navMenu) {
        navMenu.classList.remove('active');
    }
}));

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
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

// Navbar background change on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Form submission handling
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const name = this.querySelector('input[type="text"]').value;
        const email = this.querySelector('input[type="email"]').value;
        const message = this.querySelector('textarea').value;
        
        // Simple validation
        if (!name || !email || !message) {
            showNotification('Please fill in all fields', 'error');
            return;
        }
        
        if (!isValidEmail(email)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }
        
        // Simulate form submission
        showNotification('Thank you! Your message has been sent successfully.', 'success');
        this.reset();
    });
}

// Email validation function
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 400px;
        font-family: 'Inter', sans-serif;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove after 5 seconds
    const autoRemove = setTimeout(() => {
        removeNotification(notification);
    }, 5000);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        clearTimeout(autoRemove);
        removeNotification(notification);
    });
    
    // Hover to pause auto-remove
    notification.addEventListener('mouseenter', () => {
        clearTimeout(autoRemove);
    });
    
    notification.addEventListener('mouseleave', () => {
        setTimeout(() => {
            removeNotification(notification);
        }, 2000);
    });
}

function removeNotification(notification) {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

// Intersection Observer for animations
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

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.feature-card, .stat, .contact-info, .contact-form');
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Listing filtering helpers
const listingFilterState = {
    price: { min: null, max: null },
    distance: { min: null, max: null }
};

const parseListingPrice = (card) => {
    const priceElement = card.querySelector('.listing-price');
    if (!priceElement) return null;
    const match = priceElement.textContent.replace(/,/g, '').match(/\d+(?:\.\d+)?/);
    return match ? parseFloat(match[0]) : null;
};

const parseListingDistance = (card) => {
    const metaElement = card.querySelector('.listing-meta');
    if (!metaElement) return null;
    const text = metaElement.textContent || '';
    const distanceMatch = text.match(/([0-9]+(?:\.[0-9]+)?)\s*km/i);
    if (distanceMatch) {
        return parseFloat(distanceMatch[1]);
    }
    if (/on campus/i.test(text)) {
        return 0;
    }
    return null;
};

function updateListingVisibility() {
    const cards = document.querySelectorAll('.listing-card');
    let visibleCount = 0;

    cards.forEach(card => {
        const priceValue = parseListingPrice(card);
        const distanceValue = parseListingDistance(card);

        const matchesPrice = (() => {
            const { min, max } = listingFilterState.price;
            if (min === null && max === null) return true;
            if (!Number.isFinite(priceValue)) return true;
            if (min !== null && priceValue < min) return false;
            if (max !== null && priceValue > max) return false;
            return true;
        })();

        const matchesDistance = (() => {
            const { min, max } = listingFilterState.distance;
            if (min === null && max === null) return true;
            if (!Number.isFinite(distanceValue)) return true;
            if (min !== null && distanceValue < min) return false;
            if (max !== null && distanceValue > max) return false;
            return true;
        })();

        const isVisible = matchesPrice && matchesDistance;
        card.style.display = isVisible ? '' : 'none';
        if (isVisible) {
            visibleCount += 1;
        }
    });

    const resultsCount = document.querySelector('.results-count');
    if (resultsCount) {
        const label = visibleCount === 1 ? 'listing' : 'listings';
        resultsCount.textContent = `Showing ${visibleCount} ${label}`;
    }
}

// Price range slider syncing
const initPriceSlider = (rangeSlider) => {
    const minNumber = rangeSlider.querySelector('.min-price');
    const maxNumber = rangeSlider.querySelector('.max-price');
    const minRange = rangeSlider.querySelector('.min-input');
    const maxRange = rangeSlider.querySelector('.max-input');
    const sliderTrack = rangeSlider.querySelector('.slider');
    const progressBar = sliderTrack ? sliderTrack.querySelector('.progress') : null;
    const minDisplay = rangeSlider.querySelector('.min-display');
    const maxDisplay = rangeSlider.querySelector('.max-display');
    const prefix = rangeSlider.dataset.prefix !== undefined ? rangeSlider.dataset.prefix : '$';
    const suffix = rangeSlider.dataset.suffix || '';
    const sliderType = prefix === '$' ? 'price' : suffix.trim() === 'km' ? 'distance' : null;

    if (!minNumber || !maxNumber || !minRange || !maxRange) {
        return;
    }

    const minLimit = parseFloat(minRange.min || minNumber.min || '0');
    const maxLimit = parseFloat(maxRange.max || maxNumber.max || '100');
    const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
    const formatValue = (value) => {
        const numericValue = Math.round(Number(value));
        if (!Number.isFinite(numericValue)) {
            return `${prefix}${value}${suffix}`;
        }
        return `${prefix}${numericValue.toLocaleString()}${suffix}`;
    };

    let minTooltip = null;
    let maxTooltip = null;

    if (sliderTrack) {
        const createTooltip = (className) => {
            const tooltip = document.createElement('div');
            tooltip.className = `thumb-tooltip ${className}`;
            sliderTrack.appendChild(tooltip);
            return tooltip;
        };

        minTooltip = createTooltip('min-tooltip');
        maxTooltip = createTooltip('max-tooltip');
        sliderTrack.classList.add('show-tooltips');
    }

    minRange.setAttribute('max', maxLimit);
    maxRange.setAttribute('min', minLimit);

    const renderDisplays = (minValue, maxValue) => {
        if (minDisplay) {
            minDisplay.textContent = formatValue(minValue);
        }
        if (maxDisplay) {
            maxDisplay.textContent = formatValue(maxValue);
        }
    };

    const clampTooltipPercent = (percent) => Math.min(Math.max(percent, 5), 95);

    const updateProgress = () => {
        const minValue = parseFloat(minRange.value);
        const maxValue = parseFloat(maxRange.value);
        const span = Math.max(maxLimit - minLimit, 1);
        const start = ((minValue - minLimit) / span) * 100;
        const end = ((maxValue - minLimit) / span) * 100;
        const width = Math.max(end - start, 0);

        if (progressBar) {
            progressBar.style.left = `${start}%`;
            progressBar.style.width = `${width}%`;
        }

        if (minTooltip) {
            minTooltip.textContent = formatValue(minValue);
            minTooltip.style.left = `${clampTooltipPercent(start)}%`;
        }

        if (maxTooltip) {
            maxTooltip.textContent = formatValue(maxValue);
            maxTooltip.style.left = `${clampTooltipPercent(end)}%`;
        }
    };

    const updateTrackState = (isActive) => {
        if (!sliderTrack) return;
        sliderTrack.classList.toggle('is-active', isActive);
    };

    const bindActiveHandlers = (input) => {
        input.addEventListener('pointerdown', () => updateTrackState(true));
        input.addEventListener('pointerup', () => updateTrackState(false));
        input.addEventListener('pointerleave', () => updateTrackState(false));
        input.addEventListener('focus', () => updateTrackState(true));
        input.addEventListener('blur', () => updateTrackState(false));
        input.addEventListener('touchstart', () => updateTrackState(true), { passive: true });
        input.addEventListener('touchend', () => updateTrackState(false));
        input.addEventListener('touchcancel', () => updateTrackState(false));
    };

    bindActiveHandlers(minRange);
    bindActiveHandlers(maxRange);
    window.addEventListener('pointerup', () => updateTrackState(false));
    window.addEventListener('pointercancel', () => updateTrackState(false));

    const syncFromRange = () => {
        let minValue = parseFloat(minRange.value);
        let maxValue = parseFloat(maxRange.value);

        if (!Number.isFinite(minValue)) {
            minValue = minLimit;
        }
        if (!Number.isFinite(maxValue)) {
            maxValue = maxLimit;
        }

        if (minValue > maxValue) {
            minValue = maxValue;
            minRange.value = minValue;
        }

        minValue = Math.round(minValue);
        maxValue = Math.round(maxValue);

        minRange.value = minValue;
        maxRange.value = maxValue;
        minNumber.value = minValue;
        maxNumber.value = maxValue;
        renderDisplays(minValue, maxValue);
        updateProgress();
        if (sliderType === 'price') {
            listingFilterState.price.min = minValue;
            listingFilterState.price.max = maxValue;
        }
        if (sliderType === 'distance') {
            listingFilterState.distance.min = minValue;
            listingFilterState.distance.max = maxValue;
        }
        if (sliderType) {
            updateListingVisibility();
        }
    };

    const syncFromNumber = () => {
        let minValue = parseFloat(minNumber.value);
        let maxValue = parseFloat(maxNumber.value);

        if (!Number.isFinite(minValue)) {
            minValue = minLimit;
        }
        if (!Number.isFinite(maxValue)) {
            maxValue = maxLimit;
        }

        minValue = clamp(minValue, minLimit, maxValue);
        maxValue = clamp(maxValue, minValue, maxLimit);

        minValue = Math.round(minValue);
        maxValue = Math.round(maxValue);

        minRange.value = minValue;
        maxRange.value = maxValue;
        minNumber.value = minValue;
        maxNumber.value = maxValue;
        renderDisplays(minValue, maxValue);
        updateProgress();
        if (sliderType === 'price') {
            listingFilterState.price.min = minValue;
            listingFilterState.price.max = maxValue;
        }
        if (sliderType === 'distance') {
            listingFilterState.distance.min = minValue;
            listingFilterState.distance.max = maxValue;
        }
        if (sliderType) {
            updateListingVisibility();
        }
    };

    minRange.addEventListener('input', () => {
        if (parseFloat(minRange.value) > parseFloat(maxRange.value)) {
            maxRange.value = minRange.value;
        }
        syncFromRange();
    });

    maxRange.addEventListener('input', () => {
        if (parseFloat(maxRange.value) < parseFloat(minRange.value)) {
            minRange.value = maxRange.value;
        }
        syncFromRange();
    });

    const handleMinNumberInput = () => {
        if (minNumber.value === '') return;
        syncFromNumber();
    };

    const handleMaxNumberInput = () => {
        if (maxNumber.value === '') return;
        syncFromNumber();
    };

    const handleMinNumberCommit = () => {
        if (minNumber.value === '') {
            minNumber.value = minLimit;
        }
        syncFromNumber();
    };

    const handleMaxNumberCommit = () => {
        if (maxNumber.value === '') {
            maxNumber.value = maxLimit;
        }
        syncFromNumber();
    };

    minNumber.addEventListener('input', handleMinNumberInput);
    minNumber.addEventListener('change', handleMinNumberCommit);
    minNumber.addEventListener('blur', handleMinNumberCommit);
    maxNumber.addEventListener('input', handleMaxNumberInput);
    maxNumber.addEventListener('change', handleMaxNumberCommit);
    maxNumber.addEventListener('blur', handleMaxNumberCommit);

    syncFromNumber();
    if (sliderType) {
        const minValue = parseFloat(minRange.value);
        const maxValue = parseFloat(maxRange.value);
        if (sliderType === 'price') {
            listingFilterState.price.min = minValue;
            listingFilterState.price.max = maxValue;
        }
        if (sliderType === 'distance') {
            listingFilterState.distance.min = minValue;
            listingFilterState.distance.max = maxValue;
        }
        updateListingVisibility();
    }
};

const setupPriceSliders = () => {
    const sliders = document.querySelectorAll('.range-slider');
    if (!sliders.length) return;
    sliders.forEach(initPriceSlider);
};

const initializeFilters = () => {
    setupPriceSliders();
    updateListingVisibility();
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeFilters);
} else {
    initializeFilters();
}

// Button click animations
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function(e) {
        // Create ripple effect
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
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
        
        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Add ripple animation CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Counter animation for stats
function animateCounters() {
    const counters = document.querySelectorAll('.stat h3');
    
    counters.forEach(counter => {
        const target = parseInt(counter.textContent.replace(/[^\d]/g, ''));
        const increment = target / 100;
        let current = 0;
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                if (current > target) current = target;
                
                // Format the number based on the original text
                const originalText = counter.textContent;
                if (originalText.includes('K')) {
                    counter.textContent = Math.floor(current / 1000) + 'K+';
                } else if (originalText.includes('%')) {
                    counter.textContent = current.toFixed(1) + '%';
                } else if (originalText.includes('/')) {
                    counter.textContent = originalText;
                } else {
                    counter.textContent = Math.floor(current);
                }
                
                requestAnimationFrame(updateCounter);
            }
        };
        
        updateCounter();
    });
}

// Trigger counter animation when stats section is visible
const statsSection = document.querySelector('.stats');
if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    statsObserver.observe(statsSection);
}

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroGraphic = document.querySelector('.hero-graphic');
    
    if (heroGraphic && scrolled < window.innerHeight) {
        const rate = scrolled * -0.5;
        heroGraphic.style.transform = `translateY(${rate}px)`;
    }
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Add loading styles
const loadingStyle = document.createElement('style');
loadingStyle.textContent = `
    body {
        opacity: 0;
        transition: opacity 0.5s ease;
    }
    
    body.loaded {
        opacity: 1;
    }
`;
document.head.appendChild(loadingStyle);
