import Phaser from 'phaser';

import {
    Loading
} from '../sprites/Hud/Components';
import {
    // Tutorial,
    RecruitPopup,
    InfoStartScreen
} from '../Modals';

import { masterScale } from '../utils';
import {
    FULL_SCREEN_HEIGHT,
    FULL_SCREEN_WIDTH
} from '../consts';
import { mainFont } from '../Style/Text';

import {
    isFBInstant,
    isAndroid,
    getPlayerName,
    getPlayerID,
    getPlayerPhoto,
    simpleShare

} from '../Handlers/MainHandler';

import { LoaderManager, MusicManager, Ticker, SoundFXManager, InAppPurchases } from '../Services';
import { SOUND_FX_BUTTON_CLICK } from '../Services/SoundFXManager';

import { Player, Game, Device } from '../Stores';
import { AdsService } from '../Handlers';

export default class StartScreen extends Phaser.State {
    init (data) {
        this.comeBackData = data || {};
        this.isFirstFail = true;
        this.iapStoreFail = false;
    }

    preload () {
        // start loading thingy
        // this.loadingIcon = Loading.startLoadingIcon(Game.getGame(), Game.getGame().world.centerX, Game.getGame().world.centerY);

        InAppPurchases.initIAPIds();

        // try to get user products
        InAppPurchases.restoreAllNonConsumables()
            .then((products = []) => {
                return Promise.resolve(products.filter(p => p.productId === InAppPurchases.getIAPIds().removeAds)[0]);
            })
            .then(removeAdsObj => {
                if (!removeAdsObj || isAndroid()) return Promise.resolve(removeAdsObj);

                // IOS need to send receipt to validate on server
                return new Promise((resolve, reject) => {
                    InAppPurchases.getReceipt()
                        .then(receipt => {
                            removeAdsObj.iosReceipt = receipt;

                            resolve(removeAdsObj);
                        })
                        .catch(err => reject(err));
                });
            })
            .then(removeAdsObj => Player.init(getPlayerName(), getPlayerID(), getPlayerPhoto(), removeAdsObj))
            .then(reward => {
                // this.loadingIcon.destroy();
                // this.loadingIcon = null;

                this.preloadGame(reward);
            })
            .catch(err => {
                console.log(`Failed fucking INIT player on start:`, err);
                // this.loadingIcon.destroy();

                if (!this.isFirstFail) return;

                this.isFirstFail = false;

                if (err.code < 0) this.iapStoreFail = true;

                Player.init(getPlayerName(), getPlayerID(), getPlayerPhoto())
                    .then(reward => {
                        this.preloadGame(reward);
                    })
                    .catch(err => console.log(`Failed INIT player without store on start: ${JSON.stringify(err)}`));
            });
    }

    preloadGame () {
        // render dailies after player data came back from server
        LoaderManager.loadStartScreenBottom(this.game)
            .then(() => {
            });

        // effect only mobile builds
        AdsService.init();

        if (!AdsService.isRewardedVideoPreloaded() && !Player.getIsRemovedAds()) {
            AdsService.getRewardVideo();
        }

        if (!AdsService.isInterstitialAdPreloaded() && !Player.getIsRemovedAds()) {
            AdsService.getInterstitialAd();
        }

        // lazy load center assets
        Promise.all([
            Player.getIsRemovedAds() ? LoaderManager.loadImageByName('premium_crown.png') : Promise.resolve(),
            LoaderManager.loadStartScreenCenter(this.game)
        ])
            .then(() => {
            }).catch(err => console.log(`Failed getting center assets with: ${err}`));
    }

    create () {
        this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.game.scale.pageAlignHorizontally = true;
        this.game.scale.pageAlignVertically = true;
        this.game.scale.setShowAll();

        this.game.scale.refresh();

        // fix IOS scaling bug on load
        this.IOSScreenFix = 0;

        this.worldScale = masterScale();

        // stop all tickers if were tickers working
        this.game.world.resize(FULL_SCREEN_WIDTH, FULL_SCREEN_HEIGHT);
        this.game.camera.reset();

        this.style = {
            font: '46px ' + mainFont,
            align: 'center'
        };

        this.currentGold = -1;
        this.maxSpell = -1;

        this.game.world.setBounds(0, 0, FULL_SCREEN_WIDTH, FULL_SCREEN_HEIGHT);

        // lazy load top icons

        // main pop up group
        this.popUpGroup = this.game.add.group();

        this.fuckText();
    }

    fuckText () {
        console.log('fuck text')
        const testText = this.game.add.text(this.game.world.centerX, this.game.world.centerY, 'fuck dis', this.style);
        testText.anchor.set(0.5);
        this.game.world.addChild(testText);
    }

    update () {
        // this.game.device.iOS
        // fixing IOS screen size bug - trying to perform the refresh 10 times after "fixed" for weird IOS bug
        if (this.IOSScreenFix < 10 && this.game.scale.width === this.game.width) {
            this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

            this.game.scale.refresh();

            // stop screen refreshing
            this.IOSScreenFix++;
        }
    }

    clickShare () {
        // click sound
        SoundFXManager.playSoundFX(SOUND_FX_BUTTON_CLICK);

        if (!isFBInstant()) {
            return simpleShare(Player.getName());
        }
        // open an information pop up
        this.recruitPopup = new RecruitPopup({
            game: this.game,
            reward: 400,
            playerName: Player.getName(),
            playerID: Player.getID()
        });

        this.popUpGroup.removeAll();
        this.popUpGroup.add(this.recruitPopup);
    }

    clickMusic () {
        MusicManager.toggleSound();

        const frame = `button_music${this.btnSound && !MusicManager.isSound() ? '_off' : ''}.png`;
        this.btnMusic.setFrames(frame, frame, frame, frame);

        SoundFXManager.playSoundFX(SOUND_FX_BUTTON_CLICK);

        MusicManager.stopMainMusic();

        if (MusicManager.isSound()) {
            MusicManager.playMainMusic();
        }
    }

    clickSound () {
        SoundFXManager.toggleSound();

        const frame = `button_sound${this.btnSound && !SoundFXManager.isSound() ? '_off' : ''}.png`;
        this.btnSound.setFrames(frame, frame, frame, frame);

        SoundFXManager.playSoundFX(SOUND_FX_BUTTON_CLICK);
    }

    clickInfo () {
        // log event open info screen

        // TODO: open modal for information
        this.infoStartScreen = InfoStartScreen.startInfoStartScreen(this.game);
        this.add.existing(this.infoStartScreen);
    }
}
