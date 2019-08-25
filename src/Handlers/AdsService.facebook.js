/* globals:

FB_AD_STAGING_PLACEMENT_ID
FB_AD_STAGING_PLACEMENT_INTENTIONS_ID
 */

import { isFBInstant, isFBSupportRewardedVideos, isFBSupportInterstitialVideos } from './MainHandler';
import { SideBubble } from '../Notifications';

class AdsServiceFacebook {
    constructor () {
        if (!AdsServiceFacebook.instance) {
            AdsServiceFacebook.instance = this;
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
                isInterstitialToManyInstances: false
            };
        }

        return AdsServiceFacebook.instance;
    }

    // for mobile build compatability
    init () {

    }

    getVideoReward () {
        return this._ads.videoReward;
    }

    getAdReward () {
        return this._ads.adReward;
    }

    setFullRewardWatchListener (cb) {
    }

    dispatchFullRewardWatch () {
    }

    removeFullRewardWatchListener (cb) {
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

    getRewardVideo () {
        if (!isFBInstant()) return console.log('Only supported for FB Instant Games'); // Promise.reject(new Error('Only supported for FB Instant Games'));

        if (!isFBSupportRewardedVideos()) return console.log('No supported for FB Rewarded Video API'); // Promise.reject(new Error('No supported for FB Rewarded Video API'));

        if (this._locks.isRewardVideoToManyInstances) return;

        this._ads.isRewardVideoReady = false;

        console.log('starging get rewareded video async');
        FBInstant.getRewardedVideoAsync(FB_AD_STAGING_PLACEMENT_ID).then(rewardVideo => {
            // Load the Ad asynchronously
            this._ads.preloadedRewardedVideo = rewardVideo;
            console.log('starting loading Rewarded video');

            return this._ads.preloadedRewardedVideo.loadAsync();

        }).then(() => {
            console.log('Rewarded video preloaded');
            this._ads.isRewardVideoReady = true;

        }).catch(err => {
            console.log('this is fucking shit: ' + err);
            // this is for preventing stuck on loading screen if returns error
            if (err.code == 'ADS_FREQUENT_LOAD' || err.code == 'ADS_TOO_MANY_INSTANCES') {
                console.log('Failed getting reward ad video too many instances, ShowAsync() needed: ' + err.code + ', ' + err.message);
                this._locks.isRewardVideoToManyInstances = true;

                return;
            }

            if (err.code == 'ADS_NO_FILL') {
                console.log('Failed getting reward ad, got: ' + err.code + ', ' + err.message);
                this.getRewardVideo();

                return;
            }

            console.error('Rewarded video failed to preload?: ' + err.code + ', ' + err.message);
        });
    };

    showRewardedVideo () {
        if (!isFBInstant()) return Promise.reject(new Error('Ads show only support for FB Instant Games'));

        if (!this._ads.preloadedRewardedVideo) {
            console.log('preloadedRewardedVideo are null');
            return Promise.reject(new Error('preloadedRewardedVideo is null'));
        }

        return this._ads.preloadedRewardedVideo.showAsync()
            .then(() => {
                // Perform post-ad success operation
                console.log('showed reward video ad');
                this._ads.isRewardVideoReady = false;

                this._locks.isRewardVideoToManyInstances = false;

                this.getRewardVideo();

                return Promise.resolve();
            }).catch(err => {
                if (err.code === 'ADS_FREQUENT_LOAD' || err.code === 'ADS_TOO_MANY_INSTANCES') {
                    console.log('Failed showing ad video, ShowAsync() needed: ' + err.code + ', ' + err.message);

                    this.showRewardedVideo();
                    return Promise.reject(new Error(err));
                }

                // if video failed to show - from any other (see below) reason - try to reload
                this.getRewardVideo();
                return Promise.reject(new Error('Failed showing Rewarded video' + err.code + ', ' + err.message))
            });
    };

    getInterstitialAd () {
        if (!isFBInstant()) return Promise.reject(new Error('Ads show only support for FB Instant Games'));

        if (!isFBSupportInterstitialVideos()) return Promise.reject(new Error('No supported for FB Interstitial Video API'));

        if (this._locks.isInterstitialToManyInstances) return;

        this._ads.isInterstitialAdReady = false;

        FBInstant.getInterstitialAdAsync(FB_AD_STAGING_PLACEMENT_INTENTIONS_ID).then(interstitial => {
            // Load the Ad asynchronously
            this._ads.preloadedInterstitial = interstitial;
            return this._ads.preloadedInterstitial.loadAsync();
        }).then(() => {
            console.log('Interstitial preloaded');
            this._ads.isInterstitialAdReady = true;

        }).catch((err) => {
            if (err.code == 'ADS_FREQUENT_LOAD' || err.code == 'ADS_TOO_MANY_INSTANCES') {
                console.log('Failed showing Interstitial ad, ShowAsync() needed: ' + err.message);
                this._locks.isInterstitialToManyInstances = true;

                return;
            }

            if (err.code == 'ADS_NO_FILL') {
                console.log('Failed getting interstitial ad, got: ' + err.code + ', ' + err.message);
                this.getInterstitialAd();

                return;
            }

            console.error('Interstitial failed to preload: ' + err.code + ', ' + err.message);
        });
    }

    showInterstitialAd () {
        if (!isFBInstant()) return Promise.reject(new Error('Ads show only support for FB Instant Games'));

        if (!this._ads.preloadedInterstitial) {
            return Promise.reject(new Error('preloadedInterstitial is null'));
        }

        return this._ads.preloadedInterstitial.showAsync()
            .then(() => {
                // Perform post-ad success operation
                console.log('showed Interstitial ad');
                this._ads.isInterstitialAdReady = false;

                this._locks.isInterstitialToManyInstances = false;

                this.getInterstitialAd();

                return Promise.resolve();
            }).catch(err => {
                if (err.code === 'ADS_FREQUENT_LOAD' || err.code === 'ADS_TOO_MANY_INSTANCES') {
                    console.log('Failed showing Interstitial ad, ShowAsync() needed: ' + err.message);

                    this.showInterstitialAd();
                    return Promise.reject(new Error(err));
                }

                this.getInterstitialAd();
                return Promise.reject(new Error('failed showing Interstitial ad: ' + err.code + ', ' + err.message));
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

const instance = new AdsServiceFacebook();
Object.freeze(instance);

export default instance;

// usful stuff from the comunity
// === After the successfully preloaded ad, you can show it and if it was successfully displayed you preload the ad again to be ready for the next display.
//
//     But it's not yet clear what should be done after the particular error occurs so please Chris Hawkins could you confirm/clarify if this is correct (there are also two questions).
//
// === Errors on attempt to preload the Ad:
//     * ADS_TOO_MANY_INSTANCES -> Do not preload again until ShowAsync().
//
// * CLIENT_UNSUPPORTED_OPERATION -> Do not preload again, best disable attempt to showing ads as it will not work in this session anyway.
//
// * ADS_FREQUENT_LOAD -> Do not preload again until ShowAsync().
//
// * ADS_NO_FILL -> Must preload again before ShowAsync().
//
// * INVALID_PARAM -> Do not preload again until fix.
//
// * NETWORK_FAILURE -> Must preload again before ShowAsync().
//
// === Errors on attempt to show the Ad:
//     * ADS_NOT_LOADED -> Must preload again before ShowAsync().
//
// * INVALID_PARAM -> Do not Show until you fix param. [QUESTION] Is preload required after this error (is ad instance cleared)?
//
// * NETWORK_FAILURE -> Do not Show until back online. [QUESTION] Is preload required after this error (is ad instance cleared)?
//
// * INVALID_OPERATION -> Do not preload until fix.
