const Iyzipay = require("iyzipay");

// iyzico ayarları (Sandbox ortamı)
const iyzipay = new Iyzipay({
  apiKey: "sandbox-XZ4Ammnjh7vN3pz3HdnINBJ86vj4MOte",
  secretKey: "sandbox-PgcSITKSVrdkOipMabWLMPIENJGrHRi0",
  uri: "https://sandbox-api.iyzipay.com"
});

// Ödeme işlemini yapan controller
exports.makePayment = (req, res) => {
  const { 
    cardNumber, 
    expireMonth, 
    expireYear, 
    cvc, 
    cardHolderName = "Ali Veli",
    price = "100.0",
    paidPrice = "100.0"
  } = req.body;

  // Benzersiz conversation ID oluştur
  const conversationId = `conv_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;

  const paymentRequest = {
    locale: Iyzipay.LOCALE.TR,
    conversationId, // Benzersiz işlem kimliği
    price, // Decimal - Sepet toplam tutarı
    paidPrice, // Decimal - Müşteriden tahsil edilecek nihai tutar
    currency: Iyzipay.CURRENCY.TRY,
    installment: 1, // Integer - Taksit sayısı
    paymentChannel: Iyzipay.PAYMENT_CHANNEL.WEB,
    paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
    paymentCard: {
      cardHolderName, // String - Kart sahibinin adı
      cardNumber, // String - Kart numarası
      expireMonth, // String - Son kullanma ayı (2 haneli)
      expireYear, // String - Son kullanma yılı
      cvc, // String - CVC kodu
      registerCard: 0 // Integer - Kartı kaydet (0 veya 1)
    },
    buyer: {
      id: "BY789", // String - Alıcı ID'si
      name: "Ali", // String - Alıcı adı
      surname: "Veli", // String - Alıcı soyadı
      gsmNumber: "+905555555555", // String - GSM numarası
      email: "ali@example.com", // String - E-posta adresi
      identityNumber: "11111111111", // String - Kimlik numarası
      lastLoginDate: "2024-01-01 00:00:00", // String - Son giriş tarihi
      registrationDate: "2024-01-01 00:00:00", // String - Kayıt tarihi
      registrationAddress: "Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1", // String - Kayıt adresi
      ip: req.ip || req.connection.remoteAddress || "85.34.78.112", // String - IP adresi
      city: "İstanbul", // String - Şehir
      country: "Turkey", // String - Ülke
      zipCode: "34732" // String - Posta kodu
    },
    shippingAddress: {
      contactName: "Ali Veli", // String - İletişim adı (PHYSICAL ürün için zorunlu)
      city: "İstanbul", // String - Şehir (PHYSICAL ürün için zorunlu)
      country: "Turkey", // String - Ülke (PHYSICAL ürün için zorunlu)
      address: "Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1", // String - Adres (PHYSICAL ürün için zorunlu)
      zipCode: "34732" // String - Posta kodu
    },
    billingAddress: {
      contactName: "Ali Veli", // String - Fatura iletişim adı (zorunlu)
      city: "İstanbul", // String - Fatura şehri (zorunlu)
      country: "Turkey", // String - Fatura ülkesi (zorunlu)
      address: "Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1", // String - Fatura adresi (zorunlu)
      zipCode: "34732" // String - Fatura posta kodu
    },
    basketItems: [
      {
        id: "BI101", // String - Sepet ürün ID'si
        name: "Telefon", // String - Ürün adı
        category1: "Elektronik", // String - Kategori 1
        category2: "Cep Telefonu", // String - Kategori 2
        itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL, // String - Ürün tipi (PHYSICAL/VIRTUAL)
        price // Decimal - Ürün fiyatı (sıfırdan büyük olmalı)
      }
    ]
  };

  // Ödeme isteği gönder
  iyzipay.payment.create(paymentRequest, (err, result) => {
    if (err) {
      console.error("İyzico Ödeme Hatası:", err);
      return res.status(500).json({ 
        success: false, 
        error: "Payment processing failed",
        message: err.message,
        details: err
      });
    }

    // Başarılı yanıt kontrolü
    if (result.status === "success") {
      console.log("Ödeme Başarılı:", {
        paymentId: result.paymentId,
        conversationId: result.conversationId,
        paidPrice: result.paidPrice,
        currency: result.currency
      });

      return res.status(200).json({
        success: true,
        message: "Payment completed successfully",
        data: {
          paymentId: result.paymentId, // Ödeme ID'si - saklanmalı
          paymentTransactionId: result.itemTransactions?.[0]?.paymentTransactionId, // İşlem ID'si - saklanmalı
          conversationId: result.conversationId,
          status: result.status,
          paidPrice: result.paidPrice,
          currency: result.currency,
          installment: result.installment,
          cardAssociation: result.cardAssociation,
          cardFamily: result.cardFamily,
          cardType: result.cardType,
          fraudStatus: result.fraudStatus
        }
      });
    } else {
      // Başarısız ödeme
      console.error("Ödeme Başarısız:", {
        errorCode: result.errorCode,
        errorMessage: result.errorMessage,
        errorGroup: result.errorGroup
      });

      return res.status(400).json({
        success: false,
        error: "Payment failed",
        errorCode: result.errorCode,
        errorMessage: result.errorMessage,
        errorGroup: result.errorGroup,
        conversationId: result.conversationId
      });
    }
  });
};

// İyzico Checkout Form işlemini yapan controller
exports.createCheckoutForm = (req, res) => {
  // req.body'nin tanımlı olduğundan emin ol
  const body = req.body || {};
  
  const { 
    price = "100.0",
    paidPrice = "100.0",
    customerName = "Ali Veli",
    customerEmail = "ali@example.com",
    customerPhone = "+905555555555"
  } = body;

  // Debug için request body'yi logla
  console.log("Request Body:", req.body);
  console.log("Extracted values:", { price, paidPrice, customerName, customerEmail, customerPhone });

  // Benzersiz conversation ID oluştur
  const conversationId = `checkout_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;

  const checkoutFormRequest = {
    locale: Iyzipay.LOCALE.TR,
    conversationId, // Benzersiz işlem kimliği
    price, // Decimal - Sepet toplam tutarı
    paidPrice, // Decimal - Müşteriden tahsil edilecek nihai tutar
    currency: Iyzipay.CURRENCY.TRY,
    basketId: `basket_${Date.now()}`, // Sepet ID'si
    paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
    callbackUrl: `http://localhost:3000/api/checkout/callback`, // Ödeme sonrası dönüş URL'i
    enabledInstallments: [1, 2, 3, 6, 9, 12], // İzin verilen taksit sayıları
    buyer: {
      id: "BY789", // String - Alıcı ID'si
      name: customerName.split(' ')[0] || "Ali", // String - Alıcı adı
      surname: customerName.split(' ')[1] || "Veli", // String - Alıcı soyadı
      gsmNumber: customerPhone, // String - GSM numarası
      email: customerEmail, // String - E-posta adresi
      identityNumber: "11111111111", // String - Kimlik numarası
      lastLoginDate: "2024-01-01 00:00:00", // String - Son giriş tarihi
      registrationDate: "2024-01-01 00:00:00", // String - Kayıt tarihi
      registrationAddress: "Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1", // String - Kayıt adresi
      ip: req.ip || req.connection.remoteAddress || "85.34.78.112", // String - IP adresi
      city: "İstanbul", // String - Şehir
      country: "Turkey", // String - Ülke
      zipCode: "34732" // String - Posta kodu
    },
    shippingAddress: {
      contactName: customerName, // String - İletişim adı (PHYSICAL ürün için zorunlu)
      city: "İstanbul", // String - Şehir (PHYSICAL ürün için zorunlu)
      country: "Turkey", // String - Ülke (PHYSICAL ürün için zorunlu)
      address: "Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1", // String - Adres (PHYSICAL ürün için zorunlu)
      zipCode: "34732" // String - Posta kodu
    },
    billingAddress: {
      contactName: customerName, // String - Fatura iletişim adı (zorunlu)
      city: "İstanbul", // String - Fatura şehri (zorunlu)
      country: "Turkey", // String - Fatura ülkesi (zorunlu)
      address: "Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1", // String - Fatura adresi (zorunlu)
      zipCode: "34732" // String - Fatura posta kodu
    },
    basketItems: [
      {
        id: "BI101", // String - Sepet ürün ID'si
        name: "iPhone 15 Pro", // String - Ürün adı
        category1: "Elektronik", // String - Kategori 1
        category2: "Cep Telefonu", // String - Kategori 2
        itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL, // String - Ürün tipi (PHYSICAL/VIRTUAL)
        price // Decimal - Ürün fiyatı (sıfırdan büyük olmalı)
      }
    ]
  };

  // Checkout Form isteği gönder
  iyzipay.checkoutFormInitialize.create(checkoutFormRequest, (err, result) => {
    if (err) {
      console.error("İyzico Checkout Form Hatası:", err);
      return res.status(500).json({ 
        success: false, 
        error: "Checkout form creation failed",
        message: err.message,
        details: err
      });
    }

    // Başarılı yanıt kontrolü
    if (result.status === "success") {
      console.log("Checkout Form Başarıyla Oluşturuldu:", {
        token: result.token,
        checkoutFormUrl: result.checkoutFormUrl,
        conversationId: result.conversationId
      });

      return res.status(200).json({
        success: true,
        message: "Checkout form created successfully",
        data: {
          token: result.token, // Checkout form token'ı
          checkoutFormUrl: result.checkoutFormUrl, // İyzico ödeme sayfası URL'i
          conversationId: result.conversationId,
          paymentPageUrl: result.paymentPageUrl // Alternatif ödeme sayfası URL'i
        }
      });
    } else {
      // Başarısız checkout form oluşturma
      console.error("Checkout Form Oluşturulamadı:", {
        errorCode: result.errorCode,
        errorMessage: result.errorMessage,
        errorGroup: result.errorGroup
      });

      return res.status(400).json({
        success: false,
        error: "Checkout form creation failed",
        errorCode: result.errorCode,
        errorMessage: result.errorMessage,
        errorGroup: result.errorGroup,
        conversationId: result.conversationId
      });
    }
  });
};

// İyzico Checkout Form callback işleyici
exports.handleCheckoutCallback = (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({
      success: false,
      error: "Token is required"
    });
  }

  // Checkout form sonucunu al
  iyzipay.checkoutForm.retrieve({ token }, (err, result) => {
    if (err) {
      console.error("Checkout Form Sonuç Alma Hatası:", err);
      return res.status(500).json({ 
        success: false, 
        error: "Failed to retrieve checkout result",
        message: err.message
      });
    }

    // Başarılı yanıt kontrolü
    if (result.status === "success" && result.paymentStatus === "SUCCESS") {
      console.log("Ödeme Başarılı:", {
        paymentId: result.paymentId,
        conversationId: result.conversationId,
        paidPrice: result.paidPrice,
        currency: result.currency
      });

      // Başarılı ödeme sayfasına yönlendir
      return res.redirect(`/api/checkout/success?paymentId=${result.paymentId}&amount=${result.paidPrice}`);
    } else {
      // Başarısız ödeme
      console.error("Ödeme Başarısız:", {
        errorCode: result.errorCode,
        errorMessage: result.errorMessage,
        paymentStatus: result.paymentStatus
      });

      // Başarısız ödeme sayfasına yönlendir
      return res.redirect(`/api/checkout/failure?error=${encodeURIComponent(result.errorMessage || 'Ödeme başarısız')}`);
    }
  });
};
