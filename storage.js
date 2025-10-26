// ============================================
// Password Generator - Storage Manager
// ============================================

class StorageManager {
    constructor() {
        this.storageKeys = CONSTANTS.STORAGE_KEYS;
        this.initializeStorage();
    }

    // Initialize storage with default values
    initializeStorage() {
        // Initialize default categories if not exists
        if (!this.getCategories().length) {
            this.saveCategories(CONSTANTS.DEFAULT_CATEGORIES);
        }

        // Initialize default settings if not exists
        if (!this.getSettings()) {
            this.saveSettings(CONSTANTS.DEFAULT_SETTINGS);
        }

        // Initialize other storage items
        if (!this.getPasswords().length) {
            this.saveToStorage(this.storageKeys.passwords, []);
        }

        if (!this.getHistory().length) {
            this.saveToStorage(this.storageKeys.history, []);
        }
    }

    // Save password
    savePassword(passwordData) {
        try {
            Validation.validatePasswordName(passwordData.name);
            Validation.validatePassword(passwordData.password);
            Validation.validateNotes(passwordData.notes);

            const passwords = this.getPasswords();
            const newPassword = {
                id: Utils.generateId(),
                ...passwordData,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            passwords.push(newPassword);
            this.saveToStorage(this.storageKeys.passwords, passwords);

            // Update category count
            this.updateCategoryCount(passwordData.category);

            // Save to history
            this.saveToHistory(passwordData.password);

            return newPassword.id;
        } catch (error) {
            Utils.handleError(error, 'savePassword');
            throw error;
        }
    }

    // Get all passwords
    getPasswords() {
        return this.getFromStorage(this.storageKeys.passwords, []);
    }

    // Delete password
    deletePassword(passwordId) {
        try {
            const passwords = this.getPasswords();
            const passwordIndex = passwords.findIndex(p => p.id === passwordId);

            if (passwordIndex === -1) {
                throw new Error('Şifre bulunamadı');
            }

            const deletedPassword = passwords.splice(passwordIndex, 1)[0];
            this.saveToStorage(this.storageKeys.passwords, passwords);

            // Update category count
            this.updateCategoryCount(deletedPassword.category, -1);

            return true;
        } catch (error) {
            Utils.handleError(error, 'deletePassword');
            return false;
        }
    }

    // Update password
    updatePassword(passwordId, updates) {
        try {
            const passwords = this.getPasswords();
            const passwordIndex = passwords.findIndex(p => p.id === passwordId);

            if (passwordIndex === -1) {
                throw new Error('Şifre bulunamadı');
            }

            // Validate updates
            if (updates.name) Validation.validatePasswordName(updates.name);
            if (updates.password) Validation.validatePassword(updates.password);
            if (updates.notes) Validation.validateNotes(updates.notes);

            const oldCategory = passwords[passwordIndex].category;
            passwords[passwordIndex] = {
                ...passwords[passwordIndex],
                ...updates,
                updatedAt: new Date().toISOString()
            };

            this.saveToStorage(this.storageKeys.passwords, passwords);

            // Update category counts
            if (updates.category !== oldCategory) {
                this.updateCategoryCount(oldCategory, -1);
                this.updateCategoryCount(updates.category, 1);
            }

            return true;
        } catch (error) {
            Utils.handleError(error, 'updatePassword');
            return false;
        }
    }

    // Save categories
    saveCategories(categories) {
        try {
            this.saveToStorage(this.storageKeys.categories, categories);
            return true;
        } catch (error) {
            Utils.handleError(error, 'saveCategories');
            return false;
        }
    }

    // Get categories
    getCategories() {
        return this.getFromStorage(this.storageKeys.categories, []);
    }

    // Add category
    addCategory(name) {
        try {
            Validation.validateCategoryName(name);

            const categories = this.getCategories();
            const newCategory = {
                id: Utils.generateId(),
                name: name.trim(),
                count: 0
            };

            categories.push(newCategory);
            this.saveCategories(categories);

            return newCategory.id;
        } catch (error) {
            Utils.handleError(error, 'addCategory');
            throw error;
        }
    }

    // Delete category
    deleteCategory(categoryId) {
        try {
            const categories = this.getCategories();
            const passwords = this.getPasswords();

            // Check if category has passwords
            const passwordsInCategory = passwords.filter(p => p.category === categoryId);
            if (passwordsInCategory.length > 0) {
                throw new Error('Bu kategoride şifreler var, önce şifreleri silin veya taşıyın');
            }

            const filteredCategories = categories.filter(c => c.id !== categoryId);
            this.saveCategories(filteredCategories);

            return true;
        } catch (error) {
            Utils.handleError(error, 'deleteCategory');
            throw error;
        }
    }

    // Update category count
    updateCategoryCount(categoryId, delta = 1) {
        if (!categoryId) return;

        try {
            const categories = this.getCategories();
            const category = categories.find(c => c.id === categoryId);

            if (category) {
                category.count = Math.max(0, (category.count || 0) + delta);
                this.saveCategories(categories);
            }
        } catch (error) {
            Utils.handleError(error, 'updateCategoryCount');
        }
    }

    // Save settings
    saveSettings(settings) {
        try {
            const validation = Validation.validateSettings(settings);
            if (!validation.valid) {
                throw new Error('Geçersiz ayarlar: ' + validation.errors.join(', '));
            }

            this.saveToStorage(this.storageKeys.settings, validation.sanitized);
            return true;
        } catch (error) {
            Utils.handleError(error, 'saveSettings');
            return false;
        }
    }

    // Get settings
    getSettings() {
        return this.getFromStorage(this.storageKeys.settings, null);
    }

    // Save to history
    saveToHistory(password) {
        try {
            const history = this.getFromStorage(this.storageKeys.history, []);

            // Add new entry
            history.unshift({
                password: password.substring(0, 3) + '***', // Hide password for security
                timestamp: new Date().toISOString(),
                length: password.length,
                strength: Validation.validatePasswordStrength(password).strength
            });

            // Keep only last 100 items
            history.splice(CONSTANTS.performance.maxHistoryItems);

            this.saveToStorage(this.storageKeys.history, history);
            return true;
        } catch (error) {
            Utils.handleError(error, 'saveToHistory');
            return false;
        }
    }

    // Get history
    getHistory() {
        return this.getFromStorage(this.storageKeys.history, []);
    }

    // Export all data
    exportData() {
        try {
            const data = {
                passwords: this.getPasswords(),
                categories: this.getCategories(),
                settings: this.getSettings(),
                history: this.getHistory(),
                exportDate: new Date().toISOString(),
                version: config.version
            };

            const jsonData = JSON.stringify(data, null, 2);
            Utils.downloadFile(jsonData, `password-generator-backup-${Utils.formatDate(new Date(), { year: 'numeric', month: '2-digit', day: '2-digit' })}.json`, 'application/json');

            return true;
        } catch (error) {
            Utils.handleError(error, 'exportData');
            return false;
        }
    }

    // Import data
    importData(jsonData) {
        try {
            const validation = Validation.validateImportData(JSON.parse(jsonData));
            if (!validation.valid) {
                throw new Error('Geçersiz veri: ' + validation.errors.join(', '));
            }

            // Backup current data
            const backup = this.exportData();

            // Import new data
            this.saveToStorage(this.storageKeys.passwords, validation.data.passwords);
            this.saveToStorage(this.storageKeys.categories, validation.data.categories);
            this.saveToStorage(this.storageKeys.settings, validation.data.settings);
            this.saveToStorage(this.storageKeys.history, validation.data.history);

            return true;
        } catch (error) {
            Utils.handleError(error, 'importData');
            return false;
        }
    }

    // Clear all data
    clearAllData() {
        try {
            Object.values(this.storageKeys).forEach(key => {
                Utils.removeStorageItem(key);
            });

            this.initializeStorage();
            return true;
        } catch (error) {
            Utils.handleError(error, 'clearAllData');
            return false;
        }
    }

    // Get storage usage
    getStorageUsage() {
        try {
            let total = 0;
            Object.values(this.storageKeys).forEach(key => {
                const item = localStorage.getItem(key);
                if (item) total += item.length;
            });

            return {
                total: total,
                passwords: JSON.stringify(this.getPasswords()).length,
                categories: JSON.stringify(this.getCategories()).length,
                settings: JSON.stringify(this.getSettings()).length,
                history: JSON.stringify(this.getHistory()).length,
                available: this.getAvailableStorage()
            };
        } catch (error) {
            Utils.handleError(error, 'getStorageUsage');
            return { total: 0, available: 0 };
        }
    }

    // Get available storage
    getAvailableStorage() {
        try {
            const testKey = '__storage_test__';
            const testData = 'x'.repeat(1024); // 1KB test data

            let size = 0;
            while (size < 5 * 1024 * 1024) { // Test up to 5MB
                try {
                    Utils.setStorageItem(testKey, testData.repeat(size + 1));
                    size++;
                } catch {
                    break;
                }
            }

            Utils.removeStorageItem(testKey);
            return size * 1024; // Return in bytes
        } catch (error) {
            return 0;
        }
    }

    // Helper methods for localStorage
    saveToStorage(key, data) {
        try {
            Utils.setStorageItem(key, data);
            return true;
        } catch (error) {
            Utils.handleError(error, `saveToStorage(${key})`);
            return false;
        }
    }

    getFromStorage(key, defaultValue) {
        try {
            return Utils.getStorageItem(key, defaultValue);
        } catch (error) {
            Utils.handleError(error, `getFromStorage(${key})`);
            return defaultValue;
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = StorageManager;
} else {
    // Make available globally
    window.StorageManager = StorageManager;
}
