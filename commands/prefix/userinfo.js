const {
  ContainerBuilder,
  TextDisplayBuilder,
  SeparatorBuilder,
  SeparatorSpacingSize,
  MessageFlags,
  ThumbnailBuilder
} = require('discord.js');

module.exports = {
  name: 'userinfo',
  description: 'Get information about a user',
  aliases: ['ui', 'user', 'whois'],
  cooldown: 5,
  
  async execute(message, args, client) {
    // Get target user
    const targetUser = message.mentions.users.first() 
      || (args[0] ? await client.users.fetch(args[0]).catch(() => null) : null)
      || message.author;

    const member = message.guild.members.cache.get(targetUser.id);

    // Format dates
    const createdTimestamp = Math.floor(targetUser.createdTimestamp / 1000);
    const joinedTimestamp = member ? Math.floor(member.joinedTimestamp / 1000) : null;

    // Get user badges
    const flags = targetUser.flags?.toArray() || [];
    const badgeEmojis = {
      'Staff': ' discord_staff',
      'Partner': ' discord_partner',
      'Hypesquad': ' hypesquad',
      'BugHunterLevel1': ' bug_hunter',
      'BugHunterLevel2': ' bug_hunter',
      'HypeSquadOnlineHouse1': ' hypesquad_bravery',
      'HypeSquadOnlineHouse2': ' hypesquad_brilliance',
      'HypeSquadOnlineHouse3': ' hypesquad_balance',
      'PremiumEarlySupporter': ' early_supporter',
      'ActiveDeveloper': ' active_developer',
      'VerifiedDeveloper': ' verified_bot_dev'
    };

    const badges = flags
      .map(flag => badgeEmojis[flag] || flag)
      .slice(0, 10)
      .join(' ') || 'None';

    // Create container with user info
    const container = new ContainerBuilder()
      .addTextDisplayComponents(
        new TextDisplayBuilder()
          .setContent(`## 👤 User Information

### ${targetUser.bot ? '🤖' : '👤'} ${targetUser.username}${targetUser.discriminator !== '0' ? `#${targetUser.discriminator}` : ''}`)
      );

    // Add thumbnail if available
    if (targetUser.avatarURL()) {
      container.setAccentColor(member?.displayColor || 0x5865F2);
    }

    container
      .addSeparatorComponents(
        new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small)
      )
      .addTextDisplayComponents(
        new TextDisplayBuilder()
          .setContent(`### 📋 Basic Info
**ID:** \`${targetUser.id}\`
**Mention:** ${targetUser.toString()}
**Bot:** ${targetUser.bot ? 'Yes ✓' : 'No ✗'}`)
      );

    // Add member-specific info if in guild
    if (member) {
      container
        .addSeparatorComponents(
          new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small)
        )
        .addTextDisplayComponents(
          new TextDisplayBuilder()
            .setContent(`### 🏠 Server Info
**Nickname:** ${member.nickname || 'None'}
**Joined:** <t:${joinedTimestamp}:F> (<t:${joinedTimestamp}:R>)
**Roles:** ${member.roles.cache.size > 1 
  ? member.roles.cache
      .filter(r => r.id !== message.guild.id)
      .sort((a, b) => b.position - a.position)
      .first(5)
      .map(r => r.toString())
      .join(' ') + (member.roles.cache.size > 6 ? ` *+${member.roles.cache.size - 6} more*` : '')
  : 'None'}
**Top Role:** ${member.roles.highest.toString()}`)
        );
    }

    container
      .addSeparatorComponents(
        new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small)
      )
      .addTextDisplayComponents(
        new TextDisplayBuilder()
          .setContent(`### 📅 Dates
**Account Created:** <t:${createdTimestamp}:F>
**Account Age:** <t:${createdTimestamp}:R>`)
      )
      .addSeparatorComponents(
        new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small)
      )
      .addTextDisplayComponents(
        new TextDisplayBuilder()
          .setContent(`### 🏅 Badges
${badges}`)
      )
      .addSeparatorComponents(
        new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Large)
      )
      .addTextDisplayComponents(
        new TextDisplayBuilder()
          .setContent(`-# Requested by ${message.author.username}`)
      );

    await message.reply({
      components: [container],
      flags: MessageFlags.IsComponentsV2
    });
  }
};