import Phaser from 'phaser';

class Dude extends Phaser.Sprite {
    constructor ({ game, x, y, asset }) {
        super(game, x, y, asset);
        this.anchor.setTo(0.5);
        this.scale.setTo(0.1);
    }

    update () {
        this.angle += 1;
    }
}

export default Dude;
