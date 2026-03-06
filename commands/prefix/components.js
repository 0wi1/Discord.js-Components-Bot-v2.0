const {
  ContainerBuilder,
  TextDisplayBuilder,
  SeparatorBuilder,
  SeparatorSpacingSize,
  MessageFlags,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  SectionBuilder
} = require('discord.js');

module.exports = {
  name: 'components',
  description: 'Showcase all component types',
  aliases: ['comp', 'demo'],
  cooldown: 5,
  
  async execute(message, args, client) {
    // Create a comprehensive container showcasing all components
    const container = new ContainerBuilder()
      .setAccentColor(0x5865F2) // Discord Blurple
      .addTextDisplayComponents(
        new TextDisplayBuilder()
          .setContent('# 🧩 Component Showcase\nThis message demonstrates all available component types in Discord.js!')
      )
      .addSeparatorComponents(
        new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Large)
      )
      .addTextDisplayComponents(
        new TextDisplayBuilder()
          .setContent('## 📝 TextDisplayBuilder\nThe TextDisplayBuilder allows you to create rich text content with **markdown** support!\n\n- **Bold text** for emphasis\n- *Italic text* for subtle highlights\n- ~~Strikethrough~~ for deleted content\n- `Code blocks` for technical content\n- > Blockquotes for important notes\n- > Nested quotes work too!\n\nYou can also use:\n- Bullet lists\n- Numbered lists\n1. First item\n2. Second item')
      )
      .addSeparatorComponents(
        new SeparatorBuilder()
          .setSpacing(SeparatorSpacingSize.Large)
          .setDivider(true)
      )
      .addTextDisplayComponents(
        new TextDisplayBuilder()
          .setContent('## ➖ SeparatorBuilder\nThe separator above shows different spacing sizes:\n- `SeparatorSpacingSize.Small` - Compact spacing\n- `SeparatorSpacingSize.Large` - More breathing room\n\nYou can also toggle the divider line on or off!')
      )
      .addSeparatorComponents(
        new SeparatorBuilder()
          .setSpacing(SeparatorSpacingSize.Small)
          .setDivider(false)
      )
      .addTextDisplayComponents(
        new TextDisplayBuilder()
          .setContent('## 🔘 Button Styles\nHere are all the button styles available:')
      )
      .addActionRowComponents(
        new ActionRowBuilder()
          .addComponents(
            new ButtonBuilder()
              .setCustomId('primary_demo')
              .setLabel('Primary')
              .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
              .setCustomId('secondary_demo')
              .setLabel('Secondary')
              .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
              .setCustomId('success_demo')
              .setLabel('Success')
              .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
              .setCustomId('danger_demo')
              .setLabel('Danger')
              .setStyle(ButtonStyle.Danger)
          )
      )
      .addActionRowComponents(
        new ActionRowBuilder()
          .addComponents(
            new ButtonBuilder()
              .setCustomId('emoji_button')
              .setLabel('With Emoji')
              .setEmoji('🎉')
              .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
              .setLabel('Link Button')
              .setURL('https://discord.js.org')
              .setStyle(ButtonStyle.Link),
            new ButtonBuilder()
              .setCustomId('disabled_button')
              .setLabel('Disabled')
              .setStyle(ButtonStyle.Secondary)
              .setDisabled(true)
          )
      )
      .addSeparatorComponents(
        new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Large)
      )
      .addTextDisplayComponents(
        new TextDisplayBuilder()
          .setContent('## 🎨 ContainerBuilder\n\nThe ContainerBuilder is the main wrapper for all components. Key features:\n\n- `setAccentColor(color)` - Sets the side accent color\n- `addTextDisplayComponents(...)` - Adds text displays\n- `addSeparatorComponents(...)` - Adds separators\n- `addActionRowComponents(...)` - Adds button rows\n- `addSectionComponents(...)` - Adds sections\n- `addFileComponents(...)` - Adds file attachments')
      )
      .addSeparatorComponents(
        new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Large)
      )
      .addTextDisplayComponents(
        new TextDisplayBuilder()
          .setContent('## ⚙️ MessageFlags\n\nWhen sending components, always use:\n```js\nflags: MessageFlags.IsComponentsV2\n```\n\nThis enables the new components system in Discord!')
      )
      .addSeparatorComponents(
        new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Large)
      )
      .addTextDisplayComponents(
        new TextDisplayBuilder()
          .setContent(`## 📊 Quick Stats

Server Count: **${client.guilds.cache.size}**
User Count: **${client.users.cache.size}**
Ping: **${client.ws.ping}ms**`)
      )
      .addSeparatorComponents(
        new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Large)
      )
      .addTextDisplayComponents(
        new TextDisplayBuilder()
          .setContent('-# 💡 Tip: Use `/button-demo` to see interactive buttons in action!')
      );

    await message.reply({
      components: [container],
      flags: MessageFlags.IsComponentsV2
    });
  }
};