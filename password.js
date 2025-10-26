// ============================================
// Password Generator - Password Generation
// ============================================

class PasswordGenerator {
    constructor() {
        this.charSets = CONSTANTS.CHAR_SETS;
    }

    // Main password generation function
    generate(options = {}) {
        try {
            const validation = Validation.validateGenerationOptions(options);
            if (!validation.valid) {
                throw new Error(validation.errors.join(', '));
            }

            const {
                length = CONSTANTS.PASSWORD.DEFAULT_LENGTH,
                includeUppercase = true,
                includeLowercase = true,
                includeNumbers = true,
                includeSymbols = true
            } = options;

            const charPool = this.getCharacterPool({
                includeUppercase,
                includeLowercase,
                includeNumbers,
                includeSymbols
            });

            if (charPool.length === 0) {
                throw new Error(CONSTANTS.MESSAGES.ERROR.NO_CHARACTERS);
            }

            let password = '';

            // Ensure at least one character from each selected type
            const requiredTypes = [];
            if (includeUppercase) requiredTypes.push('uppercase');
            if (includeLowercase) requiredTypes.push('lowercase');
            if (includeNumbers) requiredTypes.push('numbers');
            if (includeSymbols) requiredTypes.push('symbols');

            // Add at least one character from each required type
            for (const type of requiredTypes) {
                const randomIndex = Math.floor(Math.random() * this.charSets[type.toUpperCase()].length);
                password += this.charSets[type.toUpperCase()][randomIndex];
            }

            // Fill the rest randomly
            const remainingLength = length - requiredTypes.length;
            for (let i = 0; i < remainingLength; i++) {
                const randomIndex = Math.floor(Math.random() * charPool.length);
                password += charPool[randomIndex];
            }

            // Shuffle the password to avoid predictable patterns
            password = Utils.shuffleArray(password.split('')).join('');

            return password;
        } catch (error) {
            Utils.handleError(error, 'generate');
            throw error;
        }
    }

    // Generate multiple passwords
    generateMultiple(count = 3, options = {}) {
        try {
            const passwords = [];

            for (let i = 0; i < count; i++) {
                passwords.push(this.generate(options));
            }

            return passwords;
        } catch (error) {
            Utils.handleError(error, 'generateMultiple');
            throw error;
        }
    }

    // Generate with custom character set
    generateWithCustomSet(length, customSet) {
        try {
            if (!customSet || customSet.length === 0) {
                throw new Error('Geçerli bir karakter seti belirtmelisiniz');
            }

            let password = '';
            for (let i = 0; i < length; i++) {
                const randomIndex = Math.floor(Math.random() * customSet.length);
                password += customSet[randomIndex];
            }

            return password;
        } catch (error) {
            Utils.handleError(error, 'generateWithCustomSet');
            throw error;
        }
    }

    // Get character pool based on options
    getCharacterPool(options = {}) {
        try {
            const {
                includeUppercase = true,
                includeLowercase = true,
                includeNumbers = true,
                includeSymbols = true
            } = options;

            let charPool = '';

            if (includeUppercase) charPool += this.charSets.UPPERCASE;
            if (includeLowercase) charPool += this.charSets.LOWERCASE;
            if (includeNumbers) charPool += this.charSets.NUMBERS;
            if (includeSymbols) charPool += this.charSets.SYMBOLS;

            return charPool;
        } catch (error) {
            Utils.handleError(error, 'getCharacterPool');
            return '';
        }
    }

    // Get character set size for entropy calculation
    getCharacterSetSize(options = {}) {
        try {
            let size = 0;

            if (options.includeUppercase) size += this.charSets.UPPERCASE.length;
            if (options.includeLowercase) size += this.charSets.LOWERCASE.length;
            if (options.includeNumbers) size += this.charSets.NUMBERS.length;
            if (options.includeSymbols) size += this.charSets.SYMBOLS.length;

            return Math.max(size, 1);
        } catch (error) {
            Utils.handleError(error, 'getCharacterSetSize');
            return 1;
        }
    }

    // Generate memorable password (pronounceable)
    generateMemorable(length = 12) {
        try {
            const vowels = 'aeiou';
            const consonants = 'bcdfghjklmnpqrstvwxyz';

            let password = '';
            let useVowel = Math.random() < 0.5;

            for (let i = 0; i < length; i++) {
                const charSet = useVowel ? vowels : consonants;
                const randomIndex = Math.floor(Math.random() * charSet.length);
                password += charSet[randomIndex];

                // Add number or symbol occasionally
                if (Math.random() < 0.1 && password.length < length - 1) {
                    if (Math.random() < 0.5) {
                        password += Math.floor(Math.random() * 10);
                    } else {
                        password += CONSTANTS.CHAR_SETS.SYMBOLS[Math.floor(Math.random() * 4)];
                    }
                    i++; // Skip next iteration
                }

                useVowel = !useVowel;
            }

            return password.substring(0, length);
        } catch (error) {
            Utils.handleError(error, 'generateMemorable');
            return this.generate({ length });
        }
    }

    // Generate PIN (numbers only)
    generatePin(length = 4) {
        try {
            if (length < 4 || length > 12) {
                throw new Error('PIN uzunluğu 4-12 karakter arasında olmalı');
            }

            let pin = '';
            for (let i = 0; i < length; i++) {
                pin += Math.floor(Math.random() * 10);
            }

            return pin;
        } catch (error) {
            Utils.handleError(error, 'generatePin');
            throw error;
        }
    }

    // Generate password with specific pattern
    generatePattern(pattern) {
        try {
            // Pattern format: "2u3l2n1s" (2 uppercase, 3 lowercase, 2 numbers, 1 symbol)
            const patternRegex = /^(\d+[ulns])+$/i;
            if (!patternRegex.test(pattern)) {
                throw new Error('Geçersiz pattern formatı. Örnek: 2u3l2n1s');
            }

            let password = '';
            const parts = pattern.match(/\d+[ulns]/gi);

            for (const part of parts) {
                const count = parseInt(part.slice(0, -1));
                const type = part.slice(-1).toLowerCase();

                let charSet = '';
                switch (type) {
                    case 'u': charSet = this.charSets.UPPERCASE; break;
                    case 'l': charSet = this.charSets.LOWERCASE; break;
                    case 'n': charSet = this.charSets.NUMBERS; break;
                    case 's': charSet = this.charSets.SYMBOLS; break;
                    default: throw new Error('Geçersiz karakter türü: ' + type);
                }

                for (let i = 0; i < count; i++) {
                    const randomIndex = Math.floor(Math.random() * charSet.length);
                    password += charSet[randomIndex];
                }
            }

            return Utils.shuffleArray(password.split('')).join('');
        } catch (error) {
            Utils.handleError(error, 'generatePattern');
            throw error;
        }
    }

    // Generate password with separators
    generateWithSeparators(options = {}, separator = '-') {
        try {
            const basePassword = this.generate(options);
            const groups = Math.ceil(basePassword.length / 4);

            const parts = [];
            for (let i = 0; i < groups; i++) {
                const start = i * 4;
                const end = Math.min(start + 4, basePassword.length);
                parts.push(basePassword.slice(start, end));
            }

            return parts.join(separator);
        } catch (error) {
            Utils.handleError(error, 'generateWithSeparators');
            throw error;
        }
    }

    // Calculate password strength
    calculateStrength(password) {
        try {
            if (!password) return { score: 0, strength: 'Çok Zayıf' };

            let score = 0;
            const length = password.length;

            // Length score (max 30)
            score += Math.min(length * 2, 30);

            // Character variety score (max 30)
            const hasLower = /[a-z]/.test(password);
            const hasUpper = /[A-Z]/.test(password);
            const hasNumbers = /\d/.test(password);
            const hasSymbols = /[^a-zA-Z\d]/.test(password);

            const varietyCount = [hasLower, hasUpper, hasNumbers, hasSymbols].filter(Boolean).length;
            score += varietyCount * 7;

            // Uniqueness score (max 20)
            const uniqueChars = new Set(password).size;
            const uniquenessRatio = uniqueChars / length;
            score += uniquenessRatio * 20;

            // Bonus for longer passwords with variety
            if (length >= 12 && varietyCount >= 3) score += 10;
            if (length >= 16 && varietyCount >= 4) score += 10;

            // Penalty for common patterns
            if (Validation.hasPattern(password)) score -= 15;
            if (CONSTANTS.COMMON_PASSWORDS.includes(password.toLowerCase())) score -= 20;

            // Bound score between 0-100
            score = Math.max(0, Math.min(100, score));

            let strength;
            if (score < 20) strength = 'Çok Zayıf';
            else if (score < 40) strength = 'Zayıf';
            else if (score < 60) strength = 'Orta';
            else if (score < 80) strength = 'Güçlü';
            else strength = 'Çok Güçlü';

            return {
                score: Math.round(score),
                strength,
                length,
                variety: varietyCount,
                uniqueness: Math.round(uniquenessRatio * 100),
                checks: {
                    hasLowercase: hasLower,
                    hasUppercase: hasUpper,
                    hasNumbers: hasNumbers,
                    hasSymbols: hasSymbols
                }
            };
        } catch (error) {
            Utils.handleError(error, 'calculateStrength');
            return { score: 0, strength: 'Hesaplanamadı' };
        }
    }

    // Get password suggestions based on options
    getSuggestions(options = {}) {
        try {
            const suggestions = [];

            // Basic suggestion
            suggestions.push({
                name: 'Standart',
                password: this.generate(options),
                description: 'Dengeli şifre'
            });

            // Stronger suggestion
            suggestions.push({
                name: 'Güçlü',
                password: this.generate({ ...options, length: CONSTANTS.PASSWORD.STRONG_LENGTH }),
                description: 'Daha uzun ve güçlü'
            });

            // Memorable suggestion
            suggestions.push({
                name: 'Ezberlenebilir',
                password: this.generateMemorable(options.length || 12),
                description: 'Kolay ezberlenebilir'
            });

            return suggestions;
        } catch (error) {
            Utils.handleError(error, 'getSuggestions');
            return [];
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PasswordGenerator;
} else {
    // Make available globally
    window.PasswordGenerator = PasswordGenerator;
}
