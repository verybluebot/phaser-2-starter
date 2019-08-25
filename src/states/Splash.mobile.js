import Phaser from 'phaser';

import { Player, Game } from '../Stores';
import { LoaderManager, EventListener } from '../Services';

export default class extends Phaser.State {
    init () {
        this.ready = false;
    }

    create () {

        // client event listener
        EventListener.init();

        console.log('this shit is on mobile????');
        Game.init(this.game);

        this.state.start('StartScreen');

        this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
    }

    update () {
        if (this.ready && !Player.isLoading()) {
            // Player.startLoading();

            Game.init(this.game);
            this.state.start('StartScreen');

        }
    }

    onLoadComplete () {
        this.ready = true;
    }
}
