import Phaser from 'phaser';

import { isFBInstant } from '../Handlers/MainHandler';
import { Player, Game } from '../Stores';
import { LoaderManager, EventListener } from '../Services';

export default class extends Phaser.State {
    init () {
        this.preloadAsset = null;
        this.ready = false;
    }

    preload () {}

    create () {
        // client event listener
        EventListener.init();

        console.log('this shit is on FB????');

        this.progressInc = 0;

        if (isFBInstant()) {
            return FBInstant.initializeAsync()
                .then(() => {
                    this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
                    this.load.onFileComplete.add(this.updateProgress, this);
                    LoaderManager.loadInit(this);
                });
        }
    }

    update () {
        if (this.ready && !Player.isLoading()) {
            Player.startLoading();

            FBInstant.startGameAsync()
                .then(() => {
                    Game.init(this.game);

                    // get Player hash
                    Player.updateSignedHash()
                        .then(() => {
                            this.state.start('StartScreen');
                        })
                        .catch(err => console.log(err));
                });
        }
    }

    onLoadComplete () {
        this.ready = true;
    }

    updateProgress () {
        FBInstant.setLoadingProgress(this.load.progress);
    }
}
