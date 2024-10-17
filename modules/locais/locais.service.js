const db = require("../../config/firebase.config");
const cacheService = require("../common/cache.service");

class LocaisService {
  async listarLocais() {
    const cacheKey = "locais_cache";
    const ttl = 3600;

    try {
      const cachedLocais = await cacheService.getCache(cacheKey);
      if (cachedLocais) {
        return cachedLocais;
      }

      const ref = db.ref("locais");
      const snapshot = await ref.once("value");
      const locaisData = snapshot.val();

      if (!locaisData) {
        return null;
      }

      const locais = Object.keys(locaisData).map((id) => ({
        id,
        ...locaisData[id],
      }));

      await cacheService.setCache(cacheKey, locais, ttl);

      return locais;
    } catch (error) {
      throw new Error(`Erro ao listar locais: ${error.message}`);
    }
  }
}

module.exports = new LocaisService();
