// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initLoader();
    initNavigation();
    initScrollEffects();
    initAnimations();
    initProductFiltering();
    initContactForm();
    initOfferTimer();
    initScrollToTop();
    initMobileMenu();
    initPhotoZoom();
    initArticles();
});

// Loading Screen
function initLoader() {
    const loader = document.getElementById('loading-screen');
    
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
            }, 500);
        }, 1000);
    });
}

// Navigation Functions
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Update active link
                updateActiveNavLink(link);
                
                // Close mobile menu if open
                closeMobileMenu();
            }
        });
    });
    
    // Update active navigation link based on scroll position
    window.addEventListener('scroll', updateActiveNavOnScroll);
}

function updateActiveNavLink(activeLink) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    activeLink.classList.add('active');
}

function updateActiveNavOnScroll() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// Mobile Menu
function initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
}

function closeMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}

// Scroll Effects
function initScrollEffects() {
    // Initialize AOS (Animate on Scroll)
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000,
            once: true,
            offset: 100
        });
    }
    
    // Parallax effect for hero section
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallax = document.querySelector('.hero-background');
        
        if (parallax) {
            const speed = scrolled * 0.5;
            parallax.style.transform = `translateY(${speed}px)`;
        }
    });
}

// Animations
function initAnimations() {
    // Typing effect for hero title
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        animateTyping(heroTitle);
    }
    
    // Counter animation for statistics
    const counters = document.querySelectorAll('.counter');
    if (counters.length > 0) {
        observeCounters(counters);
    }
    
    // Stagger animation for cards
    const cardContainers = document.querySelectorAll('.services-grid, .products-grid');
    cardContainers.forEach(container => {
        staggerAnimateCards(container);
    });
}

function animateTyping(element) {
    const text = element.innerHTML;
    element.innerHTML = '';
    element.style.opacity = '1';
    
    let i = 0;
    const timer = setInterval(() => {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
        } else {
            clearInterval(timer);
        }
    }, 50);
}

function observeCounters(counters) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
            }
        });
    });
    
    counters.forEach(counter => {
        observer.observe(counter);
    });
}

function animateCounter(counter) {
    const target = parseInt(counter.getAttribute('data-target'));
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            counter.textContent = target;
            clearInterval(timer);
        } else {
            counter.textContent = Math.floor(current);
        }
    }, 16);
}

function staggerAnimateCards(container) {
    const cards = container.querySelectorAll('.service-card, .product-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                cards.forEach((card, index) => {
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, index * 100);
                });
            }
        });
    });
    
    observer.observe(container);
    
    // Set initial state
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
}

// Product Filtering
function initProductFiltering() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productsGrid = document.getElementById('products-grid');
    const loadMoreBtn = document.getElementById('load-more-btn');
    
    let currentFilter = 'all';
    let productsLoaded = 6;
    const productsPerLoad = 6;
    
    // Sample product data
    const products = [
        {
            id: 1,
            name: "فيتامين د3 1000 وحدة",
            category: "vitamins",
            price: "12.99 ج.م",
            description: "فيتامين أساسي لصحة العظام ودعم جهاز المناعة",
            image: "images/products/vitamin-d3.svg"
        },
        {
            id: 2,
            name: "زيت السمك أوميجا 3",
            category: "supplements",
            price: "24.99 ج.م",
            description: "أحماض أوميجا 3 عالية الجودة لصحة القلب",
            image: "images/products/omega-3.svg"
        },
        {
            id: 3,
            name: "باراسيتامول 500 ملجم",
            category: "medicines",
            price: "8.99 ج.م",
            description: "مسكن فعال للألم وخافض للحرارة",
            image: "images/products/paracetamol.svg"
        },
        {
            id: 4,
            name: "سيروم مكافح للشيخوخة",
            category: "beauty",
            price: "45.99 ج.م",
            description: "تركيبة متقدمة لبشرة شابة ومشرقة",
            image: "images/products/serum.svg"
        },
        {
            id: 5,
            name: "مجموعة فيتامينات متعددة",
            category: "vitamins",
            price: "18.99 ج.م",
            description: "دعم يومي كامل للفيتامينات والمعادن",
            image: "images/products/multivitamin.svg"
        },
        {
            id: 6,
            name: "إيبوبروفين 400 ملجم",
            category: "medicines",
            price: "6.99 ج.م",
            description: "دواء مضاد للالتهاب ومسكن للألم",
            image: "images/products/ibuprofen.svg"
        },
        {
            id: 7,
            name: "كريم مرطب",
            category: "beauty",
            price: "22.99 ج.م",
            description: "ترطيب عميق لجميع أنواع البشرة",
            image: "images/products/moisturizer.svg"
        },
        {
            id: 8,
            name: "بروبيوتيك",
            category: "supplements",
            price: "29.99 ج.م",
            description: "دعم صحة الجهاز الهضمي وجهاز المناعة",
            image: "images/products/probiotics.svg"
        }
    ];
    
    // Load initial products
    loadProducts();
    
    // Filter button events
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active filter
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            currentFilter = button.getAttribute('data-filter');
            productsLoaded = productsPerLoad;
            
            // Clear and reload products
            productsGrid.innerHTML = '';
            loadProducts();
        });
    });
    
    // Load more button event
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            productsLoaded += productsPerLoad;
            loadProducts();
        });
    }
    
    function loadProducts() {
        const filteredProducts = currentFilter === 'all' 
            ? products 
            : products.filter(product => product.category === currentFilter);
        
        const productsToShow = filteredProducts.slice(0, productsLoaded);
        
        // Clear grid
        productsGrid.innerHTML = '';
        
        // Add products
        productsToShow.forEach((product, index) => {
            const productCard = createProductCard(product);
            productsGrid.appendChild(productCard);
            
            // Animate card appearance
            setTimeout(() => {
                productCard.style.opacity = '1';
                productCard.style.transform = 'translateY(0)';
            }, index * 100);
        });
        
        // Update load more button visibility
        if (loadMoreBtn) {
            if (productsToShow.length >= filteredProducts.length) {
                loadMoreBtn.style.display = 'none';
            } else {
                loadMoreBtn.style.display = 'block';
            }
        }
    }
    
    function createProductCard(product) {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        // Create better fallback image based on category
        const fallbackImage = createProductFallbackImage(product.category, product.name);
        
        card.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" onerror="this.src='${fallbackImage}'">
            </div>
            <div class="product-info">
                <div class="product-category">${getCategoryName(product.category)}</div>
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-price">${product.price}</div>
                <button class="product-btn">أضف للاستفسار</button>
            </div>
        `;
        
        return card;
    }
    
    function createProductFallbackImage(category, productName) {
        const categoryIcons = {
            'vitamins': '💊',
            'supplements': '🟢', 
            'medicines': '💉',
            'beauty': '✨'
        };
        
        const categoryColors = {
            'vitamins': '#2ecc71',
            'supplements': '#3498db',
            'medicines': '#e74c3c',
            'beauty': '#9b59b6'
        };
        
        const icon = categoryIcons[category] || '💊';
        const color = categoryColors[category] || '#95a5a6';
        const categoryName = getCategoryName(category);
        
        // Create SVG as data URL
        const svg = `
            <svg width="280" height="200" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:${color};stop-opacity:0.8" />
                        <stop offset="100%" style="stop-color:${color};stop-opacity:0.6" />
                    </linearGradient>
                </defs>
                <rect width="100%" height="100%" fill="url(#gradient)"/>
                <text x="50%" y="30%" text-anchor="middle" fill="white" font-size="40" font-family="Arial">${icon}</text>
                <text x="50%" y="55%" text-anchor="middle" fill="white" font-size="14" font-family="Cairo, Arial" font-weight="bold">${categoryName}</text>
                <text x="50%" y="75%" text-anchor="middle" fill="white" font-size="12" font-family="Cairo, Arial">${productName.substring(0, 20)}${productName.length > 20 ? '...' : ''}</text>
            </svg>
        `;
        
        return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)));
    }
    
    function getCategoryName(category) {
        const categoryNames = {
            'vitamins': 'فيتامينات',
            'supplements': 'مكملات غذائية',
            'medicines': 'أدوية',
            'beauty': 'تجميل وعناية بشرة'
        };
        return categoryNames[category] || category;
    }
}

// Contact Form
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactFormSubmit);
    }
}

function handleContactFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const button = form.querySelector('button[type="submit"]');
    const buttonText = button.querySelector('.btn-text');
    const buttonLoader = button.querySelector('.btn-loader');
    
    // Show loading state
    buttonText.style.display = 'none';
    buttonLoader.style.display = 'inline-block';
    button.disabled = true;
    
    // Get form data
    const formData = new FormData(form);
    
    // Try to submit to PHP handler first, fallback to localStorage
    fetch('contact-handler.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showNotification(data.message, 'success');
            form.reset();
        } else {
            showNotification(data.message, 'error');
        }
    })
    .catch(error => {
        // Fallback to localStorage if PHP handler is not available
        console.log('PHP handler not available, saving to localStorage');
        
        // Save message to localStorage
        const messageData = {
            id: generateMessageId(),
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone') || '',
            subject: formData.get('subject') || 'رسالة جديدة',
            message: formData.get('message'),
            status: 'unread',
            dateReceived: new Date().toISOString(),
            priority: 'normal'
        };
        
        saveMessageToLocalStorage(messageData);
        
        setTimeout(() => {
            showNotification('تم إرسال الرسالة بنجاح! سنتواصل معكم قريباً.', 'success');
            form.reset();
        }, 1000);
    })
    .finally(() => {
        // Reset button state
        buttonText.style.display = 'inline-block';
        buttonLoader.style.display = 'none';
        button.disabled = false;
    });
}

// Save message to localStorage for admin panel access
function saveMessageToLocalStorage(messageData) {
    const storageKey = 'pharmacy_db_messages';
    let messages = [];
    
    try {
        const existingMessages = localStorage.getItem(storageKey);
        if (existingMessages) {
            messages = JSON.parse(existingMessages);
        }
    } catch (error) {
        console.warn('Error reading existing messages:', error);
        messages = [];
    }
    
    messages.push(messageData);
    
    try {
        localStorage.setItem(storageKey, JSON.stringify(messages));
        console.log('Message saved to localStorage successfully');
    } catch (error) {
        console.error('Error saving message to localStorage:', error);
    }
}

// Generate unique message ID
function generateMessageId() {
    const storageKey = 'pharmacy_db_messages';
    let existingMessages = [];
    
    try {
        const stored = localStorage.getItem(storageKey);
        if (stored) {
            existingMessages = JSON.parse(stored);
        }
    } catch (error) {
        existingMessages = [];
    }
    
    const ids = existingMessages.map(msg => parseInt(msg.id) || 0);
    return Math.max(0, ...ids) + 1;
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#2ecc71' : '#3498db'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 5000);
}

// Offer Timer
function initOfferTimer() {
    const timerElements = {
        days: document.getElementById('days'),
        hours: document.getElementById('hours'),
        minutes: document.getElementById('minutes')
    };
    
    if (timerElements.days && timerElements.hours && timerElements.minutes) {
        updateTimer();
        setInterval(updateTimer, 60000); // Update every minute
    }
    
    function updateTimer() {
        // Set offer end date (30 days from now for demo)
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + 30);
        
        const now = new Date();
        const timeLeft = endDate - now;
        
        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        
        timerElements.days.textContent = days.toString().padStart(2, '0');
        timerElements.hours.textContent = hours.toString().padStart(2, '0');
        timerElements.minutes.textContent = minutes.toString().padStart(2, '0');
    }
}

// Scroll to Top
function initScrollToTop() {
    const scrollToTopBtn = document.getElementById('scroll-to-top');
    
    if (scrollToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                scrollToTopBtn.classList.add('visible');
            } else {
                scrollToTopBtn.classList.remove('visible');
            }
        });
        
        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Utility Functions
function debounce(func, wait) {
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

function throttle(func, limit) {
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

// Intersection Observer for lazy loading and animations
function createIntersectionObserver(callback, options = {}) {
    const defaultOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observerOptions = { ...defaultOptions, ...options };
    
    return new IntersectionObserver(callback, observerOptions);
}

// Performance optimized scroll handler
const optimizedScroll = throttle(() => {
    updateActiveNavOnScroll();
}, 100);

window.addEventListener('scroll', optimizedScroll);

// Photo Zoom Functionality
function initPhotoZoom() {
    const pharmacistPhoto = document.getElementById('pharmacist-photo');
    const photoModal = document.getElementById('photo-modal');
    const modalPhoto = document.getElementById('modal-photo');
    const closeModalBtn = document.getElementById('close-photo-modal');
    
    if (pharmacistPhoto && photoModal && modalPhoto) {
        // Open modal when clicking on photo
        pharmacistPhoto.addEventListener('click', () => {
            modalPhoto.src = pharmacistPhoto.src;
            modalPhoto.alt = pharmacistPhoto.alt;
            photoModal.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // Add zoom animation
            setTimeout(() => {
                modalPhoto.style.transform = 'scale(1)';
            }, 100);
        });
        
        // Close modal functions
        function closeModal() {
            photoModal.classList.remove('active');
            document.body.style.overflow = '';
            modalPhoto.style.transform = 'scale(0.8)';
        }
        
        // Close on X button click
        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', closeModal);
        }
        
        // Close on background click
        photoModal.addEventListener('click', (e) => {
            if (e.target === photoModal) {
                closeModal();
            }
        });
        
        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && photoModal.classList.contains('active')) {
                closeModal();
            }
        });
        
        // Prevent scroll when modal is open
        photoModal.addEventListener('wheel', (e) => {
            e.preventDefault();
        });
    }
}

// Articles Management
function initArticles() {
    loadArticlesFromDatabase();
    initArticleModal();
}

function loadArticlesFromDatabase() {
    // Load articles from JSON or localStorage
    fetch('data/news.json')
        .then(response => response.json())
        .then(articles => {
            updateArticlesOnPage(articles);
        })
        .catch(error => {
            console.log('Loading from localStorage fallback');
            // Fallback to localStorage
            const storedArticles = localStorage.getItem('pharmacy_db_news');
            if (storedArticles) {
                const articles = JSON.parse(storedArticles);
                updateArticlesOnPage(articles);
            }
        });
}

function updateArticlesOnPage(articles) {
    // Update news cards with real data and add event listeners
    const newsCards = document.querySelectorAll('.news-card');
    
    newsCards.forEach((card, index) => {
        if (articles[index]) {
            const article = articles[index];
            const img = card.querySelector('img');
            const title = card.querySelector('h3') || card.querySelector('h4');
            const readMoreBtn = card.querySelector('.read-more');
            const dateElement = card.querySelector('.news-date');
            
            // Update image
            if (img) {
                img.src = article.image;
                img.alt = article.title;
            }
            
            // Update title
            if (title) {
                title.textContent = article.title;
            }
            
            // Update date
            if (dateElement && article.datePublished) {
                const formattedDate = formatArabicDate(article.datePublished);
                dateElement.innerHTML = `<i class="fas fa-calendar"></i> ${formattedDate}`;
            }
            
            // Add click event to read more button
            if (readMoreBtn) {
                readMoreBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    showArticleModal(article);
                });
            }
            
            // Add click event to entire card
            card.addEventListener('click', (e) => {
                if (!e.target.closest('.read-more')) {
                    showArticleModal(article);
                }
            });
            
            // Add cursor pointer
            card.style.cursor = 'pointer';
        }
    });
}

function formatArabicDate(dateString) {
    const date = new Date(dateString);
    const arabicMonths = [
        'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
        'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
    ];
    
    const day = date.getDate();
    const month = arabicMonths[date.getMonth()];
    const year = date.getFullYear();
    
    return `${day} ${month} ${year}`;
}

function getCategoryDisplayName(category) {
    const categoryNames = {
        'health-tips': 'نصائح صحية',
        'nutrition': 'تغذية',
        'wellness': 'عافية',
        'medications': 'أدوية',
        'pharmacy': 'صيدلة'
    };
    return categoryNames[category] || category;
}

function initArticleModal() {
    const articleModal = document.getElementById('article-modal');
    const closeBtn = document.getElementById('close-article-modal');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', closeArticleModal);
    }
    
    if (articleModal) {
        // Close on background click
        articleModal.addEventListener('click', (e) => {
            if (e.target === articleModal) {
                closeArticleModal();
            }
        });
    }
    
    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && articleModal && articleModal.classList.contains('active')) {
            closeArticleModal();
        }
    });
}

function showArticleModal(article) {
    const modal = document.getElementById('article-modal');
    const modalImage = document.getElementById('article-modal-image');
    const modalTitle = document.getElementById('article-modal-title');
    const modalAuthor = document.getElementById('article-modal-author');
    const modalDate = document.getElementById('article-modal-date');
    const modalCategory = document.getElementById('article-modal-category');
    const modalContent = document.getElementById('article-modal-content');
    
    if (modal && modalImage && modalTitle && modalAuthor && modalDate && modalCategory && modalContent) {
        // Populate modal content
        modalImage.src = article.image;
        modalImage.alt = article.title;
        modalTitle.textContent = article.title;
        modalAuthor.textContent = article.author;
        modalDate.textContent = formatArabicDate(article.datePublished);
        modalCategory.textContent = getCategoryDisplayName(article.category);
        
        // Format article content
        const formattedContent = formatArticleContent(article.content);
        modalContent.innerHTML = formattedContent;
        
        // Show modal
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Scroll to top of modal
        modal.scrollTop = 0;
    }
}

function formatArticleContent(content) {
    // Split content into paragraphs and format
    const paragraphs = content.split('\n').filter(p => p.trim() !== '');
    
    return paragraphs.map(paragraph => {
        paragraph = paragraph.trim();
        
        // Check if it's a heading (starts with ##)
        if (paragraph.startsWith('##')) {
            return `<h3>${paragraph.replace('##', '').trim()}</h3>`;
        }
        
        // Check if it's a list item (starts with -)
        if (paragraph.startsWith('-')) {
            return `<li>${paragraph.replace('-', '').trim()}</li>`;
        }
        
        // Regular paragraph
        return `<p>${paragraph}</p>`;
    }).join('');
}

function closeArticleModal() {
    const modal = document.getElementById('article-modal');
    
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}