const { ActivityType } = require('discord.js');

module.exports = {
  name: 'clientReady', // Changed from 'ready' for v15 compatibility
  once: true,
  
  async execute(client) {
    // Log ready status
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`✅ Logged in as ${client.user.tag}`);
    console.log(`📊 Serving ${client.guilds.cache.size} servers`);
    console.log(`👥 Watching ${client.users.cache.size} users`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Set bot activity
    const setActivity = () => {
      const activities = [
        { name: `${client.slashCommands.size} slash commands`, type: ActivityType.Watching },
        { name: `${client.guilds.cache.size} servers`, type: ActivityType.Watching },
        { name: `${client.prefixCommands.size} prefix commands`, type: ActivityType.Listening },
        { name: `${process.env.PREFIX || '!'}help for help`, type: ActivityType.Watching }
      ];
      
      const activity = activities[Math.floor(Math.random() * activities.length)];
      client.user.setActivity(activity);
    };

    // Set initial activity
    setActivity();

    // Rotate activity every 30 seconds
    setInterval(setActivity, 30000);

    // Deploy commands on ready
    const { deployCommands } = require('../utils/handlers');
    const commands = client.slashCommandsData || [];
    
    if (commands.length > 0) {
      await deployCommands(client, commands);
    }
  }
};
