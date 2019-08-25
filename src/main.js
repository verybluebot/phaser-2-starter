/* globals set with webpack:
 AD_ANDROID_PROD_REWARD_ID,
 AD_ANDROID_PROD_INTERSTITIAL_ID,
 AD_IOS_PROD_REWARD_ID,
 AD_IOS_PROD_INTERSTITIAL_ID
 */

import 'pixi';
import 'p2';
import Phaser from 'phaser';  // working phaser version before update "^2.10.5";

import BootState from './states/Boot';
import SplashState from './states/Splash.facebook';
import {
    Level1
} from './states/Levels';
import StartScreen from './states/StartScreen';
import { isAndroid, isIOS } from './Handlers/MainHandler';
import { Device } from './Stores';

// import config from './config';

class Game extends Phaser.Game {
    constructor () {
        // const docElement = document.documentElement;
        let width = window.innerWidth * window.devicePixelRatio;
        let height = window.innerHeight * window.devicePixelRatio;
        console.log('fucking width onload', window.innerWidth);
        console.log('fucking height onload', window.innerHeight);

        // super(width, height, Phaser.CANVAS, 'content', null);

        super({
            renderer:    Phaser.CANVAS,
            crisp:       true,
            roundPixels: true,
            scaleMode:   Phaser.ScaleManager.SHOW_ALL,
            alignH:      true,
            alignV:      true,
            scaleH:      0,
            scaleV:      0,
            trimH:       0,
            trimV:       0,
            width,
            height
        });

        this.state.add('Boot', BootState, false);
        this.state.add('Splash', SplashState, false);

        this.state.add('Level1', Level1, false);


        this.state.add('StartScreen', StartScreen, false);

        // with Cordova with need to wait that the device is ready so we will call the Boot state in another file
        if (!window.cordova) {
            this.state.start('Boot');
        }
    }
}

window.game = new Game();

if (window.cordova) {
    const app = {
        initialize: function () {
            document.addEventListener(
                'deviceready',
                this.onDeviceReady.bind(this),
                false
            );
        },

        // deviceready Event Handler

        onDeviceReady: function () {
            this.receivedEvent('deviceready');

            // When the device is ready, start Phaser Boot state.
            window.game.state.start('Boot');

            // set admob ads
            console.log(`DEVICE have ad mob!!!!!!! ${typeof admob}`);

            Device.init(device);

            // Android by default
            const admobIDs = {
                reward: AD_ANDROID_PROD_REWARD_ID,
                interstitial: AD_ANDROID_PROD_INTERSTITIAL_ID
            };

            if (isIOS()) {
                admobIDs.reward = AD_IOS_PROD_REWARD_ID;
                admobIDs.interstitial = AD_IOS_PROD_INTERSTITIAL_ID;
            }

            console.log(`ADMOB test reward id: ${admobIDs.reward}`);

            const isProduction = GAME_ENV === 'production';

            console.log(`FUCK YOU IS THIS TRUE?????: ${isProduction} AND what is GAME_ENV?? ${GAME_ENV}`);

            // reward test ad: ca-app-pub-3940256099942544/5224354917
            // interstitial test ad: ca-app-pub-3940256099942544/8691691433
            if (typeof admob === 'object') {
                admob.interstitial.config({
                    id: admobIDs.interstitial,
                    isTesting: !isProduction,
                    autoShow: false
                });

                admob.rewardvideo.config({
                    id: admobIDs.reward,
                    isTesting: !isProduction,
                    autoShow: false
                });
            }
        },

        receivedEvent: function (id) {
            console.log('Received Event: ' + id);
        }
    };

    app.initialize();
}
