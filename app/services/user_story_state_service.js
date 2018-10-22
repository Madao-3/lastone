const redis = require("redis");
const HOST = "127.0.0.1";
const PORT = 6379;

module.exports = {
  client() {
    redis.createClient(PORT, HOST);
  },
  getUserState(uid, storyId) {
    let client = this.client();
    return client.get(`${uid}_${storyId}`);
  },
  setUserState(uid, storyId, state) {
    return !!client.set(`${uid}_${storyId}`, state);
  }
};
