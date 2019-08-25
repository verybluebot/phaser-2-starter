import Phaser from 'phaser';
import { Game } from '../Stores';
import {masterScale} from '../utils';
import {defaultStyle, setStroke} from '../Style/Text';
// import { WORLD_SCALE } from '../consts'; // TODO: temporary const until scaling manager will be created

class Animations {
    static startOpenAnim (animTarget, scale) {
        Game.getGame().add.tween(animTarget.scale)
            .to({x: scale + 0.1, y: scale + 0.1}, 50, Phaser.Easing.Linear.None)
            .to({x: scale, y: scale}, 50, Phaser.Easing.Linear.None, true);
    }

    static sizeFlash (animTarget, scale, toScale) {
        return Game.getGame().add.tween(animTarget.scale)
            .to({x: scale + (toScale || 0.1), y: scale + (toScale || 0.1)}, 500, Phaser.Easing.Quadratic.InOut, true, 0, 1000, true);
    }

    static click (animTarget, scale) {
        return Game.getGame().add.tween(animTarget.scale)
            .to({x: scale / 1.1, y: scale / 1.1}, 50, Phaser.Easing.Linear.None)
            .to({x: scale, y: scale}, 50, Phaser.Easing.Linear.None, true);
    }

    static wiggle (aProgress, aPeriod1, aPeriod2) {
        const current1 = aProgress * Math.PI * 2 * aPeriod1;
        const current2 = aProgress * (Math.PI * 2 * aPeriod2 + Math.PI / 2);

        const value = Math.sin(current1) * Math.cos(current2);

        return Game.getGame().add.tween(animatedTarget).to({ x: this.position.x + aRadius}, aTime, function (k) {
            return Easing.wiggle(k, aXPeriod1, aXPeriod2);
        }, true, 0, -1);
    }

    static scoreUpUpdate (obj, amount, customText) {
        const score = Game.getGame().add.text(0, -obj.height / masterScale(2), `${customText || '+' + amount}`, defaultStyle);
        score.fontSize = 10;
        // setStroke(score);
        score.anchor.set(0.5);

        obj.addChild(score);

        obj.bringToTop(score);

        // animation for floating up and getting bigger
        Game.getGame().add.tween(score)
            .to({fontSize: 100}, 4000, Phaser.Easing.Linear.None, true);
        // .to({fontSize: 120}, 2000, Phaser.Easing.Linear.None, true);

        Game.getGame().add.tween(score).to({y: -300}, 3500, Phaser.Easing.Linear.None, true);
        const animRemove = Game.getGame().add.tween(score).to({alpha: 0}, 4000, Phaser.Easing.Linear.None);

        animRemove.onComplete.addOnce(() => {
            score.destroy();
        });

        setTimeout(() => {
            animRemove.start();
        }, 500);
    }
}

export default Animations;
