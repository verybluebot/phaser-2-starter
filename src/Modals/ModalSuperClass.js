import Phaser from 'phaser';

import { masterScale } from '../utils';

import { styleTitle, mainFont } from '../Style/Text';

import { SoundFXManager } from '../Services';
import { SOUND_FX_BUTTON_CLICK } from '../Services/SoundFXManager';

class ModalSuperClass extends Phaser.Group {
    constructor ({
        offsetX,
        offsetY,
        customWidth,
        customHeight,
        game,
        parent,
        backgroundColor,
        backgroundOpacity,
        asset,
        modalFrame,
        titleText,
        isNoBack,
        isNoClose,
        closeCallback = () => {}
    }) {
        super(game, parent);

        this.game = game;
        this.customWidth = customWidth || this.game.world.width;
        this.customHeight = customHeight || this.game.world.height;
        this.worldScale = masterScale();

        this.asset = asset;
        this.modalFrame = modalFrame;
        this.titleText = titleText;
        this.isNoBack = isNoBack;
        this.isNoClose = isNoClose;

        this.closeCallback = closeCallback;

        this.backgroundColor = backgroundColor || 0x696969;

        // default style to customise in the target classes
        this.txtStyle = {
            font: '68px ' + mainFont,
            fill: '#000',
            align: 'center'
        };

        this.backgroundOpacity = backgroundOpacity || 0.8;

        // styling
        this.style = {
            popUpWidth: this.game.world.width / 2,
            popUpHeight: this.game.world.height / 2,
            titleTopPadding: masterScale(10)
        };

        // offseting the modal
        this.offsetX = offsetX || 0;
        this.offsetY = offsetY || 0;

        this.renderPopUp();
    }

    renderPopUp () {
        this.renderModalBackground();
        this.renderModalFrame();
        this.renderModalTitle();

        if (!this.isNoBack) {
            this.renderCloseButton();
        }
    }

    // render functions
    renderModalBackground () {
        this.modalBackground = this.game.add.graphics(0, 0);
        this.modalBackground.beginFill(this.backgroundColor)
            .drawRect(this.offsetX, this.offsetY, this.customWidth, this.customHeight);

        this.modalBackground.alpha = this.backgroundOpacity;

        this.modalBackground.inputEnabled = true;
        this.modalBackground.input.priorityID = 0; // lower priority
        if (!this.isNoClose) {
            this.modalBackground.events.onInputDown.add(this.clearPopups, this);
        }

        this.add(this.modalBackground);
    }

    renderModalFrame () {
        this.mainFrame = this.game.add.image(
            this.modalBackground.centerX,
            this.modalBackground.centerY - masterScale(15),
            this.asset,
            this.modalFrame,
            this
        );

        this.mainFrame.inputEnabled = true;
        this.mainFrame.input.priorityID = 1; // mid priority

        this.mainFrame.anchor.set(0.5);
        this.mainFrame.scale.set(masterScale());
    }

    renderModalTitle () {
        this.title = this.game.add.image(
            this.mainFrame.centerX,
            this.mainFrame.y - this.mainFrame.height / 2,
            'start-screen',
            'levels_title.png',
            this
        );

        this.title.anchor.set(0.5);

        this.txtTitle = this.game.add.text(
            0,
            -15,
            this.titleText,
            this.txtStyle
        );

        this.txtTitle.anchor.set(0.5);
        this.title.scale.set(masterScale());
        styleTitle(this.txtTitle);

        this.title.addChild(this.txtTitle);
    }

    renderCloseButton () {

    }

    // click functions
    clearPopups () {
        SoundFXManager.playSoundFX(SOUND_FX_BUTTON_CLICK);

        this.closeCallback();
        this.destroy();
    }

    // frame sizes for child classes
    getMainFrame () {
        return this.mainFrame;
    }

    updateTitleText (txt) {
        this.txtTitle.text = txt;
    }

    updatePriorityId (id) {
        this.modalBackground.input.priorityID = id;
        this.mainFrame.input.priorityID = id + 1;
        this.btnClose.input.priorityID = id + 2;
    }

    updateTitleSize (titleScale, txtScale) {
        this.title.scale.set(titleScale);
        this.txtTitle.scale.set(txtScale);
    }

    flatClickArea() {
        const clickArea = this.game.add.graphics(0, 0);
        clickArea.beginFill(0x000000);
        clickArea.alpha = 0;
        clickArea.drawRect(-75, -75, 150, 150);
        clickArea.anchor.set(0.5);

        clickArea.inputEnabled = true;
        clickArea.input.useHandCursor = true;
        clickArea.events.onInputUp.add(this.clearPopups.bind(this), this);

        clickArea.input.priorityID = 100;
        return clickArea;
    }
}

export default ModalSuperClass;
