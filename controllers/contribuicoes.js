const db = require("../config/firebase");
const contribuicaoSchema = require("../validation/contribuicao");
const redisClient = require("../config/redis.config");

// Adicionar uma nova contribuição
exports.adicionarContribuicao = async (req, res) => {
  try {
    const { error } = contribuicaoSchema.validate(req.body);

    if (error) {
      return res.status(400).send({ error: error.details[0].message });
    }

    const contribuicao = req.body;
    const ref = db.ref("contribuicoes");
    const novaContribuicaoRef = ref.push();
    await novaContribuicaoRef.set({
      ...contribuicao,
      status: "pendente",
      submittedAt: new Date().toISOString(),
    });

    await redisClient.del("contribuicoes_pendentes_cache");

    res.status(201).send({
      message: "Contribuição submetida com sucesso!",
      id: novaContribuicaoRef.key,
    });
  } catch (error) {
    console.error("Erro ao submeter contribuição:", error.message);
    res
      .status(500)
      .send({ error: `Erro ao submeter contribuição: ${error.message}` });
  }
};

// Listar contribuições pendentes
exports.listarContribuicoesPendentes = async (req, res) => {
  try {
    const cachedContribuicoes = await redisClient.get(
      "contribuicoes_pendentes_cache"
    );

    if (cachedContribuicoes) {
      console.log("Retornando contribuições pendentes do cache.");
      return res
        .status(200)
        .send({ contribuicoes: JSON.parse(cachedContribuicoes) });
    }

    const ref = db.ref("contribuicoes");
    const snapshot = await ref
      .orderByChild("status")
      .equalTo("pendente")
      .once("value");
    const contribuicoes = snapshot.val();

    if (!contribuicoes) {
      console.log("Nenhuma contribuição pendente encontrada");
      return res.status(404).send({ message: "Nenhuma contribuição pendente" });
    }

    const listaContribuicoes = Object.keys(contribuicoes).map((id) => ({
      id,
      ...contribuicoes[id],
    }));

    await redisClient.setEx(
      "contribuicoes_pendentes_cache",
      3600,
      JSON.stringify(listaContribuicoes)
    );

    console.log(
      `Encontradas ${listaContribuicoes.length} contribuições pendentes`
    );
    return res.status(200).send({ contribuicoes: listaContribuicoes });
  } catch (error) {
    console.error("Erro ao recuperar contribuições pendentes:", error.message);
    return res.status(500).send({
      error: `Erro ao recuperar contribuições pendentes: ${error.message}`,
    });
  }
};

// Aprovar uma contribuição
exports.aprovarContribuicao = async (req, res) => {
  try {
    const contribuicaoId = req.params.id;
    const refContribuicao = db.ref(`contribuicoes/${contribuicaoId}`);
    const snapshot = await refContribuicao.once("value");

    if (!snapshot.exists()) {
      return res.status(404).send({ error: "Contribuição não encontrada" });
    }

    const contribuicao = snapshot.val();
    const refLocais = db.ref("locais").push();
    await refLocais.set({
      name: contribuicao.name,
      address: contribuicao.address,
      features: contribuicao.features,
      rating: contribuicao.rating,
    });

    await refContribuicao.update({ status: "aprovado" });
    await redisClient.del("contribuicoes_pendentes_cache");

    res.status(200).send({ message: "Contribuição aprovada com sucesso!" });
  } catch (error) {
    console.error("Erro ao aprovar contribuição:", error.message);
    res
      .status(500)
      .send({ error: `Erro ao aprovar contribuição: ${error.message}` });
  }
};

// Rejeitar uma contribuição
exports.rejeitarContribuicao = async (req, res) => {
  try {
    const contribuicaoId = req.params.id;
    const refContribuicao = db.ref(`contribuicoes/${contribuicaoId}`);
    const snapshot = await refContribuicao.once("value");

    if (!snapshot.exists()) {
      return res.status(404).send({ error: "Contribuição não encontrada" });
    }

    await refContribuicao.update({ status: "rejeitado" });
    await redisClient.del("contribuicoes_pendentes_cache");

    res.status(200).send({ message: "Contribuição rejeitada com sucesso!" });
  } catch (error) {
    console.error("Erro ao rejeitar contribuição:", error.message);
    res
      .status(500)
      .send({ error: `Erro ao rejeitar contribuição: ${error.message}` });
  }
};

// Verificar status de uma contribuição
exports.verificarStatusContribuicao = async (req, res) => {
  try {
    const contribuicaoId = req.params.id;
    const ref = db.ref(`contribuicoes/${contribuicaoId}`);
    const snapshot = await ref.once("value");

    if (!snapshot.exists()) {
      return res.status(404).send({ error: "Contribuição não encontrada" });
    }

    const contribuicao = snapshot.val();
    res.status(200).send({ status: contribuicao.status });
  } catch (error) {
    console.error("Erro ao verificar status da contribuição:", error.message);
    res.status(500).send({
      error: `Erro ao verificar status da contribuição: ${error.message}`,
    });
  }
};
