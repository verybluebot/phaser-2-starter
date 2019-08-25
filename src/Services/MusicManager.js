import Phaser from 'phaser';

class MusicManger {
    constructor () {
        if (!MusicManger.instance) {
            MusicManger.instance = true;
            this._control = {
                isSound: false
            };

            this._stats = {
                isMainMusicLoading: false,
                isMainMusicPlaying: false,
                isMainMusicLoaded: false,

                isGameMusicPlaying: false
            };

            this._loaders = {
                mainMusic: {}
            };

            this._sounds = {
                mainMusic: null,
                gameMusic: null
            };
        }

        return MusicManger.instance;
    }

    playMainMusic () {
        if (this._sounds.mainMusic && !this._stats.isMainMusicPlaying) {
            // this._sounds.mainMusic.loopFull(0.3);
            this._sounds.mainMusic.play(null, 1, 0.3, true);

            if (this._sounds.gameMusic) {
                this._sounds.gameMusic.stop();
            }

            this._stats.isMainMusicPlaying = true;
            this._control.isSound = true;
        }
    }

    playGameMusic () {
        console.log('play game music', this._sounds, this._stats);
        if (this._sounds.gameMusic && !this._stats.isGameMusicPlaying) {
            // this._sounds.gameMusic.loopFull(0.3);
            this._sounds.gameMusic.play(null, 1, 0.3, true);
            if (this._sounds.mainMusic) {
                this._sounds.mainMusic.stop();
            }
            this._stats.isGameMusicPlaying = true;
            this._control.isSound = true;
        }
    }

    stopMainMusic () {
        if (!this._sounds.mainMusic) return;

        console.log('stop main music!');
        this._sounds.mainMusic.stop();
        this._stats.isMainMusicPlaying = false;
    }

    stopGameMusic () {
        if (!this._sounds.gameMusic) return;

        console.log('stop game music!');
        this._sounds.gameMusic.stop();
        this._stats.isGameMusicPlaying = false;
    }

    isMainMusicPlaying () {
        return this._stats.isMainMusicPlaying;
    }

    isGameMusicPlaying () {
        return this._stats.isGameMusicPlaying;
    }

    toggleSound () {
        this._control.isSound = !this._control.isSound;
    }

    isSound () {
        return this._control.isSound;
    }

    loadMainMusicAsset (game) {
        return new Promise((resolve, reject) => {
            if (game.cache && game.cache.checkSoundKey('main-music')) return resolve();

            const loader = new Phaser.Loader(game);
            loader.audio('main-music', ['./assets/sound/MusicFull.mp3', './assets/sound/MusicFull.ogg']);
            if (!loader.onLoadComplete) return reject(new Error('Failed getting main music asset no loader'));

            loader.onLoadComplete.addOnce(() => {
                this._stats.isMainMusicLoading = false;
                this._stats.isMainMusicLoaded = true;
                this._sounds.mainMusic = game.add.audio('main-music');

                resolve();
            });

            loader.start();
        });
    }

    // those files are pretty bit ~1.5MB
    loadGameMusicAsset (game) {
        return new Promise((resolve, reject) => {
            if (game.cache && game.cache.checkSoundKey('game-music')) return resolve();

            const loader = new Phaser.Loader(game);
            loader.audio('game-music', ['./assets/sound/GameMusic.mp3', './assets/sound/GameMusic.ogg']);
            if (!loader.onLoadComplete) return reject(new Error('Failed getting game music asset no loader'));

            loader.onLoadComplete.addOnce(() => {
                this._stats.isGameMusicLoading = false;
                this._stats.isGameMusicLoaded = true;
                this._sounds.gameMusic = game.add.audio('game-music');

                resolve();
            });

            loader.start();
        });
    }

    isMainMusicLoading () {
        return this._stats.isMainMusicLoading;
    }

    isMainMusicLoaded () {
        return this._stats.isMainMusicLoaded;
    }

    getMainMusic () {
        return this._sounds.mainMusic;
    }

    getGameMusic () {
        return this._sounds.gameMusic;
    }

    _isObjectEmpty (obj) {
        return Object.keys(obj).length === 0;
    }
}

const instance = new MusicManger();
Object.freeze(instance);

export default instance;
