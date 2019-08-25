// import Phaser from 'phaser';

import ModalSuperClass from './ModalSuperClass';
import { masterScale } from '../utils';
import { defaultStyle } from '../Style/Text';
import { IconButton } from '../sprites/Hud/Components';
import { PauseManager, MusicManager, SoundFXManager, GlobalSettings } from '../Services';
import { SOUND_FX_BUTTON_TOGGLE, SOUND_FX_BUTTON_CLICK } from '../Services/SoundFXManager';

const MODAL_ASSET = 'start-screen';

class GameMenu extends ModalSuperClass {
    constructor ({
        game,
        confirmButtonText,
        parent,
        offsetX,
        offsetY,
        customWidth,
        customHeight,
        levelNum,
        clickOkCallback = () => {},
        toggleDeadBodiesCallback = () => {}
    }) {
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
            titleText: 'Menu'
        });

        if (this.game.camera) {
            this.game.camera.x = 0;
            this.game.camera.y = 0;
        }

        this.contentPadding = 150;
        this.clickOkCallback = clickOkCallback;
        this.toggleDeadBodiesCallback = toggleDeadBodiesCallback;

        this.confirmButtonText = confirmButtonText || 'Ok';

        this.levelNum = levelNum;
        this.txtStyle = JSON.parse(JSON.stringify(defaultStyle));

        this.mainFrame = super.getMainFrame();
        this.mainFrame.scale.set(masterScale());

        this.renderModalContent();
    }

    // render functions
    renderModalContent () {
        this.renderButtonQuit();
        this.renderButtonReplay();
        // this.renderContent();
        this.renderContent();
    }

    // Overriding parent
    clearPopups () {
        SoundFXManager.playSoundFX(SOUND_FX_BUTTON_CLICK);

        this.game.paused = false;
        PauseManager.unStopGame(this.game);
        this.destroy();
    }

    // overFrame?: any, outFrame?: any, downFrame?: any, upFrame?
    renderButtonQuit () {
        this.btnMainMenu = new IconButton({
            game: this.game,
            x: 150,
            y: this.mainFrame.height / masterScale(2),
            scale: 1,
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

    renderButtonReplay () {
        this.btnReplay = new IconButton({
            game: this.game,
            x: -150,
            y: this.mainFrame.height / masterScale(2),
            scale: 1,
            key: 'start-screen-bottom',
            callback: () => this.clickRestart(),
            callbackContext: this,
            outFrame: 'button_empty.png',
            overFrame: 'button_empty.png',
            downFrame: 'button_empty.png',
            upFrame: 'button_empty.png'
        });

        this.btnReplay.input.priorityID = 10; // mid priority

        this.btnReplay.anchor.set(0.5);

        this.txtStyle.fontSize = 52;
        const txtReplay = this.game.add.text(5, 0, 'Restart', this.txtStyle);
        txtReplay.anchor.set(0.5);

        this.btnReplay.addChild(txtReplay);

        this.mainFrame.addChild(this.btnReplay);
    }

    renderContent () {
        this.renderMusicButton();
        this.renderMusicButtonText();

        this.renderSoundFXButton();
        this.renderSoundFXButtonText();

        this.renderDeadBodiesButton();
        this.renderDeadBodiesText();
    }

    renderMusicButton () {
        this.musicButton = this.game.add.button(
            this.mainFrame.width / masterScale(2) - this.contentPadding,
            -100,
            MODAL_ASSET,
            this.toggleMusicClick,
            this
        );

        this.musicButton.frameName = MusicManager.isSound() ? 'button_on.png' : 'button_off.png';

        this.musicButton.input.priorityID = 11; // mid priority

        this.musicButton.scale.set(1.5);
        this.musicButton.anchor.set(0.5);

        this.mainFrame.addChild(this.musicButton);
    }

    renderMusicButtonText () {
        this.txtStyle.fontSize = 65;
        // yes the space in the text is for the crystal icon
        this.musicButtontext = this.game.add.text(
            -(this.mainFrame.width / masterScale(1.6)) + this.contentPadding,
            -100,
            'Music',
            this.txtStyle
        );

        this.musicButtontext.anchor.set(0, 0.5);

        this.mainFrame.addChild(this.musicButtontext);
    }

    renderSoundFXButton () {
        this.soundFXButton = this.game.add.button(
            this.mainFrame.width / masterScale(2) - this.contentPadding,
            0,
            MODAL_ASSET,
            this.toggleSoundFXClick,
            this
        );

        this.soundFXButton.frameName = SoundFXManager.isSound() ? 'button_on.png' : 'button_off.png';

        this.soundFXButton.input.priorityID = 11; // mid priority

        this.soundFXButton.scale.set(1.5);
        this.soundFXButton.anchor.set(0.5);

        this.mainFrame.addChild(this.soundFXButton);
    }

    renderSoundFXButtonText () {
        this.txtStyle.fontSize = 65;
        // yes the space in the text is for the crystal icon
        this.soundFXButtontext = this.game.add.text(
            -(this.mainFrame.width / masterScale(1.6)) + this.contentPadding,
            0,
            'Sound FX',
            this.txtStyle
        );

        this.soundFXButtontext.anchor.set(0, 0.5);

        this.mainFrame.addChild(this.soundFXButtontext);
    }

    renderDeadBodiesText () {
        this.txtStyle.fontSize = 46;
        // yes the space in the text is for the crystal icon
        this.deadBodiesText = this.game.add.text(
            -(this.mainFrame.width / masterScale(1.6)) + this.contentPadding,
            120,
            'Leave Dead \nEnemies?',
            this.txtStyle
        );

        this.deadBodiesText.anchor.set(0, 0.5);

        this.mainFrame.addChild(this.deadBodiesText);
    }

    renderDeadBodiesButton () {
        this.deadBodiesButton = this.game.add.button(
            this.mainFrame.width / masterScale(2) - this.contentPadding,
            100,
            MODAL_ASSET,
            this.toggleDeadBodiesClick,
            this
        );

        this.deadBodiesButton.frameName = GlobalSettings.isDeadBodies() ? 'button_on.png' : 'button_off.png';

        this.deadBodiesButton.input.priorityID = 11; // mid priority

        this.deadBodiesButton.scale.set(1.5);
        this.deadBodiesButton.anchor.set(0.5);

        this.mainFrame.addChild(this.deadBodiesButton);
    }

    // click handlers
    toggleMusicClick () {
        SoundFXManager.playSoundFX(SOUND_FX_BUTTON_TOGGLE);

        MusicManager.toggleSound();
        MusicManager.stopMainMusic();
        MusicManager.stopGameMusic();

        if (MusicManager.isSound()) {
            this.musicButton.frameName = 'button_on.png';
            MusicManager.playGameMusic();
            return;
        }

        this.musicButton.frameName = 'button_off.png';
    }

    toggleSoundFXClick () {
        SoundFXManager.toggleSound();

        SoundFXManager.playSoundFX(SOUND_FX_BUTTON_TOGGLE);

        this.soundFXButton.frameName = SoundFXManager.isSound() ? 'button_on.png' : 'button_off.png';
    }

    toggleDeadBodiesClick () {
        GlobalSettings.toggleDeadBodies();
        SoundFXManager.playSoundFX(SOUND_FX_BUTTON_TOGGLE);

        this.deadBodiesButton.frameName = GlobalSettings.isDeadBodies() ? 'button_on.png' : 'button_off.png';

        this.toggleDeadBodiesCallback();
    }

    clickOk () {
        SoundFXManager.playSoundFX(SOUND_FX_BUTTON_CLICK);

        this.clickOkCallback();
    }

    clickRestart () {
        SoundFXManager.playSoundFX(SOUND_FX_BUTTON_CLICK);

        this.game.state.start(`Level${this.levelNum}`, true);
        super.clearPopups();
    }
}

export default GameMenu;
