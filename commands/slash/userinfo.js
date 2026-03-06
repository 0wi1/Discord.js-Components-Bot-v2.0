const {
  SlashCommandBuilder,
  ContainerBuilder,
  TextDisplayBuilder,
  SeparatorBuilder,
  SeparatorSpacingSize,
  MessageFlags,
  MessageMentions
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('userinfo')
    .setDescription('Get information about a user')
    .addUserOption(option =>
      option
        .setName('user')
        .setDescription('The user to get info about')
        .setRequired(false)
    ),
  
  cooldown: 5,
  
  async execute(interaction, client) {
    const targetUser = interaction.options.getUser('user') || interaction.user;
    const member = interaction.guild?.members.cache.get(targetUser.id);

    // Format timestamps
    const createdTimestamp = Math.floor(targetUser.createdTimestamp / 1000);
    const joinedTimestamp = member ? Math.floor(member.joinedTimestamp / 1000) : null;

    // Get user badges
    const flags = targetUser.flags?.toArray() || [];
    const badgesList = flags.length > 0 
      ? flags.map(flag => `\`${flag}\``).join(' ')
      : 'None';

    // Determine user status
    const statusEmoji = {
      online: '🟢',
      idle: '🟡',
      dnd: '🔴',
      offline: '⚫'
    };

    const presence = member?.presence;
    const status = presence?.status || 'offline';

    // Create container
    const container = new ContainerBuilder()
      .setAccentColor(member?.displayColor || 0x5865F2);

    // Header
    let headerContent = `# 👤 User Information

### ${targetUser.bot ? '🤖' : '👤'} ${targetUser.username}${targetUser.discriminator !== '0' ? `#${targetUser.discriminator}` : ''}`;

    if (member?.nickname) {
      headerContent += `\n> AKA: **${member.nickname}**`;
    }

    container.addTextDisplayComponents(
      new TextDisplayBuilder().setContent(headerContent)
    );

    container.addSeparatorComponents(
      new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small)
    );

    // Basic Info
    container.addTextDisplayComponents(
      new TextDisplayBuilder()
        .setContent(`### 📋 Identification
**User ID:** \`${targetUser.id}\`
**Mention:** ${targetUser.toString()}
**Bot Account:** ${targetUser.bot ? 'Yes ✓' : 'No ✗'}
**Status:** ${statusEmoji[status] || '⚫'} ${status.charAt(0).toUpperCase() + status.slice(1)}`)
    );

    // Member-specific info (if in guild)
    if (member && interaction.guild) {
      // Get roles (excluding @everyone)
      const roles = member.roles.cache
        .filter(r => r.id !== interaction.guild.id)
        .sort((a, b) => b.position - a.position);

      const rolesDisplay = roles.size > 0
        ? roles.first(10).map(r => r.toString()).join(' ') + 
          (roles.size > 10 ? `\n*...and ${roles.size - 10} more*` : '')
        : 'None';

      container
        .addSeparatorComponents(
          new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small)
        )
        .addTextDisplayComponents(
          new TextDisplayBuilder()
            .setContent(`### 🏠 Server Membership
**Joined:** <t:${joinedTimestamp}:F>
**Joined:** <t:${joinedTimestamp}:R>
**Top Role:** ${member.roles.highest.toString()}
**Total Roles:** ${roles.size}
**Roles:** ${rolesDisplay}`)
        );

      // Check permissions
      const permissions = member.permissions.toArray();
      const keyPermissions = [
        'Administrator',
        'ManageGuild',
        'ManageChannels',
        'ManageRoles',
        'ManageMessages',
        'KickMembers',
        'BanMembers',
        'ModerateMembers'
      ];

      const hasKeyPerms = permissions.filter(p => keyPermissions.includes(p));
      
      if (hasKeyPerms.length > 0) {
        container
          .addSeparatorComponents(
            new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small)
          )
          .addTextDisplayComponents(
            new TextDisplayBuilder()
              .setContent(`### 🔑 Key Permissions
${hasKeyPerms.map(p => `✅ ${p}`).join('\n')}`)
          );
      }
    }

    // Account Info
    container
      .addSeparatorComponents(
        new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small)
      )
      .addTextDisplayComponents(
        new TextDisplayBuilder()
          .setContent(`### 📅 Account Details
**Created:** <t:${createdTimestamp}:F>
**Account Age:** <t:${createdTimestamp}:R>`)
      );

    // Badges
    if (flags.length > 0) {
      container
        .addSeparatorComponents(
          new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small)
        )
        .addTextDisplayComponents(
          new TextDisplayBuilder()
            .setContent(`### 🏅 Badges (${flags.length})
${badgesList}`)
        );
    }

    // Avatar info
    container
      .addSeparatorComponents(
        new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small)
      )
      .addTextDisplayComponents(
        new TextDisplayBuilder()
          .setContent(`### 🖼️ Avatar
**Default:** ${targetUser.avatarURL() ? 'No' : 'Yes'}
**Animated:** ${targetUser.avatar?.startsWith('a_') ? 'Yes ✓' : 'No'}`)
      );

    // Footer
    container
      .addSeparatorComponents(
        new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Large)
      )
      .addTextDisplayComponents(
        new TextDisplayBuilder()
          .setContent(`-# Requested by ${interaction.user.username}`)
      );

    await interaction.reply({
      components: [container],
      flags: MessageFlags.IsComponentsV2
    });
  }
};