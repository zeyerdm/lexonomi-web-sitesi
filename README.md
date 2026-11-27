# Lexonomi — Hukuk Analitiği Platformu Web Sitesi

Hukukçular, mali müşavirler ve bilirkişiler için geliştirilen **Lexonomi** platformunun kurumsal tanıtım web sitesi ve UI/UX tasarım çalışması.

> **Rol:** Bu depoda projenin kullanıcı deneyimi (UX) ve kullanıcı arayüzü (UI) tasarımı ile statik ön yüz (HTML / CSS / JavaScript) yapısı yer almaktadır.  
> **Canlı Site:** [https://lexonomi.com/](https://lexonomi.com/)

---

## Öne Çıkan Özellikler

- **Sinematik Hero Video:** Arka plan videosu, poster görseli ve duraklat/oynat kontrolü ([`hero-media.js`](hero-media.js)).
- **Otomatik Açık / Koyu Tema:** İşletim sistemi tercihine göre (`prefers-color-scheme`) otomatik tema geçişi ve `#2B7A8A` / `#CADCE1` / `#C4A879` marka renk sistemi.
- **Etkileşimli Modül Önizlemeleri:** Kaynak Arama (`İlgi`, `Güncel`, `Kelime` sıralama ve karar içi arama), Hukuki Araştırma, Belge Geliştirme (`Atıf` / `Öneriler` / `OCR`) ve İçtihat Radarı.
- **Canlı Hesap Paneli:**
  - **2026–2027 AAÜT** vekâlet ücreti hesaplayıcı (kademeli tarife + kabul edilen miktar desteği)
  - **Faiz**, **Adli Süre** (hafta sonu uzatma kurallı) ve **Harç** hesaplayıcıları
  - Paket kota (`Temel`, `Uzman`, `Profesyonel`), ajanda ve fatura önizlemesi
- **Gizlilik ve Veri Güvenliği:** Yerel sunucuda çalışan yapay zekâ, künyelerde sıfır halüsinasyon, Baro ilkelerine uyum ve TÜBİTAK Ar-Ge vurguları.
- **Blog ve Video Sayfaları:** Makale şablonu ([`blog/`](blog/)), kategori/kelime filtreleme ve ürün tanıtım videosu sayfası ([`video/`](video/)).

---

## Dosya Yapısı

```text
├── index.html          # Ana sayfa
├── styles.css          # Tasarım sistemi, responsive düzen ve açık/koyu tema
├── app.js              # Modül sekmeleri, hesaplayıcılar, filtreleme ve kaydırma etkileşimleri
├── hero-media.js       # Hero video/poster ve uygulama giriş/kayıt bağlantıları
├── blog/               # Blog dizini ve makale sayfaları
├── video/              # Tanıtım videosu sayfası
├── assets/             # Video, poster, meslek ve kapak görselleri, ikonlar
├── robots.txt
└── sitemap.xml
```

---

## Konfigürasyon ve Yerel Önizleme

- Giriş/kayıt bağlantıları ve hero video yolları [`hero-media.js`](hero-media.js) içindeki `LEXONOMI_LINKS` ve `LEXONOMI_HERO_MEDIA` nesnelerinden yönetilir.
- Herhangi bir derleme adımı gerekmez; `index.html` dosyasını doğrudan tarayıcıda veya yerel bir HTTP sunucusuyla (`npx serve .`) açarak önizleyebilirsiniz.
