const {
  ContainerBuilder,
  TextDisplayBuilder,
  SeparatorBuilder,
  SeparatorSpacingSize,
  MessageFlags
} = require('discord.js');

module.exports = {
  name: 'serverinfo',
  description: 'Get information about the server',
  aliases: ['si', 'server', 'guildinfo'],
  cooldown: 5,
  
  async execute(message, args, client) {
    const guild = message.guild;
    
    if (!guild) {
      return message.reply('This command can only be used in a server!');
    }

    // Get various counts
    const memberCount = guild.memberCount;
    const botCount = guild.members.cache.filter(m => m.user.bot).size;
    const humanCount = memberCount - botCount;
    const channelCount = guild.channels.cache.size;
    const textChannels = guild.channels.cache.filter(c => c.type === 0).size;
    const voiceChannels = guild.channels.cache.filter(c => c.type === 2).size;
    const categories = guild.channels.cache.filter(c => c.type === 4).size;
    const roleCount = guild.roles.cache.size;
    const emojiCount = guild.emojis.cache.size;
    const stickerCount = guild.stickers.cache.size;

    // Get verification level
    const verificationLevels = {
      0: 'None',
      1: 'Low',
      2: 'Medium',
      3: 'High',
      4: 'Very High'
    };

    // Get boost info
    const boostLevel = guild.premiumTier;
    const boostCount = guild.premiumSubscriptionCount || 0;

    // Create container
    const container = new ContainerBuilder()
      .addTextDisplayComponents(
        new TextDisplayBuilder()
          .setContent(`## 🏰 Server Information

### 📌 ${guild.name}
${guild.description ? `*${guild.description}*` : ''}`)
      )
      .addSeparatorComponents(
        new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small)
      )
      .addTextDisplayComponents(
        new TextDisplayBuilder()
          .setContent(`### 👥 Members
**Total:** ${memberCount.toLocaleString()}
**Humans:** ${humanCount.toLocaleString()}
**Bots:** ${botCount.toLocaleString()}
**Owner:** <@${guild.ownerId}>`)
      )
      .addSeparatorComponents(
        new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small)
      )
      .addTextDisplayComponents(
        new TextDisplayBuilder()
          .setContent(`### 📁 Channels
**Total:** ${channelCount}
**Text:** ${textChannels}
**Voice:** ${voiceChannels}
**Categories:** ${categories}`)
      )
      .addSeparatorComponents(
        new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small)
      )
      .addTextDisplayComponents(
        new TextDisplayBuilder()
          .setContent(`### 🎨 Server Assets
**Roles:** ${roleCount}
**Emojis:** ${emojiCount}
**Stickers:** ${stickerCount}`)
      )
      .addSeparatorComponents(
        new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small)
      )
      .addTextDisplayComponents(
        new TextDisplayBuilder()
          .setContent(`### 🔒 Security
**Verification Level:** ${verificationLevels[guild.verificationLevel]}
**2FA Required:** ${guild.mfaLevel ? 'Yes' : 'No'}
**Explicit Content Filter:** ${['Disabled', 'Members without roles', 'All members'][guild.explicitContentFilter]}`)
      )
      .addSeparatorComponents(
        new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small)
      )
      .addTextDisplayComponents(
        new TextDisplayBuilder()
          .setContent(`### ⬆️ Boost Status
**Level:** ${boostLevel}
**Boosts:** ${boostCount}
${boostCount > 0 ? `Thanks to our boosters! 💜` : 'Consider boosting the server!'}`)
      )
      .addSeparatorComponents(
        new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small)
      )
      .addTextDisplayComponents(
        new TextDisplayBuilder()
          .setContent(`### 📅 Dates
**Created:** <t:${Math.floor(guild.createdTimestamp / 1000)}:F>
**Age:** <t:${Math.floor(guild.createdTimestamp / 1000)}:R>`)
      )
      .addSeparatorComponents(
        new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Large)
      )
      .addTextDisplayComponents(
        new TextDisplayBuilder()
          .setContent(`-# Server ID: \`${guild.id}\``)
      );

    // Set accent color based on boost level
    const accentColors = [0x5865F2, 0x9B59B6, 0xE91E63, 0xFF5722];
    container.setAccentColor(accentColors[boostLevel] || 0x5865F2);

    await message.reply({
      components: [container],
      flags: MessageFlags.IsComponentsV2
    });
  }
};
