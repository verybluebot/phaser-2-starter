import { UserAPI } from '../Api';

import { isObjectNotEmpty } from '../utils';

class InGameContent {
    constructor () {
        if (!InGameContent.instance) {
            this._content = {};

            this._stats = {};

            InGameContent.instance = this;
        }

        return InGameContent.instance;
    }

    isLevels () {
        return !!this._content.levels;
    }

    isSpells () {
        return !!this._content.spells;
    }

    isTowers () {
        return !!this._content.towers;
    }

    isEnemies () {
        return !!this._content.enemies;
    }

    getPlayerLevelsContent () {
        return this._content.levels || [];
    }

    getPlayerTowersContent () {
        return this._content.towers || [];
    }

    getPlayerSpellsContent () {
        return this._content.spells || [];
    }

    getUpgrades () {
        return this._content.upgrades || {};
    }

    getEnemies () {
        return this._content.enemies || [];
    }

    updateLevels (levels = [], isShowLoading) {
        if (isShowLoading) {
            this._stats.loadingData = true;
        }

        return UserAPI.updatePlayerLevels(levels)
            .then(levels => {
                this._content.levels = levels;

                if (isShowLoading) {
                    this._stats.loadingData = false;
                }

                return Promise.resolve();
            });
    }

    updateEnemies ()  {
        return UserAPI.updatePlayerEnemies()
            .then(enemies => {
                this._content.enemies = enemies;

                return Promise.resolve();
            })
            .catch(err => Promise.reject(err));
    }

    updateTowers (towers = {}, isShowLoading) {
        if (isShowLoading) {
            this._stats.loadingData = true;
            this._stats.loadingTowers = true;
        }

        return UserAPI.updatePlayerTowers(towers)
            .then(towers => {
                this._content.towers = towers;

                if (isShowLoading) {
                    this._stats.loadingData = false;
                    this._stats.loadingTowers = false;
                }

                return Promise.resolve();
            });
    }

    updateSpells (spells = [], isShowLoading) {
        if (isShowLoading) {
            this._stats.loadingData = true;
            this._stats.loadingSpells = true;
        }

        return UserAPI.updatePlayerSpells(spells)
            .then(spells => {
                this._content.spells = spells;

                if (isShowLoading) {
                    this._stats.loadingData = false;
                    this._stats.loadingSpells = false;
                }

                return Promise.resolve();
            });
    }

    updateUpgrades (playerID, isShowLoading) {
        if (isShowLoading) {
            this._stats.loadingData = true;
            this._stats.loadingUpgrades = true;
        }

        return UserAPI.getUpgrades(playerID)
            .then(upgrades => {
                this._content.upgrades = upgrades;

                if (isShowLoading) {
                    this._stats.loadingData = false;
                    this._stats.loadingUpgrades = false;
                }

                return Promise.resolve();
            });
    }

    isLoading () {
        return this._stats.loadingData;
    }

    isLoadingUpgrades () {
        return this._stats.loadingUpgrades;
    }

    isUpgradesLoaded () {
        return isObjectNotEmpty(this._content.upgrades);
    }
}

const instance = new InGameContent();
Object.freeze(instance);

export default instance;
