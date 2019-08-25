/* globals set with webpack:
IAP_ANDROID_REMOVE_ADS,
IAP_ANDROID_SKULLS_SMALL,
IAP_ANDROID_SKULLS_MEDIUM,
IAP_ANDROID_SKULLS_HUGE,

IAP_IOS_REMOVE_ADS,
IAP_IOS_SKULLS_SMALL,
IAP_IOS_SKULLS_MEDIUM,
IAP_IOS_SKULLS_HUGE
 */

import { Player, Device } from '../Stores';
import { isAndroid, isIOS } from '../Handlers/MainHandler';

class InAppPurchases {
    constructor () {
        if (!InAppPurchases.instance) {
            this._iap = {

            };

            this._iapPlatformIds = {
                removeAds: '',
                skullsSmall: '',
                skullsBig: '',
                skullsHuge: ''

            };

            InAppPurchases.instance = this;
        }

        return InAppPurchases.instance;
    }

    initIAPIds () {
        // if (!window.cordova) return;
        if (window.cordova && isIOS()) {
            this._iapPlatformIds.removeAds = IAP_IOS_REMOVE_ADS;
            this._iapPlatformIds.skullsSmall = IAP_IOS_SKULLS_SMALL;
            this._iapPlatformIds.skullsBig = IAP_IOS_SKULLS_MEDIUM;
            this._iapPlatformIds.skullsHuge = IAP_IOS_SKULLS_HUGE;

            return;
        }

        this._iapPlatformIds.removeAds = IAP_ANDROID_REMOVE_ADS;
        this._iapPlatformIds.skullsSmall = IAP_ANDROID_SKULLS_SMALL;
        this._iapPlatformIds.skullsBig = IAP_ANDROID_SKULLS_MEDIUM;
        this._iapPlatformIds.skullsHuge = IAP_ANDROID_SKULLS_HUGE;
    }

    getIAPIds () {
        return this._iapPlatformIds;
    }

    // TODO: this should call save to server if successful
    getAllAvailableProducts () {
        if (!this._isPlugin()) return Promise.resolve();

        return new Promise((resolve, reject) => {
            console.log('fucking env products!!!: ' + this._iapPlatformIds.removeAds);

            // TODO: get products for the right platform and the right state IOS or fucking ANDROID
            return inAppPurchase
                .getProducts([
                    this._iapPlatformIds.removeAds,
                    this._iapPlatformIds.skullsSmall,
                    this._iapPlatformIds.skullsBig,
                    this._iapPlatformIds.skullsHuge
                ])
                .then(products => {
                    console.log('GOT PRODUCTS!: ' + JSON.stringify(products));

                    return resolve(products);
                })
                .catch(err => {
                    console.log(`GETTING PRODUCTS FAILED service: ${err}`);
                    return reject(err);
                });
        });
    }

    buyNonCunsumable (product) {
        if (!this._isPlugin()) return Promise.resolve();

        if (!product || !product.productId) return Promise.reject(new Error('Failed buying non consumable product Error: product or no product ID'));
        let resData = {};

        return new Promise((resolve, reject) => {
            return inAppPurchase
                .buy(product.productId)
                .then(data => {
                    // console.log('GOT MY REMOVE ADS!!!! ' + JSON.stringify(data));
                    // The consume() function should only be called after purchasing consumable products
                    // otherwise, you should skip this step

                    resData = data;
                    // TODO: consuming for testing only as this shit is not cancenable
                    // TODO: save purchased data in db
                    // TODO: return response with token and such
                    // return inAppPurchase.consume(data.type, data.receipt, data.signature);
                })
                .then(() => {
                    console.log('CONSUMED THIS SHIT!');
                    return resolve(resData);
                })
                .catch(err => {
                    console.log('REMOVING ADS FAILED: ' + JSON.stringify(err));
                    return reject(err);
                });
        });
    }

    // TODO: handle when work on cosumables will start
    buyCunsumable (product) {
        if (!this._isPlugin()) return Promise.resolve();

        if (!product || !product.productId) return Promise.reject(new Error('Failed buy product Error: product or no product ID'));
        return new Promise((resolve, reject) => {
            return inAppPurchase
                .buy(product.productId)
                .then(data => {
                    console.log('GOT MY SKULLS!!!! ' + JSON.stringify(data.productId));
                    // The consume() function should only be called after purchasing consumable products
                    // otherwise, you should skip this step

                    let skullsAmount = parseInt((product.description || '').trim(), 10) || 0;

                    if (isIOS()) {
                        skullsAmount = parseInt((product.description.split(' ')[1] || '').trim(), 10) || 0;
                    }

                    Player.updateCurrentGold(skullsAmount);

                    // TODO: return response with token and such
                    // TODO: THIS IS FOR Android only. IOS need to have separated products
                    if (isIOS()) return Promise.resolve();

                    return inAppPurchase.consume(data.type, data.receipt, data.signature);
                })
                .then(() => {
                    console.log('CONSUME THIS SHIT!');
                    return resolve();
                })
                .catch(err => {
                    console.log('GETTING SKULLS FAILED: ' + JSON.stringify(err));
                    reject(err);
                });
        });
    }

    // this should be checked on each user entry to the game
    restoreAllNonConsumables () {
        if (!this._isPlugin()) return Promise.resolve();

        return inAppPurchase.restorePurchases();
    }

    getReceipt () {
        if (!this._isPlugin() || !isIOS()) return Promise.resolve();

        return inAppPurchase.getReceipt()
            .then(receipt => Promise.resolve(receipt))
            .catch(err => Promise.reject(err));
    }

    // TODO: for testing
    consumeTesting (data) {
        if (!this._isPlugin()) return Promise.resolve();

        return inAppPurchase.consume(data.type, data.receipt, data.signature);
    }

    _isPlugin () {
        return typeof inAppPurchase !== 'undefined';
    }
}

const instance = new InAppPurchases();
Object.freeze(instance);

export default instance;

/*
{
  "signature": "eYCaGKvOFJMTPKr7zOf1zXAE5Pe19ZEVvDGrQ9Q0JhR3+wzUGwqLBFOOg6UQQPXhxK+g7/XgMKVlaIk7pL24Ynuw7LqzmMG+tQQw5hlUPZ3tl1jX5Akp9Zvi4tAOoHZzKSLRR3R4ANnsDxpuNBRCm7zSeGLlvwqfQyy3l6jPxhhoIrLI3MiP+PYzdMmeiGPGgxBIgJcRcYMlPnFNptzaWTzl25/C1xsJGxAct1vD+TqF2w2GO/mICgjpGRatmvzxaL23OV9YRMsMySqG5z3ANXwPgwTvl9pGFzpy5UqbrMFGb7V1W932hD7mv/SJOQs0JxTceRL6ORI9Ra5sEyeVvQ==",
  "productId": "remove_all_ads",
  "transactionId": "nfdknofkedgappbapkkdloie.AO-J1OxP2JdDsO_HOEa6nRT10nQTpLvQcm8hPFdzUT_EmZwN7AT0WATqtGFm6exD_r4xKD6NImTe3f8GGemyTYcwJZY00BuqYn7UsxbinVitPvyYSEP0wIgw2OwY6n5mH9mdVME9r_jG",
  "type": "inapp",
  "productType": "inapp",
  "receipt": {
    "orderId":"GPA.3347-1067-8724-70205",
    "packageName":"io.shugostudios.sketchwars",
    "productId":"remove_all_ads",
    "purchaseTime":1563039461197,
    "purchaseState":0,
    "purchaseToken":"nfdknofkedgappbapkkdloie.AO-J1OxP2JdDsO_HOEa6nRT10nQTpLvQcm8hPFdzUT_EmZwN7AT0WATqtGFm6exD_r4xKD6NImTe3f8GGemyTYcwJZY00BuqYn7UsxbinVitPvyYSEP0wIgw2OwY6n5mH9mdVME9r_jG"
   }
}
 */
