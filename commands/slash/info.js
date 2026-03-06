const {
  SlashCommandBuilder,
  ContainerBuilder,
  TextDisplayBuilder,
  SeparatorBuilder,
  SeparatorSpacingSize,
  MessageFlags,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('info')
    .setDescription('Get information about the bot'),
  
  cooldown: 5,
  
  async execute(interaction, client) {
    // Calculate uptime
    const uptimeSeconds = Math.floor((Date.now() - client.readyAt) / 1000);
    const days = Math.floor(uptimeSeconds / 86400);
    const hours = Math.floor((uptimeSeconds % 86400) / 3600);
    const minutes = Math.floor((uptimeSeconds % 3600) / 60);

    // Get memory usage
    const memoryUsage = process.memoryUsage();
    const usedMB = Math.round(memoryUsage.heapUsed / 1024 / 1024);
    const totalMB = Math.round(memoryUsage.heapTotal / 1024 / 1024);

    // Create container
    const container = new ContainerBuilder()
      .setAccentColor(0x5865F2) // Discord Blurple
      .addTextDisplayComponents(
        new TextDisplayBuilder()
          .setContent(`# 🤖 Bot Information

### ${client.user.tag}`)
      )
      .addSeparatorComponents(
        new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small)
      )
      .addTextDisplayComponents(
        new TextDisplayBuilder()
          .setContent(`### 📊 Statistics
**Servers:** ${client.guilds.cache.size.toLocaleString()}
**Users:** ${client.users.cache.size.toLocaleString()}
**Channels:** ${client.channels.cache.size.toLocaleString()}
**Slash Commands:** ${client.slashCommands.size}
**Prefix Commands:** ${client.prefixCommands.size}`)
      )
      .addSeparatorComponents(
        new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small)
      )
      .addTextDisplayComponents(
        new TextDisplayBuilder()
          .setContent(`### ⏱️ Uptime
**Days:** ${days}
**Hours:** ${hours}
**Minutes:** ${minutes}
**Total:** ${days}d ${hours}h ${minutes}m`)
      )
      .addSeparatorComponents(
        new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small)
      )
      .addTextDisplayComponents(
        new TextDisplayBuilder()
          .setContent(`### 🖥️ System
**Memory Usage:** ${usedMB}MB / ${totalMB}MB
**Node.js Version:** ${process.version}
**Discord.js Version:** ${require('discord.js').version}`)
      )
      .addSeparatorComponents(
        new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small)
      )
      .addTextDisplayComponents(
        new TextDisplayBuilder()
          .setContent(`### 🏓 Latency
**WebSocket:** ${client.ws.ping}ms`)
      )
      .addSeparatorComponents(
        new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Large)
      )
      .addTextDisplayComponents(
        new TextDisplayBuilder()
          .setContent(`### ✨ Features
✅ Prefix Commands
✅ Slash Commands
✅ Component System (V2)
✅ ContainerBuilder
✅ TextDisplayBuilder
✅ SeparatorBuilder
✅ ButtonBuilder
✅ ActionRowBuilder
❌ EmbedBuilder (Using Components V2 instead!)`)
      )
      .addSeparatorComponents(
        new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Large)
      )
      .addActionRowComponents(
        new ActionRowBuilder()
          .addComponents(
            new ButtonBuilder()
              .setLabel('Invite Bot')
              .setURL(`https://discord.com/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands`)
              .setStyle(ButtonStyle.Link),
            new ButtonBuilder()
              .setLabel('Support Server')
              .setURL('https://discord.gg/example')
              .setStyle(ButtonStyle.Link),
            new ButtonBuilder()
              .setLabel('GitHub')
              .setURL('https://github.com/example/bot')
              .setStyle(ButtonStyle.Link)
          )
      );

    await interaction.reply({
      components: [container],
      flags: MessageFlags.IsComponentsV2
    });
  }
};