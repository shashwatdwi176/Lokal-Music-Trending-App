/**
 * Empty mock for react-native-track-player on web
 */
export default {
    setupPlayer: async () => { },
    updateOptions: async () => { },
    add: async () => { },
    play: async () => { },
    pause: async () => { },
    skipToNext: async () => { },
    skipToPrevious: async () => { },
    reset: async () => { },
    seekTo: async () => { },
    getPlaybackState: async () => ({ state: 'none' }),
    getActiveTrackIndex: async () => undefined,
    getTrack: async () => undefined,
    registerPlaybackService: () => { },
    addEventListener: () => ({ remove: () => { } }),
};

export const Capability = {};
export const Event = {};
export const RepeatMode = { Off: 0, Track: 1, Queue: 2 };
export const State = { None: 'none', Playing: 'playing', Paused: 'paused', Loading: 'loading' };
export const AppKilledPlaybackBehavior = {};

export const usePlaybackState = () => ({ state: 'none' });
export const useProgress = () => ({ position: 0, duration: 0 });
