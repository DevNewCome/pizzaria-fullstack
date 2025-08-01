import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Pizzaria',
      version: '1.0.0',
      description: 'API completa para gerenciamento de pizzaria',
      contact: {
        name: 'Suporte Pizzaria',
        email: 'suporte@pizzaria.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Servidor de Desenvolvimento'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  apis: ['./src/docs/swagger.ts', './src/routes.ts']
};

export const specs = swaggerJsdoc(options); 