// ============================================
// Password Generator - Configuration
// ============================================

class Config {
    constructor() {
        this.debug = true;
        this.version = '2.0.0';
        this.author = 'Password Generator Team';
        this.description = 'Güçlü Şifre Üreteci - Güvenli şifreler oluşturun ve yönetin';

        // Development settings
        this.dev = {
            enableConsoleLogs: true,
            enableErrorReporting: true,
            mockData: false,
            testMode: false
        };

        // Performance settings
        this.performance = {
            maxPasswords: 1000,
            maxCategories: 50,
            maxHistoryItems: 100,
            debounceDelay: 300,
            animationDuration: 300
        };

        // Security settings
        this.security = {
            minPasswordLength: 4,
            maxPasswordLength: 64,
            requireMixedCase: false,
            requireNumbers: false,
            requireSymbols: false,
            preventCommonPasswords: true,
            encryptStorage: false // For future implementation
        };

        // UI settings
        this.ui = {
            defaultTheme: 'light',
            defaultLanguage: 'tr',
            showAnimations: true,
            enableSounds: true,
            toastDuration: 5000,
            modalAnimationDuration: 300
        };

        // Feature flags
        this.features = {
            welcomeScreen: true,
            categories: true,
            passwordHistory: true,
            exportImport: true,
            darkTheme: true,
            mobileGestures: true,
            autoSave: true,
            strengthAnalysis: true
        };

        // API settings (for future use)
        this.api = {
            enabled: false,
            baseUrl: '',
            timeout: 5000,
            retryAttempts: 3
        };
    }

    // Get configuration value
    get(key) {
        const keys = key.split('.');
        let value = this;

        for (const k of keys) {
            value = value?.[k];
            if (value === undefined) return undefined;
        }

        return value;
    }

    // Set configuration value
    set(key, value) {
        const keys = key.split('.');
        let obj = this;

        for (let i = 0; i < keys.length - 1; i++) {
            if (!obj[keys[i]]) obj[keys[i]] = {};
            obj = obj[keys[i]];
        }

        obj[keys[keys.length - 1]] = value;
    }

    // Load configuration from storage
    loadFromStorage() {
        try {
            const stored = localStorage.getItem('password_generator_config');
            if (stored) {
                const configData = JSON.parse(stored);
                Object.assign(this, configData);
            }
        } catch (error) {
            console.error('Config yüklenemedi:', error);
        }
    }

    // Save configuration to storage
    saveToStorage() {
        try {
            localStorage.setItem('password_generator_config', JSON.stringify(this));
            return true;
        } catch (error) {
            console.error('Config kaydedilemedi:', error);
            return false;
        }
    }

    // Reset to defaults
    reset() {
        localStorage.removeItem('password_generator_config');

        // Reset to initial values
        this.debug = true;
        this.dev.enableConsoleLogs = true;
        this.dev.enableErrorReporting = true;
        this.dev.mockData = false;
        this.dev.testMode = false;
    }

    // Check if feature is enabled
    isFeatureEnabled(feature) {
        return this.features[feature] === true;
    }

    // Enable/disable feature
    toggleFeature(feature, enabled) {
        if (this.features.hasOwnProperty(feature)) {
            this.features[feature] = enabled;
            this.saveToStorage();
        }
    }

    // Get debug info
    getDebugInfo() {
        return {
            version: this.version,
            debug: this.debug,
            features: this.features,
            performance: this.performance,
            timestamp: new Date().toISOString()
        };
    }

    // Log configuration (if debug enabled)
    log() {
        if (this.debug && this.dev.enableConsoleLogs) {
            console.log('🔧 Config:', this.getDebugInfo());
        }
    }
}

// Create global config instance
const config = new Config();

// Load config from storage on initialization
config.loadFromStorage();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Config, config };
} else {
    // Make available globally
    window.Config = Config;
    window.config = config;
}
