const {
  ContainerBuilder,
  TextDisplayBuilder,
  SeparatorBuilder,
  SeparatorSpacingSize,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  SectionBuilder,
  ThumbnailBuilder,
  UnfurledMediaItemBuilder
} = require('discord.js');

// ============================================
// Color Constants
// ============================================
const Colors = {
  // Discord brand colors
  BLURPLE: 0x5865F2,
  GREEN: 0x57F287,
  YELLOW: 0xFEE75C,
  FUCHSIA: 0xEB459E,
  RED: 0xED4245,
  WHITE: 0xFFFFFF,
  
  // Common colors
  INFO: 0x3498DB,
  SUCCESS: 0x2ECC71,
  WARNING: 0xF1C40F,
  ERROR: 0xE74C3C,
  
  // Theme colors
  PRIMARY: 0x5865F2,
  SECONDARY: 0x99AAB5
};

// ============================================
// Quick Container Builders
// ============================================

/**
 * Create a simple info container
 * @param {string} title - The title text
 * @param {string} content - The main content
 * @param {number} [color] - Optional accent color
 */
function createInfoContainer(title, content, color = Colors.INFO) {
  return new ContainerBuilder()
    .setAccentColor(color)
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(`## ℹ️ ${title}\n\n${content}`)
    );
}

/**
 * Create a success container
 * @param {string} title - The title text
 * @param {string} content - The main content
 */
function createSuccessContainer(title, content) {
  return new ContainerBuilder()
    .setAccentColor(Colors.SUCCESS)
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(`## ✅ ${title}\n\n${content}`)
    );
}

/**
 * Create an error container
 * @param {string} title - The title text
 * @param {string} content - The main content
 */
function createErrorContainer(title, content) {
  return new ContainerBuilder()
    .setAccentColor(Colors.ERROR)
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(`## ❌ ${title}\n\n${content}`)
    );
}

/**
 * Create a warning container
 * @param {string} title - The title text
 * @param {string} content - The main content
 */
function createWarningContainer(title, content) {
  return new ContainerBuilder()
    .setAccentColor(Colors.WARNING)
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(`## ⚠️ ${title}\n\n${content}`)
    );
}

// ============================================
// Button Builders
// ============================================

/**
 * Create a primary button
 * @param {string} customId - The button custom ID
 * @param {string} label - The button label
 * @param {string} [emoji] - Optional emoji
 */
function createPrimaryButton(customId, label, emoji) {
  const button = new ButtonBuilder()
    .setCustomId(customId)
    .setLabel(label)
    .setStyle(ButtonStyle.Primary);
  
  if (emoji) button.setEmoji(emoji);
  return button;
}

/**
 * Create a success button
 * @param {string} customId - The button custom ID
 * @param {string} label - The button label
 * @param {string} [emoji] - Optional emoji
 */
function createSuccessButton(customId, label, emoji) {
  const button = new ButtonBuilder()
    .setCustomId(customId)
    .setLabel(label)
    .setStyle(ButtonStyle.Success);
  
  if (emoji) button.setEmoji(emoji);
  return button;
}

/**
 * Create a danger button
 * @param {string} customId - The button custom ID
 * @param {string} label - The button label
 * @param {string} [emoji] - Optional emoji
 */
function createDangerButton(customId, label, emoji) {
  const button = new ButtonBuilder()
    .setCustomId(customId)
    .setLabel(label)
    .setStyle(ButtonStyle.Danger);
  
  if (emoji) button.setEmoji(emoji);
  return button;
}

/**
 * Create a secondary button
 * @param {string} customId - The button custom ID
 * @param {string} label - The button label
 * @param {string} [emoji] - Optional emoji
 */
function createSecondaryButton(customId, label, emoji) {
  const button = new ButtonBuilder()
    .setCustomId(customId)
    .setLabel(label)
    .setStyle(ButtonStyle.Secondary);
  
  if (emoji) button.setEmoji(emoji);
  return button;
}

/**
 * Create a link button
 * @param {string} url - The button URL
 * @param {string} label - The button label
 * @param {string} [emoji] - Optional emoji
 */
function createLinkButton(url, label, emoji) {
  const button = new ButtonBuilder()
    .setURL(url)
    .setLabel(label)
    .setStyle(ButtonStyle.Link);
  
  if (emoji) button.setEmoji(emoji);
  return button;
}

// ============================================
// Action Row Builder
// ============================================

/**
 * Create an action row with buttons
 * @param {...ButtonBuilder} buttons - The buttons to add
 */
function createButtonRow(...buttons) {
  return new ActionRowBuilder().addComponents(buttons);
}

// ============================================
// Separator Builders
// ============================================

/**
 * Create a small separator
 * @param {boolean} [divider=true] - Whether to show the divider line
 */
function createSmallSeparator(divider = true) {
  return new SeparatorBuilder()
    .setSpacing(SeparatorSpacingSize.Small)
    .setDivider(divider);
}

/**
 * Create a large separator
 * @param {boolean} [divider=true] - Whether to show the divider line
 */
function createLargeSeparator(divider = true) {
  return new SeparatorBuilder()
    .setSpacing(SeparatorSpacingSize.Large)
    .setDivider(divider);
}

// ============================================
// Complex Container Templates
// ============================================

/**
 * Create a paginated container template
 * @param {Object} options - Pagination options
 * @param {string} options.title - The title
 * @param {string} options.content - The content
 * @param {number} options.currentPage - Current page number
 * @param {number} options.totalPages - Total pages
 * @param {number} [options.color] - Accent color
 */
function createPaginatedContainer({ title, content, currentPage, totalPages, color = Colors.BLURPLE }) {
  const container = new ContainerBuilder()
    .setAccentColor(color)
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(`## ${title}`)
    )
    .addSeparatorComponents(createSmallSeparator())
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(content)
    )
    .addSeparatorComponents(createLargeSeparator())
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(`-# Page ${currentPage} of ${totalPages}`)
    );

  // Add navigation buttons
  const navRow = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId(`page_first_${currentPage}`)
        .setLabel('⏮️')
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(currentPage === 1),
      new ButtonBuilder()
        .setCustomId(`page_prev_${currentPage}`)
        .setLabel('◀️')
        .setStyle(ButtonStyle.Primary)
        .setDisabled(currentPage === 1),
      new ButtonBuilder()
        .setCustomId(`page_next_${currentPage}`)
        .setLabel('▶️')
        .setStyle(ButtonStyle.Primary)
        .setDisabled(currentPage === totalPages),
      new ButtonBuilder()
        .setCustomId(`page_last_${currentPage}`)
        .setLabel('⏭️')
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(currentPage === totalPages)
    );

  container.addActionRowComponents(navRow);
  return container;
}

/**
 * Create a confirmation dialog container
 * @param {Object} options - Dialog options
 * @param {string} options.title - The title
 * @param {string} options.description - The description
 * @param {string} options.confirmId - Confirm button custom ID
 * @param {string} options.cancelId - Cancel button custom ID
 * @param {string} [options.confirmLabel='Confirm'] - Confirm button label
 * @param {string} [options.cancelLabel='Cancel'] - Cancel button label
 */
function createConfirmationContainer({ 
  title, 
  description, 
  confirmId, 
  cancelId,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel'
}) {
  return new ContainerBuilder()
    .setAccentColor(Colors.WARNING)
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(`## ⚠️ ${title}\n\n${description}`)
    )
    .addSeparatorComponents(createLargeSeparator())
    .addActionRowComponents(
      new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId(confirmId)
            .setLabel(confirmLabel)
            .setStyle(ButtonStyle.Danger),
          new ButtonBuilder()
            .setCustomId(cancelId)
            .setLabel(cancelLabel)
            .setStyle(ButtonStyle.Secondary)
        )
    );
}

/**
 * Create a user profile card container
 * @param {Object} user - Discord user object
 * @param {Object} [member] - Discord guild member object
 */
function createUserCard(user, member) {
  const container = new ContainerBuilder()
    .setAccentColor(member?.displayColor || Colors.BLURPLE)
    .addTextDisplayComponents(
      new TextDisplayBuilder()
        .setContent(`# 👤 ${user.username}${user.discriminator !== '0' ? `#${user.discriminator}` : ''}`)
    )
    .addSeparatorComponents(createSmallSeparator())
    .addTextDisplayComponents(
      new TextDisplayBuilder()
        .setContent(`**ID:** \`${user.id}\`
**Bot:** ${user.bot ? 'Yes ✓' : 'No ✗'}
**Created:** <t:${Math.floor(user.createdTimestamp / 1000)}:R>`)
    );

  if (member) {
    container
      .addSeparatorComponents(createSmallSeparator())
      .addTextDisplayComponents(
        new TextDisplayBuilder()
          .setContent(`**Nickname:** ${member.nickname || 'None'}
**Joined:** <t:${Math.floor(member.joinedTimestamp / 1000)}:R>
**Roles:** ${member.roles.cache.size - 1}`)
      );
  }

  return container;
}

// ============================================
// Exports
// ============================================
module.exports = {
  Colors,
  createInfoContainer,
  createSuccessContainer,
  createErrorContainer,
  createWarningContainer,
  createPrimaryButton,
  createSuccessButton,
  createDangerButton,
  createSecondaryButton,
  createLinkButton,
  createButtonRow,
  createSmallSeparator,
  createLargeSeparator,
  createPaginatedContainer,
  createConfirmationContainer,
  createUserCard
};