const {
  ContainerBuilder,
  TextDisplayBuilder,
  SeparatorBuilder,
  SeparatorSpacingSize,
  MessageFlags
} = require('discord.js');

module.exports = {
  name: 'ping',
  description: 'Check bot latency',
  aliases: ['p', 'latency'],
  cooldown: 3,
  
  async execute(message, args, client) {
    const sent = await message.reply({
      content: 'Calculating latency...',
    });

    // Calculate latencies
    const websocketLatency = client.ws.ping;
    const roundtripLatency = sent.createdTimestamp - message.createdTimestamp;

    // Create container with latency info
    const container = new ContainerBuilder()
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent('## 🏓 Pong!')
      )
      .addSeparatorComponents(
        new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small)
      )
      .addTextDisplayComponents(
        new TextDisplayBuilder()
          .setContent(`### Latency Information
📊 **WebSocket:** ${websocketLatency}ms
📡 **Roundtrip:** ${roundtripLatency}ms
⏱️ **Uptime:** <t:${Math.floor(client.readyAt / 1000)}:R>`)
      )
      .addSeparatorComponents(
        new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Large)
      )
      .addTextDisplayComponents(
        new TextDisplayBuilder()
          .setContent(`-# Last checked: <t:${Math.floor(Date.now() / 1000)}:f>`)
      );

    await sent.edit({
      content: '',
      components: [container],
      flags: MessageFlags.IsComponentsV2
    });
  }
};