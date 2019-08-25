class GlobalSettings {
    constructor () {
        if (!GlobalSettings.instance) {
            this._inGame = {
                isDeadBodies: true,
                isDefault: true
            };

            GlobalSettings.instance = this;
        }

        return GlobalSettings.instance;
    }

    toggleDeadBodies () {
        this._inGame.isDefault = false;
        this._inGame.isDeadBodies = !this._inGame.isDeadBodies;
    }

    autoTurnOnDeadBodies () {
        if (!this._inGame.isDefault) return;

        this._inGame.isDeadBodies = true;
    }

    autoTurnOffDeadBodies () {
        if (!this._inGame.isDefault) return;

        this._inGame.isDeadBodies = false;
    }

    isDeadBodies () {
        return this._inGame.isDeadBodies;
    }
}

const instance = new GlobalSettings();
Object.freeze(instance);

export default instance;
