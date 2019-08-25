import { Game } from '../Stores';
import { masterScale } from '../utils';

class Images {
    static createAvatar (x, y, scale, imageName) {
        const image = Game.getGame().add.image(x, y, imageName);
        image.anchor.setTo(0.5);
        // image.scale.set(scale);

        if (scale) {
            image.scale.set(scale);
        } else {
            image.width = masterScale(210);
            image.height = masterScale(210);
        }

        const mask = Game.getGame().add.graphics(x, y);
        mask.anchor.setTo(0.5);
        mask.drawCircle(x, y, image.width - 3);
        mask.endFill();

        image.mask = mask;

        return { image, mask };
    }

    static createSeparator (x, y, width) {
        const seperator = Game.getGame().add.graphics(x, y);
        seperator.beginFill(0Xf7bb1f);

        seperator.drawRect(x, y, width, 2);
        // seperator.drawCircle(x, y, width);

        seperator.endFill();

        return seperator;
    }

    static flatClickArea (cb) {
        const clickArea = Game.getGame().add.graphics(0, 0);
        clickArea.beginFill(0x000000);
        clickArea.alpha = 0;
        clickArea.drawRect(-75, -75, 150, 150);
        clickArea.anchor.set(0.5);

        clickArea.inputEnabled = true;
        clickArea.input.useHandCursor = true;
        clickArea.events.onInputUp.add(cb);

        clickArea.input.priorityID = 100;
        return clickArea;
    }
}

export default Images;
