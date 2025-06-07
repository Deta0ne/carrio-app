# 🚀 Carrio Chrome Extension

LinkedIn üzerinde iş başvurularınızı otomatik olarak takip eden Chrome eklentisi.

## 🌟 Özellikler

-   **Otomatik Takip**: LinkedIn'de "Apply" veya "Easy Apply" butonuna tıkladığınızda otomatik olarak başvurunuzu Carrio hesabınıza kaydeder
-   **Çoklu Dil Desteği**: Türkçe ve İngilizce LinkedIn arayüzlerini destekler
-   **Duplicate Detection**: Aynı pozisyon için tekrar başvuru yapmaya çalışırsanız uyarı verir
-   **Real-time Notifications**: Başvuru durumu hakkında anlık bildirimler
-   **Dashboard Entegrasyonu**: Carrio dashboard'unuzla tam entegrasyon

## 📦 Kurulum

### Chrome Web Store'dan (Gelecekte)

1. Chrome Web Store'da "Carrio Job Tracker" araması yapın
2. "Add to Chrome" butonuna tıklayın
3. Carrio hesabınızla giriş yapın

### Manuel Kurulum (Developer Mode)

1. Bu repository'yi clone edin:

    ```bash
    git clone [repository-url]
    cd carrio-app/carrio-chrome-extension
    ```

2. Chrome'da Extensions sayfasını açın:

    - `chrome://extensions/` adresine gidin
    - Sağ üst köşede "Developer mode" toggle'ını açın

3. Eklentiyi yükleyin:

    - "Load unpacked" butonuna tıklayın
    - `carrio-chrome-extension` klasörünü seçin

4. Eklenti simgesi toolbar'da görünecektir

## 🚀 Kullanım

### İlk Kurulum

1. Eklenti kurulumu sonrası Carrio hesabınızla giriş yapın
2. LinkedIn Jobs sayfasına gidin
3. Eklenti simgesine tıklayarak bağlantı durumunu kontrol edin

### Job Application Tracking

1. LinkedIn'de herhangi bir iş ilanına gidin
2. "Apply" veya "Easy Apply" butonuna tıklayın
3. Eklenti otomatik olarak iş bilgilerini çıkarır ve Carrio hesabınıza kaydeder
4. Sağ üst köşede bildirim görünecektir

### Manual Testing

1. LinkedIn job posting sayfasında eklenti popup'ını açın
2. "Test Job Tracking" butonuna tıklayın
3. İş bilgilerinin doğru çıkarıldığını kontrol edin

## 🔧 Konfigürasyon

### API Endpoint Değiştirme

Production için `background.js` ve `popup.js` dosyalarındaki `API_BASE_URL` değerini güncelleyin:

```javascript
const CONFIG = {
    API_BASE_URL: 'https://your-production-domain.com', // Production URL
    DEBUG: false, // Production'da debug'ı kapatın
};
```

### Supported Selectors

Eklenti LinkedIn'in farklı selector'larını destekler. `content.js` dosyasındaki `CONFIG.SELECTORS` objesini güncelleyerek yeni selector'lar ekleyebilirsiniz.

## 🛠️ Geliştirme

### Dosya Yapısı

```
carrio-chrome-extension/
├── manifest.json      # Extension configuration
├── background.js      # Service worker
├── content.js         # LinkedIn page injection script
├── popup.html         # Extension popup UI
├── popup.js           # Popup functionality
├── icons/             # Extension icons
└── README.md          # This file
```

### Debug Etme

1. Developer mode'da eklentiyi yükleyin
2. Background script için: `chrome://extensions/` > "Service Worker" linkine tıklayın
3. Content script için: LinkedIn sayfasında F12 > Console
4. Popup için: Eklenti simgesine sağ tık > "Inspect popup"

### Testing

1. LinkedIn'de test job posting'i açın
2. Console'da debug loglarını kontrol edin
3. Eklenti popup'ında "Test Job Tracking" fonksiyonunu kullanın

## 🔐 Güvenlik

-   Eklenti sadece LinkedIn job pages'lerde çalışır
-   Authentication için Supabase cookie'lerini kullanır
-   Hassas veriler local storage'da tutulmaz
-   API çağrıları HTTPS üzerinden yapılır

## ⚡ Performans

-   Lightweight: ~50KB total size
-   Minimal memory footprint
-   Sadece LinkedIn job pages'lerde aktif
-   Efficient DOM watching with debounced updates

## 🐛 Sorun Giderme

### Eklenti Çalışmıyor

1. Developer mode aktif mi kontrol edin
2. Extension reload edin
3. LinkedIn sayfasını yenileyin
4. Console'da error mesajlarını kontrol edin

### Authentication Sorunları

1. Carrio hesabınızla giriş yaptığınızdan emin olun
2. "Refresh Connection" butonunu deneyin
3. Cookie'lerin silinmediğinden emin olun

### Job Detection Sorunları

1. Doğru LinkedIn job posting page'inde olduğunuzdan emin olun
2. Sayfa tamamen yüklendiğinden emin olun
3. "Test Job Tracking" ile extraction'ı test edin

## 📞 Destek

-   🐛 Bug reports: GitHub Issues
-   💡 Feature requests: GitHub Discussions
-   📧 Email: support@carrio.app
-   💬 Discord: [Carrio Community]

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 🔄 Güncelleme Notları

### v1.0.0

-   İlk release
-   LinkedIn job tracking
-   Türkçe/İngilizce dil desteği
-   Carrio dashboard entegrasyonu
-   Real-time notifications

---

Made with ❤️ by Carrio Team
