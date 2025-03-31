// Registrar Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('ServiceWorker registrado com sucesso:', registration.scope);
            })
            .catch(error => {
                console.log('Falha ao registrar o ServiceWorker:', error);
            });
    });
}

// Header Scroll Effect
let lastScroll = 0;
const header = document.querySelector('header');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        header.classList.remove('scroll-up');
        return;
    }
    
    if (currentScroll > lastScroll && !header.classList.contains('scroll-down')) {
        header.classList.remove('scroll-up');
        header.classList.add('scroll-down');
    } else if (currentScroll < lastScroll && header.classList.contains('scroll-down')) {
        header.classList.remove('scroll-down');
        header.classList.add('scroll-up');
    }
    lastScroll = currentScroll;
});

// Mobile Menu Toggle
const menuBtn = document.querySelector('.menu-btn');
const navLinks = document.querySelector('.nav-links');

menuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    const isExpanded = menuBtn.getAttribute('aria-expanded') === 'true';
    menuBtn.setAttribute('aria-expanded', !isExpanded);
});

// Parallax Effect
const heroImage = document.querySelector('.hero-image img');
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    heroImage.style.transform = `translateY(${scrolled * 0.5}px)`;
});

// Intersection Observer para animações
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observar elementos para animação
document.querySelectorAll('.area-card, .membro-card').forEach(el => {
    observer.observe(el);
});

// Função para formatar números com separador de milhares
function formatNumber(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// Animação dos contadores com curva de animação suave
function animateCounter(element, target, duration) {
    let start = 0;
    const startTime = performance.now();
    
    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Função de easing para suavizar a animação
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        
        const currentValue = Math.floor(target * easeOutQuart);
        element.textContent = formatNumber(currentValue);
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = formatNumber(target);
        }
    }
    
    requestAnimationFrame(updateCounter);
}

// Observador para os contadores
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const anos = entry.target.querySelector('.anos');
            const casos = entry.target.querySelector('.casos');
            const profissionais = entry.target.querySelector('.profissionais');
            
            // Iniciar animações com diferentes durações para criar um efeito sequencial
            setTimeout(() => animateCounter(anos, 10, 2000), 0);
            setTimeout(() => animateCounter(casos, 500, 2500), 500);
            setTimeout(() => animateCounter(profissionais, 2, 2000), 1000);
            
            // Desobservar após iniciar as animações
            counterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

// Observar a seção de estatísticas
const statsSection = document.querySelector('.sobre-stats');
if (statsSection) {
    counterObserver.observe(statsSection);
}

// Validação do formulário
const form = document.querySelector('.contato-form');
if (form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = form.querySelector('#name');
        const email = form.querySelector('#email');
        const phone = form.querySelector('#phone');
        const subject = form.querySelector('#subject');
        const message = form.querySelector('#message');
        
        let isValid = true;
        
        // Validação do nome
        if (name.value.trim() === '') {
            showError(name, 'Por favor, insira seu nome');
            isValid = false;
        } else {
            hideError(name);
        }
        
        // Validação do email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.value)) {
            showError(email, 'Por favor, insira um email válido');
            isValid = false;
        } else {
            hideError(email);
        }
        
        // Validação do telefone
        const phoneRegex = /^\(\d{2}\) \d{5}-\d{4}$/;
        if (!phoneRegex.test(phone.value)) {
            showError(phone, 'Por favor, insira um telefone válido');
            isValid = false;
        } else {
            hideError(phone);
        }
        
        // Validação do assunto
        if (subject.value.trim() === '') {
            showError(subject, 'Por favor, insira um assunto');
            isValid = false;
        } else {
            hideError(subject);
        }
        
        // Validação da mensagem
        if (message.value.trim() === '') {
            showError(message, 'Por favor, insira sua mensagem');
            isValid = false;
        } else {
            hideError(message);
        }
        
        if (isValid) {
            // Aqui você pode adicionar o código para enviar o formulário
            console.log('Formulário válido, enviando...');
            // Simular envio
            const submitBtn = form.querySelector('.submit-btn');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Enviando...';
            
            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Enviar Mensagem';
                form.reset();
                alert('Mensagem enviada com sucesso!');
            }, 2000);
        }
    });
}

// Funções auxiliares para validação
function showError(input, message) {
    const formGroup = input.parentElement;
    const error = formGroup.querySelector('.error-message');
    input.classList.add('error');
    error.textContent = message;
    error.style.display = 'block';
}

function hideError(input) {
    const formGroup = input.parentElement;
    const error = formGroup.querySelector('.error-message');
    input.classList.remove('error');
    error.style.display = 'none';
}

// Máscara para o campo de telefone
const phoneInput = document.querySelector('#phone');
if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 11) value = value.slice(0, 11);
        
        if (value.length > 2) {
            value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
        }
        if (value.length > 10) {
            value = `${value.slice(0, 10)}-${value.slice(10)}`;
        }
        
        e.target.value = value;
    });
}

// Botão Voltar ao Topo
const backToTop = document.querySelector('.back-to-top');
if (backToTop) {
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    });
    
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Fechar menu ao clicar em um link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
});

// Animação suave do scroll
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

// Animação de fade-in para as seções
const sections = document.querySelectorAll('section');
const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
        }
    });
}, { threshold: 0.1 });

sections.forEach(section => {
    fadeObserver.observe(section);
});

// Animação de Cards
const cards = document.querySelectorAll('.area-card, .membro-card, .destaque-card, .valor-card, .metodologia-item');
if (cards.length > 0) {
    const cardsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                cardsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    cards.forEach(card => cardsObserver.observe(card));
} 