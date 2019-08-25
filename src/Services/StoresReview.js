
class StoresReview {
    constructor () {
        if (!StoresReview.instance) {
            // this._launchReview = LaunchReview || {};

            StoresReview.instance = this;
        }

        return StoresReview.instance;
    }

    launch () {
        if (!window.cordova) return Promise.reject(new Error('NO_CORDOVA'));

        if (LaunchReview.isRatingSupported()) return this.launchRating();

        return new Promise((resolve, reject) => {
            return this.launchReview().then(() => resolve()).catch(err => reject(err));
        });
    }

    isPlugin () {
        return window.cordova && typeof LaunchReview !== 'undefined';
    }

    isIOSNative () {
        return LaunchReview.isRatingSupported();
    }

    launchReview () {
        let appId;
        const platform = device.platform.toLowerCase();

        switch (platform) {
        case 'ios':
            appId = '1463412164';
            break;
        case 'android':
            appId = 'io.shugostudios.starter';
            break;
        }

        return new Promise((resolve, reject) => {
            LaunchReview.launch(() => {
                return resolve();
            }, err => {
                return reject(err);
            }, appId);
        });
    }

    // only for IOS 10.3 and above - native in app popup
    launchRating () {
        return new Promise((resolve, reject) => {
            return LaunchReview.rating(result => {
                if (result === 'shown') return resolve();
            }, err => reject(err));
        });
    }
}

const instance = new StoresReview();
Object.freeze(instance);

export default instance;
