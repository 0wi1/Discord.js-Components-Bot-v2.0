require('dotenv').config();

const { REST, Routes } = require('discord.js');

const rest = new REST().setToken(process.env.BOT_TOKEN);

const mode = process.argv[2]?.toLowerCase();

if (!mode || !['global', 'guild', 'all'].includes(mode)) {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('       DELETE COMMANDS UTILITY');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('');
  console.log('Usage:');
  console.log('  node delete-commands.js global   - Delete all global commands');
  console.log('  node delete-commands.js guild    - Delete all guild commands');
  console.log('  node delete-commands.js all      - Delete both');
  console.log('');
  process.exit(0);
}

async function deleteGlobalCommands() {
  try {
    console.log('🗑️ Deleting all global commands...');
    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: [] }
    );
    console.log('✅ Deleted all global commands');
  } catch (error) {
    console.error('❌ Error deleting global commands:', error);
  }
}

async function deleteGuildCommands() {
  if (!process.env.GUILD_ID) {
    console.log('⚠️ No GUILD_ID set in .env - skipping guild commands');
    return;
  }

  try {
    console.log(`🗑️ Deleting all guild commands for ${process.env.GUILD_ID}...`);
    await rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
      { body: [] }
    );
    console.log('✅ Deleted all guild commands');
  } catch (error) {
    console.error('❌ Error deleting guild commands:', error);
  }
}

async function main() {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('       DELETE COMMANDS UTILITY');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('');

  if (mode === 'global' || mode === 'all') {
    await deleteGlobalCommands();
  }

  if (mode === 'guild' || mode === 'all') {
    await deleteGuildCommands();
  }

  console.log('');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Done! Run `npm run register` to re-register commands.');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

main();
