const express = require("express");
const router = express.Router();
const contribuicoesController = require("../controllers/contribuicoes");

router.post("/", contribuicoesController.adicionarContribuicao);
router.get("/pendentes", contribuicoesController.listarContribuicoesPendentes);
router.put("/aprovar/:id", contribuicoesController.aprovarContribuicao);
router.put("/rejeitar/:id", contribuicoesController.rejeitarContribuicao);
router.get("/:id/status", contribuicoesController.verificarStatusContribuicao);

module.exports = router;
