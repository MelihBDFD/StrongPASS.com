// ============================================
// Password Generator - Animations & Effects
// ============================================

class AnimationManager {
    constructor() {
        this.activeAnimations = new Map();
        this.init();
    }

    // Initialize animations
    init() {
        this.setupCSSAnimations();
        this.setupIntersectionObserver();
    }

    // Setup CSS animations
    setupCSSAnimations() {
        // Add animation styles if not already present
        if (!document.querySelector('#animation-styles')) {
            const style = document.createElement('style');
            style.id = 'animation-styles';
            style.textContent = `
                @keyframes slideInUp {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                @keyframes slideInDown {
                    from { opacity: 0; transform: translateY(-30px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                @keyframes slideInLeft {
                    from { opacity: 0; transform: translateX(-30px); }
                    to { opacity: 1; transform: translateX(0); }
                }

                @keyframes slideInRight {
                    from { opacity: 0; transform: translateX(30px); }
                    to { opacity: 1; transform: translateX(0); }
                }

                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                @keyframes scaleIn {
                    from { opacity: 0; transform: scale(0.8); }
                    to { opacity: 1; transform: scale(1); }
                }

                @keyframes bounceIn {
                    0% { opacity: 0; transform: scale(0.3); }
                    50% { opacity: 1; transform: scale(1.05); }
                    70% { transform: scale(0.9); }
                    100% { opacity: 1; transform: scale(1); }
                }

                @keyframes typing {
                    from { width: 0; }
                    to { width: 100%; }
                }

                @keyframes blink {
                    0%, 50% { border-color: transparent; }
                    51%, 100% { border-color: currentColor; }
                }

                .animate-slide-up { animation: slideInUp 0.6s ease-out; }
                .animate-slide-down { animation: slideInDown 0.6s ease-out; }
                .animate-slide-left { animation: slideInLeft 0.6s ease-out; }
                .animate-slide-right { animation: slideInRight 0.6s ease-out; }
                .animate-fade-in { animation: fadeIn 0.6s ease-out; }
                .animate-scale-in { animation: scaleIn 0.6s ease-out; }
                .animate-bounce-in { animation: bounceIn 0.8s ease-out; }

                .typing-cursor::after {
                    content: '|';
                    animation: blink 1s infinite;
                }
            `;
            document.head.appendChild(style);
        }
    }

    // Setup intersection observer for scroll animations
    setupIntersectionObserver() {
        if ('IntersectionObserver' in window) {
            this.observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-slide-up');
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });
        }
    }

    // Animate element
    animate(element, animation, duration = 600) {
        try {
            if (!element) return;

            // Remove existing animations
            this.clearAnimation(element);

            // Add animation class
            element.classList.add(`animate-${animation}`);

            // Store animation
            this.activeAnimations.set(element, {
                animation,
                duration,
                startTime: Date.now()
            });

            // Remove animation class after duration
            setTimeout(() => {
                element.classList.remove(`animate-${animation}`);
                this.activeAnimations.delete(element);
            }, duration);

        } catch (error) {
            Utils.handleError(error, 'animate');
        }
    }

    // Clear animation from element
    clearAnimation(element) {
        try {
            if (!element) return;

            const animations = ['slide-up', 'slide-down', 'slide-left', 'slide-right', 'fade-in', 'scale-in', 'bounce-in'];
            animations.forEach(anim => {
                element.classList.remove(`animate-${anim}`);
            });

            this.activeAnimations.delete(element);
        } catch (error) {
            Utils.handleError(error, 'clearAnimation');
        }
    }

    // Typing animation
    typeText(element, text, speed = 50) {
        try {
            if (!element || !text) return;

            element.textContent = '';
            element.classList.add('typing-cursor');

            let index = 0;
            const interval = setInterval(() => {
                if (index < text.length) {
                    element.textContent += text[index];
                    index++;
                } else {
                    clearInterval(interval);
                    setTimeout(() => {
                        element.classList.remove('typing-cursor');
                    }, 1000);
                }
            }, speed);

        } catch (error) {
            Utils.handleError(error, 'typeText');
        }
    }

    // Particle effect
    createParticles(container, count = 12, colors = null) {
        try {
            if (!container) return;

            // Clear existing particles
            this.clearParticles(container);

            const defaultColors = colors || Utils.getRandomColor();
            const particles = [];

            for (let i = 0; i < count; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.style.cssText = `
                    position: absolute;
                    width: 4px;
                    height: 4px;
                    background: ${defaultColors};
                    border-radius: 50%;
                    pointer-events: none;
                    z-index: 1000;
                    opacity: 0;
                `;

                // Random position around center
                const angle = (i / count) * Math.PI * 2;
                const distance = 30 + Math.random() * 40;
                const x = Math.cos(angle) * distance;
                const y = Math.sin(angle) * distance;

                particle.style.left = '50%';
                particle.style.top = '50%';
                particle.style.transform = `translate(-50%, -50%)`;

                container.appendChild(particle);
                particles.push({ element: particle, x, y });

                // Animate particle
                setTimeout(() => {
                    particle.style.transition = 'all 1s ease-out';
                    particle.style.transform = `translate(${x}px, ${y}px)`;
                    particle.style.opacity = '1';

                    setTimeout(() => {
                        particle.style.opacity = '0';
                        setTimeout(() => particle.remove(), 1000);
                    }, 800);
                }, i * 50);
            }

            return particles;
        } catch (error) {
            Utils.handleError(error, 'createParticles');
        }
    }

    // Clear particles from container
    clearParticles(container) {
        try {
            if (!container) return;

            const particles = container.querySelectorAll('.particle');
            particles.forEach(particle => particle.remove());
        } catch (error) {
            Utils.handleError(error, 'clearParticles');
        }
    }

    // Pulse animation
    pulse(element, duration = 1000) {
        try {
            if (!element) return;

            element.style.animation = `pulse ${duration}ms ease-in-out`;
            setTimeout(() => {
                element.style.animation = '';
            }, duration);
        } catch (error) {
            Utils.handleError(error, 'pulse');
        }
    }

    // Shake animation
    shake(element, intensity = 5, duration = 500) {
        try {
            if (!element) return;

            const originalTransform = element.style.transform || '';

            const shake = () => {
                const x = (Math.random() - 0.5) * intensity * 2;
                const y = (Math.random() - 0.5) * intensity * 2;
                element.style.transform = `${originalTransform} translate(${x}px, ${y}px)`;
            };

            const interval = setInterval(shake, 50);
            setTimeout(() => {
                clearInterval(interval);
                element.style.transform = originalTransform;
            }, duration);
        } catch (error) {
            Utils.handleError(error, 'shake');
        }
    }

    // Slide transition between elements
    slideTransition(fromElement, toElement, direction = 'left') {
        try {
            if (!fromElement || !toElement) return;

            const translateX = direction === 'left' ? '-100%' : '100%';

            // Prepare to element
            toElement.style.position = 'absolute';
            toElement.style.top = '0';
            toElement.style.left = translateX;
            toElement.style.width = '100%';
            toElement.style.opacity = '0';

            // Animate
            setTimeout(() => {
                fromElement.style.transition = 'all 0.3s ease-out';
                toElement.style.transition = 'all 0.3s ease-out';

                fromElement.style.transform = `translateX(${direction === 'left' ? '100%' : '-100%'})`;
                fromElement.style.opacity = '0';

                toElement.style.transform = 'translateX(0)';
                toElement.style.opacity = '1';
            }, 50);

            // Cleanup
            setTimeout(() => {
                fromElement.style.display = 'none';
                toElement.style.position = '';
                toElement.style.top = '';
                toElement.style.left = '';
                toElement.style.width = '';
                toElement.style.transform = '';
            }, 350);

        } catch (error) {
            Utils.handleError(error, 'slideTransition');
        }
    }

    // Morphing animation
    morph(element, duration = 3000) {
        try {
            if (!element) return;

            element.style.transition = `border-radius ${duration}ms ease-in-out`;
            element.style.borderRadius = '60% 40% 30% 70% / 60% 30% 70% 40%';

            setTimeout(() => {
                element.style.borderRadius = '30% 60% 70% 40% / 50% 60% 30% 60%';
                setTimeout(() => {
                    element.style.borderRadius = '60% 40% 30% 70% / 60% 30% 70% 40%';
                }, duration / 2);
            }, duration / 2);

        } catch (error) {
            Utils.handleError(error, 'morph');
        }
    }

    // Breathing animation
    breathe(element, duration = 4000) {
        try {
            if (!element) return;

            element.style.animation = `breathe ${duration}ms ease-in-out infinite`;
        } catch (error) {
            Utils.handleError(error, 'breathe');
        }
    }

    // Stop breathing animation
    stopBreathing(element) {
        try {
            if (!element) return;
            element.style.animation = '';
        } catch (error) {
            Utils.handleError(error, 'stopBreathing');
        }
    }

    // Floating animation
    float(element, duration = 3000) {
        try {
            if (!element) return;

            element.style.animation = `float ${duration}ms ease-in-out infinite`;
        } catch (error) {
            Utils.handleError(error, 'float');
        }
    }

    // Stop floating animation
    stopFloating(element) {
        try {
            if (!element) return;
            element.style.animation = '';
        } catch (error) {
            Utils.handleError(error, 'stopFloating');
        }
    }

    // Glow effect
    glow(element, color = '#667eea', intensity = 20) {
        try {
            if (!element) return;

            element.style.boxShadow = `0 0 ${intensity}px ${color}`;
            element.style.transition = 'box-shadow 0.3s ease';
        } catch (error) {
            Utils.handleError(error, 'glow');
        }
    }

    // Remove glow effect
    removeGlow(element) {
        try {
            if (!element) return;
            element.style.boxShadow = '';
        } catch (error) {
            Utils.handleError(error, 'removeGlow');
        }
    }

    // Liquid button effect
    liquidEffect(element) {
        try {
            if (!element) return;

            const shine = document.createElement('div');
            shine.style.cssText = `
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
                transition: left 0.5s;
                pointer-events: none;
                border-radius: inherit;
            `;

            element.style.position = 'relative';
            element.style.overflow = 'hidden';
            element.appendChild(shine);

            element.addEventListener('mouseenter', () => {
                shine.style.left = '100%';
            });

            element.addEventListener('mouseleave', () => {
                shine.style.left = '-100%';
            });

        } catch (error) {
            Utils.handleError(error, 'liquidEffect');
        }
    }

    // Ripple effect
    rippleEffect(element) {
        try {
            if (!element) return;

            element.addEventListener('click', (e) => {
                const ripple = document.createElement('span');
                const rect = element.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;

                ripple.style.cssText = `
                    position: absolute;
                    width: ${size}px;
                    height: ${size}px;
                    left: ${x}px;
                    top: ${y}px;
                    background: rgba(255, 255, 255, 0.3);
                    border-radius: 50%;
                    transform: scale(0);
                    animation: ripple 0.6s ease-out;
                    pointer-events: none;
                `;

                // Add ripple animation CSS if not exists
                if (!document.querySelector('#ripple-styles')) {
                    const style = document.createElement('style');
                    style.id = 'ripple-styles';
                    style.textContent = `
                        @keyframes ripple {
                            to { transform: scale(4); opacity: 0; }
                        }
                    `;
                    document.head.appendChild(style);
                }

                element.style.position = 'relative';
                element.style.overflow = 'hidden';
                element.appendChild(ripple);

                setTimeout(() => {
                    if (ripple.parentNode) {
                        ripple.parentNode.removeChild(ripple);
                    }
                }, 600);
            });

        } catch (error) {
            Utils.handleError(error, 'rippleEffect');
        }
    }

    // Magnetic effect (elements attract to cursor)
    magneticEffect(element, strength = 0.3) {
        try {
            if (!element || Utils.isMobile()) return;

            element.addEventListener('mousemove', (e) => {
                const rect = element.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;

                const deltaX = (e.clientX - centerX) * strength;
                const deltaY = (e.clientY - centerY) * strength;

                element.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
            });

            element.addEventListener('mouseleave', () => {
                element.style.transform = '';
            });

        } catch (error) {
            Utils.handleError(error, 'magneticEffect');
        }
    }

    // Loading skeleton animation
    createSkeleton(element, lines = 3) {
        try {
            if (!element) return;

            element.innerHTML = '';

            for (let i = 0; i < lines; i++) {
                const skeletonLine = document.createElement('div');
                skeletonLine.className = 'skeleton';
                skeletonLine.style.cssText = `
                    height: 1rem;
                    margin-bottom: 0.5rem;
                    border-radius: 4px;
                `;

                if (i === lines - 1) {
                    skeletonLine.style.width = '60%';
                }

                element.appendChild(skeletonLine);
            }

        } catch (error) {
            Utils.handleError(error, 'createSkeleton');
        }
    }

    // Remove skeleton
    removeSkeleton(element) {
        try {
            if (!element) return;

            const skeletons = element.querySelectorAll('.skeleton');
            skeletons.forEach(skeleton => skeleton.remove());
        } catch (error) {
            Utils.handleError(error, 'removeSkeleton');
        }
    }

    // Sound effects
    playSound(type = 'click') {
        try {
            if (!config.get('ui.enableSounds')) return;

            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            switch (type) {
                case 'click':
                    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
                    oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1);
                    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
                    break;

                case 'success':
                    oscillator.frequency.setValueAtTime(523, audioContext.currentTime); // C5
                    oscillator.frequency.setValueAtTime(659, audioContext.currentTime + 0.1); // E5
                    oscillator.frequency.setValueAtTime(784, audioContext.currentTime + 0.2); // G5
                    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
                    break;

                case 'error':
                    oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
                    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
                    break;
            }

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.3);

        } catch (error) {
            // Audio not supported or blocked
        }
    }

    // Haptic feedback
    vibrate(pattern = 50) {
        try {
            Utils.vibrate(pattern);
        } catch (error) {
            Utils.handleError(error, 'vibrate');
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AnimationManager;
} else {
    // Make available globally
    window.AnimationManager = AnimationManager;
}
