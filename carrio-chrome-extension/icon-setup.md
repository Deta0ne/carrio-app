# 🎨 Carrio Extension Icons Kurulum Kılavuzu

Icon dosyaları manifest.json'dan geçici olarak kaldırıldı. Eklenti çalışır durumda ama daha iyi görünüm için icon'ları eklemeniz önerilir.

## 🚀 Hızlı Icon Oluşturma

### Yöntem 1: Online Tool (Önerilen)

1. [https://favicon.io/favicon-generator/](https://favicon.io/favicon-generator/) sitesine gidin
2. Ayarlar:
    - **Text**: 🚀 (roket emoji)
    - **Background**: Gradient (#667eea to #764ba2)
    - **Font Family**: "Roboto"
    - **Font Size**: 50-60
3. "Generate" butonuna tıklayın
4. ZIP dosyasını indirin ve çıkarın

### Yöntem 2: Canva

1. [Canva.com](https://canva.com)'a gidin
2. "Custom Size" 128x128px seçin
3. 🚀 emoji ekleyin ve gradient background kullanın
4. PNG olarak export edin
5. Online resizer tool ile 16px, 32px, 48px boyutları oluşturun

## 📁 Dosya Yerleştirme

İndirdiğiniz icon'ları şu isimlerle `carrio-chrome-extension/icons/` klasörüne koyun:

```
icons/
├── icon16.png   (16x16px)
├── icon32.png   (32x32px)
├── icon48.png   (48x48px)
└── icon128.png  (128x128px)
```

## 🔧 Manifest.json Güncelleme

Icon dosyalarını ekledikten sonra manifest.json'a şu kısımları ekleyin:

```json
{
    "action": {
        "default_popup": "popup.html",
        "default_title": "Carrio Job Tracker",
        "default_icon": {
            "16": "icons/icon16.png",
            "32": "icons/icon32.png",
            "48": "icons/icon48.png",
            "128": "icons/icon128.png"
        }
    },
    "icons": {
        "16": "icons/icon16.png",
        "32": "icons/icon32.png",
        "48": "icons/icon48.png",
        "128": "icons/icon128.png"
    }
}
```

## ✅ Test Etme

1. Icon dosyalarını ekleyin
2. Manifest.json'ı güncelleyin
3. Chrome'da eklentiyi reload edin: `chrome://extensions/` > 🔄 buton
4. Toolbar'da Carrio simgesinin göründüğünü kontrol edin

## 🎨 Tasarım Önerileri

-   **Renk Paleti**: #667eea, #764ba2 (Carrio brand colors)
-   **Symbol**: 🚀 rocket emoji veya "C" harfi
-   **Style**: Modern, minimal, görünür
-   **Background**: Şeffaf veya gradient

---

**Not**: İcon'lar olmadan da eklenti tam fonksiyonel çalışır. Bu sadece görsel iyileştirme içindir.
