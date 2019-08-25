import Phaser from 'phaser';

import { Game, Player } from '../Stores';

const ASSETS_START_SCREEN                       = 'start-screen';

class LoaderManger {
    constructor () {
        if (!LoaderManger.instance) {
            LoaderManger.instance = this;
        }

        return LoaderManger.instance;
    }

    // with loading bar
    loadInGameAssets ({game, loadingComponent = () => {}}) {
        return new Promise((resolve, reject) => {
            // start loading bar with progress bar
            const loadingBar = loadingComponent.startLoading(game, true);

            const loader = new Phaser.Loader(game);


            if (!loader.onLoadComplete) return reject(new Error('Filled getting assets for in game assets, no loader created'));

            loader.onLoadComplete.addOnce(() => {
                // filthy hack for showing all loading bar before game starts
                setTimeout(() => {
                    loadingBar.finishLoading();
                    resolve();
                }, 100);
            });

            loader.onFileComplete.add((progress, name) => {
                console.log('progress', progress, 'name', name);
                loadingBar.setProgress(progress);
            });

            loader.start();
        });
    }

    loadBase64Image (imageName) {
        return new Promise((resolve, reject) => {
            if (Game.getGame().cache && Game.getGame().cache.checkTextKey(imageName)) {
                return resolve(Game.getGame().cache.getText(imageName));
            }

            const loader = new Phaser.Loader(Game.getGame());
            loader.text(imageName, `assets/images/base64images/${imageName}.txt`);
            if (!loader.onLoadComplete) return reject(new Error('Failed getting assets for base64 image, no loader created'));

            loader.onLoadComplete.addOnce(() => {
                resolve(Game.getGame().cache.getText(imageName));
            });

            loader.start();
        });
    }

    loadImageByName (imageName) {
        return this._loadOneImageAsset(imageName, `assets/images/images/${imageName}.png`);
    }

    // helpers
    _loadOneImageAsset (imageName, path) {
        return new Promise((resolve, reject) => {
            const loader = new Phaser.Loader(Game.getGame());
            if (Game.getGame().cache && Game.getGame().cache.checkImageKey(imageName)) {
                return resolve();
            }

            loader.image(imageName, path);
            if (!loader.onLoadComplete) return reject(new Error(`Failed getting assets for loading image name ${imageName}, no loader created`));

            loader.onLoadComplete.addOnce(() => resolve());
            loader.start();
        });
    }
}

const instance = new LoaderManger();
Object.freeze(instance);

export default instance;
