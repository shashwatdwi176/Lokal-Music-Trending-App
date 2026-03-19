import { useEffect, useCallback, useRef } from 'react';
import TrackPlayer, {
    usePlaybackState,
    useProgress,
    State as PlaybackState,
    RepeatMode as NativeRepeatMode,
    useTrackPlayerEvents,
    Event
} from 'react-native-track-player';
import { usePlayerStore, RepeatModeType } from '../store/playerStore';
import { Song, getDownloadUrl, getImageUrl } from '../services/api';

export const usePlayer = () => {
    const store = usePlayerStore();
    const {
        currentTrack,
        isPlaying,
        queue,
        repeatMode,
        shuffleMode,
        setCurrentTrack,
        setPlaying,
        setQueue,
        setRepeatMode: setStoreRepeatMode,
        setShuffleMode: setStoreShuffleMode,
        setProgress,
        setDuration,
    } = store;

    const playbackState = usePlaybackState();
    const progress = useProgress();

    // Sync playback state to store
    useEffect(() => {
        setPlaying(playbackState.state === PlaybackState.Playing);
    }, [playbackState.state, setPlaying]);

    // Sync progress to store
    useEffect(() => {
        setProgress(progress.position ?? 0);
        setDuration(progress.duration ?? 0);
    }, [progress.position, progress.duration, setProgress, setDuration]);

    const queueRef = useRef(queue);
    useEffect(() => { queueRef.current = queue; }, [queue]);

    useTrackPlayerEvents([Event.PlaybackActiveTrackChanged], async (event) => {
        if (event.type === Event.PlaybackActiveTrackChanged && event.track != null) {
            const track = event.track;
            const song = queueRef.current.find((s) => s.id === track.id);
            if (song) setCurrentTrack(song);
        }
    });

    const playSong = useCallback(async (song: Song, newQueue?: Song[]) => {
        const songQueue = newQueue ?? [song];
        try {
            setQueue(songQueue);
            await TrackPlayer.reset();
            const tracks = songQueue.map((s) => ({
                id: s.id,
                url: getDownloadUrl(s),
                title: s.name,
                artist: s.primaryArtists,
                artwork: getImageUrl(s, '500x500'),
                duration: s.duration,
            }));
            await TrackPlayer.add(tracks);
            const idx = songQueue.findIndex((s) => s.id === song.id);
            if (idx > 0) await TrackPlayer.skip(idx);
            await TrackPlayer.play();
            setCurrentTrack(song);
        } catch (error) {
            console.error('Error playing song:', error);
        }
    }, [setCurrentTrack, setQueue]);

    const togglePlayback = useCallback(async () => {
        try {
            const state = await TrackPlayer.getPlaybackState();
            if (state.state === PlaybackState.Playing) {
                await TrackPlayer.pause();
            } else {
                await TrackPlayer.play();
            }
        } catch { }
    }, []);

    const skipNext = useCallback(async () => {
        try {
            await TrackPlayer.skipToNext();
            const index = await TrackPlayer.getActiveTrackIndex();
            if (index !== undefined && index !== null) {
                const track = await TrackPlayer.getTrack(index);
                const song = queueRef.current.find((s) => s.id === track?.id);
                if (song) setCurrentTrack(song);
            }
        } catch { }
    }, [setCurrentTrack]);

    const skipPrevious = useCallback(async () => {
        try {
            await TrackPlayer.skipToPrevious();
            const index = await TrackPlayer.getActiveTrackIndex();
            if (index !== undefined && index !== null) {
                const track = await TrackPlayer.getTrack(index);
                const song = queueRef.current.find((s) => s.id === track?.id);
                if (song) setCurrentTrack(song);
            }
        } catch { }
    }, [setCurrentTrack]);

    const seekTo = useCallback(async (value: number) => {
        try {
            await TrackPlayer.seekTo(value);
        } catch { }
    }, []);

    const addToQueue = useCallback(async (song: Song) => {
        store.addToQueue(song);
        try {
            await TrackPlayer.add({
                id: song.id,
                url: getDownloadUrl(song),
                title: song.name,
                artist: song.primaryArtists,
                artwork: getImageUrl(song, '500x500'),
                duration: song.duration,
            });
        } catch { }
    }, [store]);

    const setRepeatMode = useCallback(async (mode: RepeatModeType) => {
        setStoreRepeatMode(mode);
        const nativeModes = [NativeRepeatMode.Off, NativeRepeatMode.Track, NativeRepeatMode.Queue];
        await TrackPlayer.setRepeatMode(nativeModes[mode]);
    }, [setStoreRepeatMode]);

    const setShuffleMode = useCallback(async (shuffle: boolean) => {
        setStoreShuffleMode(shuffle);

    }, [setStoreShuffleMode]);

    return {
        currentTrack,
        isPlaying,
        progress: progress.position,
        duration: progress.duration,
        queue,
        repeatMode,
        shuffleMode,
        playSong,
        togglePlayback,
        skipNext,
        skipPrevious,
        seekTo,
        addToQueue,
        setRepeatMode,
        setShuffleMode,
    };
};
