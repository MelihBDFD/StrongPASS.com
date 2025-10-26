// ============================================
// Güçlü Şifre Üreteci - Ana JavaScript Dosyası
// ============================================

// PasswordGenerator Sınıfı - Şifre üretimi motoru
class PasswordGenerator {
    constructor() {
        this.charSets = {
            uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
            lowercase: 'abcdefghijklmnopqrstuvwxyz',
            numbers: '0123456789',
            symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
        };
    }

    // Ana şifre üretme fonksiyonu
    generate(options = {}) {
        const {
            length = 12,
            includeUppercase = true,
            includeLowercase = true,
            includeNumbers = true,
            includeSymbols = true
        } = options;

        // Kullanılacak karakter setini oluştur
        let charPool = '';
        if (includeUppercase) charPool += this.charSets.uppercase;
        if (includeLowercase) charPool += this.charSets.lowercase;
        if (includeNumbers) charPool += this.charSets.numbers;
        if (includeSymbols) charPool += this.charSets.symbols;

        if (charPool.length === 0) {
            throw new Error('En az bir karakter türü seçmelisiniz');
        }

        // Şifreyi oluştur
        let password = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * charPool.length);
            password += charPool[randomIndex];
        }

        return password;
    }

    // Çoklu şifre üretme
    generateMultiple(count = 3, options = {}) {
        const passwords = [];
        for (let i = 0; i < count; i++) {
            passwords.push(this.generate(options));
        }
        return passwords;
    }

    // Özel karakter seti ile üretme
    generateWithCustomSet(length, customSet) {
        if (!customSet || customSet.length === 0) {
            throw new Error('Geçerli bir karakter seti belirtmelisiniz');
        }

        let password = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * customSet.length);
            password += customSet[randomIndex];
        }
        return password;
    }

    // Kullanılacak karakter setini döndür
    getCharacterPool(options = {}) {
        const {
            includeUppercase = true,
            includeLowercase = true,
            includeNumbers = true,
            includeSymbols = true
        } = options;

        let charPool = '';
        if (includeUppercase) charPool += this.charSets.uppercase;
        if (includeLowercase) charPool += this.charSets.lowercase;
        if (includeNumbers) charPool += this.charSets.numbers;
        if (includeSymbols) charPool += this.charSets.symbols;

        return charPool;
    }
}

// SecurityAnalyzer Sınıfı - Şifre güvenlik analizi
class SecurityAnalyzer {
    constructor() {
        this.commonPasswords = [
            '123456', 'password', '123456789', 'qwerty', 'abc123',
            'password123', 'admin', 'letmein', 'welcome', 'monkey'
        ];
    }

    // Şifre gücünü analiz et
    analyze(password) {
        if (!password) return { score: 0, strength: 'Çok Zayıf', bits: 0 };

        let score = 0;
        const length = password.length;

        // Uzunluk puanı (max 25)
        if (length >= 8) score += Math.min(length * 2, 25);

        // Karakter çeşitliliği puanı (max 25)
        const hasLower = /[a-z]/.test(password);
        const hasUpper = /[A-Z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSymbols = /[^a-zA-Z\d]/.test(password);

        const varietyCount = [hasLower, hasUpper, hasNumbers, hasSymbols].filter(Boolean).length;
        score += varietyCount * 6;

        // Tekrar kontrolü (max 20)
        const uniqueChars = new Set(password).size;
        const uniquenessRatio = uniqueChars / length;
        score += Math.min(uniquenessRatio * 20, 20);

        // Ortak şifre kontrolü (max 15)
        const isCommon = this.commonPasswords.some(common => password.toLowerCase().includes(common));
        if (!isCommon) score += 15;

        // Pattern kontrolü (max 15)
        const hasPattern = this.hasPattern(password);
        if (!hasPattern) score += 15;

        // Skoru 0-100 arasında sınırla
        score = Math.min(Math.max(score, 0), 100);

        // Entropi hesapla
        const bits = this.calculateEntropy(password);

        // Güç seviyesini belirle
        let strength;
        if (score < 20) strength = 'Çok Zayıf';
        else if (score < 40) strength = 'Zayıf';
        else if (score < 60) strength = 'Orta';
        else if (score < 80) strength = 'Güçlü';
        else strength = 'Çok Güçlü';

        return {
            score: Math.round(score),
            strength,
            bits: Math.round(bits),
            crackTime: this.estimateCrackTime(bits),
            checks: {
                length,
                variety: varietyCount,
                uniqueness: Math.round(uniquenessRatio * 100),
                hasLower,
                hasUpper,
                hasNumbers,
                hasSymbols,
                isCommon,
                hasPattern
            }
        };
    }

    // Entropi hesapla (bit cinsinden)
    calculateEntropy(password) {
        const length = password.length;
        const charSetSize = this.getCharSetSize(password);
        return Math.log2(Math.pow(charSetSize, length));
    }

    // Karakter seti büyüklüğünü hesapla
    getCharSetSize(password) {
        let size = 0;
        if (/[a-z]/.test(password)) size += 26; // lowercase
        if (/[A-Z]/.test(password)) size += 26; // uppercase
        if (/\d/.test(password)) size += 10; // numbers
        if (/[^a-zA-Z\d]/.test(password)) size += 32; // symbols (yaklaşık)
        return Math.max(size, 1);
    }

    // Pattern kontrolü (123456, abcdef gibi)
    hasPattern(password) {
        // Ardışık sayılar
        if (/012|123|234|345|456|567|678|789/.test(password)) return true;

        // Ardışık harfler
        if (/abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz/i.test(password)) return true;

        // Tekrarlayan karakterler
        if (/(.)\1{2,}/.test(password)) return true;

        return false;
    }

    // Tahmini kırılma süresi
    estimateCrackTime(bits) {
        const secondsPerGuess = 1e-9; // 1 billion guesses per second (modern hardware)
        const seconds = Math.pow(2, bits) * secondsPerGuess;

        if (seconds < 1) return 'Anında';
        if (seconds < 60) return `${Math.round(seconds)} saniye`;
        if (seconds < 3600) return `${Math.round(seconds / 60)} dakika`;
        if (seconds < 86400) return `${Math.round(seconds / 3600)} saat`;
        if (seconds < 31536000) return `${Math.round(seconds / 86400)} gün`;
        if (seconds < 3153600000) return `${Math.round(seconds / 31536000)} yıl`;

        return 'Milyonlarca yıl';
    }
}

// StorageManager Sınıfı - Local Storage yönetimi
class StorageManager {
    constructor() {
        this.storageKeys = {
            passwords: 'password_generator_passwords',
            categories: 'password_generator_categories',
            settings: 'password_generator_settings',
            history: 'password_generator_history'
        };

        this.initializeStorage();
    }

    // Storage'ı başlat
    initializeStorage() {
        // Varsayılan kategoriler
        if (!this.getCategories().length) {
            this.saveCategories([
                { id: 'personal', name: 'Kişisel', count: 0 },
                { id: 'work', name: 'İş', count: 0 },
                { id: 'social', name: 'Sosyal Medya', count: 0 },
                { id: 'finance', name: 'Finans', count: 0 }
            ]);
        }

        // Varsayılan ayarlar
        if (!this.getSettings()) {
            this.saveSettings({
                autoCopy: false,
                showStrength: true,
                saveHistory: true,
                theme: 'light'
            });
        }
    }

    // Şifreleri kaydet
    savePassword(passwordData) {
        const passwords = this.getPasswords();
        const newPassword = {
            id: Date.now().toString(),
            ...passwordData,
            createdAt: new Date().toISOString()
        };

        passwords.push(newPassword);
        this.saveToStorage(this.storageKeys.passwords, passwords);

        // Kategori sayısını güncelle
        this.updateCategoryCount(passwordData.category);

        return newPassword.id;
    }

    // Şifreleri al
    getPasswords() {
        return this.getFromStorage(this.storageKeys.passwords, []);
    }

    // Şifreyi sil
    deletePassword(passwordId) {
        const passwords = this.getPasswords();
        const passwordIndex = passwords.findIndex(p => p.id === passwordId);

        if (passwordIndex === -1) return false;

        const deletedPassword = passwords.splice(passwordIndex, 1)[0];
        this.saveToStorage(this.storageKeys.passwords, passwords);

        // Kategori sayısını güncelle
        this.updateCategoryCount(deletedPassword.category, -1);

        return true;
    }

    // Şifreyi güncelle
    updatePassword(passwordId, updates) {
        const passwords = this.getPasswords();
        const passwordIndex = passwords.findIndex(p => p.id === passwordId);

        if (passwordIndex === -1) return false;

        const oldCategory = passwords[passwordIndex].category;
        passwords[passwordIndex] = { ...passwords[passwordIndex], ...updates };
        this.saveToStorage(this.storageKeys.passwords, passwords);

        // Kategori sayılarını güncelle
        if (updates.category && updates.category !== oldCategory) {
            this.updateCategoryCount(oldCategory, -1);
            this.updateCategoryCount(updates.category, 1);
        }

        return true;
    }

    // Kategorileri kaydet
    saveCategories(categories) {
        this.saveToStorage(this.storageKeys.categories, categories);
    }

    // Kategorileri al
    getCategories() {
        return this.getFromStorage(this.storageKeys.categories, []);
    }

    // Kategori ekle
    addCategory(name) {
        const categories = this.getCategories();
        const newCategory = {
            id: Date.now().toString(),
            name: name.trim(),
            count: 0
        };

        categories.push(newCategory);
        this.saveCategories(categories);

        return newCategory.id;
    }

    // Kategori sil
    deleteCategory(categoryId) {
        const categories = this.getCategories();
        const passwords = this.getPasswords();

        // Bu kategorideki şifreleri kontrol et
        const passwordsInCategory = passwords.filter(p => p.category === categoryId);
        if (passwordsInCategory.length > 0) {
            throw new Error('Bu kategoride şifreler var, önce şifreleri silin veya taşıyın');
        }

        const filteredCategories = categories.filter(c => c.id !== categoryId);
        this.saveCategories(filteredCategories);

        return true;
    }

    // Kategori sayısını güncelle
    updateCategoryCount(categoryId, delta = 1) {
        if (!categoryId) return;

        const categories = this.getCategories();
        const category = categories.find(c => c.id === categoryId);

        if (category) {
            category.count = Math.max(0, (category.count || 0) + delta);
            this.saveCategories(categories);
        }
    }

    // Ayarları kaydet
    saveSettings(settings) {
        this.saveToStorage(this.storageKeys.settings, settings);
    }

    // Ayarları al
    getSettings() {
        return this.getFromStorage(this.storageKeys.settings, null);
    }

    // Geçmişi kaydet
    saveToHistory(password) {
        const history = this.getFromStorage(this.storageKeys.history, []);
        history.unshift({
            password: password.substring(0, 3) + '***', // Güvenlik için kısalt
            timestamp: new Date().toISOString(),
            length: password.length
        });

        // Son 50 öğeyi tut
        history.splice(50);
        this.saveToStorage(this.storageKeys.history, history);
    }

    // Geçmişi al
    getHistory() {
        return this.getFromStorage(this.storageKeys.history, []);
    }

    // Tüm verileri dışa aktar
    exportData() {
        const data = {
            passwords: this.getPasswords(),
            categories: this.getCategories(),
            settings: this.getSettings(),
            history: this.getHistory(),
            exportDate: new Date().toISOString()
        };

        return JSON.stringify(data, null, 2);
    }

    // Verileri içe aktar
    importData(jsonData) {
        try {
            const data = JSON.parse(jsonData);

            if (data.passwords) this.saveToStorage(this.storageKeys.passwords, data.passwords);
            if (data.categories) this.saveToStorage(this.storageKeys.categories, data.categories);
            if (data.settings) this.saveToStorage(this.storageKeys.settings, data.settings);
            if (data.history) this.saveToStorage(this.storageKeys.history, data.history);

            return true;
        } catch (error) {
            throw new Error('Geçersiz veri formatı');
        }
    }

    // Tüm verileri temizle
    clearAllData() {
        Object.values(this.storageKeys).forEach(key => {
            localStorage.removeItem(key);
        });
        this.initializeStorage();
        return true;
    }

    // Yardımcı fonksiyonlar
    saveToStorage(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Storage save error:', error);
            return false;
        }
    }

    getFromStorage(key, defaultValue) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error('Storage get error:', error);
            return defaultValue;
        }
    }

    // Storage alanı kontrolü
    getStorageUsage() {
        let total = 0;
        Object.values(this.storageKeys).forEach(key => {
            const item = localStorage.getItem(key);
            if (item) total += item.length;
        });
        return total;
    }
}

// UIManager Sınıfı - UI yönetimi
class UIManager {
    constructor() {
        this.currentSection = 'generator';
        this.toastContainer = null;
        this.initializeElements();
        this.bindEvents();
    }

    // DOM elementlerini başlat
    initializeElements() {
        this.elements = {
            // Navigation
            navMenu: document.getElementById('nav-menu'),
            menuToggle: document.getElementById('menu-toggle'),
            navClose: document.getElementById('nav-close'),
            themeToggle: document.getElementById('theme-toggle'),

            // Sections
            generatorSection: document.getElementById('generator-section'),
            savedSection: document.getElementById('saved-section'),
            categoriesSection: document.getElementById('categories-section'),
            settingsSection: document.getElementById('settings-section'),

            // Generator elements
            lengthSlider: document.getElementById('length-slider'),
            lengthValue: document.getElementById('length-value'),
            passwordOutput: document.getElementById('password-output'),
            toggleVisibility: document.getElementById('toggle-visibility'),
            copyPassword: document.getElementById('copy-password'),
            savePassword: document.getElementById('save-password'),
            regeneratePassword: document.getElementById('regenerate-password'),
            strengthBar: document.getElementById('strength-bar'),
            strengthText: document.getElementById('strength-text'),
            strengthBits: document.getElementById('strength-bits'),
            crackTime: document.getElementById('crack-time'),
            characterPreview: document.getElementById('character-preview'),
            quickGenerate: document.getElementById('quick-generate'),
            autoGenerateSave: document.getElementById('auto-generate-save'),

            // Checkboxes
            includeUppercase: document.getElementById('include-uppercase'),
            includeLowercase: document.getElementById('include-lowercase'),
            includeNumbers: document.getElementById('include-numbers'),
            includeSymbols: document.getElementById('include-symbols'),

            // Modal
            saveModal: document.getElementById('save-modal'),
            saveName: document.getElementById('save-name'),
            savePasswordDisplay: document.getElementById('save-password-display'),
            saveCategory: document.getElementById('save-category'),
            saveNotes: document.getElementById('save-notes'),
            saveConfirm: document.getElementById('save-confirm'),
            saveCancel: document.getElementById('save-cancel'),

            // Kategori ekleme modal
            addCategoryModal: document.getElementById('add-category-modal'),
            newCategoryName: document.getElementById('new-category-name'),
            addCategoryConfirm: document.getElementById('add-category-confirm'),
            addCategoryCancel: document.getElementById('add-category-cancel'),
            addCategoryBtn: document.getElementById('add-category-btn')
        };

        // Modal'ları başlangıçta kapat
        this.ensureModalsClosed();

        // Toast container oluştur
        this.createToastContainer();
    }

    // Modal'ların başlangıçta kapalı olduğundan emin ol
    ensureModalsClosed() {
        if (this.elements.saveModal) {
            this.elements.saveModal.classList.remove('active');
        }

        if (this.elements.addCategoryModal) {
            this.elements.addCategoryModal.classList.remove('active');
        }
    }

    // Event listener'ları bağla
    bindEvents() {
        // Navigation
        if (this.elements.menuToggle) {
            this.elements.menuToggle.addEventListener('click', () => this.toggleNavMenu());
        }

        if (this.elements.navClose) {
            this.elements.navClose.addEventListener('click', () => this.hideNavMenu());
        }

        if (this.elements.themeToggle) {
            this.elements.themeToggle.addEventListener('click', () => this.toggleTheme());
        }

        // Nav items
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const section = e.currentTarget.dataset.section;
                this.switchSection(section);
            });
        });

        // Generator events
        if (this.elements.lengthSlider) {
            this.elements.lengthSlider.addEventListener('input', (e) => {
                this.updateLengthDisplay(e.target.value);
                // Otomatik şifre üret - slider değiştiğinde
                this.regeneratePassword();
            });
        }

        if (this.elements.toggleVisibility) {
            this.elements.toggleVisibility.addEventListener('click', () => this.togglePasswordVisibility());
        }

        if (this.elements.copyPassword) {
            this.elements.copyPassword.addEventListener('click', () => this.copyPassword());
        }

        if (this.elements.savePassword) {
            this.elements.savePassword.addEventListener('click', () => this.showSaveModal());
        }

        if (this.elements.regeneratePassword) {
            this.elements.regeneratePassword.addEventListener('click', () => this.regeneratePassword());
        }

        if (this.elements.quickGenerate) {
            this.elements.quickGenerate.addEventListener('click', () => this.quickGenerate());
        }

        if (this.elements.autoGenerateSave) {
            this.elements.autoGenerateSave.addEventListener('click', () => this.autoGenerateAndSave());
        }

        // Checkbox events
        document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', () => this.updateCharacterPreview());
        });

        // Modal events
        if (this.elements.saveModal) {
            this.elements.saveModal.addEventListener('click', (e) => {
                if (e.target.classList.contains('modal-overlay') || e.target.classList.contains('modal-close')) {
                    this.hideSaveModal();
                }
            });
        }

        if (this.elements.saveConfirm) {
            this.elements.saveConfirm.addEventListener('click', () => this.confirmSavePassword());
        }

        if (this.elements.saveCancel) {
            this.elements.saveCancel.addEventListener('click', () => this.hideSaveModal());
        }

        if (this.elements.addCategoryBtn) {
            this.elements.addCategoryBtn.addEventListener('click', () => this.showAddCategoryModal());
        }

        // Kategori ekleme modal events
        if (this.elements.addCategoryModal) {
            this.elements.addCategoryModal.addEventListener('click', (e) => {
                if (e.target.classList.contains('modal-overlay') || e.target.classList.contains('modal-close')) {
                    this.hideAddCategoryModal();
                }
            });
        }

        if (this.elements.addCategoryConfirm) {
            this.elements.addCategoryConfirm.addEventListener('click', () => this.confirmAddCategory());
        }

        if (this.elements.addCategoryCancel) {
            this.elements.addCategoryCancel.addEventListener('click', () => this.hideAddCategoryModal());
        }

        // ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hideNavMenu();
                this.hideSaveModal();
                this.hideAddCategoryModal();
            }
        });

        // Mobile gestures
        this.setupMobileGestures();
    }

    // Mobile gestures setup
    setupMobileGestures() {
        let touchStartX = 0;
        let touchStartY = 0;
        let touchEndX = 0;
        let touchEndY = 0;

        const passwordOutput = this.elements.passwordOutput;
        if (!passwordOutput) return;

        passwordOutput.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            touchStartY = e.changedTouches[0].screenY;
        }, { passive: true });

        passwordOutput.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            touchEndY = e.changedTouches[0].screenY;
            this.handleSwipeGesture();
        }, { passive: true });

        // Swipe handler
        this.handleSwipeGesture = () => {
            const deltaX = touchEndX - touchStartX;
            const deltaY = touchEndY - touchStartY;
            const minSwipeDistance = 50;

            // Yatay swipe kontrolü (dikey swipe'den büyük olmalı)
            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
                if (deltaX > 0) {
                    // Sağa swipe - yeni şifre üret
                    this.showToast('Yeni şifre üretiliyor...', 'info');
                    this.regeneratePassword();
                } else {
                    // Sola swipe - hızlı üret
                    this.showToast('Hızlı şifre üretiliyor...', 'info');
                    this.quickGenerate();
                }

                // Haptic feedback
                if ('vibrate' in navigator) {
                    navigator.vibrate(50);
                }
            }
        };
    }

    // Navigation menüsünü aç/kapat
    toggleNavMenu() {
        if (this.elements.navMenu) {
            this.elements.navMenu.classList.toggle('active');
            this.elements.menuToggle.classList.toggle('active');
        }
    }

    // Navigation menüsünü gizle
    hideNavMenu() {
        if (this.elements.navMenu) {
            this.elements.navMenu.classList.remove('active');
            this.elements.menuToggle.classList.remove('active');
        }
    }

    // Bölüm değiştir
    switchSection(sectionId) {
        // Tüm bölümleri gizle
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });

        // Nav item'ları güncelle
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });

        // İstenen bölümü göster
        const targetSection = document.getElementById(`${sectionId}-section`);
        const targetNavItem = document.querySelector(`[data-section="${sectionId}"]`);

        if (targetSection) {
            targetSection.classList.add('active');
        }

        if (targetNavItem) {
            targetNavItem.classList.add('active');
        }

        this.currentSection = sectionId;
        this.hideNavMenu();

        // Bölüm özel işlemler
        this.onSectionChange(sectionId);
    }

    // Bölüm değiştiğinde
    onSectionChange(sectionId) {
        switch (sectionId) {
            case 'saved':
                // Kaydedilen şifreleri yükle
                if (window.app && window.app.storageManager) {
                    window.app.loadSavedPasswords();
                }
                break;
            case 'categories':
                // Kategorileri yükle
                if (window.app && window.app.storageManager) {
                    window.app.loadCategories();
                }
                break;
        }
    }

    // Tema değiştir
    toggleTheme() {
        document.body.classList.toggle('dark-theme');
        const isDark = document.body.classList.contains('dark-theme');

        // Ayarları kaydet
        if (window.app && window.app.storageManager) {
            const settings = window.app.storageManager.getSettings() || {};
            settings.theme = isDark ? 'dark' : 'light';
            window.app.storageManager.saveSettings(settings);
        }

        // Icon değiştir
        if (this.elements.themeToggle) {
            this.elements.themeToggle.textContent = isDark ? '☀️' : '🌙';
        }

        this.showToast(`Tema ${isDark ? 'koyu' : 'açık'} olarak değiştirildi`, 'success');
    }

    // Uzunluk display güncelle
    updateLengthDisplay(value) {
        if (this.elements.lengthValue) {
            this.elements.lengthValue.textContent = value;
        }
        this.updateCharacterPreview();
    }

    // Şifre görünürlüğünü değiştir
    togglePasswordVisibility() {
        const input = this.elements.passwordOutput;
        if (!input) return;

        const isVisible = input.type === 'text';
        input.type = isVisible ? 'password' : 'text';

        if (this.elements.toggleVisibility) {
            this.elements.toggleVisibility.textContent = isVisible ? '👁️' : '🙈';
        }
    }

    // Şifreyi kopyala
    async copyPassword() {
        const password = this.elements.passwordOutput?.value;
        if (!password) {
            this.showToast('Kopyalanacak şifre yok', 'error');
            return;
        }

        try {
            await navigator.clipboard.writeText(password);
            this.showToast('Şifre panoya kopyalandı!', 'success');

            // Geçmişe kaydet
            if (window.app && window.app.storageManager) {
                window.app.storageManager.saveToHistory(password);
            }
        } catch (error) {
            // Fallback
            const textArea = document.createElement('textarea');
            textArea.value = password;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);

            this.showToast('Şifre panoya kopyalandı!', 'success');
        }
    }


    // Hızlı üret
    quickGenerate() {
        if (window.app && window.app.passwordGenerator) {
            const password = window.app.passwordGenerator.generate({
                length: 16,
                includeUppercase: true,
                includeLowercase: true,
                includeNumbers: true,
                includeSymbols: true
            });
            this.displayPassword(password);
        }
    }

    // Otomatik şifre üret ve kaydet
    autoGenerateAndSave() {
        // Rastgele isim oluştur
        const names = ['Gmail', 'Facebook', 'Twitter', 'Instagram', 'LinkedIn', 'Netflix', 'Spotify', 'GitHub', 'Discord', 'Slack'];
        const randomName = names[Math.floor(Math.random() * names.length)] + ' ' +
                         Math.floor(Math.random() * 1000);

        // Rastgele kategori seç
        const categories = window.app?.storageManager?.getCategories() || [];
        const randomCategory = categories.length > 0 ?
                             categories[Math.floor(Math.random() * categories.length)].id : '';

        // Şifre üret
        const password = window.app.passwordGenerator.generate({
            length: 12,
            includeUppercase: true,
            includeLowercase: true,
            includeNumbers: true,
            includeSymbols: true
        });

        // Şifreyi kaydet
        if (window.app?.storageManager) {
            const passwordData = {
                id: Date.now().toString(),
                name: randomName,
                password: password,
                category: randomCategory,
                notes: 'Otomatik oluşturuldu',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            window.app.storageManager.savePassword(passwordData);
            this.displayPassword(password);
            this.showToast('Şifre otomatik oluşturuldu ve kaydedildi', 'success');

            // Şifreler listesini güncelle
            if (window.app.loadSavedPasswords) {
                window.app.loadSavedPasswords();
            }
        } else {
            this.showToast('Kaydetme hatası: Depolama yöneticisi yüklenemedi', 'error');
        }
    }

    // Şifreyi göster - typing effect ile
    displayPassword(password) {
        if (this.elements.passwordOutput) {
            // Typing effect
            this.typePassword(password);
        }

        if (this.elements.toggleVisibility) {
            this.elements.toggleVisibility.textContent = '🙈'; // Varsayılan gizli
        }

        // Güvenlik analizi
        if (window.app && window.app.securityAnalyzer) {
            const analysis = window.app.securityAnalyzer.analyze(password);
            this.updateSecurityDisplay(analysis);
        }

        // Particle effect
        this.createParticleEffect();

        // Otomatik kopyala ayarı kontrolü
        if (window.app && window.app.storageManager) {
            const settings = window.app.storageManager.getSettings();
            if (settings && settings.autoCopy) {
                setTimeout(() => this.copyPassword(), 100);
            }
        }
    }

    // Typing effect ile şifre göster
    typePassword(password) {
        const input = this.elements.passwordOutput;
        if (!input) return;

        input.value = '';
        let i = 0;
        const interval = setInterval(() => {
            if (i < password.length) {
                input.value += password[i];
                i++;

                // Ses efekti (basit beep)
                if (window.AudioContext || window.webkitAudioContext) {
                    this.playTypingSound();
                }
            } else {
                clearInterval(interval);
                // Tamamlandığında particle effect
                setTimeout(() => this.createParticleEffect(), 200);
            }
        }, 50);
    }

    // Typing sound effect
    playTypingSound() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.05);

            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.05);
        } catch (error) {
            // Audio desteklenmiyorsa sessizce geç
        }
    }

    // Particle effect oluştur
    createParticleEffect() {
        const container = document.querySelector('.password-output');
        if (!container) return;

        // Mevcut particle'ları temizle
        const existingParticles = container.querySelectorAll('.particle');
        existingParticles.forEach(particle => particle.remove());

        // Yeni particle'lar oluştur
        for (let i = 0; i < 12; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.cssText = `
                position: absolute;
                width: 4px;
                height: 4px;
                background: ${this.getRandomColor()};
                border-radius: 50%;
                pointer-events: none;
                z-index: 1000;
            `;

            // Rastgele pozisyon
            const angle = (i / 12) * Math.PI * 2;
            const distance = 50 + Math.random() * 50;
            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance;

            particle.style.left = '50%';
            particle.style.top = '50%';
            particle.style.transform = `translate(-50%, -50%)`;

            container.appendChild(particle);

            // Animasyon
            setTimeout(() => {
                particle.style.transition = 'all 1s ease-out';
                particle.style.transform = `translate(${x}px, ${y}px)`;
                particle.style.opacity = '0';

                setTimeout(() => particle.remove(), 1000);
            }, 10);
        }
    }

    // Rastgele renk
    getRandomColor() {
        const colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4ade80', '#22c55e'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    // Güvenlik display güncelle
    updateSecurityDisplay(analysis) {
        const { score, strength, bits, crackTime } = analysis;

        // Progress bar
        if (this.elements.strengthBar) {
            this.elements.strengthBar.style.width = `${score}%`;

            // Renk sınıflarını temizle
            this.elements.strengthBar.className = 'strength-fill';

            // Yeni renk sınıfını ekle
            if (score < 20) this.elements.strengthBar.classList.add('strength-very-weak');
            else if (score < 40) this.elements.strengthBar.classList.add('strength-weak');
            else if (score < 60) this.elements.strengthBar.classList.add('strength-medium');
            else if (score < 80) this.elements.strengthBar.classList.add('strength-strong');
            else this.elements.strengthBar.classList.add('strength-very-strong');
        }

        // Metin güncellemeler
        if (this.elements.strengthText) {
            this.elements.strengthText.textContent = strength;
        }

        if (this.elements.strengthBits) {
            this.elements.strengthBits.textContent = `${bits} bit`;
        }

        if (this.elements.crackTime) {
            this.elements.crackTime.textContent = `Tahmini kırılma: ${crackTime}`;
        }
    }

    // Karakter önizlemesi
    updateCharacterPreview() {
        const options = this.getGeneratorOptions();
        const charPool = window.app?.passwordGenerator?.getCharacterPool(options) || '';

        if (this.elements.characterPreview) {
            if (charPool.length > 0) {
                // İlk 50 karakteri göster
                const preview = charPool.length > 50 ? charPool.substring(0, 47) + '...' : charPool;
                this.elements.characterPreview.textContent = `Seçilen karakterler: ${preview}`;
            } else {
                this.elements.characterPreview.textContent = 'Hiç karakter türü seçilmedi';
            }
        }
    }

    // Generator seçeneklerini al
    getGeneratorOptions() {
        return {
            length: parseInt(this.elements.lengthSlider?.value || 12),
            includeUppercase: this.elements.includeUppercase?.checked || false,
            includeLowercase: this.elements.includeLowercase?.checked || false,
            includeNumbers: this.elements.includeNumbers?.checked || false,
            includeSymbols: this.elements.includeSymbols?.checked || false
        };
    }

    // Kaydet modal'ını göster
    showSaveModal() {
        const password = this.elements.passwordOutput?.value;
        if (!password) {
            this.showToast('Kaydedilecek şifre yok', 'error');
            return;
        }

        if (this.elements.savePasswordDisplay) {
            this.elements.savePasswordDisplay.value = password;
        }

        if (this.elements.saveModal) {
            this.elements.saveModal.classList.add('active');
        }

        // Kategorileri yükle
        this.loadCategoriesForModal();

        // Focus
        setTimeout(() => {
            if (this.elements.saveName) {
                this.elements.saveName.focus();
            }
        }, 100);
    }

    // Kaydet modal'ını gizle
    hideSaveModal() {
        if (this.elements.saveModal) {
            this.elements.saveModal.classList.remove('active');
        }

        // Form'u temizle
        if (this.elements.saveName) this.elements.saveName.value = '';
        if (this.elements.saveNotes) this.elements.saveNotes.value = '';
    }

    // Modal için kategorileri yükle
    loadCategoriesForModal() {
        if (!this.elements.saveCategory) return;

        const categories = window.app?.storageManager?.getCategories() || [];
        this.elements.saveCategory.innerHTML = '<option value="">Kategori seçin...</option>';

        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = `${category.name} (${category.count})`;
            this.elements.saveCategory.appendChild(option);
        });
    }

    // Şifre kaydetmeyi onayla
    confirmSavePassword() {
        const name = this.elements.saveName?.value?.trim();
        const password = this.elements.savePasswordDisplay?.value;
        const category = this.elements.saveCategory?.value;
        const notes = this.elements.saveNotes?.value?.trim();

        if (!name) {
            this.showToast('Şifre adı gerekli', 'error');
            return;
        }

        if (!password) {
            this.showToast('Şifre bulunamadı', 'error');
            return;
        }

        try {
            const passwordData = {
                name,
                password,
                category: category || null,
                notes: notes || null
            };

            const id = window.app.storageManager.savePassword(passwordData);
            this.showToast('Şifre başarıyla kaydedildi!', 'success');
            this.hideSaveModal();

        } catch (error) {
            this.showToast('Şifre kaydedilemedi: ' + error.message, 'error');
        }
    }

    // Kategori ekleme modal'ını göster
    showAddCategoryModal() {
        if (this.elements.addCategoryModal) {
            this.elements.addCategoryModal.classList.add('active');
        }

        // Input'u temizle ve focus
        if (this.elements.newCategoryName) {
            this.elements.newCategoryName.value = '';
            setTimeout(() => {
                this.elements.newCategoryName.focus();
            }, 100);
        }
    }

    // Kategori ekleme modal'ını gizle
    hideAddCategoryModal() {
        if (this.elements.addCategoryModal) {
            this.elements.addCategoryModal.classList.remove('active');
        }
    }

    // Kategori eklemeyi onayla
    confirmAddCategory() {
        const categoryName = this.elements.newCategoryName?.value?.trim();

        if (!categoryName) {
            this.showToast('Kategori adı gerekli', 'error');
            return;
        }

        if (categoryName.length < 2 || categoryName.length > 30) {
            this.showToast('Kategori adı 2-30 karakter arası olmalı', 'error');
            return;
        }

        try {
            const categoryId = window.app.storageManager.addCategory(categoryName);
            this.showToast(`"${categoryName}" kategorisi eklendi!`, 'success');

            // Kategorileri yeniden yükle
            window.app.loadCategories();

            this.hideAddCategoryModal();
        } catch (error) {
            this.showToast('Kategori eklenemedi: ' + error.message, 'error');
        }
    }

    // Toast container oluştur
    createToastContainer() {
        this.toastContainer = document.createElement('div');
        this.toastContainer.id = 'toast-container';
        this.toastContainer.className = 'toast-container';
        this.toastContainer.setAttribute('role', 'log');
        this.toastContainer.setAttribute('aria-live', 'assertive');
        this.toastContainer.setAttribute('aria-label', 'Bildirimler');
        document.body.appendChild(this.toastContainer);
    }

    // Toast göster
    showToast(message, type = 'info') {
        if (!this.toastContainer) return;

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;

        const icon = this.getToastIcon(type);
        const messageSpan = document.createElement('div');
        messageSpan.className = 'toast-message';
        messageSpan.textContent = message;

        const closeBtn = document.createElement('button');
        closeBtn.className = 'toast-close';
        closeBtn.setAttribute('aria-label', 'Bildirimi kapat');
        closeBtn.innerHTML = '×';
        closeBtn.addEventListener('click', () => toast.remove());

        toast.appendChild(icon);
        toast.appendChild(messageSpan);
        toast.appendChild(closeBtn);

        this.toastContainer.appendChild(toast);

        // Auto remove
        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
            }
        }, 5000);
    }

    // Toast icon'u al
    getToastIcon(type) {
        const icon = document.createElement('div');
        icon.className = 'toast-icon';

        switch (type) {
            case 'success': icon.textContent = '✅'; break;
            case 'error': icon.textContent = '❌'; break;
            case 'warning': icon.textContent = '⚠️'; break;
            default: icon.textContent = 'ℹ️';
        }

        return icon;
    }
}

// Ana App Sınıfı
class PasswordGeneratorApp {
    constructor() {
        this.passwordGenerator = new PasswordGenerator();
        this.securityAnalyzer = new SecurityAnalyzer();
        this.storageManager = new StorageManager();
        this.uiManager = new UIManager();

        this.initialize();
    }

    // Uygulamayı başlat
    initialize() {
        console.log('🚀 Password Generator App başlatılıyor...');

        // Tema yükle
        this.loadTheme();

        // İlk şifre üret
        this.uiManager.regeneratePassword();

        // Karakter önizlemesini güncelle
        this.uiManager.updateCharacterPreview();

        console.log('✅ Password Generator App hazır!');
    }

    // Tema yükle
    loadTheme() {
        const settings = this.storageManager.getSettings();
        if (settings && settings.theme === 'dark') {
            document.body.classList.add('dark-theme');
            document.getElementById('theme-toggle').textContent = '☀️';
        }
    }

    // Kaydedilen şifreleri yükle
    loadSavedPasswords() {
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
    }

    // Şifre öğesi oluştur
    createPasswordItem(password) {
        const item = document.createElement('div');
        item.className = 'password-item';
        item.dataset.id = password.id;

        // Şifre preview (güvenlik için kısaltılmış)
        const preview = password.password.length > 20
            ? password.password.substring(0, 17) + '...'
            : password.password;

        item.innerHTML = `
            <div class="password-info">
                <div class="password-name">${this.escapeHtml(password.name)}</div>
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

        // Event listeners
        item.querySelectorAll('.password-action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const action = e.currentTarget.dataset.action;
                this.handlePasswordAction(action, password.id);
            });
        });

        return item;
    }

    // Şifre aksiyonlarını işle
    handlePasswordAction(action, passwordId) {
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
    }

    // Şifreyi panoya kopyala
    copyPasswordToClipboard(passwordId) {
        const passwords = this.storageManager.getPasswords();
        const password = passwords.find(p => p.id === passwordId);

        if (password) {
            navigator.clipboard.writeText(password.password).then(() => {
                this.uiManager.showToast('Şifre panoya kopyalandı!', 'success');
            }).catch(() => {
                this.uiManager.showToast('Şifre kopyalanamadı', 'error');
            });
        }
    }

    // Şifre düzenle (şimdilik basit implementasyon)
    editPassword(passwordId) {
        this.uiManager.showToast('Düzenleme özelliği yakında eklenecek', 'info');
    }

    // Şifre sil
    deletePassword(passwordId) {
        if (confirm('Bu şifreyi silmek istediğinizden emin misiniz?')) {
            if (this.storageManager.deletePassword(passwordId)) {
                this.loadSavedPasswords();
                this.uiManager.showToast('Şifre silindi', 'success');
            } else {
                this.uiManager.showToast('Şifre silinemedi', 'error');
            }
        }
    }

    // Kategorileri yükle
    loadCategories() {
        const categories = this.storageManager.getCategories();
        const container = document.getElementById('categories-grid');

        if (!container) return;

        container.innerHTML = '';

        categories.forEach(category => {
            const card = this.createCategoryCard(category);
            container.appendChild(card);
        });
    }

    // Kategori kartı oluştur
    createCategoryCard(category) {
        const card = document.createElement('div');
        card.className = 'category-card';

        card.innerHTML = `
            <div class="category-name">${this.escapeHtml(category.name)}</div>
            <div class="category-count">${category.count} şifre</div>
        `;

        return card;
    }

    // Yardımcı fonksiyonlar
    getCategoryName(categoryId) {
        if (!categoryId) return 'Kategorisiz';

        const categories = this.storageManager.getCategories();
        const category = categories.find(c => c.id === categoryId);
        return category ? category.name : 'Bilinmeyen Kategori';
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Uygulamayı başlat
document.addEventListener('DOMContentLoaded', () => {
    window.app = new PasswordGeneratorApp();
});

// Karşılama ekranı kontrolü
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

        // Kullanıcı sayısını güncelle
        this.updateUserCount();

        // İlk ziyaret ise göster, değilse direkt başlat
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
        }
    }

    hide() {
        if (this.welcomeScreen) {
            this.welcomeScreen.classList.add('hide');
            setTimeout(() => {
                this.welcomeScreen.style.display = 'none';
            }, 500);
        }
    }

    startApp() {
        // Kullanıcı sayısını artır
        this.incrementUserCount();

        // Ziyaret edildi olarak işaretle
        this.markAsVisited();

        // Ana uygulamayı başlat
        this.hide();
        setTimeout(() => this.startMainApp(), 500);
    }

    startMainApp() {
        // Ana uygulama başlatma kodu burada çalışacak
        if (window.app) {
            window.app.initialize();
        }
    }

    checkIfVisited() {
        return localStorage.getItem('password_generator_visited') === 'true';
    }

    markAsVisited() {
        localStorage.setItem('password_generator_visited', 'true');
    }

    getUserCount() {
        const count = parseInt(localStorage.getItem('password_generator_user_count')) || 1;
        return count;
    }

    incrementUserCount() {
        this.userCount++;
        localStorage.setItem('password_generator_user_count', this.userCount.toString());
        this.updateUserCount();
    }

    updateUserCount() {
        if (this.userCountElement) {
            this.userCountElement.textContent = this.userCount;
        }
    }
}

// Welcome screen başlat
const welcomeScreen = new WelcomeScreen();

console.log('🎯 Password Generator App loaded successfully!');
