module.exports = {
  name: 'shardReady',
  
  execute(shardId, client) {
    console.log(`[SHARD] Shard ${shardId} is ready`);
  }
};