/**
 * Web-only HTML5 Audio player singleton.
 * Provides the same interface shape as the native TrackPlayer hooks.
 */

import { Song, getDownloadUrl } from '../services/api';

class WebAudioPlayer {
    private audio: HTMLAudioElement | null = null;
    private _queue: Song[] = [];
    private _currentIndex: number = -1;
    private _onProgressUpdate?: (position: number, duration: number) => void;
    private _onTrackChange?: (song: Song | null, isPlaying: boolean) => void;
    private _progressInterval?: ReturnType<typeof setInterval>;

    constructor() {
        if (typeof window !== 'undefined') {
            this.audio = new Audio();
            this.audio.preload = 'metadata';
            this._setupListeners();
        }
    }

    private _setupListeners() {
        if (!this.audio) return;
        this.audio.addEventListener('ended', () => this._handleEnded());
        this.audio.addEventListener('play', () =>
            this._onTrackChange?.(this._queue[this._currentIndex] ?? null, true)
        );
        this.audio.addEventListener('pause', () =>
            this._onTrackChange?.(this._queue[this._currentIndex] ?? null, false)
        );
        this.audio.addEventListener('loadedmetadata', () => {
            this._onProgressUpdate?.(0, this.audio?.duration ?? 0);
        });
    }

    private _handleEnded() {
        if (this._currentIndex < this._queue.length - 1) {
            this.skipToNext();
        } else {
            this._onTrackChange?.(null, false);
        }
    }

    private _startProgressTracking() {
        if (this._progressInterval) clearInterval(this._progressInterval);
        this._progressInterval = setInterval(() => {
            if (this.audio && !this.audio.paused) {
                this._onProgressUpdate?.(this.audio.currentTime, this.audio.duration ?? 0);
            }
        }, 1000);
    }

    setQueue(songs: Song[]) {
        this._queue = songs;
    }

    async playAtIndex(index: number) {
        if (!this.audio || index < 0 || index >= this._queue.length) return;
        this._currentIndex = index;
        const song = this._queue[index];
        const url = getDownloadUrl(song);
        if (!url) return;
        this.audio.src = url;
        this.audio.load();
        try {
            await this.audio.play();
            this._startProgressTracking();
        } catch (e) {
            console.warn('Web audio play error:', e);
        }
    }

    async play() {
        try {
            await this.audio?.play();
            this._startProgressTracking();
        } catch (e) { }
    }

    async pause() {
        this.audio?.pause();
    }

    async skipToNext() {
        if (this._currentIndex < this._queue.length - 1) {
            await this.playAtIndex(this._currentIndex + 1);
            this._onTrackChange?.(this._queue[this._currentIndex], true);
        }
    }

    async skipToPrevious() {
        if (this._currentIndex > 0) {
            await this.playAtIndex(this._currentIndex - 1);
            this._onTrackChange?.(this._queue[this._currentIndex], true);
        }
    }

    async seekTo(seconds: number) {
        if (this.audio) {
            this.audio.currentTime = seconds;
        }
    }

    get isPlaying() {
        return this.audio ? !this.audio.paused : false;
    }

    get position() {
        return this.audio?.currentTime ?? 0;
    }

    get duration() {
        return this.audio?.duration ?? 0;
    }

    get currentSong() {
        return this._queue[this._currentIndex] ?? null;
    }

    onProgressUpdate(cb: (position: number, duration: number) => void) {
        this._onProgressUpdate = cb;
    }

    onTrackChange(cb: (song: Song | null, isPlaying: boolean) => void) {
        this._onTrackChange = cb;
    }

    reset() {
        if (this.audio) {
            this.audio.pause();
            this.audio.src = '';
        }
        if (this._progressInterval) clearInterval(this._progressInterval);
        this._queue = [];
        this._currentIndex = -1;
    }
}

export const webPlayer = new WebAudioPlayer();
