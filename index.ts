// Universal entry point.
// - On web: index.web.ts overrides this file automatically via Metro/Expo platform extension.
// - On native: index.native.ts overrides this file automatically.
// This file must exist so that "main": "index.ts" in package.json resolves correctly.
import { registerRootComponent } from 'expo';
import App from './App';

registerRootComponent(App);
