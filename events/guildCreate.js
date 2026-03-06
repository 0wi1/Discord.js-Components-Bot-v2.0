const {
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
  name: 'guildCreate',
  
  async execute(guild, client) {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('➕ JOINED SERVER');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Server: ${guild.name} (${guild.id})`);
    console.log(`Members: ${guild.memberCount}`);
    console.log(`Total Servers: ${client.guilds.cache.size}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    // Find a suitable channel to send welcome message
    const channel = guild.systemChannelId 
      ? guild.channels.cache.get(guild.systemChannelId)
      : guild.channels.cache.find(
          ch => ch.type === 0 && ch.permissionsFor(client.user)?.has('SendMessages')
        );

    if (!channel) return;

    try {
      const prefix = process.env.PREFIX || '!';
      
      const container = new ContainerBuilder()
        .setAccentColor(0x5865F2)
        .addTextDisplayComponents(
          new TextDisplayBuilder()
            .setContent(`# 👋 Hello, ${guild.name}!

## Thanks for inviting me!

I'm a modern Discord bot using the latest Components V2 system. I don't use old-school embeds - I use fancy containers, text displays, and buttons!`)
        )
        .addSeparatorComponents(
          new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small)
        )
        .addTextDisplayComponents(
          new TextDisplayBuilder()
            .setContent(`### 🚀 Quick Start

**Prefix Commands:** \`${prefix}help\`
**Slash Commands:** Type \`/\` and select a command
**Support:** Use the buttons below!`)
        )
        .addSeparatorComponents(
          new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Large)
        )
        .addActionRowComponents(
          new ActionRowBuilder()
            .addComponents(
              new ButtonBuilder()
                .setLabel('Invite Me')
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

      await channel.send({
        components: [container],
        flags: MessageFlags.IsComponentsV2
      });
    } catch (error) {
      console.error('[ERROR] Failed to send welcome message:', error);
    }
  }
};