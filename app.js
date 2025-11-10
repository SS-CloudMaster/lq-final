// Multi-Page Navigation System
let currentPage = 'home';

// Page navigation (exposed globally for pages.js)
window.showPage = function showPage(pageName) {
    // Hide all pages
    document.querySelectorAll('.page-content').forEach(page => {
        page.classList.add('hidden');
    });
    
    // Show requested page
    const pageElement = document.getElementById(`page-${pageName}`);
    if (pageElement) {
        pageElement.classList.remove('hidden');
        currentPage = pageName;
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Close mobile menu if open
        mobileMenu.classList.remove('active');
        
        // Trigger reveal animations
        setTimeout(() => {
            const revealElements = pageElement.querySelectorAll('.reveal');
            revealElements.forEach(el => {
                const rect = el.getBoundingClientRect();
                if (rect.top < window.innerHeight) {
                    el.classList.add('active');
                }
            });
        }, 100);
    }
}

// Set up navigation links
function setupNavigation() {
    document.querySelectorAll('.nav-link').forEach(link => {
        if (!link.hasAttribute('data-listener-attached')) {
            link.setAttribute('data-listener-attached', 'true');
            link.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const page = link.getAttribute('data-page');
                if (page) {
                    window.showPage(page);
                }
            });
        }
    });
}

// Make setupNavigation globally accessible
window.setupNavigation = setupNavigation;

// Observe DOM changes to setup navigation on dynamically added content
const observer = new MutationObserver((mutations) => {
    let shouldSetup = false;
    mutations.forEach((mutation) => {
        if (mutation.addedNodes.length > 0) {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === 1 && (node.classList.contains('page-content') || node.querySelector('.nav-link'))) {
                    shouldSetup = true;
                }
            });
        }
    });
    if (shouldSetup) {
        setupNavigation();
    }
});

// Start observing the document
if (document.getElementById('app-content')) {
    observer.observe(document.getElementById('app-content'), {
        childList: true,
        subtree: true
    });
}

// Dark Mode Toggle
const themeToggle = document.getElementById('theme-toggle');
const sunIcon = document.getElementById('sun-icon');
const moonIcon = document.getElementById('moon-icon');
const html = document.documentElement;

// Use in-memory state for theme (no localStorage in sandboxed environment)
let currentTheme = 'light';

themeToggle.addEventListener('click', () => {
    html.classList.toggle('dark');
    const isDark = html.classList.contains('dark');
    
    if (isDark) {
        sunIcon.classList.remove('hidden');
        moonIcon.classList.add('hidden');
        currentTheme = 'dark';
    } else {
        sunIcon.classList.add('hidden');
        moonIcon.classList.remove('hidden');
        currentTheme = 'light';
    }
});

// Mobile Menu Toggle
const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');
const mobileMenuClose = document.getElementById('mobile-menu-close');
const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

mobileMenuToggle.addEventListener('click', () => {
    mobileMenu.classList.add('active');
});

mobileMenuClose.addEventListener('click', () => {
    mobileMenu.classList.remove('active');
});

// Close mobile menu when clicking a link
mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
    });
});

// Sticky Navigation
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.classList.add('sticky');
    } else {
        navbar.classList.remove('sticky');
    }
    
    lastScroll = currentScroll;
});

// Progress Bar
const progressBar = document.getElementById('progress-bar');

window.addEventListener('scroll', () => {
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (window.pageYOffset / windowHeight) * 100;
    progressBar.style.width = scrolled + '%';
});

// Scroll Reveal Animation
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, observerOptions);

const revealElements = document.querySelectorAll('.reveal');
revealElements.forEach(el => revealObserver.observe(el));

// Service Toggle (Accordion)
const serviceToggles = document.querySelectorAll('.service-toggle');

serviceToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
        const targetId = toggle.getAttribute('data-target');
        const content = document.getElementById(targetId);
        const arrow = toggle.querySelector('svg');
        
        // Close all other services
        document.querySelectorAll('.service-content').forEach(service => {
            if (service !== content && !service.classList.contains('hidden')) {
                service.classList.add('hidden');
                const otherToggle = document.querySelector(`[data-target="${service.id}"]`);
                if (otherToggle) {
                    otherToggle.querySelector('svg').style.transform = 'rotate(0deg)';
                }
            }
        });
        
        // Toggle current service
        content.classList.toggle('hidden');
        
        if (content.classList.contains('hidden')) {
            arrow.style.transform = 'rotate(0deg)';
        } else {
            arrow.style.transform = 'rotate(180deg)';
        }
    });
});

// Testimonials Carousel
let currentTestimonial = 0;
const testimonialsTrack = document.getElementById('testimonials-track');
const testimonialDots = document.querySelectorAll('.testimonial-dot');
const totalTestimonials = 5;

function showTestimonial(index) {
    currentTestimonial = index;
    const offset = -index * 100;
    testimonialsTrack.style.transform = `translateX(${offset}%)`;
    
    // Update dots
    testimonialDots.forEach((dot, i) => {
        if (i === index) {
            dot.style.backgroundColor = 'var(--accent)';
        } else {
            dot.style.backgroundColor = 'var(--text-secondary)';
        }
    });
}

// Dot navigation
if (testimonialDots.length > 0) {
    testimonialDots.forEach(dot => {
        dot.addEventListener('click', () => {
            const index = parseInt(dot.getAttribute('data-index'));
            showTestimonial(index);
        });
    });
    
    // Auto-scroll testimonials
    setInterval(() => {
        currentTestimonial = (currentTestimonial + 1) % totalTestimonials;
        showTestimonial(currentTestimonial);
    }, 5000);
}

// Contact Form Submission
function setupContactForm(formId, messageId) {
    const contactForm = document.getElementById(formId);
    const formMessage = document.getElementById(messageId);
    
    if (contactForm && !contactForm.hasAttribute('data-listener-attached')) {
        contactForm.setAttribute('data-listener-attached', 'true');
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const data = {};
            formData.forEach((value, key) => {
                data[key] = value;
            });
            
            // Show success message
            if (formMessage) {
                formMessage.classList.remove('hidden');
                formMessage.innerHTML = `
                    <div class="glass rounded-lg p-4 border-l-4 border-[var(--accent)]">
                        <p class="font-semibold text-[var(--accent)]">✓ Message sent successfully!</p>
                        <p class="text-sm text-[var(--text-secondary)] mt-1">We'll get back to you within 24 hours.</p>
                    </div>
                `;
                
                // Hide message after 5 seconds
                setTimeout(() => {
                    formMessage.classList.add('hidden');
                }, 5000);
            }
            
            // Reset form
            contactForm.reset();
            
            // In production, you would send this data to your backend
            console.log('Form submitted:', data);
        });
    }
}

// Setup both contact forms
setupContactForm('contact-form', 'form-message');
setupContactForm('contact-form-page', 'form-message-page');

// Newsletter Form
function setupNewsletterForm(formId) {
    const newsletterForm = document.getElementById(formId);
    
    if (newsletterForm && !newsletterForm.hasAttribute('data-listener-attached')) {
        newsletterForm.setAttribute('data-listener-attached', 'true');
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const email = newsletterForm.querySelector('input[type="email"]').value;
            
            // Show success message
            const successDiv = document.createElement('div');
            successDiv.className = 'mt-4 glass rounded-lg p-4 border-l-4 border-[var(--accent)] text-center';
            successDiv.innerHTML = `
                <p class="font-semibold text-[var(--accent)]">✓ Subscribed successfully!</p>
                <p class="text-sm text-[var(--text-secondary)] mt-1">Check your inbox for confirmation.</p>
            `;
            
            newsletterForm.parentElement.appendChild(successDiv);
            newsletterForm.reset();
            
            setTimeout(() => {
                successDiv.remove();
            }, 5000);
            
            console.log('Newsletter subscription:', email);
        });
    }
}

setupNewsletterForm('newsletter-form');
setupNewsletterForm('newsletter-form-page');

// Smooth Scroll for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#' || href === '#!') return;
        
        e.preventDefault();
        const target = document.querySelector(href);
        
        if (target) {
            const offsetTop = target.offsetTop - 80; // Account for fixed header
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Add ripple effect to buttons
document.querySelectorAll('.btn-primary, .btn-secondary').forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.style.position = 'absolute';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'rgba(255, 255, 255, 0.5)';
        ripple.style.transform = 'scale(0)';
        ripple.style.animation = 'ripple 0.6s ease-out';
        ripple.style.pointerEvents = 'none';
        
        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });
});

// Add ripple animation to CSS
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

// Case Study Modal
function openCaseStudyModal(caseId) {
    const modal = document.getElementById('case-study-modal');
    const modalContent = document.getElementById('modal-case-content');
    
    // Case study data
    const caseStudies = {
        1: {
            title: 'Healthcare Clinic - Lead Generation Explosion',
            client: 'MediCare Plus Clinic',
            industry: 'Healthcare',
            image: 'https://pplx-res.cloudinary.com/image/upload/v1754970983/pplx_project_search_images/5bf519cca00acce9628179e011da2e586b210de2.png',
            stat: '+175% Patient Leads',
            challenge: 'MediCare Plus was struggling to fill appointment slots despite providing excellent medical services. Their traditional marketing wasn\'t reaching the right patients.',
            solution: 'We implemented a multi-channel approach: targeted Facebook ads for local patients, WhatsApp automation for instant appointment booking, and email nurture sequences for follow-ups.',
            results: ['Patient inquiries increased from 15 to 41 per month', '175% growth in qualified leads', '85% appointment booking rate', 'ROI of 450% on ad spend'],
            timeline: '6 months',
            services: ['Digital Marketing', 'WhatsApp Automation', 'Email Sequences'],
            testimonial: '"Launch Quests transformed our patient acquisition. The WhatsApp automation alone saved us 10 hours per week." - Dr. Sharma, Founder'
        },
        2: {
            title: 'E-Commerce Store - Revenue Scaling',
            client: 'StyleHub E-Store',
            industry: 'E-Commerce',
            image: 'https://pplx-res.cloudinary.com/image/upload/v1755138548/pplx_project_search_images/01992248d0ba90be74e00791c5fdc0b72ae28cf4.png',
            stat: '+₹45L Annual Revenue',
            challenge: 'StyleHub had a slow website with poor mobile experience, leading to high cart abandonment and low conversion rates.',
            solution: 'Complete website rebuild with modern tech stack, conversion rate optimization, integrated Google Shopping ads, and Facebook retargeting campaigns.',
            results: ['Revenue increased from ₹20L to ₹65L annually', 'Cart abandonment reduced by 40%', 'Mobile conversions up 300%', 'Average order value increased 25%'],
            timeline: '8 months',
            services: ['Web Development', 'Digital Marketing', 'Paid Ads'],
            testimonial: '"The new website is lightning fast and our sales have tripled. Best investment we\'ve made." - Priya, CEO'
        },
        3: {
            title: 'Real Estate Agency - Deal Closure Rate Boost',
            client: 'Prime Properties Real Estate',
            industry: 'Real Estate',
            image: 'https://pplx-res.cloudinary.com/image/upload/v1755106066/pplx_project_search_images/2f850982e541dc44f41e7f110adf788f46e07052.png',
            stat: '+38% Deal Closure Rate',
            challenge: 'Prime Properties was losing deals due to slow follow-up times and poor lead organization. Manual tracking led to missed opportunities.',
            solution: 'Custom CRM development with lead scoring, automated follow-up sequences, task management, and mobile app for agents in the field.',
            results: ['Deal closure rate improved from 18% to 25%', 'Average response time reduced from 4 hours to 15 minutes', 'Lead tracking efficiency up 200%', 'Agent productivity increased 35%'],
            timeline: '4 months',
            services: ['CRM Solutions', 'Email Automation', 'Lead Scoring'],
            testimonial: '"Our agents now close deals 40% faster. The CRM keeps everyone organized and accountable." - Rajesh, Managing Director'
        },
        4: {
            title: 'SaaS Startup - User Acquisition Acceleration',
            client: 'CloudScale SaaS',
            industry: 'SaaS',
            image: 'https://pplx-res.cloudinary.com/image/upload/v1754741713/pplx_project_search_images/1d8da61b215a12eda0f4ea052197d691ce6c5e0e.png',
            stat: '10x Customer Growth',
            challenge: 'CloudScale had limited visibility in search engines and low conversion rates on their landing page despite having a great product.',
            solution: 'Comprehensive SEO strategy, multiple conversion-optimized landing pages, content marketing, and retargeting campaigns across channels.',
            results: ['Users grew from 100 to 1,000 in 12 months', 'Organic traffic up 800%', 'Conversion rate improved from 1.5% to 6.2%', 'Customer acquisition cost reduced 60%'],
            timeline: '12 months',
            services: ['Digital Marketing', 'Web Development', 'SEO'],
            testimonial: '"Launch Quests helped us achieve product-market fit faster. Their SEO work alone brought us 500+ qualified leads." - Amit, Founder'
        },
        5: {
            title: 'Consulting Firm - Client Retention Excellence',
            client: 'Strategic Insights Consulting',
            industry: 'Consulting',
            image: 'https://pplx-res.cloudinary.com/image/upload/v1762153579/pplx_project_search_images/69cd696731d6ce930465e837d6b17ad8ecb13c30.png',
            stat: '+92% Client Retention',
            challenge: 'Strategic Insights had high customer acquisition costs but poor retention. Many clients didn\'t renew after the first project.',
            solution: 'Implemented customer success automation, regular check-in sequences, value-based email campaigns, and feedback loops in CRM.',
            results: ['Client retention improved from 65% to 92%', 'Client lifetime value increased 3x', 'Referral rate up 45%', 'Upsell opportunities increased 60%'],
            timeline: '8 months',
            services: ['CRM Solutions', 'Email Automation', 'Customer Success'],
            testimonial: '"We now have predictable recurring revenue. The automation keeps clients engaged without overwhelming our team." - Neha, Partner'
        },
        6: {
            title: 'Digital Agency - Operations Automation',
            client: 'Creative Minds Agency',
            industry: 'Agency',
            image: 'https://pplx-res.cloudinary.com/image/upload/v1754741713/pplx_project_search_images/1d8da61b215a12eda0f4ea052197d691ce6c5e0e.png',
            stat: '50% Admin Time Saved',
            challenge: 'Creative Minds team was spending 30+ hours weekly on manual reporting, invoicing, and administrative tasks instead of client work.',
            solution: 'Automated client reporting dashboards, CI/CD pipelines for faster deployments, integrated project management, and billing automation.',
            results: ['Admin time reduced from 30 to 15 hours weekly', 'Project delivery speed up 40%', 'Team capacity increased by 2 clients', 'Client satisfaction score up 25%'],
            timeline: '3 months',
            services: ['IT Infrastructure', 'Workflow Automation', 'DevOps'],
            testimonial: '"This automation freed up our team to focus on creative work. We\'re now more profitable and less stressed." - Vikram, CEO'
        }
    };
    
    const study = caseStudies[caseId];
    if (!study) return;
    
    modalContent.innerHTML = `
        <img src="${study.image}" alt="${study.title}" class="w-full h-64 object-cover rounded-lg mb-6">
        <div class="mb-4">
            <span class="text-xs font-bold text-[var(--accent)] bg-[var(--bg-secondary)] px-3 py-1 rounded-full">${study.industry}</span>
        </div>
        <h2 class="text-3xl font-bold mb-2">${study.title}</h2>
        <p class="text-xl text-[var(--text-secondary)] mb-6">${study.client}</p>
        <div class="text-4xl font-bold gradient-text mb-8">${study.stat}</div>
        
        <div class="space-y-6">
            <div>
                <h3 class="text-xl font-bold mb-2">The Challenge</h3>
                <p class="text-[var(--text-secondary)]">${study.challenge}</p>
            </div>
            
            <div>
                <h3 class="text-xl font-bold mb-2">Our Solution</h3>
                <p class="text-[var(--text-secondary)]">${study.solution}</p>
            </div>
            
            <div>
                <h3 class="text-xl font-bold mb-2">Results Achieved</h3>
                <ul class="space-y-2">
                    ${study.results.map(result => `
                        <li class="flex items-start">
                            <svg class="w-5 h-5 text-[var(--accent)] mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                            </svg>
                            <span class="text-[var(--text-secondary)]">${result}</span>
                        </li>
                    `).join('')}
                </ul>
            </div>
            
            <div>
                <h3 class="text-xl font-bold mb-2">Timeline</h3>
                <p class="text-[var(--text-secondary)]">${study.timeline}</p>
            </div>
            
            <div>
                <h3 class="text-xl font-bold mb-2">Services Used</h3>
                <div class="flex flex-wrap gap-2">
                    ${study.services.map(service => `
                        <span class="text-xs font-semibold bg-[var(--bg-secondary)] px-3 py-1 rounded-full">${service}</span>
                    `).join('')}
                </div>
            </div>
            
            <div class="glass rounded-lg p-6 italic">
                <p class="text-[var(--text-secondary)]">${study.testimonial}</p>
            </div>
        </div>
        
        <div class="mt-8 pt-6 border-t border-[var(--card-border)]">
            <p class="text-center text-[var(--text-secondary)] mb-4">Ready for similar results?</p>
            <button class="btn-primary w-full nav-link" data-page="contact">Start Your Project</button>
        </div>
    `;
    
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeCaseStudyModal() {
    const modal = document.getElementById('case-study-modal');
    modal.classList.add('hidden');
    document.body.style.overflow = '';
}

// Initialize on page load
window.addEventListener('load', () => {
    // Show first testimonial
    if (testimonialsTrack) {
        showTestimonial(0);
    }
    
    // Trigger initial reveal for elements in viewport
    revealElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight) {
            el.classList.add('active');
        }
    });
    
    // Setup navigation
    setupNavigation();
    
    // Show home page by default
    showPage('home');
    
    // Setup case study buttons (with delegation)
    document.addEventListener('click', (e) => {
        const caseCard = e.target.closest('.case-study-card');
        if (caseCard) {
            const caseId = caseCard.getAttribute('data-case-id');
            if (caseId) {
                openCaseStudyModal(parseInt(caseId));
            }
        }
    });
    
    // Setup modal close
    const modalClose = document.getElementById('modal-close');
    if (modalClose) {
        modalClose.addEventListener('click', closeCaseStudyModal);
    }
    
    const modal = document.getElementById('case-study-modal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeCaseStudyModal();
            }
        });
    }
    
    // Re-setup forms after a short delay to ensure pages are loaded
    setTimeout(() => {
        setupContactForm('contact-form', 'form-message');
        setupContactForm('contact-form-page', 'form-message-page');
        setupNewsletterForm('newsletter-form');
        setupNewsletterForm('newsletter-form-page');
    }, 500);
});