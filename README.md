# Discord.js Components Bot v2.0

<div align="center">

![Discord.js](https://img.shields.io/badge/Discord.js-14.18.0-5865F2?style=for-the-badge&logo=discord&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-57F287?style=for-the-badge)

**A modern Discord.js bot using Components V2 - No EmbedBuilder!**

Built with ❤️ by **William | 0.wi1**

</div>

---

## 📖 Table of Contents

- [✨ Features](#-features)
- [🚀 Getting Started](#-getting-started)
- [📁 Project Structure](#-project-structure)
- [📋 Available Commands](#-available-commands)
- [🛠️ Scripts](#️-scripts)
- [🧩 Component Examples](#-component-examples)
- [📝 Adding New Commands](#-adding-new-commands)
- [🎯 Adding New Events](#-adding-new-events)
- [🎨 Utility Functions](#-utility-functions)
- [⚙️ Configuration](#️-configuration)
- [📚 Resources](#-resources)
- [👨‍💻 Developer](#️-developer)

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 📝 **Prefix Commands** | Traditional `!command` style commands |
| 🔀 **Slash Commands** | Modern `/command` style commands with auto-registration |
| 🧩 **Components V2** | Using the latest Discord component system |
| 🎨 **ContainerBuilder** | Beautiful container layouts with accent colors |
| 📊 **TextDisplayBuilder** | Rich markdown text displays with tables & lists |
| ➖ **SeparatorBuilder** | Visual separators with configurable spacing |
| 🔘 **ButtonBuilder** | Interactive buttons with all 5 styles |
| ⚡ **Cooldowns** | Built-in command cooldown system |
| 🛡️ **Error Handling** | Comprehensive error handling with user feedback |
| 📁 **Modular Events** | Events organized in separate files |
| 🚀 **Auto-Deploy** | Commands auto-register on bot startup |
| 🔄 **Activity Rotation** | Dynamic bot status rotation |

### ❌ No EmbedBuilder!

This bot uses the **new Components V2 system** exclusively:

```javascript
// ❌ Old way (EmbedBuilder) - NOT USED
const embed = new EmbedBuilder()
  .setTitle('Hello')
  .setDescription('World');

// ✅ New way (Components V2) - WHAT WE USE
const container = new ContainerBuilder()
  .addTextDisplayComponents(
    new TextDisplayBuilder().setContent('# Hello\n\nWorld')
  );
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js v18** or higher
- A **Discord Bot Token** ([Get one here](https://discord.com/developers/applications))

### Installation

1. **Clone or download this bot**

2. **Install dependencies:**
   ```bash
   cd discord-bot
   npm install
   ```

3. **Create a `.env` file:**
   ```bash
   cp .env.example .env
   ```

4. **Edit `.env` with your bot details:**
   ```env
   BOT_TOKEN=your_bot_token_here
   CLIENT_ID=your_client_id_here
   GUILD_ID=your_guild_id_here_optional
   PREFIX=!
   ```

5. **Start the bot:**
   ```bash
   npm start
   ```

> **Note:** Commands are automatically registered when the bot starts! No need to run a separate registration script.

### Development Mode

```bash
npm run dev
```

This runs the bot with auto-reload when files change.

---

## 📁 Project Structure

```
discord-bot/
├── commands/
│   ├── prefix/                 # Prefix commands (!cmd)
│   │   ├── ping.js            # Latency check command
│   │   ├── hello.js           # Greeting command
│   │   ├── userinfo.js        # User information
│   │   ├── serverinfo.js      # Server information
│   │   ├── components.js      # Component showcase
│   │   └── help.js            # Help menu
│   │
│   └── slash/                  # Slash commands (/cmd)
│       ├── ping.js            # Latency check command
│       ├── hello.js           # Greeting command
│       ├── info.js            # Bot information
│       ├── userinfo.js        # User information
│       ├── serverinfo.js      # Server information
│       └── button-demo.js     # Button demonstration
│
├── events/                     # Event handlers
│   ├── ready.js               # Bot ready event
│   ├── messageCreate.js       # Prefix command handler
│   ├── interactionCreate.js   # Slash & button handler
│   ├── guildCreate.js         # Server join event
│   ├── guildDelete.js         # Server leave event
│   ├── error.js               # Error handling
│   ├── warn.js                # Warning handling
│   ├── debug.js               # Debug logging
│   └── shard*.js              # Shard events
│
├── utils/
│   ├── handlers.js            # Event & command loaders
│   └── components.js          # Reusable component builders
│
├── index.js                   # Main bot entry point
├── delete-commands.js         # Command cleanup utility
├── package.json
├── .env.example
└── README.md
```

---

## 📋 Available Commands

### Prefix Commands (`!` by default)

| Command | Aliases | Description | Cooldown |
|---------|---------|-------------|----------|
| `!ping` | `!p`, `!latency` | Check bot latency | 3s |
| `!hello` | `!hi`, `!hey`, `!greet` | Say hello to someone | 2s |
| `!userinfo [user]` | `!ui`, `!user`, `!whois` | Get user information | 5s |
| `!serverinfo` | `!si`, `!server` | Get server information | 5s |
| `!components` | `!comp`, `!demo` | Component showcase | 5s |
| `!help` | `!h`, `!commands` | Show help menu | 3s |

### Slash Commands

| Command | Description | Cooldown |
|---------|-------------|----------|
| `/ping` | Check bot latency and status | 3s |
| `/hello [user]` | Say hello to someone | 2s |
| `/info` | Get bot information | 5s |
| `/userinfo [user]` | Get user information | 5s |
| `/serverinfo` | Get server information | 5s |
| `/button-demo` | Interactive button demonstration | 3s |

---

## 🛠️ Scripts

```bash
# Start the bot
npm start

# Start with auto-reload (development)
npm run dev

# Manually register commands
npm run register

# Delete all global commands
npm run delete-global

# Delete guild commands
npm run delete-guild

# Delete all commands (global + guild)
npm run delete-all
```

---

## 🧩 Component Examples

### ContainerBuilder

The main wrapper for all Components V2 content:

```javascript
const { ContainerBuilder, TextDisplayBuilder, SeparatorBuilder, SeparatorSpacingSize, MessageFlags } = require('discord.js');

const container = new ContainerBuilder()
  .setAccentColor(0x5865F2) // Discord Blurple
  .addTextDisplayComponents(
    new TextDisplayBuilder().setContent('# Hello World!')
  )
  .addSeparatorComponents(
    new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Large)
  )
  .addTextDisplayComponents(
    new TextDisplayBuilder().setContent('This is some content.')
  );

await interaction.reply({
  components: [container],
  flags: MessageFlags.IsComponentsV2
});
```

### TextDisplayBuilder

Rich text with full markdown support:

```javascript
const textDisplay = new TextDisplayBuilder()
  .setContent(`# Title
## Subtitle

This supports **bold**, *italic*, ~~strikethrough~~, and \`code\`!

- Bullet points
- Work great

1. Numbered lists
2. Also work

> Blockquotes are supported!

| Table | Works |
|-------|-------|
| Yes   | ✓     |

\`\`\`javascript
console.log('Code blocks with syntax highlighting!');
\`\`\`

-# Small text (subtext)`);
```

### SeparatorBuilder

Visual separators with configurable spacing:

```javascript
const { SeparatorBuilder, SeparatorSpacingSize } = require('discord.js');

// Small separator with divider line
const smallSep = new SeparatorBuilder()
  .setSpacing(SeparatorSpacingSize.Small)
  .setDivider(true);

// Large separator without divider line
const largeSep = new SeparatorBuilder()
  .setSpacing(SeparatorSpacingSize.Large)
  .setDivider(false);
```

### ButtonBuilder

All 5 button styles:

```javascript
const { ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

// Primary (Blurple)
const primaryBtn = new ButtonBuilder()
  .setCustomId('primary')
  .setLabel('Primary')
  .setStyle(ButtonStyle.Primary)
  .setEmoji('🎉');

// Secondary (Grey)
const secondaryBtn = new ButtonBuilder()
  .setCustomId('secondary')
  .setLabel('Secondary')
  .setStyle(ButtonStyle.Secondary);

// Success (Green)
const successBtn = new ButtonBuilder()
  .setCustomId('success')
  .setLabel('Success')
  .setStyle(ButtonStyle.Success);

// Danger (Red)
const dangerBtn = new ButtonBuilder()
  .setCustomId('danger')
  .setLabel('Danger')
  .setStyle(ButtonStyle.Danger);

// Link (Redirects to URL)
const linkBtn = new ButtonBuilder()
  .setURL('https://discord.js.org')
  .setLabel('Documentation')
  .setStyle(ButtonStyle.Link);

// Create action row
const row = new ActionRowBuilder()
  .addComponents(primaryBtn, secondaryBtn, successBtn, dangerBtn);
```

### MessageFlags

Required for Components V2:

```javascript
const { MessageFlags } = require('discord.js');

// Always use this flag when sending Components V2
await interaction.reply({
  components: [container],
  flags: MessageFlags.IsComponentsV2
});

// For ephemeral (only visible to user)
await interaction.reply({
  components: [container],
  flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral]
});
```

---

## 📝 Adding New Commands

### Adding a Prefix Command

Create a file in `commands/prefix/`:

```javascript
const { ContainerBuilder, TextDisplayBuilder, MessageFlags } = require('discord.js');

module.exports = {
  name: 'mycommand',
  description: 'My custom command',
  aliases: ['mc', 'mycmd'],       // Optional aliases
  cooldown: 5,                     // Cooldown in seconds (default: 3)
  
  async execute(message, args, client) {
    const container = new ContainerBuilder()
      .setAccentColor(0x5865F2)
      .addTextDisplayComponents(
        new TextDisplayBuilder()
          .setContent(`## My Command\n\nHello, ${message.author.username}!\n\nArguments: ${args.join(' ') || 'None'}`)
      );

    await message.reply({
      components: [container],
      flags: MessageFlags.IsComponentsV2
    });
  }
};
```

### Adding a Slash Command

Create a file in `commands/slash/`:

```javascript
const { 
  SlashCommandBuilder, 
  ContainerBuilder, 
  TextDisplayBuilder, 
  MessageFlags 
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mycommand')
    .setDescription('My custom command')
    .addStringOption(option =>
      option
        .setName('input')
        .setDescription('Some input')
        .setRequired(false)
    )
    .addUserOption(option =>
      option
        .setName('user')
        .setDescription('Target user')
        .setRequired(false)
    ),
  
  cooldown: 5,
  
  async execute(interaction, client) {
    const input = interaction.options.getString('input') || 'No input';
    const user = interaction.options.getUser('user') || interaction.user;
    
    const container = new ContainerBuilder()
      .setAccentColor(0x5865F2)
      .addTextDisplayComponents(
        new TextDisplayBuilder()
          .setContent(`## My Command\n\n**Input:** ${input}\n**User:** ${user}`)
      );

    await interaction.reply({
      components: [container],
      flags: MessageFlags.IsComponentsV2
    });
  }
};
```

---

## 🎯 Adding New Events

Create a file in `events/`:

```javascript
// events/myEvent.js

module.exports = {
  name: 'eventName',  // Discord.js event name
  once: false,        // Set to true for one-time events (like 'ready')
  
  async execute(...args, client) {
    // Event logic here
    // client is always passed as the last argument
    console.log('Event triggered!');
  }
};
```

The event will be automatically loaded when the bot starts!

### Available Events

| Event | Args | Description |
|-------|------|-------------|
| `clientReady` | `(client)` | Bot is ready |
| `messageCreate` | `(message, client)` | New message received |
| `interactionCreate` | `(interaction, client)` | Slash command or button clicked |
| `guildCreate` | `(guild, client)` | Bot joined a server |
| `guildDelete` | `(guild, client)` | Bot left a server |
| `error` | `(error, client)` | Discord client error |
| `warn` | `(warning, client)` | Discord client warning |
| `debug` | `(info, client)` | Debug info (disabled by default) |

---

## 🎨 Utility Functions

The `utils/components.js` file provides helpful builders:

```javascript
const {
  // Colors
  Colors,
  
  // Quick containers
  createInfoContainer,
  createSuccessContainer,
  createErrorContainer,
  createWarningContainer,
  
  // Quick buttons
  createPrimaryButton,
  createSuccessButton,
  createDangerButton,
  createSecondaryButton,
  createLinkButton,
  createButtonRow,
  
  // Separators
  createSmallSeparator,
  createLargeSeparator,
  
  // Complex templates
  createPaginatedContainer,
  createConfirmationContainer,
  createUserCard
} = require('./utils/components');

// Quick success message
const success = createSuccessContainer(
  'Operation Complete',
  'Your action was successful!'
);

// Quick error message
const error = createErrorContainer(
  'Error',
  'Something went wrong!'
);

// Confirmation dialog with buttons
const confirm = createConfirmationContainer({
  title: 'Delete Item?',
  description: 'This action cannot be undone.',
  confirmId: 'confirm_delete',
  cancelId: 'cancel_delete',
  confirmLabel: 'Delete',
  cancelLabel: 'Cancel'
});

// User profile card
const userCard = createUserCard(user, member);
```

### Available Colors

```javascript
const { Colors } = require('./utils/components');

// Discord brand colors
Colors.BLURPLE   // 0x5865F2
Colors.GREEN     // 0x57F287
Colors.YELLOW    // 0xFEE75C
Colors.FUCHSIA   // 0xEB459E
Colors.RED       // 0xED4245
Colors.WHITE     // 0xFFFFFF

// Semantic colors
Colors.INFO      // 0x3498DB
Colors.SUCCESS   // 0x2ECC71
Colors.WARNING   // 0xF1C40F
Colors.ERROR     // 0xE74C3C
```

---

## ⚙️ Configuration

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `BOT_TOKEN` | ✅ Yes | Your Discord bot token |
| `CLIENT_ID` | ✅ Yes | Your bot's client/application ID |
| `GUILD_ID` | ❌ No | Guild ID for faster command registration (dev mode) |
| `PREFIX` | ❌ No | Prefix for text commands (default: `!`) |

### Command vs Global Registration

| Mode | When | Speed | Use Case |
|------|------|-------|----------|
| **Guild** | `GUILD_ID` is set | Instant | Development |
| **Global** | `GUILD_ID` is not set | Up to 1 hour | Production |

### Required Bot Permissions

Invite your bot with these permissions:

```
Bot Permissions: 8 (Administrator)
Scopes: bot, applications.commands
```

Or use this invite link format:
```
https://discord.com/oauth2/authorize?client_id=YOUR_CLIENT_ID&permissions=8&scope=bot%20applications.commands
```

### Required Intents

The bot uses these intents:

| Intent | Purpose |
|--------|---------|
| `Guilds` | Basic server info |
| `GuildMessages` | Reading messages |
| `MessageContent` | Reading message content (prefix commands) |
| `GuildMembers` | Member information |

---

## 📚 Resources

- [Discord.js Documentation](https://discord.js.org/docs)
- [Discord API Documentation](https://discord.com/developers/docs)
- [Discord.js Guide](https://discordjs.guide/)
- [Components V2 Guide](https://discord.com/developers/docs/components/reference)

---

## 👨‍💻 Developer

<div align="center">

### Made with ❤️ by **William | 0.wi1**

[![Discord](https://img.shields.io/badge/Discord-0.wi1-5865F2?style=for-the-badge&logo=discord&logoColor=white)](https://discord.com/users/0.wi1)

</div>

---

## 📄 License

This project is licensed under the **MIT License** - feel free to use and modify!

---

<div align="center">

**If you like this project, give it a ⭐!**

</div>
