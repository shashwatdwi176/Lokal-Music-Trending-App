import { registerRootComponent } from 'expo';
import App from './App';

// No TrackPlayer on web, just register the UI root
registerRootComponent(App);
