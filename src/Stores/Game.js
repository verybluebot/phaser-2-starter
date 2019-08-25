
class Game {
    constructor () {
        if (!Game.instance) {
            this._main = {};

            Game.instance = this;
        }

        return Game.instance;
    }

    init (game) {
        this._main.game = game;
    }

    getGame () {
        return this._main.game;
    }
}

const instance = new Game();
Object.freeze(instance);

export default instance;
