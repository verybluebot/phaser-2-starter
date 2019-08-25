import Phaser from 'phaser';

class SoundFXManager {
    constructor () {
        if (!SoundFXManager.instance) {
            SoundFXManager.instance = this;
            this._control = {
                isSound: true
            };

            this._stats = {
                isSoundFXLoading: false,
                isSoundFXLoaded: false,
                isSoundFXEndGameLoading: false,
                isSoundFXEndGameLoaded: false
            };

            this._loaders = {
                soundFX: {},
                soundFXEndGame: {}
            };

            this._sounds = {
                soundFX: null,
                soundFXEndGame: null
            };
        }

        return SoundFXManager.instance;
    }

    isSoundFXPlaying () {
        // return this._stats.isSoundFXPlaying;
    }

    toggleSound () {
        this._control.isSound = !this._control.isSound;
    }

    isSound () {
        return this._control.isSound;
    }


    playSoundFX (type, isLoop, volume) {

    }

    stopSoundFX (type) {
        this._sounds.soundFX.stop(type);
    }

    isSoundFXLoading () {
        return this._stats.isSoundFXLoading;
    }

    isSoundFXLoaded () {
        return this._stats.isSoundFXLoaded;
    }

    getMainSoundSprite () {
        return this._sounds.soundFX;
    }

    // loads sounds for end of game
    loadSoundFXEndGame (game) {

    }


    stopSoundFXEndGame (type) {
        this._sounds.soundFXEndGame.stop(type);
    }

    isSoundFXEndGameLoading () {
        return this._stats.isSoundFXEndGameLoading;
    }

    isSoundFXEndGameLoaded () {
        return this._stats.isSoundFXEndGameLoaded;
    }

    _isObjectEmpty (obj) {
        return Object.keys(obj).length === 0;
    }
}

const instance = new SoundFXManager();
Object.freeze(instance);

export default instance;
