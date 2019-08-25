import { UserAPI } from '../Api';

import { getPlayerHash, setPlayerHash, isIOS } from '../Handlers/MainHandler';

import { LEVEL_GAME_COUNT } from '../consts';

class PlayerStore {
    constructor () {
        if (!PlayerStore.instance) {
            this._player = {};
            this._stats = {};

            PlayerStore.instance = this;
        }

        return PlayerStore.instance;
    }

    init (name, id, fbAvatarUrl, removeAdsObj) {
        if (this._player.id) return Promise.resolve();

        // modifiy to fit ios response
        if (removeAdsObj) {
            removeAdsObj.platform = isIOS() ? 'ios' : 'android';
        }

        // TODO: need to check if user is new. If new need to try pull all of this purchees
        return UserAPI.postApi(name, id, fbAvatarUrl, removeAdsObj)
            .then(({ player, reward, newToken }) => {

                // return if there is a reward
                return Promise.resolve(reward);
            });
    }

    // getPlayer () {
    //     return this._player;
    // }

    getIsFTUEDone () {
        return this._player.isFTUEDone;
    }

    getDailyRewards () {
        return this._player.dailyRewards;
    }

    getNumPlayes () {
        return this._player.numPlays || 0;
    }

    getNoAdsLeftDate () {
        return this._player.noAdsLeftDate || new Date();
    }

    getEnemies () {
        return this._player.enemies;
    }

    getRecruits () {
        return this._player.recruits || [];
    }

    reduceAdsRemain () {
        if (this._player.adsRemain > 0) {
            // positive UI for getting the right time for the first show of out of ads
            this._player.adsRemain--;

            this._player.noAdsLeftDate = new Date();

            // update server with remaining ads to watch - and update Player on response
            UserAPI.watchedAd()
                .then(({adsRemain, noAdsLeftDate}) => {
                    this._player.adsRemain = adsRemain;
                    this._player.noAdsLeftDate = noAdsLeftDate;
                })
                .catch(err => console.log(err));
        }
    }

    updatePlayerRecruits () {
        return UserAPI.updatePlayerRecruits()
            .then(recruits => {
                if (!recruits) return;

                this._player.recruits = recruits;
                return Promise.resolve(recruits);

            }).catch(err => {
                console.log(err);
                return Promise.reject(err);
            });
    }

    removePlayerRecruit (removedID) {
        // optimistic UI - removing from store the recruit before actually removing him from the server
        const tempRec = this._player.recruits;
        this._player.recruits = this._player.recruits.filter(r => r.fbID !== removedID);

        return UserAPI.removePlayerRecruit(removedID)
            .then(isRemoved => {
                if (!isRemoved) {
                    this._player.recruits = tempRec;
                }

                return Promise.resolve(isRemoved);
            }).catch(err => {
                this._player.recruits = tempRec;
                console.log(err);
                return Promise.reject(err);
            });
    }

    upgradeMaxMagicPoints () {
        return UserAPI.upgradeMaxMagicPoints()
            .then(({ maxSpell, gold, noMoney }) => {
                if (noMoney) {
                    return Promise.resolve(noMoney);
                }

                this._player.maxSpell = maxSpell;
                this._player.currentGold = gold;

                return Promise.resolve();
            })
            .catch(err => Promise.reject(err));
    }

    getAdsRemain () {
        return this._player.adsRemain;
    }

    // rest is the same code as preceding example
    setName (name) {
        this._player.name = name;
    }

    getName () {
        return this._player.name;
    }

    // use mobile id as fallback
    getID () {
        return this._player.fbID || this._player.mobileID;
    }

    getCurrentGold () {
        return this._player.currentGold;
    }

    updateSignedHash () {
        if (this._player.fbHash) return Promise.resolve();
        this.startLoading();

        return getPlayerHash()
            .then(result => {
                if (typeof result === 'object') {
                    this._player.fbHash = result.getSignature();
                } else {
                    this._player.fbHash = result;
                }

                this.stopLoading();

                UserAPI.setHash(this._player.fbHash);

                return Promise.resolve();
            })
            .catch(err => {
                // this.stopLoading();

                return Promise.reject(new Error('Failed getting player Signed Hash:' + err.message));
            });
    }

    getSignedHash () {
        return this._player.fbHash;
    }

    // this will also update in DB using optimistic UI
    setCurrentGold (gold) {
        this._player.currentGold = gold;
    }

    // this will update UI only
    addToCurrentGold (addedScore) {
        this._player.currentGold += addedScore;
    }

    updateCurrentGold (score, isReward) {
        return UserAPI.updateGold(score, isReward)
            .then(({ score, noMoney }) => {
                if (noMoney) {
                    return Promise.resolve(noMoney);
                }

                this._player.currentGold = score;

                return Promise.resolve();
            })
            .catch(err => console.error(err));
    }

    getMaxSpell () {
        return this._player.maxSpell;
    }

    // this will also update in DB using optimistic UI
    setMaxSpell () {

    }

    setTowers (towers) {
        this._player.towers = towers;
    }

    getTowers () {
        return this._player.towers || {};
    }

    getLevels () {
        return this._player.levels || [];
    }

    setSpells (spells) {
        this._player.spells = spells;
    }

    getSpells () {
        return this._player.spells || [];
    }

    getIsTutorialWatched () {
        return this._player.isTutorialWatched;
    }

    getIsTutorialWatchedInGame () {
        return this._player.isTutorialInGameWatched;
    }

    getIsTutorialWatchedUpgrade () {
        return this._player.isTutorialUpgradeWatched;
    }

    performUpgrade (data, id) {
        // using optimistic UI
        data.cat = data.name;

        // save in DB, if DB returns err add back the optimistic action
        return UserAPI.upgrade(data, id)
            .then(({ player, noMoney }) => {
                // should return the player
                if (noMoney) {
                    return Promise.resolve({ player, noMoney });
                }

                if (player) {
                    this.setCurrentGold(player.currentGold);
                    this.setTowers(player.towers);
                    this.setSpells(player.spells);
                }

                return Promise.resolve({ player, noMoney });
            });
    }

    updateWin (results) {
        const lastLevel = this._player.levels[results.level];
        if (!lastLevel.stars) {
            lastLevel.stars = results.stars;
        } else if (lastLevel.stars < results.stars) {
            lastLevel.stars = results.stars;
        }

        if (!lastLevel.completed && this._player.levels.length < LEVEL_GAME_COUNT) {
            this._player.levels.push({
                num: lastLevel.num + 1,
                stars: 0
            });

            lastLevel.completed = true;
        }

        if (!this._player.currentGold) {
            this._player.currentGold = results.reward || 0;
        } else {
            this._player.currentGold = this._player.currentGold + (results.reward || 0);
        }

        UserAPI.updateWin(results, this.getID())
            .then()
            .catch(err => {
                console.error(err);
                this._player.currentGold -= results.reward || 0;
            });
    }

    foundEnemy (enemyData) {
        if (!enemyData || !enemyData.id) return;

        const isFound = this._player.enemies.filter(e => e.id === enemyData.id)[0];

        // for case user found this enemy already
        if (isFound) return;

        UserAPI.foundEnemyAPI(enemyData.id)
            .then(() => {
                this._player.enemies.push(enemyData);
            })
            .catch(err => console.log('Failed found enemy', err));
    }

    updateDailyReward () {
        if (!this._player.dailyRewards) return Promise.reject(new Error('Failed: no daily reward object'));

        return UserAPI.updateDailyReward()
            .then(data => {
                this._player.dailyRewards = data.dailyRewards;

                this._player.currentGold = data.currentGold;

                return Promise.resolve();
            })
            .catch(err => {
                console.log('Failed updating daily rewards', err);
                return Promise.reject(err);
            });
    }

    tutorialWatched () {
        return UserAPI.tutorialWatched()
            .then(() => {
                this._player.isTutorialWatched = true;

                return Promise.resolve();
            });
    }

    // tutorial-in-game-watched
    tutorialWatchedInGame () {
        return UserAPI.tutorialWatchedInGame()
            .then(() => {
                this._player.isTutorialInGameWatched = true;

                return Promise.resolve();
            });
    }

    tutorialWatchedUpgrade () {
        return UserAPI.tutorialWatchedUpgrade()
            .then(() => {
                this._player.isTutorialUpgradeWatched = true;

                return Promise.resolve();
            });
    }

    sharedGame () {
        return UserAPI.sharedGame().then(() => Promise.resolve());
    }

    shareWinGame () {
        return UserAPI.shareWinGame().then(() => Promise.resolve());
    }

    rewardRecruitingPlayer (playerID, playerContextID) {
        return UserAPI.rewardRecruitingPlayer(playerID, playerContextID)
            .then(data => Promise.resolve(data)).catch(err => Promise.reject(err));
    }

    // one way call, if ok server will send a push notifiction to target user
    cameBackForHelp (targetUserID) {
        return UserAPI.cameBackForHelp(targetUserID)
            .then(data => {
                if (!data) return;

                console.log('Came back from requesting user', data);
            }).catch(err => console.log('Failed coming back for help: ', err));
    }

    getUpdatedCurrentGold () {
        return UserAPI.getUpdatedCurrentGold()
            .then(data => {
                if (!data || !data.currentGold) return;

                this._player.currentGold = data.currentGold;
            }).catch();
    }

    setFTUEDone () {
        return UserAPI.setFTUEDone()
            .then(() => {
                this._player.isFTUEDone = true;
            }).catch();
    }

    updatePurchase (data) {
        if (!data || Object.keys(data || {}).length < 1) return Promise.reject(new Error('No data was submitted for update purchase'));

        return new Promise((resolve, reject) => {
            UserAPI.updatePurchaseAPI(data)
                .then(resData => {
                    this._player.isRemovedAds = resData.isRemovedAds;
                    return resolve(resData);
                }).catch(err => reject(err));
        });
    }

    setIsRemovedAds (isRemovedAds) {
        this._player.isRemovedAds = isRemovedAds;
    }

    getIsRemovedAds () {
        return this._player.isRemovedAds;
    }

    isNoUpgrades () {
        if (!this._player.towers) return;

        return this._player.towers.archer.length === 1 &&
            this._player.towers.archer[0].level === 1 &&
            this._player.towers.stone.length === 0 &&
            this._player.towers.magic.length === 0 &&
            this._player.spells.length === 1;
    }

    isFirstSpell () {

    }

    // status
    isLoading () {
        return this._stats.loadingData;
    }

    startLoading () {
        this._stats.loadingData = true;
    }

    stopLoading () {
        this._stats.loadingData = false;
    }

    isReady () {
        return !!this._player.fbID;
    }
}

const instance = new PlayerStore();
Object.freeze(instance);

export default instance;
