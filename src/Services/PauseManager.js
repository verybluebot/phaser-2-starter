class PauseManager {
    constructor () {
        if (!PauseManager.instance) {
            this._pause = {
                isGameStopped: false
            };

            PauseManager.instance = this;
        }

        return PauseManager.instance;
    }

    togglePauseAll (game) {
        if (!game) return;
        game.paused = !game.paused;

    }

    stopGame (game) {
        if (!game) return;

        this._pause.isGameStopped = true;
        console.log('game is stopped', this._pause.isGameStopped);
    }

    unStopGame (game) {
        if (!game) return;

        this._pause.isGameStopped = false;
        console.log('game is unstopped', this._pause.isGameStopped);

    }

    toggleGameStop (game) {
        if (!game) return;

        this._pause.isGameStopped = !this._pause.isGameStopped;
        console.log('game is stopped', this._pause.isGameStopped);

        // fixing issue of drag scrolling on pause
        if (game.paused) {
        }

    }

    isGameStopped () {
        return this._pause.isGameStopped;
    }
}

const instance = new PauseManager();
Object.freeze(instance);

export default instance;
