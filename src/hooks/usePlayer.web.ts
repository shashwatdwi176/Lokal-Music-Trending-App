import { useEffect, useCallback } from 'react';
import { usePlayerStore } from '../store/playerStore';
import { Song, getDownloadUrl } from '../services/api';
import { webPlayer } from '../utils/webPlayer';

export const usePlayer = () => {
    const {
        currentTrack,
        isPlaying,
        queue,
        repeatMode,
        shuffleMode,
        progress,
        duration,
        setCurrentTrack,
        setPlaying,
        setQueue,
        setRepeatMode,
        setShuffleMode,
        setProgress,
        setDuration,
        addToQueue: addToStoreQueue
    } = usePlayerStore();

    // Hook to sync HTML5 audio properties to the store
    useEffect(() => {
        webPlayer.onProgressUpdate((pos: number, dur: number) => {
            setProgress(pos);
            setDuration(dur);
        });
        webPlayer.onTrackChange((song: Song | null, playing: boolean) => {
            if (song) setCurrentTrack(song);
            setPlaying(playing);
        });
    }, [setCurrentTrack, setPlaying, setProgress, setDuration]);

    const playSong = useCallback(async (song: Song, newQueue?: Song[]) => {
        const songQueue = newQueue ?? [song];
        setQueue(songQueue);
        webPlayer.setQueue(songQueue);
        const idx = songQueue.findIndex((s) => s.id === song.id);
        await webPlayer.playAtIndex(idx >= 0 ? idx : 0);
        setCurrentTrack(song);
        setPlaying(true);
    }, [setCurrentTrack, setQueue, setPlaying]);

    const togglePlayback = useCallback(async () => {
        if (webPlayer.isPlaying) {
            await webPlayer.pause();
            setPlaying(false);
        } else {
            await webPlayer.play();
            setPlaying(true);
        }
    }, [setPlaying]);

    const skipNext = useCallback(async () => {
        await webPlayer.skipToNext();
        const song = webPlayer.currentSong;
        if (song) setCurrentTrack(song);
    }, [setCurrentTrack]);

    const skipPrevious = useCallback(async () => {
        await webPlayer.skipToPrevious();
        const song = webPlayer.currentSong;
        if (song) setCurrentTrack(song);
    }, [setCurrentTrack]);

    const seekTo = useCallback(async (value: number) => {
        await webPlayer.seekTo(value);
        setProgress(value);
    }, [setProgress]);

    const addToQueue = useCallback(async (song: Song) => {
        addToStoreQueue(song);
        webPlayer.setQueue([...queue, song]);
    }, [addToStoreQueue, queue]);

    return {
        currentTrack,
        isPlaying,
        progress,
        duration,
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
