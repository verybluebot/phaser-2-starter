import Phaser from 'phaser';

import { defaultStyle } from '../../../Style/Text';
import { TEXT_LOADING } from '../../../consts';
import { masterScale } from '../../../utils';

// import { LoaderManager } from '../../../Services';

class Loading extends Phaser.Group {
    constructor ({ game, isBar, levelSelected, testLoadingTotal, testLoadingCurrent }) {
        super(game);

        // TODO: for testing only
        this.testLoadingTotal = 10;
        this.testLoadingCurrent = 1;

        this.game = game;

        this.backgroundColor = 0x212121; // 0x009949;
        this.backgroundOpacity = 0.75;

        this.txtStyle = JSON.parse(JSON.stringify(defaultStyle));

        this.isBar = isBar;
        this.levelSelected = levelSelected;

        this.progressSegment = 0;

        this.renderContent();

        // TODO: can't scale this shit because of the rectangle mess
    }

    testAllLoad () {
        this.testLoadingCurrent++;
    }

    static startLoading (game, isBar, levelSelected) {
        return new Loading({ game, isBar, levelSelected });
    }

    static startLoadingIcon (game, x, y) {
        const loadingIcon = game.add.sprite(x, y, 'start-screen', 'loading_0000.png');
        loadingIcon.anchor.set(0.5);

        loadingIcon.scale.set(1);
        loadingIcon.animations.add('loading', Phaser.Animation.generateFrameNames('loading_000', 0, 3, '.png', 1), 12, true);

        loadingIcon.animations.play('loading');

        return loadingIcon;
    }

    finishLoading () {
        this.cleanUp();
    }

    renderContent () {
        this.renderBackground();
        this.renderLoadingIcon();
        if (this.isBar) {
            this.renderLoadingBar();
        }
    }

    update () {
        if (this.isBar && this.loadingBar) {
            // this.loadingBar.width = (this.loadingBarFrame.width / LoaderManager.getStartProg().total) * LoaderManager.getStartProg().current;

            this.loadingBar.width = this.loadingBarFrame.width * this.progressSegment;
            // TODO: this shit is for testing only
            // this.loadingBar.width = (this.loadingBarFrame.width / this.testLoadingTotal) * this.testLoadingCurrent;
        }
    }

    renderBackground () {
        this.modalBackground = this.game.add.graphics(0, 0);
        this.modalBackground.beginFill(this.backgroundColor)
            .drawRect(0, 0, this.game.width, this.game.height);

        this.modalBackground.alpha = this.backgroundOpacity;

        this.modalBackground.inputEnabled = true;
        this.modalBackground.input.priorityID = 5; // lower priority

        this.add(this.modalBackground);
    }

    renderLoadingBar () {
        this.loadingBarFrame = this.create(this.LoadingIcon.x, this.LoadingIcon.y + masterScale(230), 'start-screen', 'loading_frame.png');
        this.loadingBarFrame.anchor.set(0.5);
        this.loadingBarFrame.scale.set(masterScale());

        this.loadingBar = this.create(this.loadingBarFrame.x - this.loadingBarFrame.width / 2, this.loadingBarFrame.y + 1, 'start-screen', 'loading_bar.png');
        this.loadingBar.anchor.set(0, 0.5);
        this.loadingBar.scale.set(masterScale());

        this.loadingBar.width = 0;
    }

    renderLoadingIcon () {
        this.LoadingIcon = this.game.add.sprite(this.modalBackground.centerX, this.modalBackground.centerY, 'start-screen', 'loading_0000.png');
        this.LoadingIcon.anchor.set(0.5);

        this.LoadingIcon.scale.set(masterScale());
        this.LoadingIcon.animations.add('loading', Phaser.Animation.generateFrameNames('loading_000', 0, 3, '.png', 1), 12, true);
        this.addChild(this.LoadingIcon);
        this.LoadingIcon.animations.play('loading');

        const txtLoading = this.game.add.text(0, 125, TEXT_LOADING, this.txtStyle);
        txtLoading.fill = '#fff';
        txtLoading.fontSize = 36;
        txtLoading.anchor.set(0.5, 0);

        this.LoadingIcon.addChild(txtLoading);
    }

    setProgress (progress) {
        this.progressSegment = progress / 100;
    }

    cleanUp () {
        this.destroy();
    }
}

export default Loading;
