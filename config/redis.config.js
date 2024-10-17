const redis = require("redis");

const redisClient = redis.createClient({
  host: "127.0.0.1",
  port: 6379,
  socket: {
    connectTimeout: 50000,
    keepAlive: 10000,
  },
});

redisClient.on("error", (err) => {
  console.error("Erro ao conectar ao Redis:", err);
});

(async () => {
  try {
    await redisClient.connect();
    console.log("Conectado ao Redis");
  } catch (error) {
    console.error("Erro ao conectar ao Redis:", error);
  }
})();

module.exports = redisClient;
