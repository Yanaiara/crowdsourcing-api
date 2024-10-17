const redisClient = require("../../config/redis.config");

class CacheService {
  setCache(key, value, ttl) {
    return new Promise((resolve, reject) => {
      redisClient.setex(key, ttl, JSON.stringify(value), (err, reply) => {
        if (err) return reject(err);
        resolve(reply);
      });
    });
  }

  getCache(key) {
    return new Promise((resolve, reject) => {
      redisClient.get(key, (err, data) => {
        if (err) return reject(err);
        if (data !== null) {
          resolve(JSON.parse(data));
        } else {
          resolve(null);
        }
      });
    });
  }

  deleteCache(key) {
    return new Promise((resolve, reject) => {
      redisClient.del(key, (err, reply) => {
        if (err) return reject(err);
        resolve(reply);
      });
    });
  }
}

module.exports = new CacheService();
