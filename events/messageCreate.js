const {
  ContainerBuilder,
  TextDisplayBuilder,
  MessageFlags
} = require('discord.js');

const PREFIX = process.env.PREFIX || '!';

module.exports = {
  name: 'messageCreate',
  
  async execute(message, client) {
    // Ignore bot messages
    if (message.author.bot) return;
    
    // Ignore messages without prefix
    if (!message.content.startsWith(PREFIX)) return;

    // Parse command and arguments
    const args = message.content.slice(PREFIX.length).trim().split(/ +/);
    const commandName = args.shift()?.toLowerCase();

    if (!commandName) return;

    // Get command (check aliases too)
    const command = client.prefixCommands.get(commandName) 
      || client.prefixCommands.find(cmd => cmd.aliases?.includes(commandName));

    if (!command) return;

    // Check cooldown
    const { cooldowns } = client;
    if (!cooldowns.has(command.name)) {
      cooldowns.set(command.name, new Map());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 3) * 1000;

    if (timestamps.has(message.author.id)) {
      const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
      if (now < expirationTime) {
        const timeLeft = (expirationTime - now) / 1000;
        
        const container = new ContainerBuilder()
          .setAccentColor(0xFEE75C) // Yellow
          .addTextDisplayComponents(
            new TextDisplayBuilder()
              .setContent(`## ⏳ Cooldown\nPlease wait **${timeLeft.toFixed(1)}** seconds before using \`${PREFIX}${command.name}\` again.`)
          );
        
        return message.reply({ 
          components: [container], 
          flags: MessageFlags.IsComponentsV2 
        });
      }
    }

    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    // Execute command
    try {
      await command.execute(message, args, client);
    } catch (error) {
      console.error(`[ERROR] Prefix command ${command.name}:`, error);
      
      const errorContainer = new ContainerBuilder()
        .setAccentColor(0xED4245) // Red
        .addTextDisplayComponents(
          new TextDisplayBuilder()
            .setContent('## ❌ Error\nAn error occurred while executing this command.\n\n-# Please try again later or contact support.')
        );
      
      try {
        if (message.replied || message.deferred) {
          await message.followUp({ 
            components: [errorContainer], 
            flags: MessageFlags.IsComponentsV2 
          });
        } else {
          await message.reply({ 
            components: [errorContainer], 
            flags: MessageFlags.IsComponentsV2 
          });
        }
      } catch (replyError) {
        console.error('[ERROR] Failed to send error message:', replyError);
      }
    }
  }
};