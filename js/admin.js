// Admin Panel JavaScript

// Database management
class DatabaseManager {
    constructor() {
        this.baseUrl = 'data/';
        this.storagePrefix = 'pharmacy_db_';
        this.initializeDatabase();
    }

    async initializeDatabase() {
        try {
            // Load initial data from JSON files if localStorage is empty
            await this.loadInitialData();
        } catch (error) {
            console.error('Database initialization failed:', error);
        }
    }

    async loadInitialData() {
        const tables = ['products', 'news', 'offers', 'messages'];
        
        for (const table of tables) {
            const storageKey = this.storagePrefix + table;
            
            // Check if data already exists in localStorage
            if (!localStorage.getItem(storageKey)) {
                try {
                    const response = await fetch(this.baseUrl + table + '.json');
                    if (response.ok) {
                        const data = await response.json();
                        localStorage.setItem(storageKey, JSON.stringify(data));
                    } else {
                        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                    }
                } catch (error) {
                    console.warn(`Could not load ${table} data:`, error.message);
                    // Initialize with fallback data
                    this.initializeFallbackData(table, storageKey);
                }
            }
        }
    }

    // Get data from localStorage (simulating database read)
    getData(table) {
        const storageKey = this.storagePrefix + table;
        const data = localStorage.getItem(storageKey);
        return data ? JSON.parse(data) : [];
    }

    // Save data to localStorage (simulating database write)
    saveData(table, data) {
        const storageKey = this.storagePrefix + table;
        localStorage.setItem(storageKey, JSON.stringify(data));
        return true;
    }

    // Add new record
    addRecord(table, record) {
        const data = this.getData(table);
        const newId = this.generateId(data);
        const newRecord = { ...record, id: newId };
        data.push(newRecord);
        this.saveData(table, data);
        return newRecord;
    }

    // Update existing record
    updateRecord(table, id, updatedRecord) {
        const data = this.getData(table);
        const index = data.findIndex(record => record.id == id);
        if (index !== -1) {
            data[index] = { ...data[index], ...updatedRecord };
            this.saveData(table, data);
            return data[index];
        }
        return null;
    }

    // Delete record
    deleteRecord(table, id) {
        const data = this.getData(table);
        const filteredData = data.filter(record => record.id != id);
        this.saveData(table, filteredData);
        return filteredData.length < data.length;
    }

    // Generate new ID
    generateId(existingData) {
        const ids = existingData.map(item => parseInt(item.id) || 0);
        return Math.max(0, ...ids) + 1;
    }

    // Initialize fallback data when JSON files can't be loaded
    initializeFallbackData(table, storageKey) {
        const fallbackData = {
            products: [
                {
                    "id": 1,
                    "name": "فيتامين د3 1000 وحدة",
                    "category": "vitamins",
                    "price": "12.99 ج.م",
                    "description": "فيتامين أساسي لصحة العظام ودعم جهاز المناعة",
                    "image": "images/products/vitamin-d3.svg",
                    "status": "active",
                    "dateAdded": "2024-03-15"
                }
            ],
            news: [
                {
                    "id": 1,
                    "title": "أهمية الالتزام بالدواء",
                    "author": "حازم سعد",
                    "category": "health-tips",
                    "content": "فهم سبب أهمية تناول الأدوية كما هو موصوف لنجاح العلاج والنتائج الصحية الشاملة.",
                    "image": "images/news-1.png",
                    "status": "published",
                    "datePublished": "2024-03-15",
                    "featured": true
                }
            ],
            offers: [
                {
                    "id": 1,
                    "title": "خصم 20% على جميع الفيتامينات",
                    "description": "عزز مناعتك مع مجموعة الفيتامينات المميزة لدينا. العرض ساري حتى 31 مارس.",
                    "discount": "20%",
                    "category": "vitamins",
                    "validUntil": "2024-03-31",
                    "status": "active",
                    "featured": true
                }
            ],
            messages: [
                {
                    "id": 1,
                    "name": "أحمد محمد",
                    "email": "ahmed@example.com",
                    "phone": "+20 123 456 7890",
                    "subject": "استشارة صيدلانية",
                    "message": "أحتاج نصيحة حول تفاعلات الأدوية مع بعض المكملات الغذائية...",
                    "status": "unread",
                    "dateReceived": "2024-03-15T10:30:00",
                    "priority": "normal"
                }
            ]
        };
        
        localStorage.setItem(storageKey, JSON.stringify(fallbackData[table] || []));
    }

    // Get record by ID
    getRecord(table, id) {
        const data = this.getData(table);
        return data.find(record => record.id == id);
    }
}

// Initialize database manager
const db = new DatabaseManager();

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Add error handling for initialization
    try {
        console.log('Initializing admin panel...');
        
        // Wait for database initialization
        setTimeout(() => {
            try {
                initLogin();
                initAdminPanel();
                initDataTables();
                initModals();
                console.log('Admin panel initialized successfully');
            } catch (error) {
                console.error('Error during admin panel initialization:', error);
                showNotification('حدث خطأ في تهيئة لوحة التحكم', 'error');
            }
        }, 100);
    } catch (error) {
        console.error('Critical error during initialization:', error);
    }
});

// Login functionality
function initLogin() {
    const loginForm = document.getElementById('login-form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Check if already logged in
    const isLoggedIn = localStorage.getItem('adminLoggedIn');
    if (isLoggedIn === 'true') {
        showAdminPanel();
    }
}

function handleLogin(e) {
    e.preventDefault();
    
    const form = e.target;
    const username = form.username.value;
    const password = form.password.value;
    const button = form.querySelector('button[type="submit"]');
    const buttonText = button.querySelector('.btn-text');
    const buttonLoader = button.querySelector('.btn-loader');
    
    // Show loading state
    buttonText.style.display = 'none';
    buttonLoader.style.display = 'inline-block';
    button.disabled = true;
    
    // Simulate login (replace with actual authentication)
    setTimeout(() => {
        if (username === 'admin' && password === 'admin123') {
            localStorage.setItem('adminLoggedIn', 'true');
            showAdminPanel();
        } else {
            showNotification('Invalid username or password', 'error');
            
            // Reset button state
            buttonText.style.display = 'inline-block';
            buttonLoader.style.display = 'none';
            button.disabled = false;
        }
    }, 1500);
}

function showAdminPanel() {
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('admin-dashboard').style.display = 'flex';
}

function logout() {
    localStorage.removeItem('adminLoggedIn');
    document.getElementById('login-screen').style.display = 'flex';
    document.getElementById('admin-dashboard').style.display = 'none';
}

// Admin Panel functionality
function initAdminPanel() {
    const navLinks = document.querySelectorAll('.sidebar .nav-link');
    const logoutBtn = document.getElementById('logout-btn');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    
    // Navigation
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = link.getAttribute('data-section');
            showSection(section);
            updateActiveNav(link);
            updatePageTitle(link.textContent.trim());
        });
    });
    
    // Logout
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
    
    // Sidebar toggle for mobile
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', () => {
            document.querySelector('.sidebar').classList.toggle('active');
        });
    }
}

function showSection(sectionName) {
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    const targetSection = document.getElementById(`${sectionName}-section`);
    if (targetSection) {
        targetSection.classList.add('active');
        
        // Load section-specific data
        switch(sectionName) {
            case 'dashboard':
                updateDashboardStats();
                break;
            case 'products':
                loadProductsTable();
                break;
            case 'news':
                loadNewsTable();
                break;
            case 'messages':
                loadMessagesSection();
                break;
        }
    }
}

function updateActiveNav(activeLink) {
    document.querySelectorAll('.sidebar .nav-link').forEach(link => {
        link.classList.remove('active');
    });
    activeLink.classList.add('active');
}

function updatePageTitle(title) {
    const pageTitle = document.querySelector('.page-title');
    if (pageTitle) {
        pageTitle.textContent = title;
    }
}

// Data Tables
function initDataTables() {
    loadProductsTable();
    loadNewsTable();
    updateDashboardStats();
}

function loadProductsTable() {
    const tableBody = document.getElementById('products-table-body');
    if (!tableBody) {
        console.warn('Products table body not found');
        return;
    }
    
    try {
        // Get products from database
        const products = db.getData('products');
        
        tableBody.innerHTML = '';
        
        if (products.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="6">لا توجد منتجات حالياً</td></tr>';
            return;
        }
        
        products.forEach(product => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${product.id}</td>
                <td>${product.name}</td>
                <td>${getCategoryDisplayName(product.category)}</td>
                <td>${product.price}</td>
                <td>
                    <span class="status-badge ${product.status?.toLowerCase() || 'active'}">${product.status || 'Active'}</span>
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-icon edit" onclick="editProduct(${product.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-icon delete" onclick="deleteProduct(${product.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            tableBody.appendChild(row);
        });
        
        // Add status badge styles
        addStatusBadgeStyles();
    } catch (error) {
        console.error('Error loading products table:', error);
        if (tableBody) {
            tableBody.innerHTML = '<tr><td colspan="6">حدث خطأ في تحميل المنتجات</td></tr>';
        }
    }
}

function getCategoryDisplayName(category) {
    const categoryNames = {
        'vitamins': 'فيتامينات',
        'supplements': 'مكملات غذائية', 
        'medicines': 'أدوية',
        'beauty': 'تجميل وعناية'
    };
    return categoryNames[category] || category;
}

function loadNewsTable() {
    const tableBody = document.getElementById('news-table-body');
    if (!tableBody) {
        console.warn('News table body not found');
        return;
    }
    
    try {
        // Get articles from database
        const articles = db.getData('news');
        
        tableBody.innerHTML = '';
        
        if (articles.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="6">لا توجد مقالات حالياً</td></tr>';
            return;
        }
        
        articles.forEach(article => {
            const row = document.createElement('tr');
            const formattedDate = formatDate(article.datePublished || article.date || new Date().toISOString());
            row.innerHTML = `
                <td>${article.id}</td>
                <td>${article.title}</td>
                <td>${article.author}</td>
                <td>${formattedDate}</td>
                <td>
                    <span class="status-badge ${article.status?.toLowerCase() || 'published'}">${article.status || 'Published'}</span>
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-icon edit" onclick="editArticle(${article.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-icon delete" onclick="deleteArticle(${article.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading news table:', error);
        if (tableBody) {
            tableBody.innerHTML = '<tr><td colspan="6">حدث خطأ في تحميل المقالات</td></tr>';
        }
    }
}

function addStatusBadgeStyles() {
    // Add CSS for status badges if not already added
    if (!document.getElementById('status-badge-styles')) {
        const style = document.createElement('style');
        style.id = 'status-badge-styles';
        style.textContent = `
            .status-badge {
                padding: 4px 12px;
                border-radius: 12px;
                font-size: 0.8rem;
                font-weight: 500;
            }
            .status-badge.active,
            .status-badge.published {
                background: #d4edda;
                color: #155724;
            }
            .status-badge.inactive,
            .status-badge.draft {
                background: #f8d7da;
                color: #721c24;
            }
            .action-buttons {
                display: flex;
                gap: 8px;
            }
            .btn-icon {
                width: 32px;
                height: 32px;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
            }
            .btn-icon.edit {
                background: #e3f2fd;
                color: #1976d2;
            }
            .btn-icon.edit:hover {
                background: #bbdefb;
            }
            .btn-icon.delete {
                background: #ffebee;
                color: #d32f2f;
            }
            .btn-icon.delete:hover {
                background: #ffcdd2;
            }
        `;
        document.head.appendChild(style);
    }
}

// Modals
function initModals() {
    try {
        const modal = document.getElementById('content-modal');
        const closeBtn = document.getElementById('close-modal');
        const cancelBtn = document.getElementById('cancel-btn');
        
        // Add product button
        const addProductBtn = document.getElementById('add-product-btn');
        if (addProductBtn) {
            addProductBtn.addEventListener('click', () => showAddProductModal());
        } else {
            console.warn('Add product button not found');
        }
        
        // Add article button
        const addArticleBtn = document.getElementById('add-article-btn');
        if (addArticleBtn) {
            addArticleBtn.addEventListener('click', () => showAddArticleModal());
        } else {
            console.warn('Add article button not found');
        }
        
        // Close modal events
        if (closeBtn) {
            closeBtn.addEventListener('click', hideModal);
        } else {
            console.warn('Close modal button not found');
        }
        
        if (cancelBtn) {
            cancelBtn.addEventListener('click', hideModal);
        } else {
            console.warn('Cancel button not found');
        }
        
        // Close modal when clicking outside
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    hideModal();
                }
            });
        } else {
            console.warn('Content modal not found');
        }
    } catch (error) {
        console.error('Error initializing modals:', error);
    }
}

function showAddProductModal() {
    const modal = document.getElementById('content-modal');
    const modalTitle = document.getElementById('modal-title');
    const contentForm = document.getElementById('content-form');
    
    modalTitle.textContent = 'إضافة منتج جديد';
    
    contentForm.innerHTML = `
        <div class="form-group">
            <label for="product-name">اسم المنتج</label>
            <input type="text" id="product-name" name="name" required>
        </div>
        
        <div class="form-group">
            <label for="product-category">الفئة</label>
            <select id="product-category" name="category" required>
                <option value="">اختر الفئة</option>
                <option value="medicines">أدوية</option>
                <option value="vitamins">فيتامينات</option>
                <option value="supplements">مكملات غذائية</option>
                <option value="beauty">تجميل وعناية</option>
            </select>
        </div>
        
        <div class="form-group">
            <label for="product-price">السعر</label>
            <input type="text" id="product-price" name="price" placeholder="0.00 ج.م" required>
        </div>
        
        <div class="form-group">
            <label for="product-description">الوصف</label>
            <textarea id="product-description" name="description" rows="3"></textarea>
        </div>
        
        <div class="form-group">
            <label for="product-image">صورة المنتج</label>
            <input type="file" id="product-image" name="image" accept="image/*">
        </div>
        
        <div class="form-group">
            <label for="product-status">الحالة</label>
            <select id="product-status" name="status">
                <option value="active">نشط</option>
                <option value="inactive">غير نشط</option>
            </select>
        </div>
    `;
    
    modal.classList.add('active');
    
    // Handle form submission
    contentForm.onsubmit = (e) => {
        e.preventDefault();
        handleAddProduct(new FormData(contentForm));
    };
}

function showAddArticleModal() {
    const modal = document.getElementById('content-modal');
    const modalTitle = document.getElementById('modal-title');
    const contentForm = document.getElementById('content-form');
    
    modalTitle.textContent = 'إضافة مقال جديد';
    
    contentForm.innerHTML = `
        <div class="form-group">
            <label for="article-title">عنوان المقال</label>
            <input type="text" id="article-title" name="title" required>
        </div>
        
        <div class="form-group">
            <label for="article-author">الكاتب</label>
            <input type="text" id="article-author" name="author" value="حازم سعد" required>
        </div>
        
        <div class="form-group">
            <label for="article-category">الفئة</label>
            <select id="article-category" name="category" required>
                <option value="">اختر الفئة</option>
                <option value="health-tips">نصائح صحية</option>
                <option value="medications">أدوية</option>
                <option value="wellness">عافية</option>
                <option value="nutrition">تغذية</option>
            </select>
        </div>
        
        <div class="form-group">
            <label for="article-content">المحتوى</label>
            <textarea id="article-content" name="content" rows="6" required></textarea>
        </div>
        
        <div class="form-group">
            <label for="article-image">صورة مميزة</label>
            <input type="file" id="article-image" name="image" accept="image/*">
        </div>
        
        <div class="form-group">
            <label for="article-status">الحالة</label>
            <select id="article-status" name="status" required>
                <option value="draft">مسودة</option>
                <option value="published">منشور</option>
            </select>
        </div>
    `;
    
    modal.classList.add('active');
    
    // Handle form submission
    contentForm.onsubmit = (e) => {
        e.preventDefault();
        handleAddArticle(new FormData(contentForm));
    };
}

function hideModal() {
    const modal = document.getElementById('content-modal');
    modal.classList.remove('active');
}

// Handle form submissions
function handleAddProduct(formData) {
    const productData = {
        name: formData.get('name'),
        category: formData.get('category'),
        price: formData.get('price'),
        description: formData.get('description'),
        image: formData.get('image')?.name ? `images/products/${formData.get('image').name}` : 'images/products/default.jpg',
        status: formData.get('status') || 'active',
        dateAdded: new Date().toISOString().split('T')[0]
    };
    
    try {
        // Save to database
        const newProduct = db.addRecord('products', productData);
        showNotification('تم إضافة المنتج بنجاح!', 'success');
        hideModal();
        loadProductsTable(); // Refresh table
        updateDashboardStats();
    } catch (error) {
        showNotification('حدث خطأ في إضافة المنتج', 'error');
    }
}

function handleAddArticle(formData) {
    const articleData = {
        title: formData.get('title'),
        author: formData.get('author'),
        category: formData.get('category'),
        content: formData.get('content'),
        image: formData.get('image')?.name ? `images/news/${formData.get('image').name}` : 'images/news/default.jpg',
        status: formData.get('status'),
        datePublished: new Date().toISOString().split('T')[0],
        featured: false
    };
    
    try {
        // Save to database
        const newArticle = db.addRecord('news', articleData);
        showNotification('تم إضافة المقال بنجاح!', 'success');
        hideModal();
        loadNewsTable(); // Refresh table
        updateDashboardStats();
    } catch (error) {
        showNotification('حدث خطأ في إضافة المقال', 'error');
    }
}

// CRUD operations
function editProduct(id) {
    const product = db.getRecord('products', id);
    if (!product) {
        showNotification('لم يتم العثور على المنتج', 'error');
        return;
    }
    
    const modal = document.getElementById('content-modal');
    const modalTitle = document.getElementById('modal-title');
    const contentForm = document.getElementById('content-form');
    
    modalTitle.textContent = 'تعديل المنتج';
    
    contentForm.innerHTML = `
        <div class="form-group">
            <label for="edit-product-name">اسم المنتج</label>
            <input type="text" id="edit-product-name" name="name" value="${product.name}" required>
        </div>
        
        <div class="form-group">
            <label for="edit-product-category">الفئة</label>
            <select id="edit-product-category" name="category" required>
                <option value="medicines" ${product.category === 'medicines' ? 'selected' : ''}>أدوية</option>
                <option value="vitamins" ${product.category === 'vitamins' ? 'selected' : ''}>فيتامينات</option>
                <option value="supplements" ${product.category === 'supplements' ? 'selected' : ''}>مكملات غذائية</option>
                <option value="beauty" ${product.category === 'beauty' ? 'selected' : ''}>تجميل وعناية</option>
            </select>
        </div>
        
        <div class="form-group">
            <label for="edit-product-price">السعر</label>
            <input type="text" id="edit-product-price" name="price" value="${product.price}" required>
        </div>
        
        <div class="form-group">
            <label for="edit-product-description">الوصف</label>
            <textarea id="edit-product-description" name="description" rows="3">${product.description || ''}</textarea>
        </div>
        
        <div class="form-group">
            <label for="edit-product-status">الحالة</label>
            <select id="edit-product-status" name="status">
                <option value="active" ${product.status === 'active' ? 'selected' : ''}>نشط</option>
                <option value="inactive" ${product.status === 'inactive' ? 'selected' : ''}>غير نشط</option>
            </select>
        </div>
    `;
    
    modal.classList.add('active');
    
    contentForm.onsubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(contentForm);
        const updatedData = {
            name: formData.get('name'),
            category: formData.get('category'),
            price: formData.get('price'),
            description: formData.get('description'),
            status: formData.get('status')
        };
        
        try {
            db.updateRecord('products', id, updatedData);
            showNotification('تم تحديث المنتج بنجاح!', 'success');
            hideModal();
            loadProductsTable();
        } catch (error) {
            showNotification('حدث خطأ في تحديث المنتج', 'error');
        }
    };
}

function deleteProduct(id) {
    if (confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
        try {
            db.deleteRecord('products', id);
            showNotification('تم حذف المنتج بنجاح!', 'success');
            loadProductsTable();
            updateDashboardStats();
        } catch (error) {
            showNotification('حدث خطأ في حذف المنتج', 'error');
        }
    }
}

function editArticle(id) {
    const article = db.getRecord('news', id);
    if (!article) {
        showNotification('لم يتم العثور على المقال', 'error');
        return;
    }
    
    const modal = document.getElementById('content-modal');
    const modalTitle = document.getElementById('modal-title');
    const contentForm = document.getElementById('content-form');
    
    modalTitle.textContent = 'تعديل المقال';
    
    contentForm.innerHTML = `
        <div class="form-group">
            <label for="edit-article-title">عنوان المقال</label>
            <input type="text" id="edit-article-title" name="title" value="${article.title}" required>
        </div>
        
        <div class="form-group">
            <label for="edit-article-author">الكاتب</label>
            <input type="text" id="edit-article-author" name="author" value="${article.author}" required>
        </div>
        
        <div class="form-group">
            <label for="edit-article-category">الفئة</label>
            <select id="edit-article-category" name="category" required>
                <option value="health-tips" ${article.category === 'health-tips' ? 'selected' : ''}>نصائح صحية</option>
                <option value="medications" ${article.category === 'medications' ? 'selected' : ''}>أدوية</option>
                <option value="wellness" ${article.category === 'wellness' ? 'selected' : ''}>عافية</option>
                <option value="nutrition" ${article.category === 'nutrition' ? 'selected' : ''}>تغذية</option>
            </select>
        </div>
        
        <div class="form-group">
            <label for="edit-article-content">المحتوى</label>
            <textarea id="edit-article-content" name="content" rows="6" required>${article.content || ''}</textarea>
        </div>
        
        <div class="form-group">
            <label for="edit-article-status">الحالة</label>
            <select id="edit-article-status" name="status" required>
                <option value="draft" ${article.status === 'draft' ? 'selected' : ''}>مسودة</option>
                <option value="published" ${article.status === 'published' ? 'selected' : ''}>منشور</option>
            </select>
        </div>
    `;
    
    modal.classList.add('active');
    
    contentForm.onsubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(contentForm);
        const updatedData = {
            title: formData.get('title'),
            author: formData.get('author'),
            category: formData.get('category'),
            content: formData.get('content'),
            status: formData.get('status')
        };
        
        try {
            db.updateRecord('news', id, updatedData);
            showNotification('تم تحديث المقال بنجاح!', 'success');
            hideModal();
            loadNewsTable();
        } catch (error) {
            showNotification('حدث خطأ في تحديث المقال', 'error');
        }
    };
}

function deleteArticle(id) {
    if (confirm('هل أنت متأكد من حذف هذا المقال؟')) {
        try {
            db.deleteRecord('news', id);
            showNotification('تم حذف المقال بنجاح!', 'success');
            loadNewsTable();
            updateDashboardStats();
        } catch (error) {
            showNotification('حدث خطأ في حذف المقال', 'error');
        }
    }
}

// Update dashboard statistics
function updateDashboardStats() {
    try {
        const products = db.getData('products');
        const articles = db.getData('news');
        const offers = db.getData('offers');
        const messages = db.getData('messages');
        
        // Update statistics
        const statCards = document.querySelectorAll('.stat-number');
        if (statCards.length >= 4) {
            statCards[0].textContent = products.length; // Total products
            statCards[1].textContent = articles.filter(a => a.status === 'published').length; // Published articles
            statCards[2].textContent = offers.filter(o => o.status === 'active').length; // Active offers
            statCards[3].textContent = messages.filter(m => m.status === 'unread').length; // New messages
        } else {
            console.warn('Dashboard statistics cards not found or incomplete');
        }
    } catch (error) {
        console.error('Error updating dashboard stats:', error);
    }
}

// Load messages section
function loadMessagesSection() {
    const messagesContainer = document.querySelector('.messages-list');
    if (!messagesContainer) {
        console.warn('Messages container not found');
        return;
    }
    
    try {
        const messages = db.getData('messages');
        
        messagesContainer.innerHTML = '';
        
        if (messages.length === 0) {
            messagesContainer.innerHTML = '<div class="no-messages">لا توجد رسائل حالياً</div>';
            return;
        }
        
        messages.forEach(message => {
            const messageElement = document.createElement('div');
            messageElement.className = `message-item ${message.status === 'unread' ? 'unread' : ''}`;
            
            const formattedDate = formatDate(message.dateReceived);
            
            messageElement.innerHTML = `
                <div class="message-header">
                    <h4>${message.name}</h4>
                    <span class="message-time">${formattedDate}</span>
                </div>
                <p class="message-subject">${message.subject}</p>
                <p class="message-preview">${message.message.substring(0, 100)}...</p>
                <div class="message-actions">
                    <button class="btn btn-primary" onclick="replyToMessage(${message.id})">رد</button>
                    <button class="btn btn-secondary" onclick="markAsRead(${message.id})">
                        ${message.status === 'unread' ? 'وضع علامة كمقروء' : 'أرشفة'}
                    </button>
                </div>
            `;
            
            messagesContainer.appendChild(messageElement);
        });
    } catch (error) {
        console.error('Error loading messages:', error);
        if (messagesContainer) {
            messagesContainer.innerHTML = '<div class="error-message">حدث خطأ في تحميل الرسائل</div>';
        }
    }
}

// Message management functions
function replyToMessage(id) {
    const message = db.getRecord('messages', id);
    if (message) {
        // Mark as read when replying
        db.updateRecord('messages', id, { status: 'read' });
        showNotification(`تم فتح نافذة الرد على: ${message.name}`, 'info');
        loadMessagesSection();
        updateDashboardStats();
    }
}

function markAsRead(id) {
    const message = db.getRecord('messages', id);
    if (message) {
        const newStatus = message.status === 'unread' ? 'read' : 'unread';
        db.updateRecord('messages', id, { status: newStatus });
        showNotification(newStatus === 'read' ? 'تم وضع علامة كمقروء' : 'تم وضع علامة كغير مقروء', 'success');
        loadMessagesSection();
        updateDashboardStats();
    }
}
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `admin-notification admin-notification-${type}`;
    
    const colors = {
        success: '#28a745',
        error: '#dc3545',
        warning: '#ffc107',
        info: '#17a2b8'
    };
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${colors[type] || colors.info};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 300px;
        word-wrap: break-word;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 4 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

// Settings form handler
document.addEventListener('DOMContentLoaded', function() {
    const settingsForm = document.querySelector('.settings-form');
    if (settingsForm) {
        settingsForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showNotification('Settings saved successfully!', 'success');
        });
    }
});

// Utility functions
function formatDate(dateString) {
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    } catch (error) {
        console.error('Error formatting date:', error);
        return 'Invalid Date';
    }
}

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Debug function to check admin panel status
function debugAdminPanel() {
    console.log('=== Admin Panel Debug Info ===');
    console.log('Database instance:', typeof db);
    console.log('Products data:', db ? db.getData('products').length : 'N/A');
    console.log('News data:', db ? db.getData('news').length : 'N/A');
    console.log('Messages data:', db ? db.getData('messages').length : 'N/A');
    console.log('Offers data:', db ? db.getData('offers').length : 'N/A');
    
    // Check DOM elements
    const elements = {
        'login-form': document.getElementById('login-form'),
        'admin-dashboard': document.getElementById('admin-dashboard'),
        'products-table-body': document.getElementById('products-table-body'),
        'news-table-body': document.getElementById('news-table-body'),
        'content-modal': document.getElementById('content-modal')
    };
    
    console.log('DOM Elements:');
    Object.entries(elements).forEach(([name, element]) => {
        console.log(`  ${name}:`, element ? 'Found' : 'Missing');
    });
    
    console.log('===========================');
}

// Make debug function available globally
window.debugAdminPanel = debugAdminPanel;