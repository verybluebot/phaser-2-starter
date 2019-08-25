// import Phaser from 'phaser';

import ModalSuperClass from './ModalSuperClass';
import { masterScale } from '../utils';
import { defaultStyle } from '../Style/Text';
import { IconButton } from '../sprites/Hud/Components';
import { PauseManager, LoaderManager } from '../Services';

const MODAL_ASSET = 'start-screen';

class GeneralConformation extends ModalSuperClass {
    constructor ({ game, confirmButtonText, titleText, imageName, parent, offsetX, offsetY, customWidth, customHeight, clickOkCallback }) {
        super({
            game,
            parent,
            offsetX,
            offsetY,
            customWidth,
            customHeight,
            confirmButtonText,
            asset: MODAL_ASSET,
            modalFrame: 'modal-message-background.png',
            titleText,
            isNoClose: true
        });

        if (this.game.camera) {
            this.game.camera.x = 0;
            this.game.camera.y = 0;
        }

        this.clickOkCallback = clickOkCallback;

        this.confirmButtonText = confirmButtonText || 'Ok';

        this.imageName = imageName;

        this.txtStyle = JSON.parse(JSON.stringify(defaultStyle));

        this.mainFrame = super.getMainFrame();
        this.mainFrame.scale.set(masterScale());

        this.renderModalContent();
    }

    // render functions
    renderModalContent () {
        this.renderButton();
        this.renderText();

        if (this.imageName) {
            this.renderImage();
        }
    }

    renderImage () {
        LoaderManager.loadImageByName(this.imageName)
            .then(() => {
                const image = this.game.add.image(-90, 205, this.imageName);
                image.anchor.set(0.5, 1);
                this.mainFrame.addChild(image);

                // this.mainText.x = 100;
                this.mainText.y = -120;
                this.btnMainMenu.x = 120;
            });
    }

    // Overriding parent
    clearPopups () {
        this.game.paused = false;
        PauseManager.unStopGame(this.game);
        this.destroy();
    }

    // overFrame?: any, outFrame?: any, downFrame?: any, upFrame?
    renderButton () {
        this.btnMainMenu = new IconButton({
            game: this.game,
            x: 0,
            y: this.mainFrame.height / masterScale(2),
            scale: 1.3,
            key: 'start-screen-bottom',
            callback: () => this.clickOk(),
            callbackContext: this,
            outFrame: 'button_empty.png',
            overFrame: 'button_empty.png',
            downFrame: 'button_empty.png',
            upFrame: 'button_empty.png'
        });

        this.btnMainMenu.input.priorityID = 10; // mid priority

        this.btnMainMenu.anchor.set(0.5);

        this.txtStyle.fontSize = 52;
        const txtMainMenu = this.game.add.text(5, 0, this.confirmButtonText, this.txtStyle);
        txtMainMenu.anchor.set(0.5);

        this.btnMainMenu.addChild(txtMainMenu);

        this.mainFrame.addChild(this.btnMainMenu);
    }

    renderText () {
        this.txtStyle.fontSize = 54;
        // yes the space in the text is for the crystal icon
        this.mainText = this.game.add.text(0, 0, 'Are you sure you want to leave the battle?', this.txtStyle);
        this.mainText.anchor.set(0.5);
        this.mainText.wordWrap = true;
        this.mainText.wordWrapWidth = 600;

        this.mainFrame.addChild(this.mainText);
    }

    clickOk () {
        this.clickOkCallback();
    }
}

export default GeneralConformation;
