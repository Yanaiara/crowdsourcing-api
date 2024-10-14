const express = require("express");
const router = express.Router();
const locaisController = require("../controllers/locais");

router.post("/", locaisController.adicionarLocal);
router.get("/", locaisController.listarLocais);
router.put("/:id", locaisController.atualizarLocal);
router.delete("/:id", locaisController.removerLocal);

module.exports = router;
