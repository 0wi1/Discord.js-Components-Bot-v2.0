require('dotenv').config();

const {
  Client,
  GatewayIntentBits,
  Partials
} = require('discord.js');

const { 
  loadEvents, 
  loadPrefixCommands, 
  loadSlashCommands 
} = require('./utils/handlers');

// ============================================
// Validate Environment Variables
// ============================================
const requiredEnvVars = ['BOT_TOKEN', 'CLIENT_ID'];
const missingEnvVars = requiredEnvVars.filter(env => !process.env[env]);

if (missingEnvVars.length > 0) {
  console.error('❌ Missing required environment variables:');
  missingEnvVars.forEach(env => console.error(`   - ${env}`));
  console.error('\nPlease check your .env file and try again.');
  process.exit(1);
}

// ============================================
// Client Setup with Required Intents
// ============================================
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent, // Required for prefix commands
    GatewayIntentBits.GuildMembers
  ],
  partials: [
    Partials.Channel,
    Partials.Message,
    Partials.Reaction,
    Partials.GuildMember,
    Partials.User
  ],
  // Enable all gateway errors to be emitted
  failIfNotExists: false
});

// ============================================
// Initialize Collections
// ============================================
client.prefixCommands = new Map();
client.slashCommands = new Map();
client.slashCommandsData = []; // Stores raw command data for deployment
client.cooldowns = new Map();

// ============================================
// Load Commands & Events
// ============================================
console.log('');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('       DISCORD.JS BOT - COMPONENTS V2     ');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('');

// Load prefix commands
loadPrefixCommands(client);
console.log('');

// Load slash commands (stores in client.slashCommands)
loadSlashCommands(client);
console.log('');

// Load events
loadEvents(client);
console.log('');

// ============================================
// Process Error Handlers
// ============================================
process.on('unhandledRejection', (reason, promise) => {
  console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.error('❌ UNHANDLED REJECTION');
  console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.error('Reason:', reason);
  console.error('Promise:', promise);
  console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
});

process.on('uncaughtException', (error, origin) => {
  console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.error('❌ UNCAUGHT EXCEPTION');
  console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.error('Error:', error);
  console.error('Origin:', origin);
  console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  // Attempt graceful shutdown
  process.exit(1);
});

process.on('warning', (warning) => {
  console.warn('⚠️ Warning:', warning.name, '-', warning.message);
});

// ============================================
// Graceful Shutdown
// ============================================
const gracefulShutdown = async (signal) => {
  console.log(`\n📡 Received ${signal}. Shutting down gracefully...`);
  
  try {
    client.destroy();
    console.log('✅ Discord client destroyed');
  } catch (error) {
    console.error('❌ Error during shutdown:', error);
  }
  
  console.log('👋 Goodbye!');
  process.exit(0);
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

// ============================================
// Login
// ============================================
console.log('🔐 Logging in to Discord...');
client.login(process.env.BOT_TOKEN).catch(error => {
  console.error('❌ Failed to login:', error);
  process.exit(1);
});