module.exports = {
  name: 'shardDisconnect',
  
  execute(event, shardId, client) {
    console.log(`[SHARD] Shard ${shardId} disconnected`);
    console.log(`[SHARD] Event: ${event?.code || 'Unknown'} - ${event?.reason || 'No reason provided'}`);
  }
};