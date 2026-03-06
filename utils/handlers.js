const fs = require('fs');
const path = require('path');

/**
 * Load all events from the events folder
 * @param {Client} client - Discord.js client
 */
function loadEvents(client) {
  const eventsPath = path.join(__dirname, '..', 'events');
  
  if (!fs.existsSync(eventsPath)) {
    console.log('[WARNING] Events folder not found!');
    return;
  }

  const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));
  
  let loadedCount = 0;
  
  for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    
    if ('name' in event && 'execute' in event) {
      // Create a wrapper function that injects the client
      const executeWithClient = (...args) => event.execute(...args, client);
      
      // Handle different event types (once vs on)
      if (event.once) {
        client.once(event.name, executeWithClient);
      } else {
        client.on(event.name, executeWithClient);
      }
      
      loadedCount++;
      console.log(`[EVENT] Loaded: ${event.name} (${file})`);
    } else {
      console.log(`[WARNING] Event at ${filePath} is missing required "name" or "execute" property.`);
    }
  }
  
  console.log(`[EVENT] Loaded ${loadedCount} events`);
}

/**
 * Load all prefix commands from the commands/prefix folder
 * @param {Client} client - Discord.js client
 * @returns {number} Number of commands loaded
 */
function loadPrefixCommands(client) {
  const commandsPath = path.join(__dirname, '..', 'commands', 'prefix');
  
  if (!fs.existsSync(commandsPath)) {
    console.log('[WARNING] Prefix commands folder not found!');
    return 0;
  }

  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
  let loadedCount = 0;
  
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    
    if ('name' in command && 'execute' in command) {
      client.prefixCommands.set(command.name, command);
      loadedCount++;
      console.log(`[PREFIX] Loaded: ${command.name} (${file})`);
    } else {
      console.log(`[WARNING] Command at ${filePath} is missing required "name" or "execute" property.`);
    }
  }
  
  console.log(`[PREFIX] Loaded ${loadedCount} commands`);
  return loadedCount;
}

/**
 * Load all slash commands from the commands/slash folder
 * @param {Client} client - Discord.js client
 * @returns {Array} Array of slash command data for registration
 */
function loadSlashCommands(client) {
  const commandsPath = path.join(__dirname, '..', 'commands', 'slash');
  const commandsData = [];
  
  if (!fs.existsSync(commandsPath)) {
    console.log('[WARNING] Slash commands folder not found!');
    return commandsData;
  }

  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
  let loadedCount = 0;
  
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    
    if ('data' in command && 'execute' in command) {
      client.slashCommands.set(command.data.name, command);
      commandsData.push(command.data.toJSON());
      loadedCount++;
      console.log(`[SLASH] Loaded: ${command.data.name} (${file})`);
    } else {
      console.log(`[WARNING] Command at ${filePath} is missing required "data" or "execute" property.`);
    }
  }
  
  // Store the raw command data for deployment
  client.slashCommandsData = commandsData;
  
  console.log(`[SLASH] Loaded ${loadedCount} commands`);
  return commandsData;
}

/**
 * Deploy slash commands to Discord
 * @param {Client} client - Discord.js client
 * @param {Array} commands - Array of slash command data
 */
async function deployCommands(client, commands) {
  const { REST, Routes } = require('discord.js');
  
  if (!commands || commands.length === 0) {
    console.log('[DEPLOY] No commands to deploy');
    return;
  }

  const rest = new REST().setToken(process.env.BOT_TOKEN);
  
  try {
    console.log(`\n🚀 Deploying ${commands.length} application commands...`);

    let data;
    
    if (process.env.GUILD_ID) {
      // Deploy to specific guild (instant, good for development)
      data = await rest.put(
        Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
        { body: commands }
      );
      console.log(`✅ Deployed to guild: ${process.env.GUILD_ID}`);
    } else {
      // Deploy globally (takes up to 1 hour)
      data = await rest.put(
        Routes.applicationCommands(process.env.CLIENT_ID),
        { body: commands }
      );
      console.log('✅ Deployed globally (may take up to 1 hour)');
    }

    console.log(`📊 Successfully registered ${data.length} commands\n`);
    
    // Log registered commands
    console.log('📋 Registered commands:');
    data.forEach(cmd => {
      console.log(`   /${cmd.name} - ${cmd.description}`);
    });
    console.log('');
    
  } catch (error) {
    console.error('❌ Error deploying commands:', error);
  }
}

/**
 * Delete all commands (for cleanup)
 * @param {boolean} global - Whether to delete global commands
 * @param {boolean} guild - Whether to delete guild commands
 */
async function deleteCommands(global = false, guild = false) {
  const { REST, Routes } = require('discord.js');
  
  const rest = new REST().setToken(process.env.BOT_TOKEN);
  
  try {
    if (global) {
      await rest.put(
        Routes.applicationCommands(process.env.CLIENT_ID),
        { body: [] }
      );
      console.log('🗑️ Deleted all global commands');
    }
    
    if (guild && process.env.GUILD_ID) {
      await rest.put(
        Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
        { body: [] }
      );
      console.log(`🗑️ Deleted all guild commands for ${process.env.GUILD_ID}`);
    }
  } catch (error) {
    console.error('❌ Error deleting commands:', error);
  }
}

module.exports = {
  loadEvents,
  loadPrefixCommands,
  loadSlashCommands,
  deployCommands,
  deleteCommands
};
