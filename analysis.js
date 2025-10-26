// ============================================
// Password Generator - Security Analysis
// ============================================

class SecurityAnalyzer {
    constructor() {
        this.commonPasswords = CONSTANTS.COMMON_PASSWORDS;
    }

    // Analyze password strength
    analyze(password) {
        try {
            if (!password) {
                return {
                    score: 0,
                    strength: 'Çok Zayıf',
                    bits: 0,
                    crackTime: 'Anında',
                    checks: {
                        length: 0,
                        variety: 0,
                        uniqueness: 0,
                        hasLowercase: false,
                        hasUppercase: false,
                        hasNumbers: false,
                        hasSymbols: false,
                        isCommon: false,
                        hasPattern: false
                    }
                };
            }

            let score = 0;
            const length = password.length;

            // Length score (max 25)
            if (length >= 8) score += Math.min(length * 2, 25);

            // Character variety score (max 25)
            const hasLowercase = /[a-z]/.test(password);
            const hasUppercase = /[A-Z]/.test(password);
            const hasNumbers = /\d/.test(password);
            const hasSymbols = /[^a-zA-Z\d]/.test(password);

            const varietyCount = [hasLowercase, hasUppercase, hasNumbers, hasSymbols].filter(Boolean).length;
            score += varietyCount * 6;

            // Uniqueness score (max 20)
            const uniqueChars = new Set(password).size;
            const uniquenessRatio = uniqueChars / length;
            score += Math.min(uniquenessRatio * 20, 20);

            // Common password penalty (max -15)
            const isCommon = this.commonPasswords.some(common =>
                password.toLowerCase().includes(common)
            );
            if (isCommon) score -= 15;

            // Pattern penalty (max -15)
            const hasPattern = this.hasPattern(password);
            if (hasPattern) score -= 15;

            // Bonus for mixed requirements
            if (length >= 12 && varietyCount >= 3) score += 10;
            if (length >= 16 && varietyCount >= 4) score += 15;

            // Bound score between 0-100
            score = Math.max(0, Math.min(100, score));

            // Calculate entropy
            const bits = this.calculateEntropy(password);

            // Determine strength level
            let strength;
            if (score < CONSTANTS.SECURITY.WEAK_THRESHOLD) strength = 'Çok Zayıf';
            else if (score < CONSTANTS.SECURITY.MEDIUM_THRESHOLD) strength = 'Zayıf';
            else if (score < CONSTANTS.SECURITY.STRONG_THRESHOLD) strength = 'Orta';
            else if (score < CONSTANTS.SECURITY.VERY_STRONG_THRESHOLD) strength = 'Güçlü';
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
                    hasLowercase,
                    hasUppercase,
                    hasNumbers,
                    hasSymbols,
                    isCommon,
                    hasPattern
                },
                recommendations: this.getRecommendations({
                    length,
                    varietyCount,
                    hasPattern,
                    isCommon,
                    hasLowercase,
                    hasUppercase,
                    hasNumbers,
                    hasSymbols
                })
            };
        } catch (error) {
            Utils.handleError(error, 'analyze');
            return {
                score: 0,
                strength: 'Hesaplanamadı',
                bits: 0,
                crackTime: 'Bilinmiyor'
            };
        }
    }

    // Calculate entropy (bits)
    calculateEntropy(password) {
        try {
            if (!password) return 0;

            const length = password.length;
            const charSetSize = this.getCharSetSize(password);

            return Math.log2(Math.pow(charSetSize, length));
        } catch (error) {
            Utils.handleError(error, 'calculateEntropy');
            return 0;
        }
    }

    // Get character set size
    getCharSetSize(password) {
        try {
            let size = 0;

            if (/[a-z]/.test(password)) size += 26; // lowercase
            if (/[A-Z]/.test(password)) size += 26; // uppercase
            if (/\d/.test(password)) size += 10; // numbers
            if (/[^a-zA-Z\d]/.test(password)) size += 32; // symbols (approximate)

            return Math.max(size, 1);
        } catch (error) {
            Utils.handleError(error, 'getCharSetSize');
            return 1;
        }
    }

    // Check for patterns
    hasPattern(password) {
        try {
            return Validation.hasPattern(password);
        } catch (error) {
            Utils.handleError(error, 'hasPattern');
            return false;
        }
    }

    // Estimate crack time
    estimateCrackTime(bits) {
        try {
            // Modern hardware assumptions
            const guessesPerSecond = 1e12; // 1 trillion guesses per second
            const seconds = Math.pow(2, bits) / guessesPerSecond;

            if (seconds < 1) return 'Anında';
            if (seconds < 60) return `${Math.round(seconds)} saniye`;
            if (seconds < 3600) return `${Math.round(seconds / 60)} dakika`;
            if (seconds < 86400) return `${Math.round(seconds / 3600)} saat`;
            if (seconds < 2592000) return `${Math.round(seconds / 86400)} gün`;
            if (seconds < 31536000) return `${Math.round(seconds / 2592000)} ay`;
            if (seconds < 3153600000) return `${Math.round(seconds / 31536000)} yıl`;

            return 'Milyarlarca yıl';
        } catch (error) {
            Utils.handleError(error, 'estimateCrackTime');
            return 'Bilinmiyor';
        }
    }

    // Get security recommendations
    getRecommendations(checks) {
        try {
            const recommendations = [];

            if (checks.length < 8) {
                recommendations.push('Şifreniz en az 8 karakter olmalı');
            }

            if (checks.length < 12) {
                recommendations.push('Daha uzun şifreler daha güvenlidir');
            }

            if (checks.variety < 3) {
                recommendations.push('Büyük harf, küçük harf, rakam ve sembol kullanın');
            }

            if (checks.uniqueness < 80) {
                recommendations.push('Tekrarlayan karakterler kullanmayın');
            }

            if (checks.hasPattern) {
                recommendations.push('Ardışık karakterler (123, abc) kullanmayın');
            }

            if (checks.isCommon) {
                recommendations.push('Yaygın şifreler kullanmayın (123456, password, vs.)');
            }

            if (!checks.hasUppercase) {
                recommendations.push('En az bir büyük harf kullanın');
            }

            if (!checks.hasLowercase) {
                recommendations.push('En az bir küçük harf kullanın');
            }

            if (!checks.hasNumbers) {
                recommendations.push('En az bir rakam kullanın');
            }

            if (!checks.hasSymbols) {
                recommendations.push('En az bir özel karakter kullanın');
            }

            return recommendations;
        } catch (error) {
            Utils.handleError(error, 'getRecommendations');
            return [];
        }
    }

    // Analyze password in real-time
    analyzeRealTime(password) {
        try {
            if (!password) return null;

            const analysis = this.analyze(password);

            return {
                score: analysis.score,
                strength: analysis.strength,
                isWeak: analysis.score < CONSTANTS.SECURITY.WEAK_THRESHOLD,
                isStrong: analysis.score >= CONSTANTS.SECURITY.STRONG_THRESHOLD,
                color: this.getStrengthColor(analysis.score),
                width: `${analysis.score}%`
            };
        } catch (error) {
            Utils.handleError(error, 'analyzeRealTime');
            return null;
        }
    }

    // Get color based on strength score
    getStrengthColor(score) {
        try {
            if (score < CONSTANTS.SECURITY.WEAK_THRESHOLD) return '#dc3545'; // Red
            if (score < CONSTANTS.SECURITY.MEDIUM_THRESHOLD) return '#fd7e14'; // Orange
            if (score < CONSTANTS.SECURITY.STRONG_THRESHOLD) return '#ffc107'; // Yellow
            if (score < CONSTANTS.SECURITY.VERY_STRONG_THRESHOLD) return '#28a745'; // Green
            return '#20c997'; // Teal
        } catch (error) {
            Utils.handleError(error, 'getStrengthColor');
            return '#6c757d'; // Gray
        }
    }

    // Check if password is compromised (mock function for future API integration)
    async checkCompromised(password) {
        try {
            // This would integrate with HaveIBeenPwned API in the future
            // For now, just check against common passwords
            const isCommon = this.commonPasswords.includes(password.toLowerCase());

            return {
                compromised: isCommon,
                count: isCommon ? 'Bilinmiyor' : 0,
                message: isCommon ?
                    'Bu şifre yaygın olarak kullanılıyor ve tehlikeli olabilir' :
                    'Şifre benzersiz görünüyor'
            };
        } catch (error) {
            Utils.handleError(error, 'checkCompromised');
            return {
                compromised: false,
                count: 0,
                message: 'Kontrol edilemedi'
            };
        }
    }

    // Generate security report
    generateReport(password) {
        try {
            const analysis = this.analyze(password);
            const compromised = this.checkCompromised(password);

            return {
                timestamp: new Date().toISOString(),
                password: password.substring(0, 3) + '***',
                ...analysis,
                compromised: compromised.compromised,
                recommendations: analysis.recommendations,
                riskLevel: this.getRiskLevel(analysis.score),
                suggestions: [
                    'Şifrenizi düzenli olarak değiştirin',
                    'Her hesap için farklı şifre kullanın',
                    'İki faktörlü kimlik doğrulamayı etkinleştirin',
                    'Şifre yöneticisi kullanın'
                ]
            };
        } catch (error) {
            Utils.handleError(error, 'generateReport');
            return null;
        }
    }

    // Get risk level
    getRiskLevel(score) {
        try {
            if (score < CONSTANTS.SECURITY.WEAK_THRESHOLD) return 'Yüksek';
            if (score < CONSTANTS.SECURITY.MEDIUM_THRESHOLD) return 'Orta-Yüksek';
            if (score < CONSTANTS.SECURITY.STRONG_THRESHOLD) return 'Orta';
            if (score < CONSTANTS.SECURITY.VERY_STRONG_THRESHOLD) return 'Düşük';
            return 'Çok Düşük';
        } catch (error) {
            Utils.handleError(error, 'getRiskLevel');
            return 'Bilinmiyor';
        }
    }

    // Batch analyze multiple passwords
    analyzeBatch(passwords) {
        try {
            return passwords.map((password, index) => ({
                index,
                password: password.substring(0, 3) + '***',
                ...this.analyze(password)
            }));
        } catch (error) {
            Utils.handleError(error, 'analyzeBatch');
            return [];
        }
    }

    // Get security tips
    getSecurityTips() {
        try {
            return [
                {
                    title: 'Uzun Şifreler Kullanın',
                    description: 'Şifreniz ne kadar uzun olursa o kadar güvenli olur. 12+ karakter önerilir.',
                    icon: '📏'
                },
                {
                    title: 'Karakter Çeşitliliği',
                    description: 'Büyük harf, küçük harf, rakam ve sembol karışımı kullanın.',
                    icon: '🔤'
                },
                {
                    title: 'Benzersiz Şifreler',
                    description: 'Her hesap için farklı şifreler kullanın.',
                    icon: '🔑'
                },
                {
                    title: 'Yaygın Şifrelerden Kaçının',
                    description: '123456, password gibi yaygın şifreler kullanmayın.',
                    icon: '⚠️'
                },
                {
                    title: 'Pattern\'lardan Kaçının',
                    description: '123, abc, qwerty gibi ardışık karakterler kullanmayın.',
                    icon: '🔄'
                },
                {
                    title: 'Şifre Yöneticisi Kullanın',
                    description: 'Güçlü şifreleri hatırlamak için şifre yöneticisi kullanın.',
                    icon: '📱'
                },
                {
                    title: 'İki Faktörlü Kimlik Doğrulama',
                    description: 'Mümkünse 2FA\'yı etkinleştirin.',
                    icon: '🔐'
                },
                {
                    title: 'Düzenli Değiştirin',
                    description: 'Şifrelerinizi 3-6 ayda bir değiştirin.',
                    icon: '🔄'
                }
            ];
        } catch (error) {
            Utils.handleError(error, 'getSecurityTips');
            return [];
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SecurityAnalyzer;
} else {
    // Make available globally
    window.SecurityAnalyzer = SecurityAnalyzer;
}
