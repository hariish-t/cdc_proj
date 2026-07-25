const swaggerJsdoc = require('swagger-jsdoc');

/**
 * Swagger/OpenAPI Configuration
 * Automatically generates API documentation
 */
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ShopSphere Analytics API',
      version: '1.0.0',
      description: 'Real-time Sales Analytics Dashboard API - MERN Stack',
      contact: {
        name: 'ShopSphere Team',
        email: 'api@shopsphere.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:5000/api',
        description: 'Development server'
      },
      {
        url: 'https://api.shopsphere.com/api',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter JWT token obtained from login'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string', format: 'email' },
            role: { type: 'string', enum: ['admin', 'manager', 'viewer'] },
            isActive: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        Order: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            orderId: { type: 'string' },
            customerName: { type: 'string' },
            customerEmail: { type: 'string', format: 'email' },
            product: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                category: { type: 'string' },
                quantity: { type: 'number' },
                unitPrice: { type: 'number' }
              }
            },
            amount: { type: 'number' },
            tax: { type: 'number' },
            discount: { type: 'number' },
            totalAmount: { type: 'number' },
            status: { 
              type: 'string', 
              enum: ['pending', 'processing', 'completed', 'cancelled', 'refunded']
            },
            paymentMethod: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            error: {
              type: 'object',
              properties: {
                message: { type: 'string' },
                type: { type: 'string' }
              }
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ],
    tags: [
      {
        name: 'Authentication',
        description: 'User authentication and authorization'
      },
      {
        name: 'Orders',
        description: 'Order management operations'
      },
      {
        name: 'Analytics',
        description: 'Business analytics and reporting'
      },
      {
        name: 'Export',
        description: 'Data export functionality'
      }
    ]
  },
  apis: ['./routes/*.js'], // Path to the API routes
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
