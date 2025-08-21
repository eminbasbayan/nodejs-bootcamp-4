const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'E-Ticaret API',
      version: '1.0.0',
      description: 'Node.js Bootcamp Bitirme Projesi - E-Ticaret REST API',
      contact: {
        name: 'API Desteği',
        email: 'support@ecommerce-api.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: process.env.NODE_ENV === 'production' 
          ? 'https://api.ecommerce.com' 
          : `http://localhost:${process.env.PORT || 5000}`,
        description: process.env.NODE_ENV === 'production' ? 'Production server' : 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT Authorization header using the Bearer scheme. Example: "Authorization: Bearer {token}"'
        }
      },
      schemas: {
        ApiResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              description: 'İşlem başarı durumu'
            },
            statusCode: {
              type: 'integer',
              description: 'HTTP durum kodu'
            },
            message: {
              type: 'string',
              description: 'İşlem mesajı'
            },
            data: {
              type: 'object',
              description: 'Yanıt verisi'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            statusCode: {
              type: 'integer',
              example: 400
            },
            message: {
              type: 'string',
              example: 'Hata mesajı'
            },
            stack: {
              type: 'string',
              description: 'Hata stack trace (sadece development modunda)'
            }
          }
        },
        User: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'Kullanıcı ID'
            },
            name: {
              type: 'string',
              description: 'Kullanıcı adı'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'E-posta adresi'
            },
            role: {
              type: 'string',
              enum: ['customer', 'admin'],
              description: 'Kullanıcı rolü'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Category: {
          type: 'object',
          properties: {
            _id: {
              type: 'string'
            },
            name: {
              type: 'string',
              description: 'Kategori adı'
            },
            slug: {
              type: 'string',
              description: 'URL dostu kategori adı'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Product: {
          type: 'object',
          properties: {
            _id: {
              type: 'string'
            },
            title: {
              type: 'string',
              description: 'Ürün başlığı'
            },
            description: {
              type: 'string',
              description: 'Ürün açıklaması'
            },
            price: {
              type: 'number',
              minimum: 0,
              description: 'Ürün fiyatı'
            },
            stock: {
              type: 'integer',
              minimum: 0,
              description: 'Stok miktarı'
            },
            category: {
              $ref: '#/components/schemas/Category'
            },
            images: {
              type: 'array',
              items: {
                type: 'string',
                format: 'uri'
              },
              description: 'Ürün resimleri'
            },
            averageRating: {
              type: 'number',
              minimum: 0,
              maximum: 5,
              description: 'Ortalama puan'
            },
            numReviews: {
              type: 'integer',
              minimum: 0,
              description: 'Yorum sayısı'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Order: {
          type: 'object',
          properties: {
            _id: {
              type: 'string'
            },
            user: {
              $ref: '#/components/schemas/User'
            },
            items: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  product: {
                    $ref: '#/components/schemas/Product'
                  },
                  title: {
                    type: 'string'
                  },
                  price: {
                    type: 'number'
                  },
                  quantity: {
                    type: 'integer',
                    minimum: 1
                  }
                }
              }
            },
            shippingAddress: {
              type: 'object',
              properties: {
                fullName: { type: 'string' },
                phone: { type: 'string' },
                addressLine: { type: 'string' },
                city: { type: 'string' },
                country: { type: 'string' },
                postalCode: { type: 'string' }
              }
            },
            payment: {
              type: 'object',
              properties: {
                method: {
                  type: 'string',
                  enum: ['cod', 'card']
                },
                status: {
                  type: 'string',
                  enum: ['pending', 'paid', 'refunded']
                }
              }
            },
            status: {
              type: 'string',
              enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled']
            },
            totalAmount: {
              type: 'number',
              minimum: 0
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Review: {
          type: 'object',
          properties: {
            _id: {
              type: 'string'
            },
            user: {
              $ref: '#/components/schemas/User'
            },
            product: {
              type: 'string',
              description: 'Ürün ID'
            },
            rating: {
              type: 'integer',
              minimum: 1,
              maximum: 5,
              description: 'Puan (1-5)'
            },
            comment: {
              type: 'string',
              description: 'Yorum metni'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        }
      }
    },
    tags: [
      {
        name: 'Auth',
        description: 'Kimlik doğrulama işlemleri'
      },
      {
        name: 'Users',
        description: 'Kullanıcı yönetimi'
      },
      {
        name: 'Categories',
        description: 'Kategori yönetimi'
      },
      {
        name: 'Products',
        description: 'Ürün yönetimi'
      },
      {
        name: 'Orders',
        description: 'Sipariş yönetimi'
      },
      {
        name: 'Reviews',
        description: 'Yorum yönetimi'
      }
    ]
  },
  apis: ['./src/routes/*.js'], // Route dosyalarının yolu
};

const specs = swaggerJsdoc(options);

module.exports = {
  swaggerUi,
  specs
};
