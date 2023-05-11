const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "My API",
      version: "1.0.0",
    },
  },
  apis: ["./routes/*.js", "./controller/*.js"],
};
const specs = swaggerJsdoc(options);

module.exports = specs;
