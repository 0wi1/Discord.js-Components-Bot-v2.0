module.exports = {
  name: 'guildDelete',
  
  async execute(guild, client) {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('➖ LEFT SERVER');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Server: ${guild?.name || 'Unknown'} (${guild?.id || 'Unknown'})`);
    console.log(`Total Servers: ${client.guilds.cache.size}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  }
};