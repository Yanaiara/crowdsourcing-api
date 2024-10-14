const swaggerJsdoc = require("swagger-jsdoc");

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "API de Contribuições de Locais",
    version: "1.0.0",
    description: "Documentação da API para gerenciar contribuições de locais acessíveis.",
  },
  servers: [
    {
      url: "http://localhost:3000",
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
