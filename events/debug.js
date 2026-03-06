module.exports = {
  name: 'debug',
  enabled: false, // Set to true to enable debug logging
  
  execute(info, client) {
    // Only log if enabled
    if (!this.enabled) return;
    
    // Filter out noise - only log important debug info
    const ignorePatterns = [
      '[WS =>',
      '[Heartbeat',
      'Shard',
      'Unknown',
    ];
    
    if (ignorePatterns.some(pattern => info.includes(pattern))) {
      return;
    }
    
    console.log(`[DEBUG] ${info}`);
  }
};