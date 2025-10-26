// ============================================
// Password Generator - Constants
// ============================================

const CONSTANTS = {
    // Storage Keys
    STORAGE_KEYS: {
        PASSWORDS: 'password_generator_passwords',
        CATEGORIES: 'password_generator_categories',
        SETTINGS: 'password_generator_settings',
        HISTORY: 'password_generator_history',
        VISITED: 'password_generator_visited',
        USER_COUNT: 'password_generator_user_count'
    },

    // Default Settings
    DEFAULT_SETTINGS: {
        theme: 'light',
        autoCopy: false,
        showStrength: true,
        saveHistory: true,
        language: 'tr'
    },

    // Default Categories
    DEFAULT_CATEGORIES: [
        { id: 'personal', name: 'Kişisel', count: 0 },
        { id: 'work', name: 'İş', count: 0 },
        { id: 'social', name: 'Sosyal Medya', count: 0 },
        { id: 'finance', name: 'Finans', count: 0 }
    ],

    // Character Sets
    CHAR_SETS: {
        UPPERCASE: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        LOWERCASE: 'abcdefghijklmnopqrstuvwxyz',
        NUMBERS: '0123456789',
        SYMBOLS: '!@#$%^&*()_+-=[]{}|;:,.<>?'
    },

    // Password Generation
    PASSWORD: {
        MIN_LENGTH: 4,
        MAX_LENGTH: 64,
        DEFAULT_LENGTH: 12,
        STRONG_LENGTH: 16
    },

    // Security Analysis
    SECURITY: {
        WEAK_THRESHOLD: 20,
        MEDIUM_THRESHOLD: 40,
        STRONG_THRESHOLD: 60,
        VERY_STRONG_THRESHOLD: 80
    },

    // UI Elements
    ELEMENTS: {
        NAVIGATION: {
            MENU: 'nav-menu',
            TOGGLE: 'menu-toggle',
            CLOSE: 'nav-close',
            THEME: 'theme-toggle'
        },
        SECTIONS: {
            GENERATOR: 'generator-section',
            SAVED: 'saved-section',
            CATEGORIES: 'categories-section',
            SETTINGS: 'settings-section'
        },
        GENERATOR: {
            SLIDER: 'length-slider',
            VALUE: 'length-value',
            OUTPUT: 'password-output',
            VISIBILITY: 'toggle-visibility',
            COPY: 'copy-password',
            SAVE: 'save-password',
            REGENERATE: 'regenerate-password',
            STRENGTH_BAR: 'strength-bar',
            STRENGTH_TEXT: 'strength-text',
            STRENGTH_BITS: 'strength-bits',
            CRACK_TIME: 'crack-time',
            PREVIEW: 'character-preview',
            QUICK_GENERATE: 'quick-generate',
            AUTO_GENERATE: 'auto-generate-save'
        },
        CHECKBOXES: {
            UPPERCASE: 'include-uppercase',
            LOWERCASE: 'include-lowercase',
            NUMBERS: 'include-numbers',
            SYMBOLS: 'include-symbols'
        },
        MODALS: {
            SAVE: 'save-modal',
            CATEGORY: 'add-category-modal'
        },
        MODAL_FIELDS: {
            SAVE_NAME: 'save-name',
            SAVE_PASSWORD: 'save-password-display',
            SAVE_CATEGORY: 'save-category',
            SAVE_NOTES: 'save-notes',
            SAVE_CONFIRM: 'save-confirm',
            SAVE_CANCEL: 'save-cancel',
            CATEGORY_NAME: 'new-category-name',
            CATEGORY_CONFIRM: 'add-category-confirm',
            CATEGORY_CANCEL: 'add-category-cancel'
        },
        BUTTONS: {
            ADD_CATEGORY: 'add-category-btn',
            SEARCH_CLEAR: 'clear-search',
            EXPORT_PASSWORDS: 'export-passwords',
            EXPORT_DATA: 'export-data',
            IMPORT_DATA: 'import-data',
            CLEAR_DATA: 'clear-data'
        },
        CONTAINERS: {
            PASSWORDS_LIST: 'passwords-list',
            CATEGORIES_GRID: 'categories-grid',
            TOAST: 'toast-container',
            SEARCH_INPUT: 'search-input',
            CATEGORY_FILTER: 'category-filter'
        },
        SCREENS: {
            WELCOME: 'welcome-screen',
            START_BUTTON: 'start-app',
            USER_COUNT: 'user-count'
        }
    },

    // Animations
    ANIMATIONS: {
        TYPING_SPEED: 50,
        PARTICLE_COUNT: 12,
        TOAST_DURATION: 5000,
        MODAL_ANIMATION: 300,
        WELCOME_HIDE_DELAY: 500
    },

    // Common Passwords (Security Analysis)
    COMMON_PASSWORDS: [
        '123456', 'password', '123456789', 'qwerty', 'abc123',
        'password123', 'admin', 'letmein', 'welcome', 'monkey',
        '12345678', 'password1', '12345', 'qwerty123', '1q2w3e4r',
        '1234567890', 'password12', 'admin123', 'root', 'user'
    ],

    // Messages
    MESSAGES: {
        SUCCESS: {
            PASSWORD_GENERATED: 'Şifre başarıyla oluşturuldu',
            PASSWORD_SAVED: 'Şifre başarıyla kaydedildi',
            PASSWORD_COPIED: 'Şifre panoya kopyalandı',
            CATEGORY_ADDED: 'Kategori başarıyla eklendi',
            THEME_CHANGED: 'Tema başarıyla değiştirildi',
            AUTO_GENERATED: 'Şifre otomatik oluşturuldu ve kaydedildi'
        },
        ERROR: {
            NO_PASSWORD: 'Kaydedilecek şifre yok',
            SAVE_FAILED: 'Şifre kaydedilemedi',
            COPY_FAILED: 'Şifre kopyalanamadı',
            GENERATE_FAILED: 'Şifre üretilemedi',
            VALIDATION_FAILED: 'Doğrulama hatası',
            STORAGE_ERROR: 'Depolama hatası',
            NO_CHARACTERS: 'En az bir karakter türü seçmelisiniz'
        },
        WARNING: {
            WEAK_PASSWORD: 'Şifre çok zayıf',
            COMMON_PASSWORD: 'Yaygın şifre kullanmayın',
            SHORT_PASSWORD: 'Şifre çok kısa'
        },
        INFO: {
            GENERATING: 'Şifre üretiliyor...',
            SAVING: 'Kaydediliyor...',
            LOADING: 'Yükleniyor...'
        }
    },

    // Validation Rules
    VALIDATION: {
        PASSWORD_NAME: {
            MIN_LENGTH: 2,
            MAX_LENGTH: 50
        },
        CATEGORY_NAME: {
            MIN_LENGTH: 2,
            MAX_LENGTH: 30
        },
        NOTES: {
            MAX_LENGTH: 200
        }
    },

    // Theme Colors
    THEMES: {
        LIGHT: {
            primary: '#667eea',
            secondary: '#764ba2',
            success: '#28a745',
            danger: '#dc3545',
            warning: '#ffc107',
            info: '#17a2b8',
            background: '#ffffff',
            surface: '#f8f9fa',
            text: '#333333',
            textSecondary: '#666666',
            border: '#e9ecef'
        },
        DARK: {
            primary: '#9f7aea',
            secondary: '#667eea',
            success: '#48bb78',
            danger: '#f56565',
            warning: '#ed8936',
            info: '#4299e1',
            background: '#1a202c',
            surface: '#2d3748',
            text: '#e2e8f0',
            textSecondary: '#a0aec0',
            border: '#4a5568'
        }
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONSTANTS;
}
