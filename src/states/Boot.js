import Phaser from 'phaser';
import { updateWindowWidthConsts } from '../consts';

export default class extends Phaser.State {
    init () {
        this.stage.backgroundColor = '#fff';
        this.fontsReady = true;
        this.fontsLoaded = this.fontsLoaded.bind(this);
    }

    preload () {
        window.addEventListener('resize', () => this.setWindowSize());
    }

    render () {

        if (this.fontsReady && this.game) {
            this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

            this.game.scale.refresh();

            this.state.start('Splash');
        }
    }

    fontsLoaded () {
        this.fontsReady = true;
        console.log('font loaded');
    }

    setWindowSize () {
        this.game.scale.setGameSize(window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio);

        this.game.scale.refresh();

        console.log('setting window size to width: ', window.innerWidth, 'height: ', window.innerHeight);
        updateWindowWidthConsts();

        window.removeEventListener('resize', () => this.setWindowSize());
    }
}
