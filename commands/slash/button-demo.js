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
    .setName('button-demo')
    .setDescription('Interactive button demonstration'),
  
  cooldown: 3,
  
  async execute(interaction, client) {
    // Create a comprehensive button demo
    const container = new ContainerBuilder()
      .setAccentColor(0x5865F2)
      .addTextDisplayComponents(
        new TextDisplayBuilder()
          .setContent('# 🔘 Button Demonstration\nExplore different button styles and interactions!')
      )
      .addSeparatorComponents(
        new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Large)
      )
      .addTextDisplayComponents(
        new TextDisplayBuilder()
          .setContent('## Button Styles\nHere are all 5 button styles available in Discord.js:')
      )
      .addActionRowComponents(
        new ActionRowBuilder()
          .addComponents(
            new ButtonBuilder()
              .setCustomId('style_primary')
              .setLabel('Primary')
              .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
              .setCustomId('style_secondary')
              .setLabel('Secondary')
              .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
              .setCustomId('style_success')
              .setLabel('Success')
              .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
              .setCustomId('style_danger')
              .setLabel('Danger')
              .setStyle(ButtonStyle.Danger)
          )
      )
      .addActionRowComponents(
        new ActionRowBuilder()
          .addComponents(
            new ButtonBuilder()
              .setLabel('Link Style')
              .setURL('https://discord.js.org')
              .setStyle(ButtonStyle.Link)
          )
      )
      .addSeparatorComponents(
        new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Large)
      )
      .addTextDisplayComponents(
        new TextDisplayBuilder()
          .setContent('## Buttons with Emojis\nButtons can include emojis for better visual appeal:')
      )
      .addActionRowComponents(
        new ActionRowBuilder()
          .addComponents(
            new ButtonBuilder()
              .setCustomId('emoji_like')
              .setLabel('Like')
              .setEmoji('👍')
              .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
              .setCustomId('emoji_love')
              .setLabel('Love')
              .setEmoji('❤️')
              .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
              .setCustomId('emoji_celebrate')
              .setLabel('Celebrate')
              .setEmoji('🎉')
              .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
              .setCustomId('emoji_rocket')
              .setLabel('Rocket')
              .setEmoji('🚀')
              .setStyle(ButtonStyle.Secondary)
          )
      )
      .addSeparatorComponents(
        new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Large)
      )
      .addTextDisplayComponents(
        new TextDisplayBuilder()
          .setContent('## Interactive Demo\nTry clicking these buttons:')
      )
      .addActionRowComponents(
        new ActionRowBuilder()
          .addComponents(
            new ButtonBuilder()
              .setCustomId('ping_button')
              .setLabel('Ping Pong 🏓')
              .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
              .setCustomId('info_button')
              .setLabel('Bot Info 📊')
              .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
              .setCustomId('help_button')
              .setLabel('Help ❓')
              .setStyle(ButtonStyle.Secondary)
          )
      )
      .addSeparatorComponents(
        new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Large)
      )
      .addTextDisplayComponents(
        new TextDisplayBuilder()
          .setContent('## Disabled Buttons\nButtons can be disabled:')
      )
      .addActionRowComponents(
        new ActionRowBuilder()
          .addComponents(
            new ButtonBuilder()
              .setCustomId('disabled_1')
              .setLabel('Disabled Primary')
              .setStyle(ButtonStyle.Primary)
              .setDisabled(true),
            new ButtonBuilder()
              .setCustomId('disabled_2')
              .setLabel('Disabled Success')
              .setStyle(ButtonStyle.Success)
              .setDisabled(true),
            new ButtonBuilder()
              .setCustomId('disabled_3')
              .setLabel('Disabled Danger')
              .setStyle(ButtonStyle.Danger)
              .setDisabled(true)
          )
      )
      .addSeparatorComponents(
        new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Large)
      )
      .addTextDisplayComponents(
        new TextDisplayBuilder()
          .setContent(`## Code Example
\`\`\`javascript
const button = new ButtonBuilder()
  .setCustomId('my_button')
  .setLabel('Click Me!')
  .setStyle(ButtonStyle.Primary)
  .setEmoji('👋');

const row = new ActionRowBuilder()
  .addComponents(button);

await interaction.reply({
  components: [row],
  flags: MessageFlags.IsComponentsV2
});
\`\`\``)
      );

    await interaction.reply({
      components: [container],
      flags: MessageFlags.IsComponentsV2
    });
  }
};