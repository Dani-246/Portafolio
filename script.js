// ===============================================
// PORTFOLIO JAVASCRIPT - VERSION PROFESIONAL
// ===============================================

class PortfolioManager {
    constructor() {
        this.currentTestimonial = 0;
        this.testimonialCards = [];
        this.isLoading = true;
        this.animationObserver = null;
        this.skillsAnimated = false;
        this.statsAnimated = false;
        this.userIP = null;
        this.isVPN = false;
        
        this.init();
    }

    init() {
        this.showLoader();
        
        // Inicializar cuando el DOM esté listo
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeApp());
        } else {
            this.initializeApp();
        }
    }

    initializeApp() {
        setTimeout(() => {
            this.hideLoader();
            this.initializeAllFeatures();
        }, 2000);
    }

    initializeAllFeatures() {
        this.initializeEmailJS();
        this.initializeSecuritySystem();
        this.initializeNavigation();
        this.initializeScrollEffects();
        this.initializeTypingEffect();
        this.initializeTestimonials();
        this.initializeFAQ();
        this.initializeContactForm();
        this.initializeProjectFilters();
        this.initializeAnimations();
        this.initializeCursor();
        this.initializeIntersectionObserver();
        this.optimizePerformance();
    }

    // ===============================================
    // LOADER SYSTEM
    // ===============================================
    showLoader() {
        const loader = document.getElementById('loader');
        if (loader) {
            loader.style.display = 'flex';
        }
    }

    hideLoader() {
        const loader = document.getElementById('loader');
        if (loader) {
            loader.classList.add('hidden');
            setTimeout(() => {
                loader.style.display = 'none';
                this.isLoading = false;
            }, 500);
        }
    }

    // ===============================================
    // EMAILJS CONFIGURATION
    // ===============================================
    initializeEmailJS() {
        // Inicializar EmailJS con tu Public Key
        if (typeof emailjs !== 'undefined') {
            emailjs.init("J_KYLJFcHKPiJtRgw"); // Tu Public Key configurada
        }
    }

    // ===============================================
    // SISTEMA DE SEGURIDAD ANTI-SPAM
    // ===============================================
    async initializeSecuritySystem() {
        try {
            // Obtener IP del usuario
            await this.getUserIP();
            
            // Detectar VPN/Proxy
            await this.detectVPN();
            
            // Verificar rate limiting
            this.checkRateLimit();
            
        } catch (error) {
            console.error('Error en sistema de seguridad:', error);
        }
    }

    async getUserIP() {
        try {
            // Usar múltiples servicios como fallback
            const ipServices = [
                'https://api.ipify.org?format=json',
                'https://ipapi.co/json/',
                'https://httpbin.org/ip'
            ];

            for (const service of ipServices) {
                try {
                    const response = await fetch(service);
                    const data = await response.json();
                    this.userIP = data.ip || data.origin;
                    if (this.userIP) break;
                } catch (err) {
                    continue;
                }
            }

            if (!this.userIP) {
                this.userIP = 'unknown';
            }

            console.log('IP detectada:', this.userIP);
        } catch (error) {
            this.userIP = 'unknown';
            console.error('Error obteniendo IP:', error);
        }
    }

    async detectVPN() {
        if (!this.userIP || this.userIP === 'unknown') {
            this.isVPN = false;
            return;
        }

        try {
            // Usar API gratuita para detectar VPN
            const response = await fetch(`https://vpnapi.io/api/${this.userIP}?key=free`);
            const data = await response.json();
            
            this.isVPN = data.security?.vpn || data.security?.proxy || false;
            
            if (this.isVPN) {
                console.warn('⚠️ VPN/Proxy detectado');
            }
            
        } catch (error) {
            // Si falla la detección, asumir que no es VPN
            this.isVPN = false;
            console.error('Error detectando VPN:', error);
        }
    }

    checkRateLimit() {
        const now = Date.now();
        const lastSubmission = localStorage.getItem(`lastSubmission_${this.userIP}`);
        
        if (lastSubmission) {
            const timeDiff = now - parseInt(lastSubmission);
            const hoursRemaining = Math.ceil((24 * 60 * 60 * 1000 - timeDiff) / (60 * 60 * 1000));
            
            if (timeDiff < 24 * 60 * 60 * 1000) { // 24 horas
                this.blockForm(hoursRemaining);
                return false;
            }
        }
        
        return true;
    }

    blockForm(hoursRemaining) {
        const form = document.getElementById('contactForm');
        const submitBtn = form?.querySelector('.btn-submit');
        
        if (form && submitBtn) {
            // Deshabilitar formulario
            form.style.opacity = '0.6';
            form.style.pointerEvents = 'none';
            
            // Cambiar botón
            submitBtn.innerHTML = `
                <i class="fas fa-clock"></i>
                <span>Bloqueado ${hoursRemaining}h</span>
            `;
            submitBtn.disabled = true;
            submitBtn.style.background = '#666';
            
            // Mostrar mensaje
            this.showNotification(`🚫 Solo puedes enviar 1 solicitud cada 24 horas. Espera ${hoursRemaining} hora(s) más.`, 'warning');
        }
    }

    canSubmitForm() {
        // Verificar si puede enviar
        if (!this.checkRateLimit()) {
            return false;
        }

        // Verificar VPN (opcional - puedes quitar esto si es muy restrictivo)
        if (this.isVPN) {
            this.showNotification('🚫 No se permiten solicitudes desde VPN/Proxy. Usa tu conexión normal.', 'error');
            return false;
        }

        return true;
    }

    recordSubmission() {
        // Guardar timestamp de la submisión
        localStorage.setItem(`lastSubmission_${this.userIP}`, Date.now().toString());
        
        // Guardar conteo de submisiones
        const submissionCount = parseInt(localStorage.getItem(`submissionCount_${this.userIP}`) || '0');
        localStorage.setItem(`submissionCount_${this.userIP}`, (submissionCount + 1).toString());
    }

    // ===============================================
    // NAVEGACION AVANZADA
    // ===============================================
    initializeNavigation() {
        const navbar = document.getElementById('navbar');
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('nav-menu');
        const navLinks = document.querySelectorAll('.nav-link');

        // Efecto de scroll en navbar
        this.handleNavbarScroll(navbar);
        
        // Menu móvil
        this.setupMobileMenu(hamburger, navMenu);
        
        // Navegación suave
        this.setupSmoothNavigation(navLinks, navMenu, hamburger);
        
        // Destacar link activo
        this.setupActiveNavigation(navLinks);
    }

    handleNavbarScroll(navbar) {
        let ticking = false;
        
        const updateNavbar = () => {
            if (window.scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateNavbar);
                ticking = true;
            }
        });
    }

    setupMobileMenu(hamburger, navMenu) {
        if (hamburger && navMenu) {
            hamburger.addEventListener('click', () => {
                hamburger.classList.toggle('active');
                navMenu.classList.toggle('active');
                
                // Prevenir scroll del body cuando el menú está abierto
                if (navMenu.classList.contains('active')) {
                    document.body.style.overflow = 'hidden';
                } else {
                    document.body.style.overflow = '';
                }
            });
        }
    }

    setupSmoothNavigation(navLinks, navMenu, hamburger) {
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                    
                    // Cerrar menú móvil
                    navMenu?.classList.remove('active');
                    hamburger?.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        });
    }

    setupActiveNavigation(navLinks) {
        let ticking = false;
        
        const updateActiveNav = () => {
            let current = '';
            const sections = document.querySelectorAll('section');
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 120;
                const sectionHeight = section.clientHeight;
                
                if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
            
            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateActiveNav);
                ticking = true;
            }
        });
    }

    // ===============================================
    // EFECTOS DE SCROLL
    // ===============================================
    initializeScrollEffects() {
        const scrollToTopBtn = document.getElementById('scrollToTop');
        let ticking = false;
        
        const handleScroll = () => {
            if (window.scrollY > 400) {
                scrollToTopBtn?.classList.add('visible');
            } else {
                scrollToTopBtn?.classList.remove('visible');
            }
            ticking = false;
        };
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(handleScroll);
                ticking = true;
            }
        });

        // Click handler para scroll to top
        scrollToTopBtn?.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        // Scroll suave para el indicador del hero
        const scrollIndicator = document.querySelector('.scroll-indicator');
        scrollIndicator?.addEventListener('click', () => {
            document.querySelector('#sobre-mi').scrollIntoView({
                behavior: 'smooth'
            });
        });
    }

    // ===============================================
    // EFECTO DE TYPING AVANZADO
    // ===============================================
    initializeTypingEffect() {
        const typedElement = document.getElementById('typed-text');
        if (typedElement) {
            const options = {
                strings: [
                    'Desarrollador Full Stack 🚀',
                    'Creador de Páginas Web Modernas 💻',
                    'Desarrollador de Aplicaciones Web ⚡',
                    'Especialista en Frontend & Backend 🛠️',
                    'Creador de Bots & Automatización 🤖'
                ],
                typeSpeed: 60,
                backSpeed: 40,
                backDelay: 2000,
                startDelay: 1000,
                loop: true,
                showCursor: true,
                cursorChar: '|',
                autoInsertCss: true,
            };

            new Typed(typedElement, options);
        }
    }

    // ===============================================
    // SISTEMA DE TESTIMONIOS AVANZADO
    // ===============================================
    initializeTestimonials() {
        this.testimonialCards = document.querySelectorAll('.testimonial-card');
        const dots = document.querySelectorAll('.testimonial-dots .dot');
        const prevBtn = document.getElementById('prevTestimonial');
        const nextBtn = document.getElementById('nextTestimonial');
        
        if (this.testimonialCards.length === 0) return;

        // Mostrar primer testimonio
        this.showTestimonial(0);

        // Auto-play mejorado
        this.startTestimonialAutoplay();

        // Event listeners para navegación
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                this.showTestimonial(index);
                this.resetAutoplay();
            });
        });

        prevBtn?.addEventListener('click', () => {
            this.prevTestimonial();
            this.resetAutoplay();
        });

        nextBtn?.addEventListener('click', () => {
            this.nextTestimonial();
            this.resetAutoplay();
        });

        // Pausar autoplay en hover
        const slider = document.getElementById('testimonials-slider');
        slider?.addEventListener('mouseenter', () => this.pauseAutoplay());
        slider?.addEventListener('mouseleave', () => this.resumeAutoplay());
    }

    showTestimonial(index) {
        this.currentTestimonial = index;
        
        // Actualizar cards
        this.testimonialCards.forEach((card, i) => {
            card.classList.toggle('active', i === index);
        });

        // Actualizar dots
        const dots = document.querySelectorAll('.testimonial-dots .dot');
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    }

    nextTestimonial() {
        this.currentTestimonial = (this.currentTestimonial + 1) % this.testimonialCards.length;
        this.showTestimonial(this.currentTestimonial);
    }

    prevTestimonial() {
        this.currentTestimonial = this.currentTestimonial === 0 
            ? this.testimonialCards.length - 1 
            : this.currentTestimonial - 1;
        this.showTestimonial(this.currentTestimonial);
    }

    startTestimonialAutoplay() {
        this.testimonialInterval = setInterval(() => {
            this.nextTestimonial();
        }, 6000);
    }

    pauseAutoplay() {
        if (this.testimonialInterval) {
            clearInterval(this.testimonialInterval);
        }
    }

    resumeAutoplay() {
        this.startTestimonialAutoplay();
    }

    resetAutoplay() {
        this.pauseAutoplay();
        this.resumeAutoplay();
    }

    // ===============================================
    // FAQ ACCORDION AVANZADO
    // ===============================================
    initializeFAQ() {
        const faqItems = document.querySelectorAll('.faq-item');
        
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');
            
            if (question && answer) {
                question.addEventListener('click', () => {
                    const isActive = item.classList.contains('active');
                    
                    // Cerrar todos los FAQs
                    faqItems.forEach(faqItem => {
                        faqItem.classList.remove('active');
                        const faqAnswer = faqItem.querySelector('.faq-answer');
                        if (faqAnswer) {
                            faqAnswer.style.maxHeight = '0';
                            faqAnswer.style.opacity = '0';
                        }
                    });
                    
                    // Abrir el FAQ clickeado si no estaba activo
                    if (!isActive) {
                        item.classList.add('active');
                        answer.style.maxHeight = answer.scrollHeight + 20 + 'px';
                        answer.style.opacity = '1';
                    }
                });
            }
        });

        // Manejo de resize
        window.addEventListener('resize', this.debounce(() => {
            const activeFaqItems = document.querySelectorAll('.faq-item.active');
            activeFaqItems.forEach(item => {
                const answer = item.querySelector('.faq-answer');
                if (answer) {
                    answer.style.maxHeight = answer.scrollHeight + 20 + 'px';
                }
            });
        }, 250));
    }

    // ===============================================
    // FILTROS DE PROYECTOS
    // ===============================================
    initializeProjectFilters() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        const projectCards = document.querySelectorAll('.project-card');
        
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.getAttribute('data-filter');
                
                // Actualizar botones activos
                filterBtns.forEach(button => button.classList.remove('active'));
                btn.classList.add('active');
                
                // Filtrar proyectos con animación
                this.filterProjects(projectCards, filter);
            });
        });
    }

    filterProjects(projectCards, filter) {
        projectCards.forEach((card, index) => {
            const category = card.getAttribute('data-category');
            const shouldShow = filter === 'all' || category === filter;
            
            // Animación de salida
            card.style.transform = 'scale(0.8)';
            card.style.opacity = '0';
            
            setTimeout(() => {
                if (shouldShow) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.transform = 'scale(1)';
                        card.style.opacity = '1';
                    }, 50);
                } else {
                    card.style.display = 'none';
                }
            }, 200 + index * 50);
        });
    }

    // ===============================================
    // FORMULARIO DE CONTACTO AVANZADO
    // ===============================================
    initializeContactForm() {
        const contactForm = document.getElementById('contactForm');
        
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => this.handleFormSubmit(e));
            
            // Validación en tiempo real
            this.setupRealTimeValidation(contactForm);
        }
    }

    setupRealTimeValidation(form) {
        const inputs = form.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });
    }

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        // Limpiar errores previos
        this.clearFieldError(field);

        // Validaciones específicas
        switch (field.type) {
            case 'email':
                if (value && !this.isValidEmail(value)) {
                    isValid = false;
                    errorMessage = 'Ingresa un email válido';
                }
                break;
            case 'text':
                if (field.required && !value) {
                    isValid = false;
                    errorMessage = 'Este campo es requerido';
                }
                break;
        }

        if (!isValid) {
            this.showFieldError(field, errorMessage);
        }

        return isValid;
    }

    showFieldError(field, message) {
        field.style.borderColor = 'var(--error-color)';
        
        let errorEl = field.parentNode.querySelector('.field-error');
        if (!errorEl) {
            errorEl = document.createElement('div');
            errorEl.className = 'field-error';
            errorEl.style.cssText = `
                color: var(--error-color);
                font-size: 0.8rem;
                margin-top: 6px;
                opacity: 0;
                transition: opacity 0.3s ease;
            `;
            field.parentNode.appendChild(errorEl);
        }
        
        errorEl.textContent = message;
        setTimeout(() => errorEl.style.opacity = '1', 10);
    }

    clearFieldError(field) {
        field.style.borderColor = '';
        const errorEl = field.parentNode.querySelector('.field-error');
        if (errorEl) {
            errorEl.style.opacity = '0';
            setTimeout(() => errorEl.remove(), 300);
        }
    }

    async handleFormSubmit(e) {
        e.preventDefault();
        
        const form = e.target;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        // 🛡️ VERIFICACIONES DE SEGURIDAD
        if (!this.canSubmitForm()) {
            return; // Ya se mostró el mensaje de error
        }

        // Validar todos los campos
        let isFormValid = true;
        const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isFormValid = false;
            }
        });

        if (!isFormValid) {
            this.showNotification('Por favor, corrige los errores del formulario', 'error');
            return;
        }

        // Validaciones anti-spam adicionales
        if (!this.validateAntiSpam(data)) {
            return;
        }
        
        // Mostrar estado de carga
        const submitBtn = form.querySelector('.btn-submit');
        this.setFormLoading(submitBtn, true);
        
        try {
            // Enviar email real usando EmailJS
            await this.simulateFormSubmission(data);
            
            // 🎯 REGISTRAR SUBMISIÓN (para rate limiting)
            this.recordSubmission();
            
            this.showNotification('¡Email enviado correctamente! ✅ Recibirás respuesta en 24 horas.', 'success');
            form.reset();
            
            // Bloquear formulario por 24 horas
            setTimeout(() => this.blockForm(24), 1000);
            
        } catch (error) {
            this.showNotification('Error al enviar el email. ❌ Contáctame por Discord: daniel2703_', 'error');
            console.error('Error:', error);
        } finally {
            this.setFormLoading(submitBtn, false);
        }
    }

    validateAntiSpam(data) {
        // Detectar spam en el contenido
        const spamKeywords = [
            'viagra', 'casino', 'porn', 'sex', 'bitcoin', 'crypto', 'investment',
            'loan', 'mortgage', 'insurance', 'pharmacy', 'pills', 'drugs',
            'make money', 'earn money', 'free money', 'click here', 'buy now'
        ];

        const fullText = `${data.name} ${data.email} ${data.message}`.toLowerCase();
        
        for (const keyword of spamKeywords) {
            if (fullText.includes(keyword)) {
                this.showNotification('🚫 Contenido detectado como spam. Modifica tu mensaje.', 'error');
                return false;
            }
        }

        // Detectar emails temporales
        const tempEmailDomains = [
            '10minutemail', 'tempmail', 'guerrillamail', 'mailinator',
            'yopmail', 'throwaway', 'getnada', 'temp-mail'
        ];

        for (const domain of tempEmailDomains) {
            if (data.email.toLowerCase().includes(domain)) {
                this.showNotification('🚫 No se permiten emails temporales. Usa tu email real.', 'error');
                return false;
            }
        }

        // Detectar mensaje muy corto (posible spam)
        if (data.message.length < 10) {
            this.showNotification('🚫 El mensaje es muy corto. Describe mejor tu proyecto.', 'error');
            return false;
        }

        // Detectar solo mayúsculas (posible spam)
        if (data.message === data.message.toUpperCase() && data.message.length > 20) {
            this.showNotification('🚫 No escribas todo en mayúsculas.', 'error');
            return false;
        }

        return true;
    }

    setFormLoading(btn, loading) {
        if (loading) {
            btn.classList.add('loading');
            btn.disabled = true;
        } else {
            btn.classList.remove('loading');
            btn.disabled = false;
        }
    }

    async simulateFormSubmission(data) {
        // Enviar email real usando EmailJS
        try {
            const templateParams = {
                from_name: data.name,
                from_email: data.email,
                service_type: data.service,
                budget: data.budget,
                message: data.message,
                to_email: 'danielcerrato195@gmail.com'
            };

            const response = await emailjs.send(
                'service_pk6zfqe',   // Tu Service ID
                'template_gm9lsab',  // Tu Template ID
                templateParams
            );

            if (response.status === 200) {
                return Promise.resolve();
            } else {
                throw new Error('Error al enviar email');
            }
        } catch (error) {
            console.error('Error EmailJS:', error);
            // Fallback: abrir cliente de email
            const subject = encodeURIComponent(`Solicitud de ${data.service} - ${data.name}`);
            const body = encodeURIComponent(`
Nombre: ${data.name}
Email: ${data.email}
Servicio: ${data.service}
Presupuesto: ${data.budget}

Mensaje:
${data.message}
            `);
            window.open(`mailto:danielcerrato195@gmail.com?subject=${subject}&body=${body}`);
            return Promise.resolve();
        }
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // ===============================================
    // SISTEMA DE NOTIFICACIONES
    // ===============================================
    showNotification(message, type = 'info') {
        // Remover notificaciones anteriores
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notif => this.removeNotification(notif));
        
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
                <button class="notification-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="notification-progress"></div>
        `;
        
        this.styleNotification(notification, type);
        document.body.appendChild(notification);
        
        // Animación de entrada
        setTimeout(() => notification.style.transform = 'translateX(0)', 100);
        
        // Auto-remove y click para cerrar
        this.setupNotificationRemoval(notification);
    }

    styleNotification(notification, type) {
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${this.getNotificationColor(type)};
            color: white;
            padding: 20px;
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
            z-index: 10001;
            transform: translateX(400px);
            transition: all 0.4s ease;
            max-width: 420px;
            min-width: 320px;
            font-weight: 500;
            overflow: hidden;
        `;
    }

    setupNotificationRemoval(notification) {
        const closeBtn = notification.querySelector('.notification-close');
        const progress = notification.querySelector('.notification-progress');
        
        // Estilo para el botón de cerrar
        closeBtn.style.cssText = `
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            padding: 4px;
            margin-left: 12px;
        `;
        
        // Estilo para la barra de progreso
        progress.style.cssText = `
            position: absolute;
            bottom: 0;
            left: 0;
            height: 3px;
            background: rgba(255, 255, 255, 0.3);
            width: 100%;
            animation: progress 5s linear;
        `;
        
        // Inyectar keyframes para la barra de progreso
        if (!document.querySelector('#progress-keyframes')) {
            const style = document.createElement('style');
            style.id = 'progress-keyframes';
            style.textContent = `
                @keyframes progress {
                    from { width: 100%; }
                    to { width: 0%; }
                }
            `;
            document.head.appendChild(style);
        }
        
        // Cerrar manualmente
        closeBtn.addEventListener('click', () => this.removeNotification(notification));
        
        // Auto-cerrar
        setTimeout(() => this.removeNotification(notification), 7000);
    }

    removeNotification(notification) {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };
        return icons[type] || icons.info;
    }

    getNotificationColor(type) {
        const colors = {
            success: '#00ff88',
            error: '#ff4757',
            warning: '#ffaa00',
            info: '#5865f2'
        };
        return colors[type] || colors.info;
    }

    // ===============================================
    // ANIMACIONES AVANZADAS
    // ===============================================
    initializeAnimations() {
        // Configurar ScrollReveal
        if (typeof ScrollReveal !== 'undefined') {
            const sr = ScrollReveal({
                origin: 'bottom',
                distance: '60px',
                duration: 800,
                delay: 100,
                reset: false,
                easing: 'ease-out'
            });

            // Animaciones escalonadas
            sr.reveal('.section-header h2', { delay: 200 });
            sr.reveal('.section-header p', { delay: 300 });
            sr.reveal('.service-card', { interval: 200 });
            sr.reveal('.project-card', { interval: 200 });
            sr.reveal('.skill-item', { interval: 150 });
            sr.reveal('.highlight-item', { interval: 150 });
            sr.reveal('.contact-item', { interval: 200 });
        }
    }

    initializeIntersectionObserver() {
        const observerOptions = {
            threshold: 0.3,
            rootMargin: '0px 0px -100px 0px'
        };
        
        this.animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = entry.target;
                    
                    // Animaciones específicas por sección
                    if (target.classList.contains('hero-stats') && !this.statsAnimated) {
                        this.animateStats();
                        this.statsAnimated = true;
                    }
                    
                    if (target.classList.contains('skills-grid') && !this.skillsAnimated) {
                        this.animateSkills();
                        this.skillsAnimated = true;
                    }
                }
            });
        }, observerOptions);
        
        // Observar elementos
        const elementsToObserve = document.querySelectorAll('.hero-stats, .skills-grid');
        elementsToObserve.forEach(el => this.animationObserver.observe(el));
    }

    animateStats() {
        const statNumbers = document.querySelectorAll('.stat-number');
        
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'));
            let current = 0;
            const increment = target / 60;
            const suffix = target === 99 ? '%' : '+';
            
            const updateCounter = () => {
                if (current < target) {
                    current += increment;
                    stat.textContent = Math.floor(current) + suffix;
                    requestAnimationFrame(updateCounter);
                } else {
                    stat.textContent = target + suffix;
                }
            };
            
            updateCounter();
        });
    }

    animateSkills() {
        const skillBars = document.querySelectorAll('.skill-progress');
        
        skillBars.forEach((bar, index) => {
            setTimeout(() => {
                const width = bar.getAttribute('data-width');
                bar.style.width = width;
            }, index * 200);
        });
    }

    // ===============================================
    // CURSOR PERSONALIZADO
    // ===============================================
    initializeCursor() {
        const cursorDot = document.getElementById('cursor-dot');
        const cursorOutline = document.getElementById('cursor-outline');
        
        if (!cursorDot || !cursorOutline) return;
        
        // Solo en dispositivos de escritorio
        if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
            let mouseX = 0;
            let mouseY = 0;
            let outlineX = 0;
            let outlineY = 0;
            
            document.addEventListener('mousemove', (e) => {
                mouseX = e.clientX;
                mouseY = e.clientY;
                
                cursorDot.style.left = mouseX + 'px';
                cursorDot.style.top = mouseY + 'px';
            });
            
            // Animación suave para el outline
            const animateOutline = () => {
                outlineX += (mouseX - outlineX) * 0.15;
                outlineY += (mouseY - outlineY) * 0.15;
                
                cursorOutline.style.left = outlineX - 15 + 'px';
                cursorOutline.style.top = outlineY - 15 + 'px';
                
                requestAnimationFrame(animateOutline);
            };
            animateOutline();
            
            // Efectos en hover
            this.setupCursorHoverEffects();
        } else {
            // Ocultar cursor en dispositivos táctiles
            cursorDot.style.display = 'none';
            cursorOutline.style.display = 'none';
        }
    }

    setupCursorHoverEffects() {
        const interactiveElements = document.querySelectorAll('a, button, .project-card, .service-card, .faq-question');
        const cursorDot = document.getElementById('cursor-dot');
        const cursorOutline = document.getElementById('cursor-outline');
        
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorDot.style.transform = 'scale(2)';
                cursorOutline.style.transform = 'scale(1.5)';
                cursorOutline.style.borderColor = 'var(--primary-color)';
            });
            
            el.addEventListener('mouseleave', () => {
                cursorDot.style.transform = 'scale(1)';
                cursorOutline.style.transform = 'scale(1)';
                cursorOutline.style.borderColor = 'rgba(88, 101, 242, 0.3)';
            });
        });
    }

    // ===============================================
    // OPTIMIZACIONES DE RENDIMIENTO
    // ===============================================
    optimizePerformance() {
        // Lazy loading para imágenes
        this.setupLazyLoading();
        
        // Throttle para eventos de scroll
        this.setupScrollThrottling();
        
        // Preload de recursos críticos
        this.preloadCriticalResources();
    }

    setupLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            images.forEach(img => imageObserver.observe(img));
        }
    }

    setupScrollThrottling() {
        let scrollTimeout;
        
        window.addEventListener('scroll', () => {
            if (scrollTimeout) return;
            
            scrollTimeout = setTimeout(() => {
                // Efectos de scroll optimizados aquí
                scrollTimeout = null;
            }, 16); // ~60fps
        });
    }

    preloadCriticalResources() {
        const criticalResources = [
            'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
            'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap'
        ];
        
        criticalResources.forEach(url => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = url;
            link.as = 'style';
            document.head.appendChild(link);
        });
    }

    // ===============================================
    // UTILIDADES
    // ===============================================
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // ===============================================
    // MANEJO DE ERRORES
    // ===============================================
    setupErrorHandling() {
        window.addEventListener('error', (e) => {
            console.error('Error en el sitio:', e.error);
            // En producción, podrías enviar esto a un servicio de logging
        });

        window.addEventListener('unhandledrejection', (e) => {
            console.error('Promise rechazada no manejada:', e.reason);
        });
    }
}

// ===============================================
// FUNCIONES GLOBALES ADICIONALES
// ===============================================

// Función para testimonios (compatibilidad con HTML)
function currentSlide(index) {
    if (window.portfolioManager) {
        window.portfolioManager.showTestimonial(index - 1);
        window.portfolioManager.resetAutoplay();
    }
}

// Smooth scrolling global mejorado
function smoothScrollTo(elementId, offset = 80) {
    const element = document.getElementById(elementId);
    if (element) {
        const elementPosition = element.offsetTop - offset;
        window.scrollTo({
            top: elementPosition,
            behavior: 'smooth'
        });
    }
}

// Función para copiar texto al portapapeles
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        if (window.portfolioManager) {
            window.portfolioManager.showNotification('¡Texto copiado al portapapeles!', 'success');
        }
    } catch (err) {
        console.error('Error al copiar:', err);
    }
}

// Detectar tema del sistema
function detectSystemTheme() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.body.classList.add('dark-theme');
    }
}

// ===============================================
// INICIALIZACIÓN
// ===============================================

// Crear instancia global del portfolio manager
window.portfolioManager = new PortfolioManager();

// Configuraciones adicionales
document.addEventListener('DOMContentLoaded', () => {
    // Detectar tema del sistema
    detectSystemTheme();
    
    // Configurar service worker si está disponible
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js').catch(console.error);
    }
    
    // Configurar analytics si está disponible
    if (typeof gtag !== 'undefined') {
        gtag('config', 'GA_MEASUREMENT_ID', {
            page_title: 'Portfolio - Josue Discord Developer',
            page_location: window.location.href
        });
    }
});

// Optimizaciones para el rendimiento
window.addEventListener('load', () => {
    // Marcar que la página está completamente cargada
    document.body.classList.add('loaded');
    
    // Inicializar funcionalidades que requieren que todo esté cargado
    setTimeout(() => {
        // Cualquier inicialización adicional post-carga
        console.log('Portfolio totalmente cargado y optimizado ✅');
    }, 500);
});

// Manejo de cambios de orientación en móviles
window.addEventListener('orientationchange', () => {
    setTimeout(() => {
        window.scrollTo(0, window.scrollY);
    }, 500);
});

// ===============================================
// EXPORTAR PARA TESTING (si es necesario)
// ===============================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PortfolioManager };
}
