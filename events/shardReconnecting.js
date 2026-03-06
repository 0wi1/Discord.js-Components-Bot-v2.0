module.exports = {
  name: 'shardReconnecting',
  
  execute(shardId, client) {
    console.log(`[SHARD] Shard ${shardId} is reconnecting...`);
  }
};