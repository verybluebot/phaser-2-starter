import Phaser from 'phaser';
import { defaultStyle, setStroke } from '../../../Style/Text';

class FloatingMessage extends Phaser.Image {
    constructor ({
        game,
        x,
        y,
        text,
        icon,
        textColor,
        frame,
        iconScale,
        verticalPaddingText,
        verticalPaddingArrow,
        isOffset,
        isTxtBg,
        txtFont
    }) {
        super(game, x, y, frame || 'start-screen-bottom', icon || 'chests_3.png');

        this.game = game;
        this.text = text || '';

        this.anchor.set(0.5);

        this.isTxtBg = isTxtBg;
        this.txtFont = txtFont || 120;

        this.textColor = textColor || '#000';
        this.scale.set(iconScale || 0.9);

        this.isOffset = isOffset;

        this.defaultStyle = defaultStyle;
        this.verticalPaddingText = verticalPaddingText || -90;
        this.verticalPaddingArrow = verticalPaddingArrow || 120;

        this.animFloat = game.add.tween(this)
            .to({y: this.y - 25}, 1100, Phaser.Easing.Linear.None, true, false, -1, true);

        this.renderText();
        this.renderArrow();
    }

    renderText () {
        this.txtBg = this.game.add.image(this.isOffset ? 0 : 5, this.verticalPaddingArrow - 50);

        if (this.isTxtBg) {
            this.txtBg = this.game.add.image(this.isOffset ? 0 : 5, this.verticalPaddingArrow - 50, 'start-screen-bottom', 'button_empty.png');
        }

        this.txtBg.anchor.setTo(0.5, 1);

        this.txtMain = this.game.add.text(0, -70, this.text, this.defaultStyle);
        this.txtMain.anchor.set(0.5);
        this.txtMain.fontSize = this.txtFont;
        // this.txtMain.colors = [this.textColor];

        setStroke(this.txtMain);

        this.animTxt = this.game.add.tween(this.txtBg)
            .to({y: this.txtBg.y - 15}, 1100, Phaser.Easing.Linear.None, true, false, -1, true);

        this.txtBg.addChild(this.txtMain);
        this.addChild(this.txtBg);
    }

    renderArrow () {
        this.arrow = this.game.add.image(this.isOffset ? 15 : 30, this.verticalPaddingArrow, 'start-screen-bottom', 'skull_arr.png');
        this.arrow.anchor.set(0.5, 0);
        this.arrow.angle = 90;

        this.arrow.scale.set(1.5);

        this.addChild(this.arrow);
    }
}

export default FloatingMessage;
