/**
 * Web mock for react-native-mmkv.
 * Uses localStorage as a drop-in replacement on web.
 */

class MMKVMock {
    constructor(options) {
        this._prefix = (options && options.id) ? `mmkv_${options.id}_` : 'mmkv_';
    }

    set(key, value) {
        try {
            localStorage.setItem(this._prefix + key, String(value));
        } catch (e) { }
    }

    getString(key) {
        try {
            return localStorage.getItem(this._prefix + key);
        } catch (e) {
            return null;
        }
    }

    getNumber(key) {
        try {
            const v = localStorage.getItem(this._prefix + key);
            return v !== null ? Number(v) : undefined;
        } catch (e) {
            return undefined;
        }
    }

    getBoolean(key) {
        try {
            const v = localStorage.getItem(this._prefix + key);
            return v !== null ? v === 'true' : undefined;
        } catch (e) {
            return undefined;
        }
    }

    delete(key) {
        try {
            localStorage.removeItem(this._prefix + key);
        } catch (e) { }
    }

    clearAll() {
        try {
            Object.keys(localStorage)
                .filter((k) => k.startsWith(this._prefix))
                .forEach((k) => localStorage.removeItem(k));
        } catch (e) { }
    }

    contains(key) {
        try {
            return localStorage.getItem(this._prefix + key) !== null;
        } catch (e) {
            return false;
        }
    }

    getAllKeys() {
        try {
            return Object.keys(localStorage)
                .filter((k) => k.startsWith(this._prefix))
                .map((k) => k.slice(this._prefix.length));
        } catch (e) {
            return [];
        }
    }
}

exports.MMKV = MMKVMock;
module.exports = { MMKV: MMKVMock };
