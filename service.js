const express = require("express");
const swaggerUi = require("swagger-ui-express");
const authRouter = require("./routes/auth.routes");
const productRouter = require("./routes/product.routes");
const specs = require("./swagger");
require("dotenv").config();

const app = express();
const port = 3000;

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.use(express.json());
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/product", productRouter);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
