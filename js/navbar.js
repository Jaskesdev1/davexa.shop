console.log('Samustudios bir maldır mal olarak da kalacaktır. 6 kişiler 7 yapıp manifest diye değişsinler isimlerini')

document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const navbar = document.querySelector('.navbar');
    const mobileOverlay = document.querySelector('.mobile-overlay');
    const navContainer = document.querySelector('.nav-container');

    hamburger.addEventListener('click', function() {
        const isActive = hamburger.classList.contains('active');
        
        if (isActive) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    });

    function openMobileMenu() {
        hamburger.classList.add('active');
        navMenu.classList.add('active');
        mobileOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        const menuItems = navMenu.querySelectorAll('.nav-item');
        menuItems.forEach((item, index) => {
            item.style.animationDelay = `${index * 0.1}s`;
        });
    }

    function closeMobileMenu() {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        mobileOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    mobileOverlay.addEventListener('click', closeMobileMenu);

    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            closeMobileMenu();
        });
    });

    let lastScrollY = window.scrollY;
    let ticking = false;

    function updateNavbar() {
        const scrollY = window.scrollY;
        
        if (scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        if (scrollY > lastScrollY && scrollY > 100) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }

        lastScrollY = scrollY;
        ticking = false;
    }

    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateNavbar);
            ticking = true;
        }
    }

    window.addEventListener('scroll', requestTick);

    const sections = document.querySelectorAll('section[id]');
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '-80px 0px -20% 0px'
    };

    const sectionObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.getAttribute('id');
                updateActiveLink(sectionId);
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    function updateActiveLink(activeId) {
        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === '#' + activeId) {
                link.classList.add('active');
            }
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            console.log('Link clicked:', targetId);
            
            if (targetId && targetId.startsWith('#')) {
                e.preventDefault();
                const targetSection = document.querySelector(targetId);
                console.log('Target section found:', targetSection);
                
                if (targetSection) {
                    const navbarHeight = navbar.offsetHeight || 80;
                    const offsetTop = targetSection.offsetTop - navbarHeight;
                    console.log('Scrolling to:', offsetTop);
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                } else {
                    console.log('Target section not found for:', targetId);
                }
            }
        });
    });

    const logo = document.querySelector('.nav-logo');
    logo.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    const discordBtn = document.querySelector('.btn-instagram');
    if (discordBtn) {
        discordBtn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.05)';
        });
        
        discordBtn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    }

    function updateNavbarBlur() {
        const scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
        const blurAmount = Math.min(scrollPercent * 20, 20);
        navbar.style.backdropFilter = `blur(${blurAmount}px)`;
    }

    window.addEventListener('scroll', updateNavbarBlur);

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    });

    let touchStartY = 0;
    let touchEndY = 0;

    document.addEventListener('touchstart', function(e) {
        touchStartY = e.changedTouches[0].screenY;
    });

    document.addEventListener('touchend', function(e) {
        touchEndY = e.changedTouches[0].screenY;
        handleSwipe();
    });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartY - touchEndY;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0 && window.scrollY < 100) {
            } else if (diff < 0 && navMenu.classList.contains('active')) {
                closeMobileMenu();
            }
        }
    }

    window.addEventListener('load', function() {
        navbar.style.opacity = '0';
        navbar.style.transform = 'translateY(-100%)';
        
        setTimeout(() => {
            navbar.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            navbar.style.opacity = '1';
            navbar.style.transform = 'translateY(0)';
        }, 100);
    });

    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        scrollTimeout = setTimeout(updateNavbar, 10);
    });
});
