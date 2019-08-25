
class InLevelScores {
    constructor () {
        if (!InLevelScores.instance) {
            this._scores = {};
            this._level = {
                helped: []
            };

            InLevelScores.instance = this;
        }

        return InLevelScores.instance;
    }

    // getPlayer () {
    //     return this._player;
    // }

    // rest is the same code as preceding example
    setBuild (score) {
        this._scores.build = score;
    }

    updateBuild (score) {
        this._scores.build += score;
    }

    getBuild () {
        return this._scores.build || 0;
    }

    setMagic (score) {
        this._scores.magic = score;
        return score;
    }

    updateMagic (score) {
        this._scores.magic += score;
    }

    getMagic () {
        return this._scores.magic || 0;
    }

    setLevelNum (levelNum) {
        this._level.num = levelNum;
    }

    addHelpedPlayer (fbID) {
        if (this._level.helped.indexOf(fbID) > -1) return;

        this._level.helped.push(fbID);
    }

    getHelpedPlayers () {
        return this._level.helped;
    }

    resetHelpedPlayers () {
        this._level.helped = [];
    }

    getLevelNum () {
        return this._level.num;
    }

    isEnoughMagic (value) {
        return this._scores.magic >= value;
    }
}

const instance = new InLevelScores();
Object.freeze(instance);

export default instance;
