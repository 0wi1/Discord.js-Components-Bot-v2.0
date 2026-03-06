const {
  SlashCommandBuilder,
  ContainerBuilder,
  TextDisplayBuilder,
  SeparatorBuilder,
  SeparatorSpacingSize,
  MessageFlags
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Check bot latency and connection status'),
  
  cooldown: 3,
  
  async execute(interaction, client) {
    // Defer reply for accurate latency measurement
    const sent = await interaction.deferReply({ fetchReply: true });

    // Calculate latencies
    const websocketLatency = client.ws.ping;
    const roundtripLatency = sent.createdTimestamp - interaction.createdTimestamp;

    // Determine latency status
    const getLatencyStatus = (latency) => {
      if (latency < 100) return '🟢 Excellent';
      if (latency < 200) return '🟡 Good';
      if (latency < 400) return '🟠 Fair';
      return '🔴 Poor';
    };

    // Create container
    const container = new ContainerBuilder()
      .setAccentColor(
        websocketLatency < 200 ? 0x57F287 : // Green
        websocketLatency < 400 ? 0xFEE75C : // Yellow
        0xED4245 // Red
      )
      .addTextDisplayComponents(
        new TextDisplayBuilder()
          .setContent('# 🏓 Pong!')
      )
      .addSeparatorComponents(
        new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small)
      )
      .addTextDisplayComponents(
        new TextDisplayBuilder()
          .setContent(`### 📊 Latency Metrics

| Type | Latency | Status |
|------|---------|--------|
| WebSocket | ${websocketLatency}ms | ${getLatencyStatus(websocketLatency)} |
| Roundtrip | ${roundtripLatency}ms | ${getLatencyStatus(roundtripLatency)} |`)
      )
      .addSeparatorComponents(
        new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small)
      )
      .addTextDisplayComponents(
        new TextDisplayBuilder()
          .setContent(`### ℹ️ What do these mean?

**WebSocket Latency:** The time it takes for a message to travel from Discord to the bot and back.
**Roundtrip Latency:** The total time including processing your command and sending the response.`)
      )
      .addSeparatorComponents(
        new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small)
      )
      .addTextDisplayComponents(
        new TextDisplayBuilder()
          .setContent(`### ⏱️ Bot Uptime
Started: <t:${Math.floor(client.readyAt / 1000)}:F>
Running for: <t:${Math.floor(client.readyAt / 1000)}:R>`)
      );

    await interaction.editReply({
      components: [container],
      flags: MessageFlags.IsComponentsV2
    });
  }
};
