const db = require("../config/firebase");
const contribuicaoSchema = require("../validation/contribuicao");

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

    res.status(201).send({
      message: "Contribuição submetida com sucesso!",
      id: novaContribuicaoRef.key,
    });
  } catch (error) {
    res
      .status(500)
      .send({ error: `Erro ao submeter contribuição: ${error.message}` });
  }
};

// Listar contribuições pendentes
exports.listarContribuicoesPendentes = async (req, res) => {
  try {
    const ref = db.ref("contribuicoes");
    const snapshot = await ref
      .orderByChild("status")
      .equalTo("pendente")
      .once("value");
    const contribuicoes = snapshot.val();

    if (!contribuicoes) {
      return res.status(404).send({ message: "Nenhuma contribuição pendente" });
    }

    const listaContribuicoes = Object.keys(contribuicoes).map((id) => ({
      id: id,
      ...contribuicoes[id],
    }));

    res.status(200).send({ contribuicoes: listaContribuicoes });
  } catch (error) {
    res.status(500).send({
      error: `Erro ao recuperar contribuições pendentes: ${error.message}`,
    });
  }
};

// Aprovar uma contribuição
exports.aprovarContribuicao = async (req, res) => {
  try {
    const constribuicaoId = req.params.id;
    const refContribuicao = db.ref(`contribuicoes/${constribuicaoId}`);
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
    res.status(200).send({ message: "Contribuição aprovada com sucesso!" });
  } catch (error) {
    res
      .status(500)
      .send({ error: `Erro ao aprovar contribuição: ${error.message}` });
  }
};

// Rejeitar uma contribuição
exports.rejeitarContribuicao = async (req, res) => {
  try {
    const constribuicaoId = req.params.id;
    const refContribuicao = db.ref(`contribuicoes/${constribuicaoId}`);
    const snapshot = await refContribuicao.once("value");

    if (!snapshot.exists()) {
      return res.status(404).send({ error: "Contribuição não encontrada" });
    }

    await refContribuicao.update({ status: "rejeitado" });
    res.status(200).send({ message: "Contribuição rejeitada com sucesso!" });
  } catch (error) {
    res
      .status(500)
      .send({ error: `Erro ao rejeitar contribuição: ${error.message}` });
  }
};

// Verificar status de uma contribuição
exports.verificarStatusContribuicao = async (req, res) => {
  try {
    const constribuicaoId = req.params.id;
    const ref = db.ref(`contribuicoes/${constribuicaoId}`);
    const snapshot = await ref.once("value");

    if (!snapshot.exists()) {
      return res.status(404).send({ error: "Contribuição não encontrada" });
    }

    const contribuicao = snapshot.val();
    res.status(200).send({ status: contribuicao.status });
  } catch (error) {
    res.status(500).send({
      error: `Erro ao verificar status da contribuição: ${error.message}`,
    });
  }
};
