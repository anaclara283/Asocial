/* ==========================================================================
   ASOCIAL PREMIUM STUDIO JS SCRIPTS
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Custom Interactive Cursor (Desktop Only) ---
    const cursor = document.getElementById('custom-cursor');
    
    if (cursor) {
        // Track mouse movements
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = `${e.clientX}px`;
            cursor.style.top = `${e.clientY}px`;
        });

        // Hover scale states on interactive tags
        const hoverTargets = document.querySelectorAll('a, button, [tabindex], input, textarea, .service-card');
        hoverTargets.forEach((target) => {
            target.addEventListener('mouseenter', () => {
                cursor.classList.add('active');
            });
            target.addEventListener('mouseleave', () => {
                cursor.classList.remove('active');
            });
        });

        // Hide cursor when leaving document window
        document.addEventListener('mouseleave', () => {
            cursor.style.opacity = '0';
        });
        document.addEventListener('mouseenter', () => {
            cursor.style.opacity = '1';
        });
    }


    // --- 2. Shrinking Header On Scroll ---
    const header = document.getElementById('site-header');
    
    const checkHeaderScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    
    // Check initially on load and then on scroll
    checkHeaderScroll();
    window.addEventListener('scroll', checkHeaderScroll);


    // --- 3. Mobile Navigation Menu Toggle ---
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            const isOpen = navMenu.classList.contains('open');
            navMenu.classList.toggle('open');
            navToggle.classList.toggle('nav-menu-open');
            navToggle.setAttribute('aria-expanded', !isOpen);
        });

        // Close menu on link selection
        const navLinks = document.querySelectorAll('.nav-link, .nav-cta');
        navLinks.forEach((link) => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('open');
                navToggle.classList.remove('nav-menu-open');
                navToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }


    // --- 4. Scroll Reveal Animations (IntersectionObserver) ---
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    
    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    // Once animate is done, stop observing
                    revealObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px' // Trigger slightly before it hits fully
        });

        revealElements.forEach((el) => {
            revealObserver.observe(el);
        });
    } else {
        // Fallback if IntersectionObserver is not supported
        revealElements.forEach((el) => {
            el.classList.add('revealed');
        });
    }


    // --- 5. Timeline Step Scroll Highlighting ---
    const steps = document.querySelectorAll('.timeline-step');
    const progressLine = document.querySelector('.timeline-progress');
    const timelineContainer = document.querySelector('.timeline-container');
    
    if (steps.length > 0 && 'IntersectionObserver' in window) {
        const stepObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, {
            threshold: 0.5,
            rootMargin: '0px 0px -10% 0px'
        });

        steps.forEach((step) => {
            stepObserver.observe(step);
        });
    }
    
    // Dynamic timeline scroll indicator filling
    if (progressLine && timelineContainer) {
        window.addEventListener('scroll', () => {
            const rect = timelineContainer.getBoundingClientRect();
            const viewHeight = window.innerHeight;
            
            // Calculate how far through the timeline container the user is
            const containerHeight = rect.height;
            const containerTop = rect.top;
            
            // Percentage calculated based on container position relative to screen center
            let progress = (viewHeight / 2 - containerTop) / containerHeight;
            progress = Math.max(0, Math.min(1, progress));
            
            progressLine.style.height = `${progress * 100}%`;
        });
    }


    // --- 6. Start Your Project Card / Form Logic ---
    const startProjectBtn = document.getElementById('cta-button');
    const contactCard = document.getElementById('contact-card');
    const contactForm = document.getElementById('contact-form');
    const formSuccess = document.getElementById('form-success');
    
    // Links in header/hero that lead to contact should also open the form
    const contactLinks = document.querySelectorAll('a[href="#contact"]');
    
    const openContactForm = (e) => {
        if (contactCard) {
            e.preventDefault();
            contactCard.classList.add('open');
            
            // Smoothly scroll down to the contact card area
            const offset = 80;
            const cardTop = contactCard.getBoundingClientRect().top + window.scrollY - offset;
            
            window.scrollTo({
                top: cardTop,
                behavior: 'smooth'
            });
            
            // Fade button out slightly if open
            if (startProjectBtn) {
                startProjectBtn.style.opacity = '0.5';
                startProjectBtn.style.pointerEvents = 'none';
            }
        }
    };

    if (startProjectBtn) {
        startProjectBtn.addEventListener('click', openContactForm);
    }
    
    contactLinks.forEach((link) => {
        link.addEventListener('click', openContactForm);
    });

    // Form validation and submit
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Form Elements
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const messageInput = document.getElementById('message');
            
            let isValid = true;
            
            // Reset validation states
            document.querySelectorAll('.form-group').forEach((group) => {
                group.classList.remove('invalid');
            });
            
            // Validate Name
            if (!nameInput.value.trim()) {
                nameInput.parentElement.classList.add('invalid');
                isValid = false;
            }
            
            // Validate Email
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailInput.value.trim() || !emailPattern.test(emailInput.value)) {
                emailInput.parentElement.classList.add('invalid');
                isValid = false;
            }
            
            // Validate Message
            if (!messageInput.value.trim()) {
                messageInput.parentElement.classList.add('invalid');
                isValid = false;
            }
            
            // Success State Transition
            if (isValid) {
                // Change button text to indicate loading
                const submitBtn = contactForm.querySelector('button[type="submit"]');
                const originalText = submitBtn.textContent;
                submitBtn.textContent = "Sending...";
                submitBtn.disabled = true;

                // Submit form via fetch to Formsubmit
                fetch("https://formsubmit.co/ajax/anaclaragoncalveslopes@gmail.com", {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        name: nameInput.value,
                        email: emailInput.value,
                        message: messageInput.value
                    })
                })
                .then(response => response.json())
                .then(data => {
                    // Fade out form and fade in success
                    contactForm.style.transition = 'opacity 0.4s ease';
                    contactForm.style.opacity = '0';
                    
                    setTimeout(() => {
                        contactForm.style.display = 'none';
                        formSuccess.style.display = 'block';
                        formSuccess.style.opacity = '0';
                        formSuccess.style.transition = 'opacity 0.4s ease';
                        
                        // Force redraw for transition
                        formSuccess.getBoundingClientRect();
                        formSuccess.style.opacity = '1';
                    }, 400);
                })
                .catch(error => {
                    console.error("Error submitting form:", error);
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                    alert("There was an error sending your message. Please try again later.");
                });
            }
        });
    }
});
