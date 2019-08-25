/* globals:

FB_AD_STAGING_PLACEMENT_ID
FB_AD_STAGING_PLACEMENT_INTENTIONS_ID
 */

import { SideBubble } from '../Notifications';

class AdsServiceMobile {
    constructor () {
        if (!AdsServiceMobile.instance) {
            AdsServiceMobile.instance = this;
            this._ads = {
                preloadedRewardedVideo: null,
                preloadedInterstitial: null,
                isRewardVideoReady: false,
                isInterstitialAdReady: false,
                videoReward: 250,
                adReward: 150
            };

            this._locks = {
                isRewardVideoToManyInstances: false,
                isInterstitialToManyInstances: false,

                isFullRewardWatch: false,
                isListenersSet: false
            };

            this._listeners = {
                rewardWatched: false
            };
        }

        return AdsServiceMobile.instance;
    }

    init () {
        if (this._locks.isListenersSet) return;
        this.setListeners();

        this._locks.isListenersSet = true;
    }

    setListeners () {
        // reward video listeners
        document.addEventListener('admob.rewardvideo.events.LOAD', (event) => {
            console.log(`ADMOB reward ad was loaded from listener: ${event}`);
            this._ads.isRewardVideoReady = true;
            this._ads.preloadedRewardedVideo = true;
        });

        document.addEventListener('admob.rewardvideo.events.CLOSE', (event) => {
            console.log(`ADMOB reward ad was closed from listener: ${event}`);
            if (!this._ads.isRewardVideoReady) {
                this.getRewardVideo();
            }
        });

        document.addEventListener('admob.rewardvideo.events.REWARD', (event) => {
            console.log(`ADMOB reward ad was rewarded from listener: ${event}`);
            // make sure reward was fully watched for prize
            this._locks.isFullRewardWatch = true;
            this.dispatchFullRewardWatch();

            if (!this._ads.isRewardVideoReady) {
                this.getRewardVideo();
            }
        });

        // interstitial listeners
        document.addEventListener('admob.interstitial.events.LOAD', (event) => {
            console.log(`ADMOB interstitial ad was loaded from listener: ${event}`);
            this._ads.isInterstitialAdReady = true;
            this._ads.preloadedInterstitial = true;
        });

        document.addEventListener('admob.interstitial.events.CLOSE', (event) => {
            console.log(`ADMOB interstitial ad was closed from listener: ${event}`);
            if (!this._ads.isInterstitialAdReady) {
                this.getRewardVideo();
            }
        });
    }

    isAdmob () {
        return typeof admob === 'object';
    }

    setFullRewardWatchListener (cb) {
        if (this._listeners.rewardWatched) return;

        this._listeners.rewardWatched = true;

        document.addEventListener('mobile-full-reward-watched', e => {
            cb();
        }, false);
    }

    dispatchFullRewardWatch () {
        document.dispatchEvent(new CustomEvent('mobile-full-reward-watched'));
    }

    removeFullRewardWatchListener (cb) {
        document.removeEventListener('mobile-full-reward-watched', cb, false);
    }

    getVideoReward () {
        return this._ads.videoReward;
    }

    getAdReward () {
        return this._ads.adReward;
    }

    checkFullRewardWatch () {
        if (this._locks.isFullRewardWatch) return Promise.resolve();

        setTimeout(() => {
            this.checkFullRewardWatch();
        }, 1000);
    }

    isRewardedVideoPreloaded () {
        return !!this._ads.preloadedRewardedVideo;
    };

    isRewardedVideoReady () {
        return this._ads.isRewardVideoReady;
    };

    isInterstitialAdPreloaded () {
        return !!this._ads.preloadedInterstitial;
    };

    isInterstitialAdReady () {
        return this._ads.isInterstitialAdReady;
    };

    // return null
    getRewardVideo () {
        if (!this.isAdmob()) return;

        console.log('ADMOB start reward prepare!!!');
        this._ads.isRewardVideoReady = false;
        this._ads.preloadedRewardedVideo = false;

        admob.rewardvideo.prepare()
            .then(ok => {
                console.log(`ADMOB after reward prepare: ${ok}`);
            })
            .catch(err => {
                console.log(`ADMOB ERROR reward prepare: ${err}`);
                this._ads.isRewardVideoReady = false;
                this._ads.preloadedRewardedVideo = false;
                setTimeout(() => {
                    this.getRewardVideo();
                }, 3000);
            });
    };

    // return empty promise
    showRewardedVideo () {
        if (!this.isAdmob()) return Promise.reject(new Error('Admob not supported'));

        this._locks.isFullRewardWatch = false;

        this._ads.isRewardVideoReady = false;
        this._ads.preloadedRewardedVideo = false;

        console.log('ADMOB start reward showing ad');
        return admob.rewardvideo.show()
            .then(a => {
                console.log('ADMOM after reward show', a);
                // this.getRewardVideo();

                return Promise.resolve();
            }).catch(err => {
                console.log(`ADMOB ERROR reward after show: ${err}`);
                this.getRewardVideo();

                return Promise.reject(err);
            });
    };

    // return null
    getInterstitialAd () {
        if (!this.isAdmob()) return;

        console.log('ADMOB start interstitial prepare!!!');
        this._ads.isInterstitialAdReady = false;
        this._ads.preloadedInterstitial = false;

        admob.interstitial.prepare()
            .then(ok => {
                console.log(`ADMOB after interstitial prepare: ${ok}`);
            })
            .catch(err => {
                console.log(`ADMOB ERROR interstitial prepare: ${err}`);
                this._ads.isInterstitialAdReady = false;
                this._ads.preloadedInterstitial = false;

                setTimeout(() => {
                    this.getInterstitialAd();
                }, 3000);
            });
    }

    // return empty promise
    showInterstitialAd () {
        if (!this.isAdmob()) return Promise.reject(new Error('Admob not supported'));

        console.log('ADMOB start interstitial showing ad');
        return admob.interstitial.show()
            .then(a => {
                console.log('ADMOM after interstitial show', a);

                return Promise.resolve();
            }).catch(err => {
                console.log(`ADMOB ERROR interstitial after show: ${err}`);
                this.getInterstitialAd();

                return Promise.reject(err);
            });
    }

    noAdsPopup (game) {
        const sideBubble = new SideBubble({
            game,
            x: 20,
            y: game.height - 20,
            text: `You don't have any ads left at this point, try a little bit later`
        });

        game.add.existing(sideBubble);

        game.input.onDown.addOnce(() => {
            sideBubble.closeBubble();
        });

        return true;
    }
}

const instance = new AdsServiceMobile();
Object.freeze(instance);

export default instance;

/*
    // this must be added to 'info.plist for ios to work with admod:

    <key>GADIsAdManagerApp</key>
    <true/>
    <key>GADApplicationIdentifier</key>
    <string>APP_ADMOB_ID_HERE</string>
    <key>UILaunchStoryboardName</key>
    <string>CDVLaunchScreen</string>
 */
