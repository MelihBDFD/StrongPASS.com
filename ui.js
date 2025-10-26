// ============================================
// Password Generator - UI Manager
// ============================================

class UIManager {
    constructor() {
        this.currentSection = 'generator';
        this.toastContainer = null;
        this.animationManager = new AnimationManager();
        this.initializeElements();
        this.bindEvents();
    }

    // Initialize DOM elements
    initializeElements() {
        this.elements = {
            // Navigation
            navMenu: document.getElementById(CONSTANTS.ELEMENTS.NAVIGATION.MENU),
            menuToggle: document.getElementById(CONSTANTS.ELEMENTS.NAVIGATION.TOGGLE),
            navClose: document.getElementById(CONSTANTS.ELEMENTS.NAVIGATION.CLOSE),
            themeToggle: document.getElementById(CONSTANTS.ELEMENTS.NAVIGATION.THEME),

            // Sections
            generatorSection: document.getElementById(CONSTANTS.ELEMENTS.SECTIONS.GENERATOR),
            savedSection: document.getElementById(CONSTANTS.ELEMENTS.SECTIONS.SAVED),
            categoriesSection: document.getElementById(CONSTANTS.ELEMENTS.SECTIONS.CATEGORIES),
            settingsSection: document.getElementById(CONSTANTS.ELEMENTS.SECTIONS.SETTINGS),

            // Generator elements
            lengthSlider: document.getElementById(CONSTANTS.ELEMENTS.GENERATOR.SLIDER),
            lengthValue: document.getElementById(CONSTANTS.ELEMENTS.GENERATOR.VALUE),
            passwordOutput: document.getElementById(CONSTANTS.ELEMENTS.GENERATOR.OUTPUT),
            toggleVisibility: document.getElementById(CONSTANTS.ELEMENTS.GENERATOR.VISIBILITY),
            copyPassword: document.getElementById(CONSTANTS.ELEMENTS.GENERATOR.COPY),
            savePassword: document.getElementById(CONSTANTS.ELEMENTS.GENERATOR.SAVE),
            regeneratePassword: document.getElementById(CONSTANTS.ELEMENTS.GENERATOR.REGENERATE),
            strengthBar: document.getElementById(CONSTANTS.ELEMENTS.GENERATOR.STRENGTH_BAR),
            strengthText: document.getElementById(CONSTANTS.ELEMENTS.GENERATOR.STRENGTH_TEXT),
            strengthBits: document.getElementById(CONSTANTS.ELEMENTS.GENERATOR.STRENGTH_BITS),
            crackTime: document.getElementById(CONSTANTS.ELEMENTS.GENERATOR.CRACK_TIME),
            characterPreview: document.getElementById(CONSTANTS.ELEMENTS.GENERATOR.PREVIEW),
            quickGenerate: document.getElementById(CONSTANTS.ELEMENTS.GENERATOR.QUICK_GENERATE),
            autoGenerateSave: document.getElementById(CONSTANTS.ELEMENTS.GENERATOR.AUTO_GENERATE),

            // Checkboxes
            includeUppercase: document.getElementById(CONSTANTS.ELEMENTS.CHECKBOXES.UPPERCASE),
            includeLowercase: document.getElementById(CONSTANTS.ELEMENTS.CHECKBOXES.LOWERCASE),
            includeNumbers: document.getElementById(CONSTANTS.ELEMENTS.CHECKBOXES.NUMBERS),
            includeSymbols: document.getElementById(CONSTANTS.ELEMENTS.CHECKBOXES.SYMBOLS),

            // Modals
            saveModal: document.getElementById(CONSTANTS.ELEMENTS.MODALS.SAVE),
            saveName: document.getElementById(CONSTANTS.ELEMENTS.MODAL_FIELDS.SAVE_NAME),
            savePasswordDisplay: document.getElementById(CONSTANTS.ELEMENTS.MODAL_FIELDS.SAVE_PASSWORD),
            saveCategory: document.getElementById(CONSTANTS.ELEMENTS.MODAL_FIELDS.SAVE_CATEGORY),
            saveNotes: document.getElementById(CONSTANTS.ELEMENTS.MODAL_FIELDS.SAVE_NOTES),
            saveConfirm: document.getElementById(CONSTANTS.ELEMENTS.MODAL_FIELDS.SAVE_CONFIRM),
            saveCancel: document.getElementById(CONSTANTS.ELEMENTS.MODAL_FIELDS.SAVE_CANCEL),

            // Category modal
            addCategoryModal: document.getElementById(CONSTANTS.ELEMENTS.MODALS.CATEGORY),
            newCategoryName: document.getElementById(CONSTANTS.ELEMENTS.MODAL_FIELDS.CATEGORY_NAME),
            addCategoryConfirm: document.getElementById(CONSTANTS.ELEMENTS.MODAL_FIELDS.CATEGORY_CONFIRM),
            addCategoryCancel: document.getElementById(CONSTANTS.ELEMENTS.MODAL_FIELDS.CATEGORY_CANCEL),
            addCategoryBtn: document.getElementById(CONSTANTS.ELEMENTS.BUTTONS.ADD_CATEGORY)
        };

        // Initialize checkboxes and close modals
        this.initializeCheckboxes();
        this.ensureModalsClosed();
        this.createToastContainer();
    }

    // Initialize checkboxes with default values
    initializeCheckboxes() {
        if (this.elements.includeUppercase) this.elements.includeUppercase.checked = true;
        if (this.elements.includeLowercase) this.elements.includeLowercase.checked = true;
        if (this.elements.includeNumbers) this.elements.includeNumbers.checked = true;
        if (this.elements.includeSymbols) this.elements.includeSymbols.checked = true;
    }

    // Ensure modals are closed on initialization
    ensureModalsClosed() {
        if (this.elements.saveModal) {
            this.elements.saveModal.classList.remove('active');
        }
        if (this.elements.addCategoryModal) {
            this.elements.addCategoryModal.classList.remove('active');
        }
    }

    // Bind event listeners
    bindEvents() {
        // Navigation events
        if (this.elements.menuToggle) {
            this.elements.menuToggle.addEventListener('click', () => this.toggleNavMenu());
        }
        if (this.elements.navClose) {
            this.elements.navClose.addEventListener('click', () => this.hideNavMenu());
        }
        if (this.elements.themeToggle) {
            this.elements.themeToggle.addEventListener('click', () => this.toggleTheme());
        }

        // Navigation items
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const section = e.currentTarget.dataset.section;
                this.switchSection(section);
            });
        });

        // Generator events
        if (this.elements.lengthSlider) {
            this.elements.lengthSlider.addEventListener('input', Utils.debounce((e) => {
                this.updateLengthDisplay(e.target.value);
                this.regeneratePassword();
            }, 300));
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
        this.bindModalEvents();

        // Keyboard events
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

    // Bind modal events
    bindModalEvents() {
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
    }

    // Setup mobile gestures
    setupMobileGestures() {
        let touchStartX = 0, touchStartY = 0, touchEndX = 0, touchEndY = 0;

        const passwordOutput = this.elements.passwordOutput;
        if (!passwordOutput || !Utils.isTouchDevice()) return;

        passwordOutput.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            touchStartY = e.changedTouches[0].screenY;
        }, { passive: true });

        passwordOutput.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            touchEndY = e.changedTouches[0].screenY;
            this.handleSwipeGesture();
        }, { passive: true });

        this.handleSwipeGesture = () => {
            const deltaX = touchEndX - touchStartX;
            const deltaY = touchEndY - touchStartY;
            const minSwipeDistance = 50;

            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
                if (deltaX > 0) {
                    this.showToast('Yeni şifre üretiliyor...', 'info');
                    this.regeneratePassword();
                } else {
                    this.showToast('Hızlı şifre üretiliyor...', 'info');
                    this.quickGenerate();
                }
                Utils.vibrate(50);
            }
        };
    }

    // Navigation methods
    toggleNavMenu() {
        if (this.elements.navMenu) {
            this.elements.navMenu.classList.toggle('active');
            this.elements.menuToggle.classList.toggle('active');
        }
    }

    hideNavMenu() {
        if (this.elements.navMenu) {
            this.elements.navMenu.classList.remove('active');
            this.elements.menuToggle.classList.remove('active');
        }
    }

    // Section switching
    switchSection(sectionId) {
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });

        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });

        const targetSection = document.getElementById(`${sectionId}-section`);
        const targetNavItem = document.querySelector(`[data-section="${sectionId}"]`);

        if (targetSection) targetSection.classList.add('active');
        if (targetNavItem) targetNavItem.classList.add('active');

        this.currentSection = sectionId;
        this.hideNavMenu();
        this.onSectionChange(sectionId);
    }

    // Section change handler
    onSectionChange(sectionId) {
        switch (sectionId) {
            case 'saved':
                if (window.app && window.app.storageManager) {
                    window.app.loadSavedPasswords();
                }
                break;
            case 'categories':
                if (window.app && window.app.storageManager) {
                    window.app.loadCategories();
                }
                break;
        }
    }

    // Theme management
    toggleTheme() {
        document.body.classList.toggle('dark-theme');
        const isDark = document.body.classList.contains('dark-theme');

        if (window.app && window.app.storageManager) {
            const settings = window.app.storageManager.getSettings() || {};
            settings.theme = isDark ? 'dark' : 'light';
            window.app.storageManager.saveSettings(settings);
        }

        if (this.elements.themeToggle) {
            this.elements.themeToggle.textContent = isDark ? '☀️' : '🌙';
        }

        this.showToast(`Tema ${isDark ? 'koyu' : 'açık'} olarak değiştirildi`, 'success');
    }

    // Length display
    updateLengthDisplay(value) {
        if (this.elements.lengthValue) {
            this.elements.lengthValue.textContent = value;
        }
        this.updateCharacterPreview();
    }

    // Password visibility toggle
    togglePasswordVisibility() {
        const input = this.elements.passwordOutput;
        if (!input) return;

        const isVisible = input.type === 'text';
        input.type = isVisible ? 'password' : 'text';

        if (this.elements.toggleVisibility) {
            this.elements.toggleVisibility.textContent = isVisible ? '👁️' : '🙈';
        }
    }

    // Copy password to clipboard
    async copyPassword() {
        const password = this.elements.passwordOutput?.value;
        if (!password) {
            this.showToast(CONSTANTS.MESSAGES.ERROR.NO_PASSWORD, 'error');
            return;
        }

        try {
            await Utils.copyToClipboard(password);
            this.showToast(CONSTANTS.MESSAGES.SUCCESS.PASSWORD_COPIED, 'success');

            if (window.app && window.app.storageManager) {
                window.app.storageManager.saveToHistory(password);
            }
        } catch (error) {
            this.showToast(CONSTANTS.MESSAGES.ERROR.COPY_FAILED, 'error');
        }
    }

    // Quick generate
    quickGenerate() {
        if (window.app && window.app.passwordGenerator) {
            try {
                const options = this.getGeneratorOptions();
                const password = window.app.passwordGenerator.generate(options);
                this.displayPassword(password);
                this.showToast(CONSTANTS.MESSAGES.SUCCESS.PASSWORD_GENERATED, 'success');
            } catch (error) {
                this.showToast(CONSTANTS.MESSAGES.ERROR.GENERATE_FAILED + ': ' + error.message, 'error');
            }
        }
    }

    // Auto generate and save
    autoGenerateAndSave() {
        const names = ['Gmail', 'Facebook', 'Twitter', 'Instagram', 'LinkedIn', 'Netflix', 'Spotify', 'GitHub', 'Discord', 'Slack'];
        const randomName = names[Math.floor(Math.random() * names.length)] + ' ' + Utils.randomBetween(100, 999);

        const categories = window.app?.storageManager?.getCategories() || [];
        const randomCategory = categories.length > 0 ? categories[Utils.randomBetween(0, categories.length - 1)].id : '';

        const password = window.app.passwordGenerator.generate({
            length: 12,
            includeUppercase: true,
            includeLowercase: true,
            includeNumbers: true,
            includeSymbols: true
        });

        if (window.app?.storageManager) {
            const passwordData = {
                id: Utils.generateId(),
                name: randomName,
                password: password,
                category: randomCategory,
                notes: 'Otomatik oluşturuldu',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            window.app.storageManager.savePassword(passwordData);
            this.displayPassword(password);
            this.showToast(CONSTANTS.MESSAGES.SUCCESS.AUTO_GENERATED, 'success');

            if (window.app.loadSavedPasswords) {
                window.app.loadSavedPasswords();
            }
        } else {
            this.showToast(CONSTANTS.MESSAGES.ERROR.STORAGE_ERROR, 'error');
        }
    }

    // Display password with animation
    displayPassword(password) {
        if (this.elements.passwordOutput) {
            this.typePassword(password);
        }

        if (this.elements.toggleVisibility) {
            this.elements.toggleVisibility.textContent = '🙈';
        }

        if (window.app && window.app.securityAnalyzer) {
            const analysis = window.app.securityAnalyzer.analyze(password);
            this.updateSecurityDisplay(analysis);
        }

        this.animationManager.createParticles(this.elements.passwordOutput?.parentElement);
    }

    // Typing animation
    typePassword(password) {
        const input = this.elements.passwordOutput;
        if (!input) return;
        input.value = password;
    }

    // Update security display
    updateSecurityDisplay(analysis) {
        const { score, strength, bits, crackTime } = analysis;

        if (this.elements.strengthBar) {
            this.elements.strengthBar.style.width = `${score}%`;
            this.elements.strengthBar.className = 'strength-fill';

            // Add color class based on score
            if (score < 20) this.elements.strengthBar.classList.add('strength-very-weak');
            else if (score < 40) this.elements.strengthBar.classList.add('strength-weak');
            else if (score < 60) this.elements.strengthBar.classList.add('strength-medium');
            else if (score < 80) this.elements.strengthBar.classList.add('strength-strong');
            else this.elements.strengthBar.classList.add('strength-very-strong');
        }

        if (this.elements.strengthText) this.elements.strengthText.textContent = strength;
        if (this.elements.strengthBits) this.elements.strengthBits.textContent = `${bits} bit`;
        if (this.elements.crackTime) this.elements.crackTime.textContent = `Tahmini kırılma: ${crackTime}`;
    }

    // Update character preview
    updateCharacterPreview() {
        try {
            const options = this.getGeneratorOptions();
            const charPool = window.app?.passwordGenerator?.getCharacterPool(options) || '';

            if (this.elements.characterPreview) {
                if (charPool.length > 0) {
                    const preview = charPool.length > 50 ? charPool.substring(0, 47) + '...' : charPool;
                    this.elements.characterPreview.textContent = `Seçilen karakterler: ${preview}`;
                } else {
                    this.elements.characterPreview.textContent = 'Hiç karakter türü seçilmedi';
                }
            }
        } catch (error) {
            if (this.elements.characterPreview) {
                this.elements.characterPreview.textContent = 'Önizleme hatası';
            }
        }
    }

    // Get generator options
    getGeneratorOptions() {
        return {
            length: parseInt(this.elements.lengthSlider?.value || 12),
            includeUppercase: this.elements.includeUppercase?.checked || false,
            includeLowercase: this.elements.includeLowercase?.checked || false,
            includeNumbers: this.elements.includeNumbers?.checked || false,
            includeSymbols: this.elements.includeSymbols?.checked || false
        };
    }

    // Generate new password
    regeneratePassword() {
        if (window.app && window.app.passwordGenerator) {
            try {
                const options = this.getGeneratorOptions();
                const password = window.app.passwordGenerator.generate(options);
                this.displayPassword(password);
            } catch (error) {
                this.showToast(CONSTANTS.MESSAGES.ERROR.GENERATE_FAILED + ': ' + error.message, 'error');
            }
        }
    }

    // Modal management
    showSaveModal() {
        const password = this.elements.passwordOutput?.value;
        if (!password) {
            this.showToast(CONSTANTS.MESSAGES.ERROR.NO_PASSWORD, 'error');
            return;
        }

        if (this.elements.savePasswordDisplay) {
            this.elements.savePasswordDisplay.value = password;
        }
        if (this.elements.saveModal) {
            this.elements.saveModal.classList.add('active');
        }

        this.loadCategoriesForModal();
        setTimeout(() => {
            if (this.elements.saveName) this.elements.saveName.focus();
        }, 100);
    }

    hideSaveModal() {
        if (this.elements.saveModal) {
            this.elements.saveModal.classList.remove('active');
        }
        if (this.elements.saveName) this.elements.saveName.value = '';
        if (this.elements.saveNotes) this.elements.saveNotes.value = '';
    }

    // Category modal
    showAddCategoryModal() {
        if (this.elements.addCategoryModal) {
            this.elements.addCategoryModal.classList.add('active');
        }
        if (this.elements.newCategoryName) {
            this.elements.newCategoryName.value = '';
            setTimeout(() => this.elements.newCategoryName.focus(), 100);
        }
    }

    hideAddCategoryModal() {
        if (this.elements.addCategoryModal) {
            this.elements.addCategoryModal.classList.remove('active');
        }
    }

    // Load categories for modal
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

    // Confirm save password
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
            const passwordData = { name, password, category: category || null, notes: notes || null };
            const id = window.app.storageManager.savePassword(passwordData);
            this.showToast(CONSTANTS.MESSAGES.SUCCESS.PASSWORD_SAVED, 'success');
            this.hideSaveModal();
        } catch (error) {
            this.showToast(CONSTANTS.MESSAGES.ERROR.SAVE_FAILED + ': ' + error.message, 'error');
        }
    }

    // Confirm add category
    confirmAddCategory() {
        const categoryName = this.elements.newCategoryName?.value?.trim();

        if (!categoryName) {
            this.showToast('Kategori adı gerekli', 'error');
            return;
        }

        try {
            const categoryId = window.app.storageManager.addCategory(categoryName);
            this.showToast(`"${categoryName}" ${CONSTANTS.MESSAGES.SUCCESS.CATEGORY_ADDED}`, 'success');
            window.app.loadCategories();
            this.hideAddCategoryModal();
        } catch (error) {
            this.showToast(CONSTANTS.MESSAGES.ERROR.VALIDATION_FAILED + ': ' + error.message, 'error');
        }
    }

    // Toast management
    createToastContainer() {
        this.toastContainer = document.createElement('div');
        this.toastContainer.id = 'toast-container';
        this.toastContainer.className = 'toast-container';
        this.toastContainer.setAttribute('role', 'log');
        this.toastContainer.setAttribute('aria-live', 'assertive');
        this.toastContainer.setAttribute('aria-label', 'Bildirimler');
        document.body.appendChild(this.toastContainer);
    }

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

        setTimeout(() => {
            if (toast.parentNode) toast.remove();
        }, CONSTANTS.ANIMATIONS.TOAST_DURATION);
    }

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

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UIManager;
} else {
    window.UIManager = UIManager;
}
