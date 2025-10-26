// ============================================
// Password Generator - Main Application
// ============================================

class PasswordGeneratorApp {
    constructor() {
        this.passwordGenerator = new PasswordGenerator();
        this.securityAnalyzer = new SecurityAnalyzer();
        this.storageManager = new StorageManager();
        this.uiManager = new UIManager();

        this.initialize();
    }

    // Initialize application
    async initialize() {
        try {
            console.log('🚀 Password Generator App başlatılıyor...');

            // Load theme
            this.loadTheme();

            // Generate initial password
            this.uiManager.regeneratePassword();

            // Update character preview
            this.uiManager.updateCharacterPreview();

            // Setup periodic cleanup
            this.setupPeriodicCleanup();

            console.log('✅ Password Generator App hazır!');

            // Show debug info if enabled
            if (config.get('debug')) {
                this.showDebugInfo();
            }

        } catch (error) {
            Utils.handleError(error, 'initialize');
            this.uiManager.showToast('Uygulama başlatma hatası', 'error');
        }
    }

    // Load theme from settings
    loadTheme() {
        try {
            const settings = this.storageManager.getSettings();
            if (settings && settings.theme === 'dark') {
                document.body.classList.add('dark-theme');
                const themeToggle = document.getElementById('theme-toggle');
                if (themeToggle) themeToggle.textContent = '☀️';
            }
        } catch (error) {
            Utils.handleError(error, 'loadTheme');
        }
    }

    // Setup periodic cleanup
    setupPeriodicCleanup() {
        // Clean up old data every hour
        setInterval(() => {
            this.cleanupOldData();
        }, 60 * 60 * 1000);

        // Save settings periodically
        setInterval(() => {
            this.saveCurrentState();
        }, 5 * 60 * 1000); // Every 5 minutes
    }

    // Cleanup old data
    cleanupOldData() {
        try {
            const history = this.storageManager.getHistory();
            if (history.length > 100) {
                const cleanedHistory = history.slice(0, 100);
                this.storageManager.saveToStorage('password_generator_history', cleanedHistory);
            }
        } catch (error) {
            Utils.handleError(error, 'cleanupOldData');
        }
    }

    // Save current state
    saveCurrentState() {
        try {
            // This could save current UI state, preferences, etc.
            // For now, just ensure settings are up to date
            const settings = this.storageManager.getSettings();
            if (settings) {
                this.storageManager.saveSettings(settings);
            }
        } catch (error) {
            Utils.handleError(error, 'saveCurrentState');
        }
    }

    // Show debug information
    showDebugInfo() {
        try {
            const debugInfo = config.getDebugInfo();
            console.log('🔧 Debug Info:', debugInfo);

            // Show storage usage
            const usage = this.storageManager.getStorageUsage();
            console.log('💾 Storage Usage:', usage);

        } catch (error) {
            Utils.handleError(error, 'showDebugInfo');
        }
    }

    // Load saved passwords
    loadSavedPasswords() {
        try {
            const passwords = this.storageManager.getPasswords();
            const container = document.getElementById('passwords-list');

            if (!container) return;

            container.innerHTML = '';

            if (passwords.length === 0) {
                container.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-icon">🔐</div>
                        <h3>Henüz şifre kaydetmediniz</h3>
                        <p>Şifre üreterek kaydetmeye başlayabilirsiniz</p>
                    </div>
                `;
                return;
            }

            passwords.forEach(password => {
                const item = this.createPasswordItem(password);
                container.appendChild(item);
            });

        } catch (error) {
            Utils.handleError(error, 'loadSavedPasswords');
            this.uiManager.showToast('Şifreler yüklenemedi', 'error');
        }
    }

    // Create password item
    createPasswordItem(password) {
        try {
            const item = document.createElement('div');
            item.className = 'password-item';
            item.dataset.id = password.id;

            const preview = password.password.length > 20
                ? password.password.substring(0, 17) + '...'
                : password.password;

            item.innerHTML = `
                <div class="password-info">
                    <div class="password-name">${Utils.escapeHtml(password.name)}</div>
                    <div class="password-category">${this.getCategoryName(password.category)}</div>
                    <div class="password-preview">${preview}</div>
                </div>
                <div class="password-actions">
                    <button class="password-action-btn copy-action" data-action="copy" title="Kopyala">
                        📋
                    </button>
                    <button class="password-action-btn edit-action" data-action="edit" title="Düzenle">
                        ✏️
                    </button>
                    <button class="password-action-btn delete-action" data-action="delete" title="Sil">
                        🗑️
                    </button>
                </div>
            `;

            // Bind events
            item.querySelectorAll('.password-action-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const action = e.currentTarget.dataset.action;
                    this.handlePasswordAction(action, password.id);
                });
            });

            return item;
        } catch (error) {
            Utils.handleError(error, 'createPasswordItem');
            return null;
        }
    }

    // Handle password actions
    handlePasswordAction(action, passwordId) {
        try {
            switch (action) {
                case 'copy':
                    this.copyPasswordToClipboard(passwordId);
                    break;
                case 'edit':
                    this.editPassword(passwordId);
                    break;
                case 'delete':
                    this.deletePassword(passwordId);
                    break;
            }
        } catch (error) {
            Utils.handleError(error, 'handlePasswordAction');
        }
    }

    // Copy password to clipboard
    copyPasswordToClipboard(passwordId) {
        try {
            const passwords = this.storageManager.getPasswords();
            const password = passwords.find(p => p.id === passwordId);

            if (password) {
                Utils.copyToClipboard(password.password).then(() => {
                    this.uiManager.showToast(CONSTANTS.MESSAGES.SUCCESS.PASSWORD_COPIED, 'success');
                }).catch(() => {
                    this.uiManager.showToast(CONSTANTS.MESSAGES.ERROR.COPY_FAILED, 'error');
                });
            }
        } catch (error) {
            Utils.handleError(error, 'copyPasswordToClipboard');
        }
    }

    // Edit password (placeholder)
    editPassword(passwordId) {
        this.uiManager.showToast('Düzenleme özelliği yakında eklenecek', 'info');
    }

    // Delete password
    deletePassword(passwordId) {
        try {
            if (confirm('Bu şifreyi silmek istediğinizden emin misiniz?')) {
                if (this.storageManager.deletePassword(passwordId)) {
                    this.loadSavedPasswords();
                    this.uiManager.showToast('Şifre silindi', 'success');
                } else {
                    this.uiManager.showToast(CONSTANTS.MESSAGES.ERROR.SAVE_FAILED, 'error');
                }
            }
        } catch (error) {
            Utils.handleError(error, 'deletePassword');
        }
    }

    // Load categories
    loadCategories() {
        try {
            const categories = this.storageManager.getCategories();
            const container = document.getElementById('categories-grid');

            if (!container) return;

            container.innerHTML = '';

            categories.forEach(category => {
                const card = this.createCategoryCard(category);
                container.appendChild(card);
            });

        } catch (error) {
            Utils.handleError(error, 'loadCategories');
        }
    }

    // Create category card
    createCategoryCard(category) {
        try {
            const card = document.createElement('div');
            card.className = 'category-card';

            card.innerHTML = `
                <div class="category-name">${Utils.escapeHtml(category.name)}</div>
                <div class="category-count">${category.count} şifre</div>
            `;

            return card;
        } catch (error) {
            Utils.handleError(error, 'createCategoryCard');
            return null;
        }
    }

    // Helper methods
    getCategoryName(categoryId) {
        if (!categoryId) return 'Kategorisiz';

        try {
            const categories = this.storageManager.getCategories();
            const category = categories.find(c => c.id === categoryId);
            return category ? category.name : 'Bilinmeyen Kategori';
        } catch (error) {
            Utils.handleError(error, 'getCategoryName');
            return 'Bilinmeyen Kategori';
        }
    }

    // Export application data
    exportData() {
        try {
            return this.storageManager.exportData();
        } catch (error) {
            Utils.handleError(error, 'exportData');
            return false;
        }
    }

    // Import application data
    importData(data) {
        try {
            return this.storageManager.importData(data);
        } catch (error) {
            Utils.handleError(error, 'importData');
            return false;
        }
    }

    // Clear all data
    clearAllData() {
        try {
            if (confirm('Tüm veriler silinecek. Bu işlem geri alınamaz. Emin misiniz?')) {
                this.storageManager.clearAllData();
                this.loadSavedPasswords();
                this.loadCategories();
                this.uiManager.showToast('Tüm veriler temizlendi', 'success');
                return true;
            }
            return false;
        } catch (error) {
            Utils.handleError(error, 'clearAllData');
            return false;
        }
    }

    // Get application statistics
    getStats() {
        try {
            const passwords = this.storageManager.getPasswords();
            const categories = this.storageManager.getCategories();
            const settings = this.storageManager.getSettings();
            const usage = this.storageManager.getStorageUsage();

            return {
                totalPasswords: passwords.length,
                totalCategories: categories.length,
                activeTheme: settings?.theme || 'light',
                storageUsage: usage,
                version: config.version,
                generatedToday: passwords.filter(p =>
                    new Date(p.createdAt).toDateString() === new Date().toDateString()
                ).length
            };
        } catch (error) {
            Utils.handleError(error, 'getStats');
            return {};
        }
    }
}

// ============================================
// Welcome Screen
// ============================================

class WelcomeScreen {
    constructor() {
        this.welcomeScreen = document.getElementById('welcome-screen');
        this.startButton = document.getElementById('start-app');
        this.userCountElement = document.getElementById('user-count');
        this.hasVisited = this.checkIfVisited();
        this.userCount = this.getUserCount();

        this.initialize();
    }

    initialize() {
        if (this.startButton) {
            this.startButton.addEventListener('click', () => this.startApp());
        }

        this.updateUserCount();

        if (!this.hasVisited) {
            this.show();
        } else {
            this.hide();
            this.startMainApp();
        }
    }

    show() {
        if (this.welcomeScreen) {
            this.welcomeScreen.style.display = 'flex';
            this.animationManager.animate(this.welcomeScreen, 'scale-in');
        }
    }

    hide() {
        if (this.welcomeScreen) {
            this.welcomeScreen.classList.add('hide');
            setTimeout(() => {
                this.welcomeScreen.style.display = 'none';
            }, CONSTANTS.ANIMATIONS.WELCOME_HIDE_DELAY);
        }
    }

    startApp() {
        this.incrementUserCount();
        this.markAsVisited();
        this.hide();
        setTimeout(() => this.startMainApp(), CONSTANTS.ANIMATIONS.WELCOME_HIDE_DELAY);
    }

    startMainApp() {
        if (window.app) {
            window.app.initialize();
        }
    }

    checkIfVisited() {
        return Utils.getStorageItem(CONSTANTS.STORAGE_KEYS.VISITED) === 'true';
    }

    markAsVisited() {
        Utils.setStorageItem(CONSTANTS.STORAGE_KEYS.VISITED, 'true');
    }

    getUserCount() {
        return parseInt(Utils.getStorageItem(CONSTANTS.STORAGE_KEYS.USER_COUNT, 1));
    }

    incrementUserCount() {
        this.userCount++;
        Utils.setStorageItem(CONSTANTS.STORAGE_KEYS.USER_COUNT, this.userCount);
        this.updateUserCount();
    }

    updateUserCount() {
        if (this.userCountElement) {
            this.userCountElement.textContent = this.userCount;
        }
    }
}

// ============================================
// Application Bootstrap
// ============================================

// Initialize application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    try {
        // Initialize welcome screen first
        const welcomeScreen = new WelcomeScreen();

        // Initialize main app
        window.app = new PasswordGeneratorApp();

        console.log('🎯 Password Generator App loaded successfully!');

    } catch (error) {
        console.error('Application initialization failed:', error);
        // Show error message to user
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: #f8f9fa;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            color: #dc3545;
        `;
        errorDiv.innerHTML = `
            <h1>🚫 Uygulama Başlatma Hatası</h1>
            <p>Maalesef uygulama başlatılırken bir hata oluştu.</p>
            <p>Sayfayı yenileyerek tekrar deneyin.</p>
            <button onclick="location.reload()" style="
                padding: 10px 20px;
                background: #007bff;
                color: white;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                margin-top: 20px;
            ">Sayfayı Yenile</button>
        `;
        document.body.appendChild(errorDiv);
    }
});

// ============================================
// Global Error Handler
// ============================================

window.addEventListener('error', (event) => {
    Utils.handleError(event.error, 'Global Error Handler');

    // Show user-friendly error message
    if (window.app && window.app.uiManager) {
        window.app.uiManager.showToast('Beklenmedik bir hata oluştu', 'error');
    }
});

window.addEventListener('unhandledrejection', (event) => {
    Utils.handleError(event.reason, 'Unhandled Promise Rejection');
});

// ============================================
// Performance Monitoring
// ============================================

if (config.get('debug')) {
    // Monitor performance
    window.addEventListener('load', () => {
        const perfData = performance.getEntriesByType('navigation')[0];
        console.log('📊 Performance Data:', {
            'DOM Content Loaded': perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
            'Load Complete': perfData.loadEventEnd - perfData.loadEventStart,
            'Total Load Time': perfData.loadEventEnd - perfData.navigationStart
        });
    });
}

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PasswordGeneratorApp, WelcomeScreen };
}
