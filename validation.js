// ============================================
// Password Generator - Validation Functions
// ============================================

class Validation {
    // Validate password name
    static validatePasswordName(name) {
        if (!name || typeof name !== 'string') {
            return { valid: false, error: 'Şifre adı gerekli' };
        }

        const trimmed = name.trim();

        if (trimmed.length < CONSTANTS.VALIDATION.PASSWORD_NAME.MIN_LENGTH) {
            return {
                valid: false,
                error: `Şifre adı en az ${CONSTANTS.VALIDATION.PASSWORD_NAME.MIN_LENGTH} karakter olmalı`
            };
        }

        if (trimmed.length > CONSTANTS.VALIDATION.PASSWORD_NAME.MAX_LENGTH) {
            return {
                valid: false,
                error: `Şifre adı en fazla ${CONSTANTS.VALIDATION.PASSWORD_NAME.MAX_LENGTH} karakter olabilir`
            };
        }

        // Check for special characters
        if (/[<>\"'&]/.test(trimmed)) {
            return { valid: false, error: 'Şifre adı özel karakterler içeremez' };
        }

        return { valid: true };
    }

    // Validate category name
    static validateCategoryName(name) {
        if (!name || typeof name !== 'string') {
            return { valid: false, error: 'Kategori adı gerekli' };
        }

        const trimmed = name.trim();

        if (trimmed.length < CONSTANTS.VALIDATION.CATEGORY_NAME.MIN_LENGTH) {
            return {
                valid: false,
                error: `Kategori adı en az ${CONSTANTS.VALIDATION.CATEGORY_NAME.MIN_LENGTH} karakter olmalı`
            };
        }

        if (trimmed.length > CONSTANTS.VALIDATION.CATEGORY_NAME.MAX_LENGTH) {
            return {
                valid: false,
                error: `Kategori adı en fazla ${CONSTANTS.VALIDATION.CATEGORY_NAME.MAX_LENGTH} karakter olabilir`
            };
        }

        // Check for special characters
        if (/[<>\"'&]/.test(trimmed)) {
            return { valid: false, error: 'Kategori adı özel karakterler içeremez' };
        }

        return { valid: true };
    }

    // Validate password
    static validatePassword(password, options = {}) {
        const errors = [];

        if (!password) {
            errors.push('Şifre gerekli');
            return { valid: false, errors };
        }

        if (typeof password !== 'string') {
            errors.push('Geçersiz şifre formatı');
            return { valid: false, errors };
        }

        // Length validation
        if (password.length < CONSTANTS.PASSWORD.MIN_LENGTH) {
            errors.push(`Şifre en az ${CONSTANTS.PASSWORD.MIN_LENGTH} karakter olmalı`);
        }

        if (password.length > CONSTANTS.PASSWORD.MAX_LENGTH) {
            errors.push(`Şifre en fazla ${CONSTANTS.PASSWORD.MAX_LENGTH} karakter olabilir`);
        }

        // Character requirements
        const hasLowercase = /[a-z]/.test(password);
        const hasUppercase = /[A-Z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSymbols = /[^a-zA-Z\d]/.test(password);

        if (options.requireUppercase && !hasUppercase) {
            errors.push('Şifre en az bir büyük harf içermeli');
        }

        if (options.requireLowercase && !hasLowercase) {
            errors.push('Şifre en az bir küçük harf içermeli');
        }

        if (options.requireNumbers && !hasNumbers) {
            errors.push('Şifre en az bir rakam içermeli');
        }

        if (options.requireSymbols && !hasSymbols) {
            errors.push('Şifre en az bir özel karakter içermeli');
        }

        // Check for common passwords
        if (CONSTANTS.COMMON_PASSWORDS.includes(password.toLowerCase())) {
            errors.push('Çok yaygın bir şifre kullanıyorsunuz');
        }

        // Check for patterns
        if (this.hasPattern(password)) {
            errors.push('Şifre ardışık karakterler içeriyor (123, abc, vs.)');
        }

        // Check for repeated characters
        if (/(.)\1{2,}/.test(password)) {
            errors.push('Şifre çok fazla tekrarlayan karakter içeriyor');
        }

        return {
            valid: errors.length === 0,
            errors,
            checks: {
                length: password.length >= CONSTANTS.PASSWORD.MIN_LENGTH && password.length <= CONSTANTS.PASSWORD.MAX_LENGTH,
                hasLowercase,
                hasUppercase,
                hasNumbers,
                hasSymbols,
                notCommon: !CONSTANTS.COMMON_PASSWORDS.includes(password.toLowerCase()),
                noPattern: !this.hasPattern(password),
                noRepeats: !/(.)\1{2,}/.test(password)
            }
        };
    }

    // Check for patterns in password
    static hasPattern(password) {
        // Sequential numbers
        if (/012|123|234|345|456|567|678|789/.test(password)) return true;

        // Sequential letters
        if (/abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz/i.test(password)) return true;

        // Keyboard patterns
        if (/qwerty|asdf|zxcv/i.test(password)) return true;

        return false;
    }

    // Validate password generation options
    static validateGenerationOptions(options) {
        const errors = [];

        if (!options) {
            errors.push('Üretim seçenekleri gerekli');
            return { valid: false, errors };
        }

        // Length validation
        if (options.length < CONSTANTS.PASSWORD.MIN_LENGTH || options.length > CONSTANTS.PASSWORD.MAX_LENGTH) {
            errors.push(`Şifre uzunluğu ${CONSTANTS.PASSWORD.MIN_LENGTH}-${CONSTANTS.PASSWORD.MAX_LENGTH} karakter arasında olmalı`);
        }

        // At least one character type must be selected
        const hasAtLeastOneType = options.includeUppercase || options.includeLowercase ||
                                options.includeNumbers || options.includeSymbols;

        if (!hasAtLeastOneType) {
            errors.push('En az bir karakter türü seçmelisiniz');
        }

        return {
            valid: errors.length === 0,
            errors,
            checks: {
                validLength: options.length >= CONSTANTS.PASSWORD.MIN_LENGTH && options.length <= CONSTANTS.PASSWORD.MAX_LENGTH,
                hasCharacterTypes: hasAtLeastOneType,
                includeUppercase: options.includeUppercase || false,
                includeLowercase: options.includeLowercase || false,
                includeNumbers: options.includeNumbers || false,
                includeSymbols: options.includeSymbols || false
            }
        };
    }

    // Validate notes
    static validateNotes(notes) {
        if (!notes) return { valid: true }; // Notes are optional

        if (typeof notes !== 'string') {
            return { valid: false, error: 'Geçersiz not formatı' };
        }

        const trimmed = notes.trim();

        if (trimmed.length > CONSTANTS.VALIDATION.NOTES.MAX_LENGTH) {
            return {
                valid: false,
                error: `Notlar en fazla ${CONSTANTS.VALIDATION.NOTES.MAX_LENGTH} karakter olabilir`
            };
        }

        return { valid: true };
    }

    // Validate file import
    static validateImportData(data) {
        const errors = [];

        if (!data || typeof data !== 'object') {
            errors.push('Geçersiz veri formatı');
            return { valid: false, errors };
        }

        // Check required fields
        if (data.passwords && !Array.isArray(data.passwords)) {
            errors.push('Şifreler dizisi geçersiz');
        }

        if (data.categories && !Array.isArray(data.categories)) {
            errors.push('Kategoriler dizisi geçersiz');
        }

        if (data.settings && typeof data.settings !== 'object') {
            errors.push('Ayarlar objesi geçersiz');
        }

        return {
            valid: errors.length === 0,
            errors,
            data: {
                passwords: Array.isArray(data.passwords) ? data.passwords : [],
                categories: Array.isArray(data.categories) ? data.categories : [],
                settings: typeof data.settings === 'object' ? data.settings : {},
                history: Array.isArray(data.history) ? data.history : []
            }
        };
    }

    // Validate search query
    static validateSearchQuery(query) {
        if (!query || typeof query !== 'string') {
            return { valid: true, sanitized: '' }; // Empty query is valid
        }

        const sanitized = query.trim();

        if (sanitized.length > 100) {
            return { valid: false, error: 'Arama sorgusu çok uzun' };
        }

        // Remove potentially dangerous characters
        const cleanQuery = sanitized.replace(/[<>\"'&]/g, '');

        return {
            valid: true,
            sanitized: cleanQuery,
            original: sanitized
        };
    }

    // Validate settings
    static validateSettings(settings) {
        if (!settings || typeof settings !== 'object') {
            return { valid: false, error: 'Ayarlar objesi geçersiz' };
        }

        const errors = [];
        const sanitized = {};

        // Theme validation
        if (settings.theme) {
            if (!['light', 'dark'].includes(settings.theme)) {
                errors.push('Geçersiz tema');
            } else {
                sanitized.theme = settings.theme;
            }
        }

        // Boolean validations
        const booleanFields = ['autoCopy', 'showStrength', 'saveHistory'];
        booleanFields.forEach(field => {
            if (settings[field] !== undefined) {
                if (typeof settings[field] !== 'boolean') {
                    errors.push(`${field} boolean olmalı`);
                } else {
                    sanitized[field] = settings[field];
                }
            }
        });

        return {
            valid: errors.length === 0,
            errors,
            sanitized
        };
    }

    // Sanitize input
    static sanitizeInput(input) {
        if (typeof input !== 'string') return '';

        return input
            .trim()
            .replace(/[<>\"'&]/g, '') // Remove potentially dangerous characters
            .substring(0, 1000); // Limit length
    }

    // Validate URL
    static isValidUrl(url) {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }

    // Validate number range
    static validateNumberRange(value, min, max, fieldName = 'Değer') {
        const num = parseInt(value);

        if (isNaN(num)) {
            return { valid: false, error: `${fieldName} geçerli bir sayı olmalı` };
        }

        if (num < min || num > max) {
            return { valid: false, error: `${fieldName} ${min}-${max} arasında olmalı` };
        }

        return { valid: true, value: num };
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Validation;
} else {
    // Make available globally
    window.Validation = Validation;
}
