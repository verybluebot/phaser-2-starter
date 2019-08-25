// import Phaser from 'phaser';

import ModalSuperClass from './ModalSuperClass';
import { masterScale } from '../utils';
import { defaultStyle } from '../Style/Text';
import { IconButton } from '../sprites/Hud/Components';
import moment from 'moment';

import { Player } from '../Stores';

import { AdsService } from '../Handlers';
import { SideBubble } from '../Notifications';

import { SoundFXManager, Emitter } from '../Services';
import { SOUND_FX_BUTTON_CLICK } from '../Services/SoundFXManager';
import {isFBInstant, sendLogEvent} from '../Handlers/MainHandler';

const MODAL_ASSET = 'start-screen';

class WatchAd extends ModalSuperClass {
    constructor ({ game, parent, crystalsBonus, offsetX, offsetY, customWidth, customHeight, updateScoreCallback }) {
        super({
            game,
            parent,
            offsetX,
            offsetY,
            customWidth,
            customHeight,
            isNoClose: true,
            asset: MODAL_ASSET,
            modalFrame: 'modal-message-background.png',
            titleText: 'Get Skulls'
        });

        this.crystalsBonus = AdsService.isRewardedVideoReady() ? AdsService.getVideoReward() : AdsService.getAdReward();

        this.isAdWatched = false;

        this.style = {
            rowPaddingLeft: masterScale(165),
            rowPaddingTop: masterScale(270)
        };

        this.txtStyle = JSON.parse(JSON.stringify(defaultStyle));

        this.mainFrame = super.getMainFrame();
        this.mainFrame.scale.set(masterScale());

        this.updateScoreCallback = updateScoreCallback;

        super.updateTitleSize(masterScale(1.4), 0.8);
        super.updatePriorityId(15);

        this.renderModalContent();

        this.adsRemain = Player.getAdsRemain();

        // for mobile builds only
        AdsService.setFullRewardWatchListener(this.handleAdWatched.bind(this));

        this.closeCallback = () => {
            console.log('closing watch ad modal cleaning listeners');
            AdsService.removeFullRewardWatchListener(this.handleAdWatched.bind(this));
        };
    }

    update () {
        if (this.crystalsBonus && this.mainText) {
            this.crystalsBonus = AdsService.isRewardedVideoReady() ? AdsService.getVideoReward() : AdsService.getAdReward();
            this.mainText.setText(this.creteText());
        }
    }

    // render functions
    renderModalContent () {
        this.renderButton();
        this.renderText();
    }

    // overFrame?: any, outFrame?: any, downFrame?: any, upFrame?
    renderButton () {
        this.btnWatchAd = new IconButton({
            game: this.game,
            x: 0,
            y: this.mainFrame.height / masterScale(2),
            scale: 1.3,
            key: 'start-screen-bottom',
            callback: () => this.playAd(),
            callbackContext: this,
            outFrame: 'button_empty.png',
            overFrame: 'button_empty.png',
            downFrame: 'button_empty.png',
            upFrame: 'button_empty.png'
        });

        this.btnWatchAd.input.priorityID = 16; // mid priority

        this.btnWatchAd.anchor.set(0.5);

        this.txtStyle.fontSize = 48;
        const txtWatchAd = this.game.add.text(5, 0, 'Watch Ad', this.txtStyle);
        txtWatchAd.anchor.set(0.5);

        this.btnWatchAd.addChild(txtWatchAd);

        this.mainFrame.addChild(this.btnWatchAd);
    }

    renderText () {
        this.txtStyle.fontSize = 54;
        // yes the space in the text is for the crystal icon
        this.mainText = this.game.add.text(0, 0, this.creteText(), this.txtStyle);
        this.mainText.anchor.set(0.5);
        this.mainText.wordWrap = true;
        this.mainText.wordWrapWidth = 600;

        // add crystal icon
        const crystalIcon = this.game.add.image(75, -60, 'start-screen-top', 'crystal_blue.png');
        crystalIcon.anchor.set(0.5);
        crystalIcon.scale.set(1.5);

        this.mainText.addChild(crystalIcon);

        this.mainFrame.addChild(this.mainText);
    }

    // click methods
    playAd () {
        // if (this.noAdsAtThisPoint()) return;

        SoundFXManager.playSoundFX(SOUND_FX_BUTTON_CLICK);

        // send click log event
        sendLogEvent({location: 'watch_ad_click'});

        this.crystalsBonusOnWatch = this.crystalsBonus;

        console.log('starting play ad flow');
        if (AdsService.isRewardedVideoReady()) {
            AdsService.showRewardedVideo()
                .then(() => {
                    console.log('handle reward video watched');

                    // FB build fire on watch. mobile build will fire from AdService if reward video is fully watcher
                    if (isFBInstant()) {
                        this.handleAdWatched();
                    }

                    sendLogEvent({location: 'watch_ad_reward_watched'});
                })
                .catch(err => console.log('Error: Failed showing video with ' + err));
            return;
        }

        if (AdsService.isInterstitialAdReady()) {
            AdsService.showInterstitialAd()
                .then(() => {
                    console.log('handle intentitnal ad watched');
                    this.handleAdWatched();

                    sendLogEvent({location: 'watch_ad_intentitnal_watched'});
                })
                .catch(err => console.log('Error: Failed showing video with: ' + err));
            return;
        }

        AdsService.noAdsPopup(this.game);
    }

    handleAdWatched () {
        // Player.reduceAdsRemain();

        Player.updateCurrentGold(this.crystalsBonusOnWatch)
            .then(() => {
                this.sideBubble = new SideBubble({
                    game: this.game,
                    x: 20,
                    y: this.game.height - 20,
                    text: 'You just got ' + this.crystalsBonusOnWatch + ' skulls bonus! '
                });

                this.game.add.existing(this.sideBubble);

                this.isAdWatched = true;
                Emitter.dualFlow(this.crystalsBonusOnWatch);

                this.game.input.onDown.addOnce(() => {
                    this.sideBubble.closeBubble();

                    // update callbacks scores if any
                    if (this.updateScoreCallback) {
                        this.updateScoreCallback();
                    }

                    this.clear();
                });
            });
    }

    noAdsAtThisPoint () {
        // pop up a message for player he saw all the ads he can for this session
        if (Player.getAdsRemain() > 0) return;

        const nowTime = new moment(new Date());
        const openAdsTime = (new moment(Player.getNoAdsLeftDate())).add(4, 'hour');

        console.log(`${moment.duration(nowTime.diff(openAdsTime)).humanize()}  .nowTime:  ${nowTime}. openTime: ${openAdsTime}`)
        this.sideBubble = new SideBubble({
            game: this.game,
            x: 20,
            y: this.game.height - 20,
            text: `You don't have any ads left at this point, try in ${moment.duration(nowTime.diff(openAdsTime)).humanize()} `
        });

        this.game.add.existing(this.sideBubble);

        this.game.input.onDown.addOnce(() => {
            this.sideBubble.closeBubble();
        });

        return true;
    }

    creteText () {
        return `Get  ${this.crystalsBonus}        by watching this fine ad my dear`;
    }

    clear () {
        this.destroy(true);
    }
}

export default WatchAd;
