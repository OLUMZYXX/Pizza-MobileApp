const { getDefaultConfig } = require('expo/metro-config')
const { withNativeWind } = require('nativewind/metro')
const path = require('path')

const config = getDefaultConfig(__dirname)

// Add resolver configuration
config.resolver.alias = {
  '@': path.resolve(__dirname, '.'),
}

// Ensure reanimated is properly handled
config.resolver.platforms = ['ios', 'android', 'native', 'web']

module.exports = withNativeWind(config, { input: './global.css' })
