# 🔐 Güçlü Şifre Üreteci

[![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)](https://github.com/username/password-generator)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![GitHub Stars](https://img.shields.io/github/stars/username/password-generator.svg)](https://github.com/username/password-generator/stargazers)

> Modern, güvenli ve kullanıcı dostu şifre üreteci. Tüm verileriniz cihazınızda yerel olarak saklanır.

## ✨ Özellikler

- 🔒 **Güçlü Şifre Üretimi** - Matematiksel algoritmalar ile güvenli şifreler
- 📊 **Gerçek Zamanlı Analiz** - Şifre gücünü anında değerlendirme
- 💾 **Local Storage** - Tüm veriler tarayıcınızda güvenli saklanır
- 🎨 **Modern UI** - Responsive tasarım ve dark/light tema desteği
- 📱 **Mobile Ready** - Dokunmatik cihazlar için optimize edilmiş
- 🚀 **Otomatik Kaydetme** - Tek tuşla üret ve kaydet
- 📂 **Kategori Yönetimi** - Şifrelerinizi organize edin
- ⚡ **Hızlı İşlemler** - Copy-paste ve drag-drop desteği

## 📋 Gereksinimler

- Modern web tarayıcısı (Chrome, Firefox, Safari, Edge)
- JavaScript etkin
- Local Storage desteği

## 🚀 Kurulum

### 1. Dosyaları İndirin
```bash
git clone https://github.com/username/password-generator.git
cd password-generator
```

### 2. Local Server Başlatın
```bash
# Python ile
python -m http.server 8000

# Node.js ile
npx serve .

# PHP ile
php -S localhost:8000
```

### 3. Tarayıcıda Açın
```
http://localhost:8000
```

## 📖 Kullanım

### Temel Kullanım
1. **Şifre Uzunluğu** ayarlayın (4-64 karakter)
2. **Karakter türleri** seçin (büyük/küçük harf, rakam, sembol)
3. **🔄 Yenile** butonuna tıklayın
4. **Güçlü şifre** üretildiğini görün
5. **💾 Kaydet** butonuna tıklayarak şifrenizi kaydedin

### Gelişmiş Özellikler
- **🚀 Otomatik Üret ve Kaydet** - Tek tuşla rastgele şifre üretip kaydet
- **📊 Güvenlik Analizi** - Şifrenizin gücünü gerçek zamanlı analiz
- **📂 Kategoriler** - Şifrelerinizi kategorilere ayırın
- **🌙 Dark Mode** - Koyu tema desteği
- **📱 Mobile Gestures** - Swipe hareketleri ile şifre üret

## 🏗️ Proje Yapısı

```
password-generator/
├── index.html          # Ana HTML dosyası
├── app.js             # Ana JavaScript uygulaması
├── styles.css         # CSS stilleri
├── constants.js       # Sabit değerler
├── config.js          # Yapılandırma ayarları
├── utils.js           # Yardımcı fonksiyonlar
├── validation.js      # Doğrulama fonksiyonları
├── storage.js         # Storage işlemleri
├── password.js        # Şifre üretimi
├── analysis.js        # Güvenlik analizi
├── animations.js      # Animasyonlar ve efektler
├── README.md          # Bu dosya
├── package.json       # Proje bilgileri
└── .gitignore         # Git ayarları
```

## 🔧 API Referansı

### PasswordGenerator Sınıfı
```javascript
const generator = new PasswordGenerator();

// Temel şifre üretimi
const password = generator.generate({
    length: 12,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true
});

// Çoklu şifre üretimi
const passwords = generator.generateMultiple(5, options);
```

### SecurityAnalyzer Sınıfı
```javascript
const analyzer = new SecurityAnalyzer();

// Şifre analizi
const analysis = analyzer.analyze('MyPassword123!');
console.log(analysis.strength); // "Güçlü"
console.log(analysis.score);    // 85
```

### StorageManager Sınıfı
```javascript
const storage = new StorageManager();

// Şifre kaydetme
const id = storage.savePassword({
    name: 'Gmail Hesabım',
    password: 'MyStrongPassword123!',
    category: 'personal'
});

// Şifreleri listeleme
const passwords = storage.getPasswords();
```

## 🎨 Özelleştirme

### Tema Değiştirme
```javascript
// Dark tema
document.body.classList.add('dark-theme');

// Light tema
document.body.classList.remove('dark-theme');
```

### Animasyonları Devre Dışı Bırakma
```javascript
config.set('ui.showAnimations', false);
```

### Yeni Karakter Seti Ekleme
```javascript
// constants.js dosyasında
CHAR_SETS: {
    CUSTOM: 'your-custom-characters'
}
```

## 🧪 Test

### Manuel Test
1. Tüm checkbox'ları işaretleyin
2. Şifre üretildiğini doğrulayın
3. Modal'ların açılıp kapandığını test edin
4. Dark/light tema geçişini kontrol edin

### Otomatik Test
```javascript
// Console'da test
console.log('Testing password generation...');
const testPassword = generator.generate({ length: 16 });
console.log('Generated password:', testPassword);
console.log('Analysis:', analyzer.analyze(testPassword));
```

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📝 Değişiklik Günlüğü

### v2.0.0 (Latest)
- ✅ Modüler yapıya geçiş
- ✅ Otomatik kaydetme özelliği
- ✅ Gelişmiş güvenlik analizi
- ✅ Dark theme iyileştirmeleri
- ✅ Mobile gesture desteği
- ✅ Performance optimizasyonları

### v1.5.0
- ✅ Kategori sistemi
- ✅ Export/Import özelliği
- ✅ Toast bildirimler
- ✅ Responsive tasarım

## 🐛 Sorun Bildirme

Herhangi bir sorunla karşılaştığınızda:

1. [Issues](https://github.com/username/password-generator/issues) sayfasına gidin
2. **New Issue** butonuna tıklayın
3. Sorunu detaylı açıklayın
4. Tarayıcı ve işletim sistemi bilgilerini ekleyin

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakın.

## 🙏 Teşekkürler

- [Zxcvbn](https://github.com/dropbox/zxcvbn) - Şifre gücü analizi için
- [Have I Been Pwned](https://haveibeenpwned.com/) - Güvenlik araştırmaları için
- [OWASP](https://owasp.org/) - Güvenlik en iyi uygulamaları için

## 📞 İletişim

- **GitHub:** [username/password-generator](https://github.com/username/password-generator)
- **Email:** contact@example.com
- **Twitter:** [@passwordgen](https://twitter.com/passwordgen)

---

⭐ **Star verin** ve projeyi takip edin!
