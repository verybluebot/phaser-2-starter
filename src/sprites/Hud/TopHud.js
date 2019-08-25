import Phaser from 'phaser';

import { Bar } from './Components';
import { HangingScore } from '../../Menus/Components';

import { masterScale } from '../../utils';

class TopHud extends Phaser.Group {
    constructor ({ game, x, y, initialBuildScore, initialCrystalsScore, magicScore, magicMaxScore, scale, enemiesRemainCount, enemiesKilled }) {
        super(game);

        this.x = x;
        this.y = y;

        this.leftPadding = masterScale(80);
        this.bottomPadding = masterScale(40);
        this.inlinePadding = 50;
        this.firstBottomPadding = masterScale(220);

        this.magicMaxScore = magicMaxScore;

        // this.hudBarBackground = this.game.add.image(x, y, 'hud', 'background_hud_bars.png');
        // this.hudBarBackground.fixedToCamera = true;
        // this.hudBarBackground.scale.set(masterScale());

        this.barComponents = this.game.add.group();

        this.healthBar = new Bar({
            game,
            x: this.leftPadding,
            y: this.firstBottomPadding,
            asset: 'hud',
            barInner: 'bar_4.png',
            barFrame: 'bar_frame.png',
            barIcon: 'heart.png',
            scale: masterScale(1.3)
        });

        // build points
        this.buildScoreBackground = new HangingScore({
            game,
            x: masterScale(300),
            y: -masterScale(20),
            initialScore: initialBuildScore,
            iconKey: 'hud',
            iconFrame: 'icon-hammer.png'
        });

        this.buildScoreBackground.x = this.buildScoreBackground.width + masterScale(100);
        this.buildScoreBackground.fixedToCamera = true;

        // magic points
        this.magicScoreBackground = new HangingScore({
            game,
            x: masterScale(600),
            y: -masterScale(20),
            initialScore: magicScore + '/' + magicMaxScore,
            iconKey: 'start-screen-top',
            iconFrame: 'zip.png'
        });

        this.magicScoreBackground.icon.x -= 30;
        this.magicScoreBackground.text.x -= 10;

        this.magicScoreBackground.x = this.magicScoreBackground.width + masterScale(100);
        this.magicScoreBackground.fixedToCamera = true;

        // enemies remain count
        this.hangingScoreRemain = new HangingScore({
            game,
            x: game.width - masterScale(30),
            y: -masterScale(20),
            initialScore: enemiesRemainCount,
            text: 'Remain:'
        });

        this.hangingScoreRemain.fixedToCamera = true;

        this.hangingScoreKills = new HangingScore({
            game,
            x: game.width - this.hangingScoreRemain.width - masterScale(50),
            y: -masterScale(20),
            initialScore: enemiesKilled,
            text: 'Kills:'
        });

        this.hangingScoreKills.fixedToCamera = true;

        this.barComponents.add(this.hangingScoreRemain);
        this.barComponents.add(this.hangingScoreKills);
        this.barComponents.add(this.healthBar);
    }

    setHealthValue (value) {
        if (!this.healthBar) return;

        this.healthBar.setValue(value);
    }

    setBuildScore (value) {
        if (!this.buildScoreBackground) return;
        this.buildScoreBackground.updateScore(value);
    }

    setMagicScore (value) {
        if (!this.magicScoreBackground) return;
        this.magicScoreBackground.updateScore(value + '/' + this.magicMaxScore);
    }
}

export default TopHud;
