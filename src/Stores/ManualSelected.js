import Phaser from 'phaser';
import { Game } from './index';

class ManualSelected {
    constructor () {
        if (!ManualSelected.instance) {
            this._inlevel = {
                tower: {}
            };

            ManualSelected.instance = this;
        }

        return ManualSelected.instance;
    }

    getSelectedTower () {
        return this._inlevel.tower;
    }

    setSelectedTower (tower) {
        console.log('selected tower is', tower.name);
        this._inlevel.tower = tower;
        this.renderSelectedTower(tower);
        return Promise.resolve();
    }

    deselectTower (tower) {
        if (!tower) return;
        console.log('tower deselected', tower.name);

        tower.selectedTowerArrow.destroy(true);
        tower.selectedTowerArrow = null;

        this._inlevel.tower = {};
    }

    clearSelectedTower (tower) {
        console.log('clearing tower', tower.name);
        if (!tower || tower.name === this._inlevel.tower.name) return;

        console.log('IS THIS CLREARING', tower.type, tower.cat)
        tower.selectedTowerArrow.destroy(true);
        tower.selectedTowerArrow = null;
    }

    renderSelectedTower (tower) {
        if (tower.selectedTowerArrow) return;

        const selectedTowerArrow = Game.getGame().add.sprite(0, -220, 'hud');
        selectedTowerArrow.anchor.set(0.5, 1);

        selectedTowerArrow.animations.add(
            'selected-tower',
            Phaser.Animation.generateFrameNames(`selected_tower_`, 0, 7, '.png', 4),
            12,
            true);

        tower.selectedTowerArrow = tower.addChild(selectedTowerArrow);
        selectedTowerArrow.animations.play('selected-tower');
    }
}

const instance = new ManualSelected();
Object.freeze(instance);

export default instance;
