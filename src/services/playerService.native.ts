import { Platform } from 'react-native';

// Conditionally export based on platform
export const PlaybackService = async function () {
    if (Platform.OS === 'web') return;
    const TrackPlayer = require('react-native-track-player').default;
    const { Event } = require('react-native-track-player');
    TrackPlayer.addEventListener(Event.RemotePlay, () => TrackPlayer.play());
    TrackPlayer.addEventListener(Event.RemotePause, () => TrackPlayer.pause());
    TrackPlayer.addEventListener(Event.RemoteNext, () => TrackPlayer.skipToNext());
    TrackPlayer.addEventListener(Event.RemotePrevious, () => TrackPlayer.skipToPrevious());
    TrackPlayer.addEventListener(Event.RemoteStop, () => TrackPlayer.reset());
    TrackPlayer.addEventListener(Event.RemoteSeek, (event: { position: number }) =>
        TrackPlayer.seekTo(event.position)
    );
};

export const setupPlayer = async (): Promise<boolean> => {
    if (Platform.OS === 'web') return true;

    const TrackPlayer = require('react-native-track-player').default;
    const {
        AppKilledPlaybackBehavior,
        Capability,
    } = require('react-native-track-player');

    let isSetup = false;
    try {
        await TrackPlayer.getActiveTrackIndex();
        isSetup = true;
    } catch {
        await TrackPlayer.setupPlayer({
            autoHandleInterruptions: true,
        });
        await TrackPlayer.updateOptions({
            android: {
                appKilledPlaybackBehavior:
                    AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification,
            },
            capabilities: [
                Capability.Play,
                Capability.Pause,
                Capability.SkipToNext,
                Capability.SkipToPrevious,
                Capability.SeekTo,
                Capability.Stop,
            ],
            compactCapabilities: [
                Capability.Play,
                Capability.Pause,
                Capability.SkipToNext,
            ],
            notificationCapabilities: [
                Capability.Play,
                Capability.Pause,
                Capability.SkipToNext,
                Capability.SkipToPrevious,
                Capability.Stop,
            ],
        });
        isSetup = true;
    }
    return isSetup;
};
