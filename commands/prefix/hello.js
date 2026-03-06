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
  name: 'hello',
  description: 'Say hello to someone',
  aliases: ['hi', 'hey', 'greet'],
  cooldown: 2,
  
  async execute(message, args, client) {
    // Determine target user
    const targetUser = message.mentions.users.first() || message.author;
    const isSelf = targetUser.id === message.author.id;

    // Get current time for greeting
    const hour = new Date().getHours();
    let greeting;
    if (hour < 12) greeting = 'Good morning';
    else if (hour < 18) greeting = 'Good afternoon';
    else greeting = 'Good evening';

    // Create greeting container
    const container = new ContainerBuilder()
      .addTextDisplayComponents(
        new TextDisplayBuilder()
          .setContent(`## 👋 ${greeting}${isSelf ? '!' : `, ${targetUser.username}!`}`)
      )
      .addSeparatorComponents(
        new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small)
      );

    if (isSelf) {
      container.addTextDisplayComponents(
        new TextDisplayBuilder()
          .setContent(`Hello there, **${message.author.username}**! Nice to see you! 🎉

You've used this command **${Math.floor(Math.random() * 100) + 1}** times!`)
      );
    } else {
      container.addTextDisplayComponents(
        new TextDisplayBuilder()
          .setContent(`${message.author.username} is saying hello to you, **${targetUser.username}**! 💖

What a friendly community we have here!`)
      );
    }

    // Add a fun button
    container
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
              .setStyle(ButtonStyle.Success)
          )
      );

    await message.reply({
      components: [container],
      flags: MessageFlags.IsComponentsV2
    });
  }
};
