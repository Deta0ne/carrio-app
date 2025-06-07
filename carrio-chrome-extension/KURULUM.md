# 🚀 Carrio Chrome Eklentisi Kurulum Kılavuzu

Bu kılavuz Carrio Chrome eklentisini adım adım nasıl kuracağınızı gösterir.

## 📋 Ön Gereksinimler

1. **Google Chrome** tarayıcısı (versiyon 88+)
2. **Carrio hesabı** - [carrio.app](http://localhost:3000) üzerinden kayıt olun
3. **Developer Mode** erişimi (test için)

## 🔧 Kurulum Adımları

### Adım 1: Eklenti Dosyalarını Hazırlama

1. Bu repository'yi bilgisayarınıza indirin
2. `carrio-chrome-extension` klasörünü masaüstüne kopyalayın

### Adım 2: Chrome Developer Mode'u Aktifleştirme

1. Chrome tarayıcınızı açın
2. Adres çubuğuna `chrome://extensions/` yazın ve Enter'a basın
3. Sağ üst köşede **"Developer mode"** toggle'ını açın (ON konumuna getirin)

### Adım 3: Eklentiyi Yükleme

1. **"Load unpacked"** (Paketlenmemiş öğe yükle) butonuna tıklayın
2. Açılan pencerede `carrio-chrome-extension` klasörünü seçin
3. **"Select Folder"** (Klasör Seç) butonuna tıklayın

### Adım 4: Eklentiyi Aktifleştirme

1. Eklenti yüklendikten sonra extensions listesinde "Carrio Job Tracker" görünecektir
2. Eklentinin **"Enable"** (Etkinleştir) seçeneğinin açık olduğundan emin olun
3. Chrome toolbar'ında Carrio eklentisi görünecektir (icon geçici olarak kaldırıldı)

## 🔑 Authentication Kurulumu

### Carrio Hesabınızla Giriş

1. Yeni bir Chrome sekmesi açın
2. [http://localhost:3000](http://localhost:3000) adresine gidin (veya production URL)
3. Carrio hesabınızla giriş yapın
4. Dashboard'a erişebildiğinizden emin olun

### Eklenti Bağlantısını Test Etme

1. Toolbar'daki Carrio simgesine tıklayın
2. "Checking Authentication..." mesajından sonra "✅ Authenticated" görmelisiniz
3. Eğer "❌ Not Authenticated" görüyorsanız:
    - Carrio'ya giriş yaptığınızdan emin olun
    - "Refresh Connection" butonuna tıklayın
    - Tarayıcıyı yeniden başlatın

## 🎯 İlk Kullanım

### LinkedIn'de Test Etme

1. [LinkedIn Jobs](https://www.linkedin.com/jobs/) sayfasına gidin
2. Herhangi bir iş ilanına tıklayın
3. Carrio eklenti simgesine tıklayın
4. "📍 Current Page" bölümünde "✅ LinkedIn Jobs page detected" görmelisiniz

### Job Tracking Test

1. LinkedIn job posting sayfasında iken
2. Eklenti popup'ında "🧪 Test Job Tracking" butonuna tıklayın
3. "Job details extracted successfully!" mesajını görmelisiniz
4. Eğer hata alıyorsanız, tam bir job posting sayfasında olduğunuzdan emin olun

### Otomatik Tracking

1. LinkedIn'de bir job posting'e gidin
2. "Apply" veya "Easy Apply" butonuna tıklayın
3. Sağ üst köşede "✅ Başvuru Takip Edildi!" bildirimi görünecektir
4. Carrio dashboard'unuzda yeni application'ı görebilirsiniz

## 🐛 Sorun Giderme

### Eklenti Görünmüyor

-   Chrome'u yeniden başlatın
-   `chrome://extensions/` sayfasında eklentinin "Enabled" olduğundan emin olun
-   Eklentiyi disable/enable yapın

### Authentication Çalışmıyor

-   Carrio'da logout/login yapın
-   Chrome'daki cookie'leri temizleyin ve tekrar giriş yapın
-   Developer console'da error mesajlarını kontrol edin

### Job Detection Çalışmıyor

-   Tam bir LinkedIn job posting URL'inde olduğunuzdan emin olun
-   Sayfa tamamen yüklenmeyi bekleyin
-   F12 > Console'da error mesajlarını kontrol edin

### Debug Etme

1. Eklenti simgesine sağ tık > "Inspect popup"
2. LinkedIn sayfasında F12 > Console
3. `chrome://extensions/` > Carrio eklentisi > "Service Worker" linkine tıklayın

## 📞 Destek

Sorun yaşıyorsanız:

1. Console error mesajlarının screenshot'ını alın
2. Hangi adımda problem olduğunu belirtin
3. GitHub Issues'a ticket açın veya support@carrio.app'e email gönderin

## 🔄 Güncelleme

Eklentiyi güncellemek için:

1. Yeni dosyaları indirin
2. `chrome://extensions/` sayfasında Carrio eklentisinin "🔄" butonuna tıklayın
3. Veya eklentiyi remove edip yeniden yükleyin

---

✅ **Kurulum tamamlandı!** Artık LinkedIn'de iş başvurularınızı otomatik olarak takip edebilirsiniz.
