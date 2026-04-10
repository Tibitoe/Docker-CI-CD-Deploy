import swaggerJsdoc from 'swagger-jsdoc'

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'School Exercise API',
      version: '1.0.0',
      description: 'REST API for a school exercise project',
    },
    servers: [
      {
        url: process.env.API_URL || 'http://localhost:3000',
        description: process.env.NODE_ENV === 'production' ? 'Production' : 'Local',
      },
    ],
  },
  apis: ['./server.js'],
}

export const swaggerSpec = swaggerJsdoc(options)
