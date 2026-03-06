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
  name: 'help',
  description: 'Show available commands',
  aliases: ['h', 'commands', 'cmds'],
  cooldown: 3,
  
  async execute(message, args, client) {
    const prefix = process.env.PREFIX || '!';

    // Get command info
    const prefixCommands = Array.from(client.prefixCommands.values());
    const slashCommands = Array.from(client.slashCommands.values());

    // Create help container
    const container = new ContainerBuilder()
      .setAccentColor(0x5865F2)
      .addTextDisplayComponents(
        new TextDisplayBuilder()
          .setContent('# 📚 Bot Help\nWelcome to the help menu! Here are all available commands.')
      )
      .addSeparatorComponents(
        new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Large)
      )
      .addTextDisplayComponents(
        new TextDisplayBuilder()
          .setContent(`## 💻 Prefix Commands \`${prefix}\`

${prefixCommands.map(cmd => 
  `**${prefix}${cmd.name}** ${cmd.aliases?.length ? `*(aliases: ${cmd.aliases.map(a => `\`${a}\``).join(', ')})]*` : '*'}
> ${cmd.description}`
).join('\n\n')}`)
      )
      .addSeparatorComponents(
        new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Large)
      )
      .addTextDisplayComponents(
        new TextDisplayBuilder()
          .setContent(`## 🔀 Slash Commands

${slashCommands.map(cmd => 
  `**/${cmd.data.name}**
> ${cmd.data.description}`
).join('\n\n')}`)
      )
      .addSeparatorComponents(
        new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Large)
      )
      .addTextDisplayComponents(
        new TextDisplayBuilder()
          .setContent(`## 📝 Usage Tips

• Prefix commands: \`${prefix}command [args]\`
• Slash commands: Type \`/\` and select from the menu
• Arguments in \`[]\` are optional
• Arguments in \`<>\` are required`)
      )
      .addSeparatorComponents(
        new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Large)
      )
      .addActionRowComponents(
        new ActionRowBuilder()
          .addComponents(
            new ButtonBuilder()
              .setLabel('Discord.js Docs')
              .setURL('https://discord.js.org/docs')
              .setStyle(ButtonStyle.Link),
            new ButtonBuilder()
              .setLabel('Discord API Docs')
              .setURL('https://discord.com/developers/docs')
              .setStyle(ButtonStyle.Link)
          )
      );

    await message.reply({
      components: [container],
      flags: MessageFlags.IsComponentsV2
    });
  }
};
