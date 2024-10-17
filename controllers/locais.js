const db = require("../config/firebase");
const localSchema = require("../validation/locais");
const redisClient = require("../config/redis.config");

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
    await redisClient.del("locais_cache");

    res.status(201).send({
      message: "Local adicionado com sucesso!",
      id: novoLocalRef.key,
      local: novoLocal,
    });
  } catch (error) {
    console.error("Erro ao adicionar local:", error.message);
    res
      .status(500)
      .send({ error: `Erro ao adicionar local: ${error.message}` });
  }
};

// Listar todos os locais
exports.listarLocais = async (req, res) => {
  const cacheKey = "locais_cache";

  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
    }

    const cachedData = await redisClient.get(cacheKey);

    if (cachedData) {
      console.log("Dados retornados do cache");

      try {
        const locais = JSON.parse(cachedData);
        return res.status(200).send({ locais });
      } catch (parseError) {
        console.error(
          "Erro ao fazer o parse do cache Redis:",
          parseError.message
        );
        return res
          .status(500)
          .send({
            error: `Erro ao fazer o parse do cache: ${parseError.message}`,
          });
      }
    }

    const ref = db.ref("locais");
    const snapshot = await ref.once("value");
    const locaisData = snapshot.val();

    if (!locaisData) {
      return res.status(404).send({ message: "Nenhum local encontrado" });
    }

    const locais = Object.keys(locaisData).map((id) => ({
      id,
      ...locaisData[id],
    }));

    await redisClient.setEx(cacheKey, 3600, JSON.stringify(locais));
    console.log("Dados armazenados no cache");

    return res.status(200).send({ locais });
  } catch (error) {
    console.error("Erro ao recuperar locais:", error.message);
    return res
      .status(500)
      .send({ error: `Erro ao recuperar locais: ${error.message}` });
  }
};

// Atualizar um local
exports.atualizarLocal = async (req, res) => {
  try {
    const localId = req.params.id;
    const novoDadosLocal = req.body;

    const { error } = localSchema.validate(novoDadosLocal);
    if (error) {
      return res.status(400).send({ error: error.details[0].message });
    }

    const ref = db.ref(`locais/${localId}`);
    const snapshot = await ref.once("value");

    if (!snapshot.exists()) {
      return res.status(404).send({ error: "Local não encontrado." });
    }

    await ref.update(novoDadosLocal);
    await redisClient.del("locais_cache");

    res.status(200).send({
      message: "Local atualizado com sucesso!",
      id: localId,
      local: novoDadosLocal,
    });
  } catch (error) {
    console.error("Erro ao atualizar local:", error.message);
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
    await redisClient.del("locais_cache");

    res
      .status(200)
      .send({ message: "Local removido com sucesso!", id: localId });
  } catch (error) {
    console.error("Erro ao remover local:", error.message);
    res.status(500).send({ error: `Erro ao remover local: ${error.message}` });
  }
};
