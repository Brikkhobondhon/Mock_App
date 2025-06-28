const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Exclude expo-sqlite on web to prevent WASM errors
config.resolver.platforms = ['ios', 'android', 'native', 'web'];
config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];

// Platform-specific resolver
const originalResolver = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  // Block expo-sqlite on web platform
  if (platform === 'web' && moduleName.includes('expo-sqlite')) {
    return {
      type: 'empty',
    };
  }
  
  // Use default resolver for other cases
  if (originalResolver) {
    return originalResolver(context, moduleName, platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config; 