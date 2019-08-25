import Phaser from 'phaser';
import { defaultStyle } from '../Style/Text';
import { Game } from '../Stores';

import { masterScale } from '../utils';

import { SoundFXManager } from '../Services';
import { SOUND_FX_BUBBLE_BLOOP } from '../Services/SoundFXManager';

class SideTextBubble extends Phaser.Image {
    constructor ({ game, x, y, text, isUpsideDown, isReverse, fontSize, isClickClose }) {
        super(Game.getGame(), x, y, 'start-screen-top', 'text_bubble.png');
        this.anchor.setTo(0, 1);

        if (isReverse) {
            this.anchor.setTo(0.5, 1);
        }

        this.fontSize = fontSize || 36;
        this.txtStyle = JSON.parse(JSON.stringify(defaultStyle));

        this.scale.setTo(0.01);

        this.isUpsideDown = isUpsideDown;
        this.isReverse = isReverse;

        this.reverseFactor = isReverse ? -1 : 1;

        this.tweenPopout = Game.getGame().add.tween(this.scale)
            .to({x: 0.01 * this.reverseFactor, y: 0.01}, 50, Phaser.Easing.Linear.None);

        this.tweenPopout.onComplete.addOnce(() => {
            this.destroy();
        });

        const tweenPop = Game.getGame().add.tween(this.scale)
            .to({x: this.reverseFactor * (masterScale() + 0.1), y: masterScale() + 0.1}, 50, Phaser.Easing.Linear.None)
            .to({x: this.reverseFactor * masterScale(1), y: masterScale(1)}, 50, Phaser.Easing.Linear.None, true);

        tweenPop.onComplete.addOnce(() => {

            if (text) {
                this.addChild(this.createText(text));
            }
        });

        SoundFXManager.playSoundFX(SOUND_FX_BUBBLE_BLOOP);
        //
        // this.game.add.tween(this.txtMessage.scale)
        //     .to({x: masterScale() + 0.1, y: masterScale() + 0.1}, 50, Phaser.Easing.Linear.None)
        //     .to({x: masterScale(), y: masterScale()}, 50, Phaser.Easing.Linear.None, true);
        if (isUpsideDown) {
            this.angle += 180;
        }

        if (isClickClose) {
            Game.getGame().input.onDown.addOnce(() => {
                this.closeBubble();
            });
        }
    }

    createText (textMessage) {
        this.txtStyle.fontSize = this.fontSize;
        this.txtStyle.fill = '#000';
        this.text = Game.getGame().add.text(this.width / masterScale(2), -this.height / masterScale(2), textMessage, this.txtStyle);

        this.text.wordWrap = true;
        this.text.wordWrapWidth = 350;

        this.text.anchor.set(0.5);

        if (this.isUpsideDown) {
            this.text.angle += 180;
            this.text.y -= 20;
        }

        if (this.isReverse) {
            this.text.scale.x = -this.text.scale.x;
            this.text.x = 0;
        }

        return this.text;
    }

    closeBubble () {
        if (this.txtMessage) {
            this.txtMessage.destroy();
        }

        this.tweenPopout.start();
    }
}

export default SideTextBubble;
