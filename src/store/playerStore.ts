import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { MMKV } from 'react-native-mmkv';
import { Song } from '../services/api';

// MMKV is aliased to an localStorage-backed mock on web via metro.config.js
// On native it uses the real MMKV native module for high-performance storage
const mmkvStorage = new MMKV({ id: 'player-storage' });

export type RepeatModeType = 0 | 1 | 2; // Off | Track | Queue

export interface PlayerState {
    currentTrack: Song | null;
    isPlaying: boolean;
    queue: Song[];
    repeatMode: RepeatModeType;
    shuffleMode: boolean;
    progress: number;
    duration: number;

    // Actions
    setCurrentTrack: (track: Song | null) => void;
    setPlaying: (playing: boolean) => void;
    setQueue: (queue: Song[]) => void;
    addToQueue: (track: Song) => void;
    removeFromQueue: (id: string) => void;
    moveQueueItem: (fromIndex: number, toIndex: number) => void;
    setRepeatMode: (mode: RepeatModeType) => void;
    setShuffleMode: (shuffle: boolean) => void;
    setProgress: (progress: number) => void;
    setDuration: (duration: number) => void;
}

export const usePlayerStore = create<PlayerState>()(
    persist(
        (set, get) => ({
            currentTrack: null,
            isPlaying: false,
            queue: [],
            repeatMode: 0,
            shuffleMode: false,
            progress: 0,
            duration: 0,

            setCurrentTrack: (track) => set({ currentTrack: track }),
            setPlaying: (playing) => set({ isPlaying: playing }),
            setQueue: (queue) => set({ queue }),
            addToQueue: (track) => {
                const { queue } = get();
                if (!queue.find((t) => t.id === track.id)) {
                    set({ queue: [...queue, track] });
                }
            },
            removeFromQueue: (id) => {
                const { queue } = get();
                set({ queue: queue.filter((t) => t.id !== id) });
            },
            moveQueueItem: (fromIndex, toIndex) => {
                const { queue } = get();
                const newQueue = [...queue];
                const [movedItem] = newQueue.splice(fromIndex, 1);
                newQueue.splice(toIndex, 0, movedItem);
                set({ queue: newQueue });
            },
            setRepeatMode: (mode) => set({ repeatMode: mode }),
            setShuffleMode: (shuffle) => set({ shuffleMode: shuffle }),
            setProgress: (progress) => set({ progress }),
            setDuration: (duration) => set({ duration }),
        }),
        {
            name: 'player-storage',
            storage: createJSONStorage(() => ({
                setItem: (name, value) => mmkvStorage.set(name, value),
                getItem: (name) => mmkvStorage.getString(name) ?? null,
                removeItem: (name) => mmkvStorage.delete(name),
            })),
            partialize: (state) => ({
                queue: state.queue,
                repeatMode: state.repeatMode,
                shuffleMode: state.shuffleMode,
            }),
        }
    )
);

