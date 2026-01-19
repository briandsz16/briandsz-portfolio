// Cursor Trail Stars Effect
class CursorTrailStars {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.zIndex = '10000';
        this.canvas.style.pointerEvents = 'none';
        document.body.appendChild(this.canvas);

        this.stars = [];
        this.mouseX = 0;
        this.mouseY = 0;
        this.lastX = 0;
        this.lastY = 0;
        this.cursorSize = 6;
        this.glowColor = '#0ef';

        this.setupEventListeners();
        this.animate();
    }

    setupEventListeners() {
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
            
            // Create stars continuously with smaller distance threshold
            const distance = Math.hypot(
                this.mouseX - this.lastX,
                this.mouseY - this.lastY
            );
            
            if (distance > 1.5) {
                // Create multiple stars per movement for smoother trail
                this.stars.push({
                    x: this.mouseX,
                    y: this.mouseY,
                    life: 1,
                    maxLife: 0.6,
                    size: Math.random() * 2.5 + 1.5
                });
                
                // Keep stars limited for performance
                if (this.stars.length > 100) {
                    this.stars.shift();
                }
                
                this.lastX = this.mouseX;
                this.lastY = this.mouseY;
            }
        });

        window.addEventListener('resize', () => {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        });
    }

    drawStar(x, y, size, opacity) {
        const spikes = 5;
        const step = Math.PI / spikes;
        
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.fillStyle = `rgba(0, 238, 255, ${opacity})`;
        this.ctx.strokeStyle = `rgba(0, 238, 255, ${opacity * 0.7})`;
        this.ctx.lineWidth = 0.8;
        this.ctx.shadowColor = this.glowColor;
        this.ctx.shadowBlur = 8 * opacity;
        this.ctx.shadowOffsetX = 0;
        this.ctx.shadowOffsetY = 0;
        
        this.ctx.beginPath();
        let angle = -Math.PI / 2;
        
        for (let i = 0; i < spikes * 2; i++) {
            const radius = i % 2 === 0 ? size : size / 2.5;
            const px = Math.cos(angle) * radius;
            const py = Math.sin(angle) * radius;
            
            if (i === 0) {
                this.ctx.moveTo(px, py);
            } else {
                this.ctx.lineTo(px, py);
            }
            
            angle += step;
        }
        
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();
        this.ctx.restore();
    }

    animate = () => {
        // Clear canvas completely
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Update and draw stars
        for (let i = this.stars.length - 1; i >= 0; i--) {
            const star = this.stars[i];
            
            // Smoother fade out
            star.life -= 1 / (60 * star.maxLife);
            
            if (star.life <= 0) {
                this.stars.splice(i, 1);
                continue;
            }

            // Draw star with smooth fade
            const opacity = Math.max(0, star.life);
            const size = star.size * (0.3 + opacity * 0.7);
            
            this.drawStar(star.x, star.y, size, opacity);
        }

        // Draw main cursor dot with sharp appearance
        this.ctx.save();
        this.ctx.shadowColor = this.glowColor;
        this.ctx.shadowBlur = 12;
        this.ctx.shadowOffsetX = 0;
        this.ctx.shadowOffsetY = 0;
        
        // Outer ring
        this.ctx.strokeStyle = `rgba(0, 238, 255, 0.7)`;
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.arc(this.mouseX, this.mouseY, this.cursorSize + 3, 0, Math.PI * 2);
        this.ctx.stroke();
        
        // Inner filled dot
        this.ctx.fillStyle = `rgba(0, 238, 255, 1)`;
        this.ctx.beginPath();
        this.ctx.arc(this.mouseX, this.mouseY, this.cursorSize, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.ctx.restore();

        requestAnimationFrame(this.animate);
    };
}

// Initialize cursor trail effect when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Detect if device is mobile/touch device
    const isTouchDevice = () => {
        return (('ontouchstart' in window) ||
                (navigator.maxTouchPoints > 0) ||
                (navigator.msMaxTouchPoints > 0) ||
                window.innerWidth <= 768);
    };
    
    // Cursor trail instance
    let cursorTrail = null;
    
    // Only initialize cursor trail on desktop devices
    if (!isTouchDevice()) {
        cursorTrail = new CursorTrailStars();
    }
    
    // Handle resize to switch between desktop and mobile
    window.addEventListener('resize', () => {
        const isMobile = isTouchDevice();
        
        if (!isMobile && !cursorTrail) {
            // Switch from mobile to desktop
            cursorTrail = new CursorTrailStars();
        } else if (isMobile && cursorTrail) {
            // Switch from desktop to mobile - remove cursor trail
            cursorTrail.canvas.remove();
            cursorTrail = null;
        }
    });
    
    // Mobile Menu Toggle
    const mobileMenuIcon = document.querySelector('.mobile-menu-icon');
    const mobileNavbar = document.querySelector('.mobile-navbar');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    
    // Toggle mobile menu
    mobileMenuIcon.addEventListener('click', () => {
        mobileMenuIcon.classList.toggle('active');
        mobileNavbar.classList.toggle('active');
    });
    
    // Close menu when a link is clicked
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Get the target section
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                // Close the menu
                mobileMenuIcon.classList.remove('active');
                mobileNavbar.classList.remove('active');
                
                // Update active state
                mobileNavLinks.forEach(item => item.classList.remove('active'));
                link.classList.add('active');
                
                // Smooth scroll
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Update active mobile nav link based on scroll
    window.addEventListener('scroll', () => {
        let currentSection = '';
        const sections = document.querySelectorAll('section');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.pageYOffset >= sectionTop - 200) {
                currentSection = section.getAttribute('id');
            }
        });
        
        mobileNavLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + currentSection) {
                link.classList.add('active');
            }
        });
    });
    
    // Scroll to top on page load
    window.scrollTo(0, 0);
});

var typed  = new Typed(".multiple-text", {
    strings: ["Web Developer","UX/UI Designer"],
    typeSpeed: 100,
    backSpeed: 100,
    backDelay: 1000,
    loop: true
})

// Navigation Sliding Bar Animation
const navLinks = document.querySelectorAll('.navbar a');
const navSlider = document.querySelector('.nav-slider');

function updateSliderPosition() {
    const activeLink = document.querySelector('.navbar a.active');
    if (activeLink) {
        const linkWidth = activeLink.offsetWidth;
        const linkLeft = activeLink.offsetLeft;
        
        navSlider.style.width = linkWidth + 'px';
        navSlider.style.left = linkLeft + 'px';
    }
}

// Add click event to all nav links
navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        
        // Only prevent default if it's an anchor link
        if (href.startsWith('#')) {
            e.preventDefault();
            
            // Get the target section
            const targetId = href.substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                // Remove active class from all links
                navLinks.forEach(item => item.classList.remove('active'));
                
                // Add active class to clicked link
                this.classList.add('active');
                
                // Smooth scroll to section
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Update slider position
                updateSliderPosition();
            }
        }
    });
});

// Update active link based on scroll position
window.addEventListener('scroll', () => {
    let currentSection = '';
    
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.pageYOffset >= sectionTop - 200) {
            currentSection = section.getAttribute('id');
        }
    });
    
    // Update active link
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + currentSection) {
            link.classList.add('active');
        }
    });
    
    // Update slider position
    updateSliderPosition();
});

// Initialize slider position on page load
window.addEventListener('load', updateSliderPosition);

// Update slider position on window resize
window.addEventListener('resize', updateSliderPosition);

// Scroll Animation for Sections
class ScrollAnimation {
    constructor() {
        this.setupScrollAnimations();
        this.handleScroll();
    }

    setupScrollAnimations() {
        // Add animation classes to sections and footer
        const sections = document.querySelectorAll('section.about, section.skills, section.portfolio, section.contact, footer.footer');
        
        sections.forEach((section) => {
            section.classList.add('scroll-animate');
        });
    }

    handleScroll() {
        const observerOptions = {
            threshold: 0.15,
            rootMargin: '0px 0px -80px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        document.querySelectorAll('.scroll-animate').forEach(element => {
            observer.observe(element);
        });
    }
}

// Initialize scroll animations
document.addEventListener('DOMContentLoaded', () => {
    new ScrollAnimation();
});