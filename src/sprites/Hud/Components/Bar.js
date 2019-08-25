import Phaser from 'phaser';

class Bar extends Phaser.Group {
    constructor ({ game, x, y, asset, barFrame, barInner, barIcon, scale }) {
        super(game);

        this.x = x;
        this.y = y;

        this.game = game;

        // TODO: can't scale this shit because of the rectangle mess
        this.barScale = scale;
        this.iconScale = scale;

        this.leftPadding = 0;
        this.leftPaddingBar = 20;

        this.isFull = false;
        this.isEmpty = true;

        // order is left to right
        this.icon = this.create(this.leftPadding, 0, asset, barIcon);
        this.icon.scale.set(this.iconScale);
        this.icon.anchor.set(0.5);

        this.icon.fixedToCamera = true;

        this.barHolder = this.create(this.icon.x + this.icon.width / 2 + this.leftPaddingBar, 0, asset, barFrame);
        this.barHolder.scale.set(this.barScale);
        this.barHolder.anchor.set(0, 0.5);

        this.barHolder.fixedToCamera = true;

        this.movingBar = this.create(this.barHolder.x + 5, this.barHolder.y + 1, asset, barInner);
        this.movingBar.scale.set(this.barScale);
        this.bringToTop(this.movingBar);
        this.movingBar.anchor.set(0, 0.5);

        this.movingBarMaxWidth = this.movingBar.width / scale;

        this.movingBarCropRect = new Phaser.Rectangle(0, 0, this.movingBar.width, this.movingBar.height);
        this.movingBarCropRect.scale(1 / this.barScale);

        this.movingBar.fixedToCamera = true;
    }

    // setValues (val) {
    //     val = val * this.healthScale;
    //     if (val <= 0) {
    //         val = 0;
    //     }
    //
    //     if (this.tween) this.tween.stop();
    //     this.tween = this.game.add.tween(this.movingBar.scale);
    //     this.tween.to({ x: val }, 100);
    //     this.tween.start();
    // }

    setValue (val) {
        val = val * this.movingBarMaxWidth;
        if (val <= 0) {
            val = 0;
        }

        // if (this.tween) this.tween.stop();
        this.movingBarCropRect.width = val;
        // this.tween = this.game.add.tween(this.movingBarCropRect)
        //     .to({ width: this.movingBarMaxWidth - val }, 1000, Phaser.Easing.Bounce.Out);
        // if (this.tween) this.tween.stop();

        this.movingBar.crop(this.movingBarCropRect);

        // this.tween.start();
    }

    rest () {
        this.movingBar.scale.x = 0;
        this.isFull = false;
        this.isEmpty = true;
    }

    update () {
        this.movingBar.updateCrop();
    }
}

export default Bar;
