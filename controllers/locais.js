const db = require("../config/firebase");
const localSchema = require("../validation/locais");

// Adicionar um novo local
exports.adicionarLocal = async (req, res) => {
  try {
    const { error } = localSchema.validate(req.body);
    if (error) {
      return res.status(400).send({ error: error.details[0].message });
    }

    const novoLocal = req.body;
    const ref = db.ref("locais");
    const novoLocalRef = ref.push();
    await novoLocalRef.set(novoLocal);

    res.status(201).send({
      message: "Local adicionado com sucesso!",
      id: novoLocalRef.key,
      local: novoLocal,
    });
  } catch (error) {
    res
      .status(500)
      .send({ error: `Erro ao adicionar local: ${error.message}` });
  }
};

// Listar todos os locais
exports.listarLocais = async (req, res) => {
  try {
    const ref = db.ref("locais");
    const snapshot = await ref.once("value");
    const locaisData = snapshot.val();

    if (!locaisData) {
      return res.status(404).send({ message: "Nenhum local encontrado" });
    }

    const locais = Object.keys(locaisData).map((id) => ({
      id: id,
      ...locaisData[id],
    }));

    res.status(200).send({ locais });
  } catch (error) {
    res
      .status(500)
      .send({ error: `Erro ao recuperar locais: ${error.message}` });
  }
};

// Atualizar um local
exports.atualizarLocal = async (req, res) => {
  try {
    const localId = req.params.id;
    const novoDadosLocal = req.body;

    if (
      !novoDadosLocal ||
      !novoDadosLocal.name ||
      !novoDadosLocal.address ||
      !Array.isArray(novoDadosLocal.features) ||
      typeof novoDadosLocal.rating !== "number"
    ) {
      return res
        .status(400)
        .send({ error: "Dados do local incompletos ou inválidos!" });
    }

    const ref = db.ref(`locais/${localId}`);
    const snapshot = await ref.once("value");

    if (!snapshot.exists()) {
      return res.status(404).send({ error: "Local não encontrado." });
    }

    await ref.update(novoDadosLocal);

    res.status(200).send({
      message: "Local atualizado com sucesso!",
      id: localId,
      local: novoDadosLocal,
    });
  } catch (error) {
    res
      .status(500)
      .send({ error: `Erro ao atualizar local: ${error.message}` });
  }
};

// Remover um local
exports.removerLocal = async (req, res) => {
  try {
    const localId = req.params.id;

    const ref = db.ref(`locais/${localId}`);
    const snapshot = await ref.once("value");

    if (!snapshot.exists()) {
      return res.status(404).send({ error: "Local não encontrado." });
    }

    await ref.remove();
    res
      .status(200)
      .send({ message: "Local removido com sucesso!", id: localId });
  } catch (error) {
    res.status(500).send({ error: `Erro ao remover local: ${error.message}` });
  }
};
