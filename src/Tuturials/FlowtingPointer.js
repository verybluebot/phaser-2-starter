import Phaser from 'phaser';
import { defaultStyle, setStroke } from '../Style/Text';
import { Game } from '../Stores';
import { masterScale } from '../utils';

class FloatingPointer extends Phaser.Image {
    constructor ({
        game,
        x,
        y,
        text,
        icon,
        frame,
        iconScale,
        verticalPaddingText,
        verticalPaddingArrow,
        isOffset,
        isBold,
        isTxtBg
    }) {
        super(Game.getGame(), x, y, frame, icon);

        this.game = Game.getGame();
        this.text = text;

        this.anchor.set(0.5);
        this.isTxtBg = isTxtBg;

        this.scale.set(iconScale || masterScale(0.9));

        this.isOffset = isOffset;

        this.defaultStyle = defaultStyle;
        this.verticalPaddingText = verticalPaddingText || -30;
        this.verticalPaddingArrow = verticalPaddingArrow || 30;

        this.animFloat = this.game.add.tween(this)
            .to({y: this.y - 25}, 1100, Phaser.Easing.Linear.None, true, false, -1, true);

        this.renderText(isBold);
        this.renderArrow();
    }

    renderText (isBold) {
        // this.txtBg = this.game.add.image(0, this.verticalPaddingArrow);
        // if (this.isTxtBg) {
        //     this.txtBg = this.game.add.image(0, this.verticalPaddingArrow, 'start-screen-bottom', 'button_empty.png');
        // }

        this.txtBg = this.game.add.image(0, this.verticalPaddingArrow - 100, 'start-screen-bottom', 'button_empty.png');

        this.txtBg.anchor.setTo(0.5);
        this.txtBg.scale.set(2.2);

        this.txtMain = this.game.add.text(0, 0, this.text, this.defaultStyle);
        this.txtMain.anchor.set(0.5);
        this.txtMain.fontSize = 24;

        if (isBold) {
            setStroke(this.txtMain);
        }

        this.animTxt = this.game.add.tween(this.txtBg)
            .to({y: this.txtBg.y - 15}, 1100, Phaser.Easing.Linear.None, true, false, -1, true);

        this.txtBg.addChild(this.txtMain);
        this.addChild(this.txtBg);
    }

    renderArrow () {
        this.arrow = this.game.add.image(0, this.verticalPaddingArrow + 60, 'start-screen-bottom', 'skull_arr.png');
        this.arrow.anchor.set(0.5, 0);
        this.arrow.angle = 90;

        this.arrow.scale.set(1.8);

        this.addChild(this.arrow);
    }
}

export default FloatingPointer;
