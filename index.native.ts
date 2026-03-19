import { Platform } from 'react-native';
import { registerRootComponent } from 'expo';
import App from './App';

// Only register TrackPlayer playback service on native platforms
if (Platform.OS !== 'web') {
    const TrackPlayer = require('react-native-track-player').default;
    const { PlaybackService } = require('./src/services/playerService');
    TrackPlayer.registerPlaybackService(() => PlaybackService);
}

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
