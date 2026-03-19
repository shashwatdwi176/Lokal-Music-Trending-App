const { getDefaultConfig } = require('@expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Alias native-only libraries to safe web mocks when bundling for web.
// This prevents Metro from crashing on imports that have no web-compatible implementation.
config.resolver.resolveRequest = (context, moduleName, platform) => {
    if (platform === 'web') {
        // Mock react-native-track-player (native audio playback library)
        if (moduleName === 'react-native-track-player' || moduleName.startsWith('react-native-track-player/')) {
            return {
                type: 'sourceFile',
                filePath: path.resolve(__dirname, 'src/mocks/trackPlayerMock.js'),
            };
        }
        // Mock react-native-mmkv (native key-value storage)
        if (moduleName === 'react-native-mmkv' || moduleName.startsWith('react-native-mmkv/')) {
            return {
                type: 'sourceFile',
                filePath: path.resolve(__dirname, 'src/mocks/mmkvMock.js'),
            };
        }
        // Mock react-native-svg (native SVG renderer used by lucide-react-native)
        if (moduleName === 'react-native-svg' || moduleName.startsWith('react-native-svg/')) {
            return {
                type: 'sourceFile',
                filePath: path.resolve(__dirname, 'src/mocks/reactNativeSvgMock.js'),
            };
        }
    }
    return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;

