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
    .setName('hello')
    .setDescription('Say hello to someone')
    .addUserOption(option =>
      option
        .setName('user')
        .setDescription('The user to greet')
        .setRequired(false)
    ),
  
  cooldown: 2,
  
  async execute(interaction, client) {
    const targetUser = interaction.options.getUser('user') || interaction.user;
    const isSelf = targetUser.id === interaction.user.id;

    // Get time-based greeting
    const hour = new Date().getHours();
    let greeting, emoji;
    if (hour < 12) {
      greeting = 'Good morning';
      emoji = '🌅';
    } else if (hour < 18) {
      greeting = 'Good afternoon';
      emoji = '☀️';
    } else {
      greeting = 'Good evening';
      emoji = '🌙';
    }

    // Create container
    const container = new ContainerBuilder()
      .setAccentColor(0x57F287); // Green

    if (isSelf) {
      container.addTextDisplayComponents(
        new TextDisplayBuilder()
          .setContent(`# ${emoji} ${greeting}!

## Hello there, ${interaction.user.username}! 👋

Welcome! It's great to see you using my commands. Here's a friendly greeting just for you!`)
      );
    } else {
      container.addTextDisplayComponents(
        new TextDisplayBuilder()
          .setContent(`# ${emoji} ${greeting}, ${targetUser.username}!

## 👋 A greeting from ${interaction.user.username}

You've been sent a warm hello! 💖`)
      );
    }

    container
      .addSeparatorComponents(
        new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Large)
      )
      .addTextDisplayComponents(
        new TextDisplayBuilder()
          .setContent(`### 🕐 Current Time
The time is now: <t:${Math.floor(Date.now() / 1000)}:t>`)
      )
      .addSeparatorComponents(
        new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Large)
      )
      .addActionRowComponents(
        new ActionRowBuilder()
          .addComponents(
            new ButtonBuilder()
              .setCustomId('wave_back')
              .setLabel('Wave Back! 👋')
              .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
              .setCustomId('hug')
              .setLabel('Send Hug 🤗')
              .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
              .setCustomId('highfive')
              .setLabel('High Five! ✋')
              .setStyle(ButtonStyle.Secondary)
          )
      );

    await interaction.reply({
      components: [container],
      flags: MessageFlags.IsComponentsV2
    });
  }
};
