// DOM Elements
const themeToggle = document.getElementById('themeToggle');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const nav = document.querySelector('.nav');
const body = document.body;
const snowContainer = document.getElementById('snowContainer');

// Initialize theme from localStorage or system preference
function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Remove any existing theme classes
    body.classList.remove('dark-mode', 'light-mode');
    
    // Apply saved theme or system preference
    if (savedTheme === 'light') {
        body.classList.add('light-mode');
    } else if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        body.classList.add('dark-mode');
    } else if (!savedTheme && !prefersDark) {
        body.classList.add('light-mode');
    }
}

// Theme Toggle
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const isLightMode = body.classList.contains('light-mode');
        
        if (isLightMode) {
            body.classList.remove('light-mode');
            body.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark');
        } else {
            body.classList.remove('dark-mode');
            body.classList.add('light-mode');
            localStorage.setItem('theme', 'light');
        }
        
        showToast(`Theme changed to ${isLightMode ? 'dark' : 'light'} mode`, 'success');
    });
}

// Mobile Menu Toggle
if (mobileMenuBtn && nav) {
    mobileMenuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        nav.classList.toggle('active');
        mobileMenuBtn.classList.toggle('active');
        
        // Toggle body overflow when menu is open
        if (nav.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });
}

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (nav && mobileMenuBtn && nav.classList.contains('active') && 
        !nav.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
        nav.classList.remove('active');
        mobileMenuBtn.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Close mobile menu when clicking a link
document.querySelectorAll('.nav a').forEach(link => {
    link.addEventListener('click', () => {
        if (nav && nav.classList.contains('active')) {
            nav.classList.remove('active');
            if (mobileMenuBtn) mobileMenuBtn.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
});

// Toast notification function
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(toast);
    
    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        
        if (targetId === '#') return;
        
        if (targetId.startsWith('#')) {
            const targetElement = document.querySelector(targetId);
            if (!targetElement) return;
            
            e.preventDefault();
            
            // Calculate header height for offset
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = targetElement.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Update active nav link on scroll
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav a[href^="#"]');
    const scrollPosition = window.scrollY + 100;
    
    let currentSectionId = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            currentSectionId = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (href === `#${currentSectionId}` || (currentSectionId === 'home' && href === '#')) {
            link.classList.add('active');
        }
    });
}

// Snow Animation
function createSnow() {
    if (!snowContainer) return;
    
    const isMobile = window.innerWidth < 768;
    const snowCount = isMobile ? 40 : 80;
    
    for (let i = 0; i < snowCount; i++) {
        const snow = document.createElement('div');
        snow.classList.add('snow');
        
        // Random properties
        const size = Math.random() * 4 + 2;
        const posX = Math.random() * 100;
        const duration = Math.random() * 10 + 5;
        const delay = Math.random() * 5;
        const opacity = Math.random() * 0.5 + 0.3;
        
        // Apply styles
        snow.style.width = `${size}px`;
        snow.style.height = `${size}px`;
        snow.style.left = `${posX}%`;
        snow.style.animationDuration = `${duration}s`;
        snow.style.animationDelay = `${delay}s`;
        snow.style.opacity = opacity;
        snow.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
        snow.style.filter = 'blur(0.5px)';
        
        snowContainer.appendChild(snow);
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize theme
    initTheme();
    
    // Add toast styles
    addToastStyles();
    
    // Initialize snow animation
    createSnow();
    
    // Set up scroll event listener
    window.addEventListener('scroll', updateActiveNavLink);
    updateActiveNavLink(); // Initial call
    
    // Handle image loading
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('load', function() {
            this.classList.add('loaded');
        });
        
        // If image is already loaded
        if (img.complete) {
            img.classList.add('loaded');
        }
    });
    
    // Add animation to cards
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
    
    // Observe cards for animation
    const cards = document.querySelectorAll('.nft-item, .step, .timeline-item, .distribution-item, .feature-item, .utility-item');
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(card);
    });
    
    // Log successful load
    console.log('Iconic Cats website loaded successfully! 🐱');
});

// Handle window resize
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        // Close mobile menu on resize if open
        if (window.innerWidth > 768 && nav && nav.classList.contains('active')) {
            nav.classList.remove('active');
            if (mobileMenuBtn) mobileMenuBtn.classList.remove('active');
            document.body.style.overflow = '';
        }
        
        // Clear and recreate snow on resize
        if (snowContainer) {
            snowContainer.innerHTML = '';
            createSnow();
        }
    }, 250);
});

// Add keyboard navigation support
document.addEventListener('keydown', (e) => {
    // Close mobile menu on Escape key
    if (e.key === 'Escape' && nav && nav.classList.contains('active')) {
        nav.classList.remove('active');
        if (mobileMenuBtn) mobileMenuBtn.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // Theme toggle with T key
    if (e.key === 't' && !e.ctrlKey && !e.metaKey) {
        if (themeToggle) themeToggle.click();
    }
});

// Add toast styles to head
function addToastStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .toast {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 24px;
            background: var(--card-bg);
            color: var(--text-color);
            border-radius: 8px;
            border: 1px solid var(--border-color);
            box-shadow: var(--shadow);
            display: flex;
            align-items: center;
            gap: 10px;
            z-index: 10000;
            transform: translateX(150%);
            transition: transform 0.3s ease;
        }
        .toast.show {
            transform: translateX(0);
        }
        .toast-success {
            border-left: 4px solid #4CAF50;
        }
        .toast-error {
            border-left: 4px solid #f44336;
        }
        .toast-warning {
            border-left: 4px solid #FF9800;
        }
        .toast i {
            font-size: 18px;
        }
        .toast-success i {
            color: #4CAF50;
        }
        .toast-error i {
            color: #f44336;
        }
        .toast-warning i {
            color: #FF9800;
        }
    `;
    document.head.appendChild(style);
}

