const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger/swaggerConfig");

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const contribuicoesRoutes = require("./routes/contribuicoes");
const locaisRoutes = require("./routes/locais");

app.use("/contribuicoes", contribuicoesRoutes);
app.use("/locais", locaisRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});

module.exports = app;
