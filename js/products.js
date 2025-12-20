console.log('Samustudios bir maldır mal olarak da kalacaktır. 6 kişiler 7 yapıp manifest diye değişsinler isimlerini')

document.addEventListener('DOMContentLoaded', function() {
    
    const filterTabs = document.querySelectorAll('.filter-tab');
    const searchInput = document.getElementById('searchInput');
    const sortSelect = document.getElementById('sortSelect');
    const productsGrid = document.getElementById('productsGrid');
    const productCards = document.querySelectorAll('.product-card');
    const productModal = document.getElementById('productModal');
    const modalClose = document.querySelector('.modal-close');
    const quickViewBtns = document.querySelectorAll('.btn-quick-view');
    const addToCartBtns = document.querySelectorAll('.btn-add-cart');

    let currentFilter = 'all';
    let currentSearch = '';
    let currentSort = 'name';

    init();

    function init() {
        setupEventListeners();
        setupAnimations();
        loadProducts();
    }

    function setupEventListeners() {
        filterTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                const filter = this.getAttribute('data-filter');
                setActiveFilter(filter);
                filterProducts();
            });
        });

        searchInput.addEventListener('input', function() {
            currentSearch = this.value.toLowerCase();
            filterProducts();
        });

        sortSelect.addEventListener('change', function() {
            currentSort = this.value;
            sortProducts();
        });

        quickViewBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const productCard = this.closest('.product-card');
                showProductModal(productCard);
            });
        });

        addToCartBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const productCard = this.closest('.product-card');
                addToCart(productCard);
            });
        });

        modalClose.addEventListener('click', closeModal);
        productModal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal();
            }
        });

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && productModal.classList.contains('active')) {
                closeModal();
            }
        });
    }

    function setupAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        productCards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(card);
        });
    }

    function setActiveFilter(filter) {
        currentFilter = filter;
        
        filterTabs.forEach(tab => {
            tab.classList.remove('active');
            if (tab.getAttribute('data-filter') === filter) {
                tab.classList.add('active');
            }
        });
    }

    function filterProducts() {
        const cards = Array.from(productCards);
        
        cards.forEach(card => {
            const category = card.getAttribute('data-category');
            const name = card.querySelector('.product-name').textContent.toLowerCase();
            const description = card.querySelector('.product-description').textContent.toLowerCase();
            
            const matchesFilter = currentFilter === 'all' || category === currentFilter;
            const matchesSearch = currentSearch === '' || 
                name.includes(currentSearch) || 
                description.includes(currentSearch);
            
            if (matchesFilter && matchesSearch) {
                card.style.display = 'block';
                card.style.animation = 'fadeInUp 0.6s ease forwards';
            } else {
                card.style.display = 'none';
            }
        });

        const visibleCards = cards.filter(card => card.style.display !== 'none');
        showNoResults(visibleCards.length === 0);
    }

    function sortProducts() {
        const cards = Array.from(productCards).filter(card => card.style.display !== 'none');
        
        cards.sort((a, b) => {
            switch (currentSort) {
                case 'name':
                    return a.querySelector('.product-name').textContent.localeCompare(
                        b.querySelector('.product-name').textContent
                    );
                case 'price-low':
                    return parseInt(a.getAttribute('data-price')) - parseInt(b.getAttribute('data-price'));
                case 'price-high':
                    return parseInt(b.getAttribute('data-price')) - parseInt(a.getAttribute('data-price'));
                case 'popular':
                    return parseInt(b.getAttribute('data-popularity')) - parseInt(a.getAttribute('data-popularity'));
                default:
                    return 0;
            }
        });

        cards.forEach((card, index) => {
            card.style.order = index;
            card.style.animation = `fadeInUp 0.6s ease forwards`;
            card.style.animationDelay = `${index * 0.1}s`;
        });
    }

    function showNoResults(show) {
        let noResults = document.querySelector('.no-results');
        
        if (show && !noResults) {
            noResults = document.createElement('div');
            noResults.className = 'no-results';
            noResults.innerHTML = `
                <div class="no-results-content">
                    <i class="fas fa-search"></i>
                    <h3>Ürün bulunamadı</h3>
                    <p>Aradığınız kriterlere uygun ürün bulunamadı. Lütfen farklı arama terimleri deneyin.</p>
                </div>
            `;
            noResults.style.cssText = `
                grid-column: 1 / -1;
                text-align: center;
                padding: 60px 20px;
                color: #888888;
            `;
            productsGrid.appendChild(noResults);
        } else if (!show && noResults) {
            noResults.remove();
        }
    }

    function showProductModal(productCard) {
        const name = productCard.querySelector('.product-name').textContent;
        const description = productCard.querySelector('.product-description').textContent;
        const price = productCard.querySelector('.price').textContent;
        const oldPrice = productCard.querySelector('.price-old');
        const features = Array.from(productCard.querySelectorAll('.feature-tag')).map(tag => tag.textContent);
        const category = productCard.getAttribute('data-category');
        
        const modalTitle = productModal.querySelector('.modal-title');
        const modalDescription = productModal.querySelector('.modal-description');
        const modalPrice = productModal.querySelector('.modal-price .price');
        const featuresList = productModal.querySelector('.features-list');
        const modalMedia = productModal.querySelector('.modal-media');
        
        modalTitle.textContent = name;
        modalDescription.textContent = description;
        modalPrice.textContent = price;
        if (oldPrice) {
            const oldPriceSpan = document.createElement('span');
            oldPriceSpan.className = 'price-old';
            oldPriceSpan.textContent = oldPrice.textContent;
            modalPrice.parentNode.appendChild(oldPriceSpan);
        }
        
        const videoUrl = productCard.getAttribute('data-video');
        const imageUrl = productCard.getAttribute('data-image');
        modalMedia.innerHTML = '';
        if (videoUrl) {
            const video = document.createElement('video');
            video.src = videoUrl;
            video.controls = true;
            video.style.width = '100%';
            video.style.borderRadius = '10px';
            modalMedia.appendChild(video);
        } else if (imageUrl) {
            const img = document.createElement('img');
            img.src = imageUrl;
            img.alt = name;
            img.style.width = '100%';
            img.style.borderRadius = '10px';
            modalMedia.appendChild(img);
        } else {
            const placeholder = document.createElement('div');
            placeholder.className = 'modal-placeholder-fallback';
            placeholder.innerHTML = '<i class="fas fa-image"></i>';
            placeholder.style.cssText = 'display:flex;align-items:center;justify-content:center;height:260px;background:rgba(255,255,255,0.05);border-radius:10px;color:#888;';
            modalMedia.appendChild(placeholder);
        }
        
        featuresList.innerHTML = '';
        features.forEach(feature => {
            const li = document.createElement('li');
            li.textContent = feature;
            featuresList.appendChild(li);
        });
        
        productModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        productModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    function addToCart(productCard) {
        const name = productCard.querySelector('.product-name').textContent;
        const price = productCard.querySelector('.price').textContent;
        const category = productCard.getAttribute('data-category');
        const productId = productCard.getAttribute('data-product-id') || Date.now().toString();
        const baseUrl = window.location.origin + window.location.pathname.replace('urunler.php', '');
        const paymentUrl = `${baseUrl}payment/payment_form.php?product_id=${encodeURIComponent(productId)}&product_name=${encodeURIComponent(name)}&product_price=${encodeURIComponent(price)}`;
        
        window.open(paymentUrl, '_blank');
        
        showNotification(`${name} için ödeme sayfası açıldı!`, 'success');
    }

    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? '#d5ff00' : type === 'error' ? '#ff4444' : '#333'};
            color: ${type === 'success' ? '#010101' : '#fff'};
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            z-index: 10001;
            transform: translateX(400px);
            transition: transform 0.3s ease;
            max-width: 300px;
            font-weight: 500;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    function loadProducts() {
        productsGrid.classList.add('loading');
        
        setTimeout(() => {
            productsGrid.classList.remove('loading');
            filterProducts();
        }, 100);
    }

    function performAdvancedSearch() {
        const searchTerm = searchInput.value.toLowerCase();
        const cards = Array.from(productCards);
        
        cards.forEach(card => {
            const searchableText = [
                card.querySelector('.product-name').textContent,
                card.querySelector('.product-description').textContent,
                ...Array.from(card.querySelectorAll('.feature-tag')).map(tag => tag.textContent)
            ].join(' ').toLowerCase();
            
            const matches = searchableText.includes(searchTerm);
            card.style.display = matches ? 'block' : 'none';
        });
    }

    let searchTimeout;
    searchInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(performAdvancedSearch, 300);
    });

    document.addEventListener('keydown', function(e) {
        if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
            e.preventDefault();
            searchInput.focus();
        }
        
        if (e.key === 'Enter' && e.target === searchInput) {
            performAdvancedSearch();
        }
    });

    function setupLazyLoading() {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    setupLazyLoading();

    function updateCartCounter() {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const counter = document.querySelector('.cart-counter');
        if (counter) {
            counter.textContent = cart.length;
            counter.style.display = cart.length > 0 ? 'block' : 'none';
        }
    }

    updateCartCounter();

    window.addEventListener('storage', function(e) {
        if (e.key === 'cart') {
            updateCartCounter();
        }
    });

    function scrollToProducts() {
        const productsSection = document.querySelector('.products-section');
        if (productsSection) {
            productsSection.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    const heroButtons = document.querySelectorAll('.hero-buttons .btn');
    heroButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            if (this.getAttribute('href') === '#products') {
                e.preventDefault();
                scrollToProducts();
            }
        });
    });

    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        scrollTimeout = setTimeout(() => {
        }, 10);
    });

    console.log('Products page initialized successfully!');
});
