const {
  SlashCommandBuilder,
  ContainerBuilder,
  TextDisplayBuilder,
  SeparatorBuilder,
  SeparatorSpacingSize,
  MessageFlags
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('serverinfo')
    .setDescription('Get information about the server'),
  
  cooldown: 5,
  
  async execute(interaction, client) {
    const guild = interaction.guild;
    
    if (!guild) {
      return interaction.reply({
        content: 'This command can only be used in a server!',
        ephemeral: true
      });
    }

    // Fetch all members for accurate counts
    await guild.members.fetch();

    // Calculate member counts
    const totalCount = guild.memberCount;
    const onlineCount = guild.members.cache.filter(m => 
      m.presence?.status && m.presence.status !== 'offline'
    ).size;
    const botCount = guild.members.cache.filter(m => m.user.bot).size;
    const humanCount = totalCount - botCount;

    // Channel counts
    const channels = guild.channels.cache;
    const textChannels = channels.filter(c => c.type === 0).size;
    const voiceChannels = channels.filter(c => c.type === 2).size;
    const categories = channels.filter(c => c.type === 4).size;
    const announcements = channels.filter(c => c.type === 5).size;
    const stageChannels = channels.filter(c => c.type === 13).size;
    const forumChannels = channels.filter(c => c.type === 15).size;

    // Other counts
    const roleCount = guild.roles.cache.size;
    const emojiCount = guild.emojis.cache.size;
    const animatedEmojiCount = guild.emojis.cache.filter(e => e.animated).size;
    const stickerCount = guild.stickers.cache.size;

    // Verification levels
    const verificationLevels = ['None', 'Low', 'Medium', 'High', 'Very High'];
    const contentFilter = ['Disabled', 'Members without roles', 'All members'];

    // Boost info
    const boostLevel = guild.premiumTier;
    const boostCount = guild.premiumSubscriptionCount || 0;
    const boostColors = [0x5865F2, 0x9B59B6, 0xE91E63, 0xFF5722];

    // Create container
    const container = new ContainerBuilder()
      .setAccentColor(boostColors[boostLevel] || 0x5865F2);

    // Header with server icon info
    let header = `# 🏰 ${guild.name}`;
    if (guild.description) {
      header += `\n> ${guild.description}`;
    }

    container.addTextDisplayComponents(
      new TextDisplayBuilder().setContent(header)
    );

    // Member info
    container
      .addSeparatorComponents(
        new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small)
      )
      .addTextDisplayComponents(
        new TextDisplayBuilder()
          .setContent(`### 👥 Members
**Total:** ${totalCount.toLocaleString()}
**Online:** ${onlineCount.toLocaleString()}
**Humans:** ${humanCount.toLocaleString()}
**Bots:** ${botCount.toLocaleString()}
**Owner:** <@${guild.ownerId}>`)
      );

    // Channel info
    container
      .addSeparatorComponents(
        new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small)
      )
      .addTextDisplayComponents(
        new TextDisplayBuilder()
          .setContent(`### 📁 Channels
**Total:** ${channels.size}
**Text:** ${textChannels}
**Voice:** ${voiceChannels}
**Categories:** ${categories}
**Announcements:** ${announcements}
**Stage:** ${stageChannels}
**Forums:** ${forumChannels}`)
      );

    // Server assets
    container
      .addSeparatorComponents(
        new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small)
      )
      .addTextDisplayComponents(
        new TextDisplayBuilder()
          .setContent(`### 🎨 Server Assets
**Roles:** ${roleCount}
**Emojis:** ${emojiCount} (${animatedEmojiCount} animated)
**Stickers:** ${stickerCount}
**Banner:** ${guild.banner ? 'Yes' : 'No'}
**Splash:** ${guild.splash ? 'Yes' : 'No'}`)
      );

    // Security
    container
      .addSeparatorComponents(
        new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small)
      )
      .addTextDisplayComponents(
        new TextDisplayBuilder()
          .setContent(`### 🔒 Security
**Verification:** ${verificationLevels[guild.verificationLevel]}
**Content Filter:** ${contentFilter[guild.explicitContentFilter]}
**2FA Required:** ${guild.mfaLevel ? 'Yes' : 'No'}
**NSFW Level:** ${['Default', 'Explicit', 'Safe', 'Age Restricted'][guild.nsfwLevel]}`)
      );

    // Boost info
    container
      .addSeparatorComponents(
        new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small)
      )
      .addTextDisplayComponents(
        new TextDisplayBuilder()
          .setContent(`### ⬆️ Server Boost
**Level:** ${boostLevel} ${'💎'.repeat(boostLevel)}
**Boosts:** ${boostCount}
${boostCount > 0 ? '*Thanks to all boosters! 💜*' : '*Be the first to boost!*'}`)
      );

    // Features
    const features = guild.features
      .filter(f => !f.startsWith('VIP_'))
      .slice(0, 8);

    if (features.length > 0) {
      const featureNames = features.map(f => 
        f.replace(/_/g, ' ')
         .toLowerCase()
         .replace(/\b\w/g, c => c.toUpperCase())
      );

      container
        .addSeparatorComponents(
          new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small)
        )
        .addTextDisplayComponents(
          new TextDisplayBuilder()
            .setContent(`### ⭐ Features
${featureNames.map(f => `• ${f}`).join('\n')}`)
        );
    }

    // Dates
    container
      .addSeparatorComponents(
        new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small)
      )
      .addTextDisplayComponents(
        new TextDisplayBuilder()
          .setContent(`### 📅 Server Dates
**Created:** <t:${Math.floor(guild.createdTimestamp / 1000)}:F>
**Age:** <t:${Math.floor(guild.createdTimestamp / 1000)}:R>`)
      );

    // Footer
    container
      .addSeparatorComponents(
        new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Large)
      )
      .addTextDisplayComponents(
        new TextDisplayBuilder()
          .setContent(`-# Server ID: \`${guild.id}\` • Shard: ${guild.shardId}`)
      );

    await interaction.reply({
      components: [container],
      flags: MessageFlags.IsComponentsV2
    });
  }
};