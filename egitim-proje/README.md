# E‑Ticaret Sistemi API

Node.js Bootcamp Bitirme Projesi

---

> Bu README, **Node.js + Express + MongoDB** kullanarak uçtan uca bir **E‑Ticaret REST API** geliştirmen için **adım adım** yönlendirme sağlar. Kurulumdan  doğrulamadan güvenliğe ve dokümantasyona kadar tüm gereksinimleri kapsar.

## İçindekiler

1. [Özellikler](#özellikler)
2. [Teknik Yığın](#teknik-yığın)
3. [Ön Koşullar](#ön-koşullar)
4. [Hızlı Başlangıç](#hızlı-başlangıç)
5. [Dizin Yapısı](#dizin-yapısı)
6. [Çevre Değişkenleri](#çevre-değişkenleri)
7. [Çalıştırma Komutları (NPM Scripts)](#çalıştırma-komutları-npm-scripts)
8. [Veritabanı Modelleri](#veritabanı-modelleri)
9. [Kimlik Doğrulama & Yetkilendirme](#kimlik-doğrulama--yetkilendirme)
10. [Orta Katmanlar (Middleware)](#orta-katmanlar-middleware)
11. [Endpoint Tasarımı](#endpoint-tasarımı)
12. [Validasyon (express-validator)](#validasyon-express-validator)
13. [Hata Yönetimi & Loglama](#hata-yönetimi--loglama)
14. [Güvenlik Önlemleri](#güvenlik-önlemleri)
15. [Dokümantasyon (Swagger & Postman)](#dokümantasyon-swagger--postman)
16. [Seed (Örnek Veri) & Admin Oluşturma](#seed-örnek-veri--admin-oluşturma)
18. [Git Akışı & Commit Mesajları](#git-akışı--commit-mesajları)
19. [CI (İsteğe Bağlı)](#ci-isteğe-bağlı)
20. [Sık Karşılaşılan Sorunlar](#sık-karşılaşılan-sorunlar)
21. [Lisans](#lisans)

---

## Özellikler

* Kullanıcı kayıt, giriş, **JWT** ile erişim & **Yenileme (Refresh)** token yapısı
* Rol tabanlı yetkilendirme (**admin**, **customer**)
* Ürün & Kategori CRUD (admin)
* Ürün listeleme, arama, filtreleme, kategoriye göre filtre
* Sipariş oluşturma, sipariş listeleme (kullanıcıya özel)
* Ürünlere **yorum** & **puanlama**
* **Validasyon**, **global hata yönetimi**, **loglama**
* **Rate limiting**, **Helmet**, **CORS**, **input sanitization**, **bcrypt** ile şifreleme
* **Swagger UI** ve/veya **Postman** koleksiyonu
* **Seed** komutu ile örnek veri

## Teknik Yığın

* **Dil/Runtime:** Node.js (LTS), JavaScript (CommonJS)
* **Framework:** Express.js
* **Veritabanı:** MongoDB + Mongoose
* **Kimlik Doğrulama:** JWT (Access & Refresh)
* **Validasyon:** express-validator
* **Güvenlik:** helmet, cors, express-rate-limit, xss-clean, mongo-sanitize, hpp, bcrypt
* **Loglama:** morgan (dev), winston (prod)
* **Dokümantasyon:** Swagger (OpenAPI 3), Postman

## Ön Koşullar

* Node.js (>= 18) & npm/yarn
* MongoDB (lokal veya Atlas)
* Git

## Hızlı Başlangıç

```bash
# 1) Projeyi klonla
git clone https://github.com/<kullanıcı>/<repo-adi>.git
cd <repo-adi>

# 2) Bağımlılıkları yükle
npm install

# 3) Çevre değişkenlerini ayarla
cp .env.example .env
# .env içeriğini düzenle (aşağıya bak)

# 4) Geliştirme modunda çalıştır
npm run dev

# 5) Swagger arayüzü
# Tarayıcıda: http://localhost:5000/api/docs
```

> **Not:** MongoDB bağlantısının başarılı olması için `.env` içindeki `MONGO_URI` doğru olmalıdır.

## Dizin Yapısı

```
├─ src
│  ├─ config
│  │  ├─ db.js
│  │  └─ logger.js
│  ├─ models
│  │  ├─ User.js
│  │  ├─ Product.js
│  │  ├─ Category.js
│  │  ├─ Order.js
│  │  └─ Review.js
│  ├─ middlewares
│  │  ├─ auth.js
│  │  ├─ error.js
│  │  ├─ validate.js
│  │  └─ security.js
│  ├─ controllers
│  │  ├─ auth.controller.js
│  │  ├─ user.controller.js
│  │  ├─ product.controller.js
│  │  ├─ category.controller.js
│  │  ├─ order.controller.js
│  │  └─ review.controller.js
│  ├─ routes
│  │  ├─ auth.routes.js
│  │  ├─ user.routes.js
│  │  ├─ product.routes.js
│  │  ├─ category.routes.js
│  │  ├─ order.routes.js
│  │  └─ review.routes.js
│  ├─ utils
│  │  ├─ ApiError.js
│  │  ├─ ApiResponse.js
│  │  ├─ asyncHandler.js
│  │  └─ tokens.js
│  ├─ docs
│  │  ├─ swagger.json
│  │  └─ postman_collection.json
│  ├─ app.js
│  └─ server.js
├─ scripts
│  └─ seed.js
├─ .env.example
├─ package.json
├─ README.md
└─ .gitignore
```

## Çevre Değişkenleri

`.env.example` örneği:

```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/ecommerce_db
CLIENT_URL=http://localhost:5173

# JWT
JWT_ACCESS_SECRET=supersecretaccess
JWT_REFRESH_SECRET=supersecretrefresh
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=7d

# Güvenlik
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100
CORS_ORIGINS=http://localhost:5173
```

Açıklamalar:

* `CLIENT_URL`: CORS için izin verilecek istemci adresi.
* `JWT_*`: Access/Refresh token üretimi için sırlar ve süreler.
* `RATE_LIMIT_*`: Brute force saldırılarına karşı istek sınırlama.

## Çalıştırma Komutları (NPM Scripts)

`package.json` önerisi:

```json
{
  "scripts": {
    "dev": "nodemon src/server.js",
    "start": "node src/server.js",
    "lint": "eslint .",
    "seed": "node scripts/seed.js",
    "docs": "node ./scripts/build-swagger.js"
  }
}
```

## Veritabanı Modelleri

> Aşağıdaki örnekler Mongoose şemaları içindir. İhtiyaca göre alanları genişletebilirsin.

### User.js

```js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
    refreshTokens: [{ type: String }]
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model('User', userSchema);
```

### Category.js

```js
const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, required: true, unique: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Category', categorySchema);
```

### Product.js

```js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0 },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    images: [{ type: String }],
    averageRating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
```

### Review\.js

```js
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, trim: true }
  },
  { timestamps: true }
);

reviewSchema.index({ user: 1, product: 1 }, { unique: true }); // kullanıcı başına ürün için tek yorum

module.exports = mongoose.model('Review', reviewSchema);
```

### Order.js

```js
const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  title: String,
  price: Number,
  quantity: { type: Number, default: 1 }
});

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [orderItemSchema],
    shippingAddress: {
      fullName: String,
      phone: String,
      addressLine: String,
      city: String,
      country: String,
      postalCode: String
    },
    payment: {
      method: { type: String, enum: ['cod', 'card'], default: 'cod' },
      status: { type: String, enum: ['pending', 'paid', 'refunded'], default: 'pending' }
    },
    status: { type: String, enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'], default: 'pending' },
    totalAmount: { type: Number, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
```

## Kimlik Doğrulama & Yetkilendirme

* **Kayıt / Giriş:** Email + şifre ile. Şifreler `bcrypt` ile hashlenir.
* **JWT:**

  * **Access Token:** Kısa ömürlü (örn. `15m`), `Authorization: Bearer <token>` ile.
  * **Refresh Token:** Uzun ömürlü (örn. `7d`), httpOnly cookie veya DB’de tutulur (`User.refreshTokens`).
* **Token Yenileme:** `/api/auth/refresh` endpoint’i ile yeni access token üret.
* **Çıkış:** Refresh token’ı DB’den sil, cookie temizle.
* **Rol Tabanlı Yetki:** `authorize('admin')` gibi middleware ile rota koruması.

### Örnek: tokens.js

```js
const jwt = require('jsonwebtoken');

const signAccessToken = (payload) =>
  jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: process.env.JWT_ACCESS_EXPIRES || '15m' });

const signRefreshToken = (payload) =>
  jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRES || '7d' });

module.exports = { signAccessToken, signRefreshToken };
```

### Örnek: auth.js (middleware)

```js
const jwt = require('jsonwebtoken');
const ApiError = require('../utils/ApiError');

const authenticate = (req, _res, next) => {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token) return next(new ApiError(401, 'Yetkisiz'));
  try {
    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.user = payload; // { id, role }
    next();
  } catch (e) {
    next(new ApiError(401, 'Geçersiz veya süresi geçmiş token'));
  }
};

const authorize = (...roles) => (req, _res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return next(new ApiError(403, 'Bu işlem için yetkiniz yok'));
  }
  next();
};

module.exports = { authenticate, authorize };
```

## Orta Katmanlar (Middleware)

* **security.js:** helmet, cors, rate limit, sanitization, hpp
* **validate.js:** express-validator sonuçlarını yakalar
* **error.js:** global hata yakalayıcı

### Örnek: security.js

```js
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');

module.exports = (app) => {
  app.use(helmet());
  app.use(cors({ origin: (process.env.CORS_ORIGINS || '').split(','), credentials: true }));
  app.use(xss());
  app.use(mongoSanitize());
  app.use(hpp());
  app.use(
    rateLimit({
      windowMs: Number(process.env.RATE_LIMIT_WINDOW || 15) * 60 * 1000,
      max: Number(process.env.RATE_LIMIT_MAX || 100)
    })
  );
};
```

### Örnek: error.js

```js
const ApiError = require('../utils/ApiError');

// 404
const notFound = (_req, _res, next) => next(new ApiError(404, 'Endpoint bulunamadı'));

// Global handler
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, _req, res, _next) => {
  const status = err.statusCode || 500;
  const payload = {
    success: false,
    message: err.message || 'Sunucu hatası',
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  };
  res.status(status).json(payload);
};

module.exports = { notFound, errorHandler };
```

## Endpoint Tasarımı

> Tüm endpoint’ler `/api` altında versiyonlanabilir: örn. `/api/v1/...`

### Auth

| Yöntem | Yol                  | Açıklama            |
| ------ | -------------------- | ------------------- |
| POST   | `/api/auth/register` | Kayıt (customer)    |
| POST   | `/api/auth/login`    | Giriş               |
| POST   | `/api/auth/refresh`  | Access token yenile |
| POST   | `/api/auth/logout`   | Çıkış               |

**Örnek (cURL):**

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H 'Content-Type: application/json' \
  -d '{"name":"Ali Veli","email":"ali@example.com","password":"Passw0rd!"}'
```

### Kullanıcı

| Yöntem | Yol              | Açıklama                  | Yetki |
| ------ | ---------------- | ------------------------- | ----- |
| GET    | `/api/users/me`  | Profilimi getir           | Auth  |
| GET    | `/api/users`     | Kullanıcıları listele     | Admin |
| PATCH  | `/api/users/:id` | Kullanıcı rolünü güncelle | Admin |

### Kategori (Admin)

| Yöntem | Yol                   | Açıklama          | Yetki  |
| ------ | --------------------- | ----------------- | ------ |
| POST   | `/api/categories`     | Kategori oluştur  | Admin  |
| GET    | `/api/categories`     | Kategori listele  | Herkes |
| PATCH  | `/api/categories/:id` | Kategori güncelle | Admin  |
| DELETE | `/api/categories/:id` | Kategori sil      | Admin  |

### Ürünler

| Yöntem | Yol                 | Açıklama                                             | Yetki  |
| ------ | ------------------- | ---------------------------------------------------- | ------ |
| GET    | `/api/products`     | Liste + **arama** (`q`), **filtre** ve **sayfalama** | Herkes |
| GET    | `/api/products/:id` | Detay                                                | Herkes |
| POST   | `/api/products`     | Ürün ekle                                            | Admin  |
| PATCH  | `/api/products/:id` | Ürün güncelle                                        | Admin  |
| DELETE | `/api/products/:id` | Ürün sil                                             | Admin  |

**Örnek filtreleme:** `/api/products?category=phones&minPrice=1000&maxPrice=5000&sort=price:asc&page=1&limit=12&q=iphone`

### Yorumlar

| Yöntem | Yol                         | Açıklama                 | Yetki  |
| ------ | --------------------------- | ------------------------ | ------ |
| POST   | `/api/products/:id/reviews` | Ürüne yorum yap          | Auth   |
| GET    | `/api/products/:id/reviews` | Ürün yorumlarını listele | Herkes |

### Siparişler

| Yöntem | Yol               | Açıklama                    | Yetki |
| ------ | ----------------- | --------------------------- | ----- |
| POST   | `/api/orders`     | Sipariş oluştur             | Auth  |
| GET    | `/api/orders/my`  | Kendi siparişlerimi listele | Auth  |
| GET    | `/api/orders`     | Tüm siparişleri listele     | Admin |
| PATCH  | `/api/orders/:id` | Sipariş durumunu güncelle   | Admin |

## Validasyon (express-validator)

### validate.js (örnek sonuç yakalama)

```js
const { validationResult } = require('express-validator');
const ApiError = require('../utils/ApiError');

const validate = (req, _res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const message = errors.array().map(e => `${e.param}: ${e.msg}`).join(', ');
    return next(new ApiError(422, message));
  }
  next();
};

module.exports = validate;
```

### Auth doğrulamaları (örnek)

```js
const { body } = require('express-validator');

const registerValidators = [
  body('name').notEmpty().withMessage('İsim zorunlu'),
  body('email').isEmail().withMessage('Geçerli email giriniz'),
  body('password').isLength({ min: 6 }).withMessage('Şifre min 6 karakter')
];

module.exports = { registerValidators };
```

## Hata Yönetimi & Loglama

* **ApiError**: Tutarlı hata üretimi
* **Global handler**: JSON hata çıktısı (status, message, stack dev’de)
* **morgan**: Geliştirmede HTTP logları
* **winston**: Üretimde dosyaya/sunucuya log

### ApiError.js

```js
class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}
module.exports = ApiError;
```

### logger.js (öneri)

```js
const { createLogger, transports, format } = require('winston');

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.json()
  ),
  transports: [new transports.Console()]
});

module.exports = logger;
```

## Güvenlik Önlemleri

* **Helmet**: Güvenlik başlıkları
* **CORS**: İzin verilen origin’ler
* **Rate Limiting**: Brute force’a karşı
* **XSS Clean**: XSS’e karşı
* **Mongo Sanitize**: NoSQL injection’a karşı
* **HPP**: HTTP parametre kirlenmesi
* **bcrypt**: Şifre hash
* **Cookie (opsiyonel)**: Refresh token httpOnly

## Dokümantasyon (Swagger & Postman)

* **Swagger UI**: `/api/docs`
* **OpenAPI** dosyası: `src/docs/swagger.json`
* **Postman** koleksiyonu: `src/docs/postman_collection.json`

