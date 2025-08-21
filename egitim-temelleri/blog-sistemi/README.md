# Blog Sistemi

Node.js core modülleri kullanarak geliştirilmiş basit bir blog sistemi.

## Özellikler

- HTTP server ile RESTful API
- Dosya tabanlı veri saklama (JSON)
- Event-driven mimari (EventEmitter)
- Blog okuma sayacı
- Arama fonksiyonu
- En çok okunan blogları listeleme
- Aktivite log kaydı

## Kurulum

1. Projeyi klonlayın veya indirin
2. Proje dizinine gidin:
```bash
cd blog-sistemi
```

3. Sunucuyu başlatın:
```bash
node index.js
```

Sunucu `http://localhost:3000` adresinde çalışacaktır.

## API Endpoint'leri

### Ana Sayfa
```
GET /
```
Blog sisteminin ana sayfasını gösterir.

### Tüm Blogları Listeleme
```
GET /blogs
```
Tüm blog yazılarını JSON formatında döner.

**Örnek Yanıt:**
```json
{
  "blogs": [
    {
      "id": "1",
      "title": "Blog Başlığı",
      "content": "Blog içeriği...",
      "date": "2025-01-20",
      "readCount": 5
    }
  ],
  "count": 1
}
```

### Belirli Bir Blogu Okuma
```
GET /blog/:id
```
ID'si verilen blogu getirir ve okuma sayacını artırır.

**Örnek İstek:**
```
GET /blog/1
```

### Yeni Blog Oluşturma
```
POST /create
Content-Type: application/json

{
  "title": "Yeni Blog Başlığı",
  "content": "Blog içeriği..."
}
```

**Örnek Yanıt:**
```json
{
  "message": "Blog created successfully",
  "blog": {
    "id": "1737358412345",
    "title": "Yeni Blog Başlığı",
    "content": "Blog içeriği...",
    "date": "2025-01-20",
    "readCount": 0
  }
}
```

### Blog Silme
```
DELETE /blog/:id
```
ID'si verilen blogu siler.

### En Çok Okunan Bloglar
```
GET /top
```
En çok okunan 5 blogu listeler.

### Blog Arama
```
GET /search?q=arama_terimi
```
Blog başlık ve içeriklerinde arama yapar.

**Örnek İstek:**
```
GET /search?q=node
```

## Dosya Yapısı

```
blog-sistemi/
├── index.js          # Ana sunucu dosyası
├── blogManager.js    # Blog yönetim sınıfı
├── blogs/           # Blog JSON dosyaları
│   ├── blog-1.json
│   ├── blog-2.json
│   └── blog-3.json
├── logs/            # Aktivite logları
│   └── activity.log
├── public/          # Statik dosyalar
│   └── 404.html
├── package.json
└── README.md
```

## Kullanım Örnekleri

### cURL ile Kullanım

**Tüm blogları listeleme:**
```bash
curl http://localhost:3000/blogs
```

**Belirli bir blogu okuma:**
```bash
curl http://localhost:3000/blog/1
```

**Yeni blog oluşturma:**
```bash
curl -X POST http://localhost:3000/create \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Blog","content":"Bu bir test blog yazısıdır."}'
```

**Blog arama:**
```bash
curl http://localhost:3000/search?q=javascript
```

**Blog silme:**
```bash
curl -X DELETE http://localhost:3000/blog/1
```

## Event Sistemi

BlogManager sınıfı şu event'leri destekler:

- `blogCreated` - Yeni blog oluşturulduğunda
- `blogRead` - Blog okunduğunda
- `blogDeleted` - Blog silindiğinde

Tüm event'ler `logs/activity.log` dosyasına kaydedilir.

## Teknik Detaylar

### Kullanılan Node.js Modülleri

- `http` - Web sunucusu oluşturmak için
- `fs` - Dosya okuma/yazma işlemleri için
- `path` - Dosya yollarını yönetmek için
- `events` - Event-driven programlama için
- `url` - URL parsing için

### Özellikler

- Asenkron dosya işlemleri
- Error handling
- JSON veri formatı
- RESTful API tasarımı
- CORS desteği

## Geliştirme Notları

- Blog ID'leri timestamp kullanılarak otomatik oluşturulur
- Dosya isimleri `blog-{id}.json` formatındadır
- Tüm tarihler ISO format kullanır (YYYY-MM-DD)
- Log dosyası ISO 8601 timestamp formatı kullanır

## Lisans

Bu proje eğitim amaçlı oluşturulmuştur.