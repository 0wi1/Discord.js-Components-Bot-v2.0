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
  name: 'interactionCreate',
  
  async execute(interaction, client) {
    // Handle slash commands
    if (interaction.isChatInputCommand()) {
      await handleSlashCommand(interaction, client);
      return;
    }

    // Handle button interactions
    if (interaction.isButton()) {
      await handleButton(interaction, client);
      return;
    }

    // Handle select menu interactions (for future use)
    if (interaction.isStringSelectMenu()) {
      await handleSelectMenu(interaction, client);
      return;
    }

    // Handle modal submissions (for future use)
    if (interaction.isModalSubmit()) {
      await handleModal(interaction, client);
      return;
    }
  }
};

/**
 * Handle slash command interactions
 */
async function handleSlashCommand(interaction, client) {
  const command = client.slashCommands.get(interaction.commandName);

  if (!command) {
    console.error(`[ERROR] No command matching ${interaction.commandName}`);
    return;
  }

  // Check cooldown
  const { cooldowns } = client;
  if (!cooldowns.has(command.data.name)) {
    cooldowns.set(command.data.name, new Map());
  }

  const now = Date.now();
  const timestamps = cooldowns.get(command.data.name);
  const cooldownAmount = (command.cooldown || 3) * 1000;

  if (timestamps.has(interaction.user.id)) {
    const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;
    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000;
      
      const container = new ContainerBuilder()
        .setAccentColor(0xFEE75C)
        .addTextDisplayComponents(
          new TextDisplayBuilder()
            .setContent(`## ⏳ Cooldown\nPlease wait **${timeLeft.toFixed(1)}** seconds before using \`/${interaction.commandName}\` again.`)
        );
      
      return interaction.reply({ 
        components: [container], 
        flags: MessageFlags.IsComponentsV2, 
        ephemeral: true 
      });
    }
  }

  timestamps.set(interaction.user.id, now);
  setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

  // Execute command
  try {
    await command.execute(interaction, client);
  } catch (error) {
    console.error(`[ERROR] Slash command ${interaction.commandName}:`, error);

    const errorContainer = new ContainerBuilder()
      .setAccentColor(0xED4245)
      .addTextDisplayComponents(
        new TextDisplayBuilder()
          .setContent('## ❌ Command Error\nThere was an error executing this command!\n\n-# The error has been logged. Please try again later.')
      );

    try {
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ 
          components: [errorContainer], 
          flags: MessageFlags.IsComponentsV2, 
          ephemeral: true 
        });
      } else {
        await interaction.reply({ 
          components: [errorContainer], 
          flags: MessageFlags.IsComponentsV2, 
          ephemeral: true 
        });
      }
    } catch (replyError) {
      console.error('[ERROR] Failed to send error response:', replyError);
    }
  }
}

/**
 * Handle button interactions
 */
async function handleButton(interaction, client) {
  const { customId } = interaction;

  // Button handlers map
  const buttonHandlers = {
    // Ping/Pong buttons
    'ping_button': async () => {
      const container = new ContainerBuilder()
        .setAccentColor(0x5865F2)
        .addTextDisplayComponents(
          new TextDisplayBuilder().setContent('## 🏓 Pong!\nYou clicked the ping button!')
        )
        .addActionRowComponents(
          new ActionRowBuilder()
            .addComponents(
              new ButtonBuilder()
                .setCustomId('pong_button')
                .setLabel('Ping Again!')
                .setStyle(ButtonStyle.Success)
                .setEmoji('🔄')
            )
        );
      await interaction.update({ components: [container] });
    },

    'pong_button': async () => {
      const container = new ContainerBuilder()
        .setAccentColor(0x57F287)
        .addTextDisplayComponents(
          new TextDisplayBuilder().setContent('## 🏓 Ping!\nYou clicked the pong button!')
        )
        .addActionRowComponents(
          new ActionRowBuilder()
            .addComponents(
              new ButtonBuilder()
                .setCustomId('ping_button')
                .setLabel('Pong Again!')
                .setStyle(ButtonStyle.Primary)
                .setEmoji('🏓')
            )
        );
      await interaction.update({ components: [container] });
    },

    // Info/Help buttons
    'info_button': async () => {
      const container = new ContainerBuilder()
        .setAccentColor(0x5865F2)
        .addTextDisplayComponents(
          new TextDisplayBuilder()
            .setContent(`## 📊 Bot Information
            
**Bot Name:** ${client.user.tag}
**Servers:** ${client.guilds.cache.size}
**Users:** ${client.users.cache.size}
**Prefix:** \`${process.env.PREFIX || '!'}\`
**Uptime:** <t:${Math.floor(client.readyAt / 1000)}:R>`)
        )
        .addSeparatorComponents(
          new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Large)
        )
        .addActionRowComponents(
          new ActionRowBuilder()
            .addComponents(
              new ButtonBuilder()
                .setCustomId('back_button')
                .setLabel('Back')
                .setStyle(ButtonStyle.Secondary)
                .setEmoji('⬅️')
            )
        );
      await interaction.update({ components: [container] });
    },

    'back_button': async () => {
      const container = new ContainerBuilder()
        .setAccentColor(0x5865F2)
        .addTextDisplayComponents(
          new TextDisplayBuilder().setContent('## 🏠 Main Menu\nWelcome to the bot! Use the buttons below to navigate.')
        )
        .addActionRowComponents(
          new ActionRowBuilder()
            .addComponents(
              new ButtonBuilder()
                .setCustomId('info_button')
                .setLabel('Bot Info')
                .setStyle(ButtonStyle.Primary)
                .setEmoji('📊'),
              new ButtonBuilder()
                .setCustomId('help_button')
                .setLabel('Help')
                .setStyle(ButtonStyle.Success)
                .setEmoji('❓')
            )
        );
      await interaction.update({ components: [container] });
    },

    'help_button': async () => {
      const prefix = process.env.PREFIX || '!';
      const container = new ContainerBuilder()
        .setAccentColor(0x57F287)
        .addTextDisplayComponents(
          new TextDisplayBuilder()
            .setContent(`## 📚 Help Menu

### Prefix Commands
\`${prefix}ping\` - Check bot latency
\`${prefix}hello\` - Say hello
\`${prefix}userinfo [user]\` - Get user info
\`${prefix}serverinfo\` - Get server info
\`${prefix}components\` - See component examples

### Slash Commands
\`/ping\` - Check bot latency
\`/hello\` - Say hello
\`/info\` - Get bot information
\`/userinfo [user]\` - Get user info
\`/button-demo\` - Button demonstration`)
        )
        .addActionRowComponents(
          new ActionRowBuilder()
            .addComponents(
              new ButtonBuilder()
                .setCustomId('back_button')
                .setLabel('Back')
                .setStyle(ButtonStyle.Secondary)
                .setEmoji('⬅️')
            )
        );
      await interaction.update({ components: [container] });
    },

    // Social buttons
    'wave_back': async () => {
      const container = new ContainerBuilder()
        .setAccentColor(0x57F287)
        .addTextDisplayComponents(
          new TextDisplayBuilder()
            .setContent(`## 👋 Wave Received!

${interaction.user.username} waved back! Hello there! 🎉`)
        );
      await interaction.update({ components: [container] });
    },

    'hug': async () => {
      const container = new ContainerBuilder()
        .setAccentColor(0xEB459E)
        .addTextDisplayComponents(
          new TextDisplayBuilder()
            .setContent(`## 🤗 Hug Sent!

${interaction.user.username} sent a big warm hug! 💜`)
        );
      await interaction.update({ components: [container] });
    },

    'highfive': async () => {
      const container = new ContainerBuilder()
        .setAccentColor(0xFEE75C)
        .addTextDisplayComponents(
          new TextDisplayBuilder()
            .setContent(`## ✋ High Five!

${interaction.user.username} gave a high five! Awesome! 🙌`)
        );
      await interaction.update({ components: [container] });
    }
  };

  // Style demo buttons - just acknowledge
  const styleDemos = ['style_primary', 'style_secondary', 'style_success', 'style_danger'];
  if (styleDemos.includes(customId)) {
    const styleNames = {
      'style_primary': 'Primary (Blurple)',
      'style_secondary': 'Secondary (Grey)',
      'style_success': 'Success (Green)',
      'style_danger': 'Danger (Red)'
    };
    
    const container = new ContainerBuilder()
      .setAccentColor(0x5865F2)
      .addTextDisplayComponents(
        new TextDisplayBuilder()
          .setContent(`## 🔘 Button Style: ${styleNames[customId]}\n\nYou clicked a **${styleNames[customId]}** button!`)
      );
    
    return interaction.reply({ 
      components: [container], 
      flags: MessageFlags.IsComponentsV2, 
      ephemeral: true 
    });
  }

  // Emoji demo buttons
  const emojiDemos = ['emoji_like', 'emoji_love', 'emoji_celebrate', 'emoji_rocket'];
  if (emojiDemos.includes(customId)) {
    const emojis = {
      'emoji_like': '👍',
      'emoji_love': '❤️',
      'emoji_celebrate': '🎉',
      'emoji_rocket': '🚀'
    };
    
    const container = new ContainerBuilder()
      .setAccentColor(0x5865F2)
      .addTextDisplayComponents(
        new TextDisplayBuilder()
          .setContent(`## ${emojis[customId]} Reaction!\n\nYou reacted with ${emojis[customId]}!`)
      );
    
    return interaction.reply({ 
      components: [container], 
      flags: MessageFlags.IsComponentsV2, 
      ephemeral: true 
    });
  }

  // Execute handler if exists
  const handler = buttonHandlers[customId];
  if (handler) {
    try {
      await handler();
    } catch (error) {
      console.error(`[ERROR] Button handler ${customId}:`, error);
      
      const errorContainer = new ContainerBuilder()
        .setAccentColor(0xED4245)
        .addTextDisplayComponents(
          new TextDisplayBuilder().setContent('## ❌ Error\nSomething went wrong with this button.')
        );
      
      try {
        await interaction.reply({ 
          components: [errorContainer], 
          flags: MessageFlags.IsComponentsV2, 
          ephemeral: true 
        });
      } catch {
        // Ignore if we can't respond
      }
    }
  } else {
    // Unknown button - send ephemeral response
    const container = new ContainerBuilder()
      .setAccentColor(0x99AAB5)
      .addTextDisplayComponents(
        new TextDisplayBuilder()
          .setContent(`## ❓ Unknown Button\n\nNo handler found for: \`${customId}\`\n\n-# This button may have expired or not been implemented yet.`)
      );
    
    await interaction.reply({ 
      components: [container], 
      flags: MessageFlags.IsComponentsV2, 
      ephemeral: true 
    });
  }
}

/**
 * Handle select menu interactions (placeholder)
 */
async function handleSelectMenu(interaction, client) {
  // Implement select menu handling if needed
  await interaction.reply({
    content: 'Select menu interaction received!',
    ephemeral: true
  });
}

/**
 * Handle modal submissions (placeholder)
 */
async function handleModal(interaction, client) {
  // Implement modal handling if needed
  await interaction.reply({
    content: 'Modal submission received!',
    ephemeral: true
  });
}