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
