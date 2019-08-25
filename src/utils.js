import {
    SCALE_RATIO,
    WORLD_SCALE,
    MAP_SCALE,
    SMALLMOBILE_WIDTH,
    WEB_WIDTH,
    WIDE_WEB_WIDTH,
    WORLD_JUNGLE,
    WORLD_TOWN,
    WORLD_DESERT,
    WORLD_DEAD,
    WORLD_HELL,
    DEVICE_PIXEL_RATIO,
    CALC_MASTER_SCALE,
    CALC_MASTER_SCALE_SMALL,
    CALC_WINDOW_WIDTH
} from './consts';

export const centerGameObjects = (objects) => {
    objects.forEach(function (object) {
        object.anchor.setTo(0.5);
    });
};

export const masterScale = (val = 1) => {
    if (isSmallDevice()) {
        return val * CALC_MASTER_SCALE_SMALL;
    }
    return val * CALC_MASTER_SCALE;
};

export const mapScale = val => {
    // const relativeWidthValue = window.innerWidth / window.innerHeight < 1.4 ? window.innerWidth / 650 : window.innerWidth / 750;
    // if (isSmallDevice()) {
    //     return val * relativeWidthValue * SCALE_RATIO * 0.95;
    // }

    if (val) return val * MAP_SCALE;

    return MAP_SCALE;// val * relativeWidthValue * SCALE_RATIO * 0.95; // val * MAP_SCALE * SCALE_RATIO;
};

export const scaleToRatio = (val = 1) => {
    return val * SCALE_RATIO;
};

export const isTablet = () => {
    return CALC_WINDOW_WIDTH > 1000 && window.devicePixelRatio < 3;
};

export const pixelRatio = (val = 1) => {
    return val * DEVICE_PIXEL_RATIO;
};

export const getChildByName = (obj, name) => {
    const children = obj && obj.children;
    let child = null;

    for (let i = 0; i < children.length; i++) {
        if (children[i].name === name) {
            child = children[i];
            break;
        }
    }

    return child;
};

export const getWorldByLevel = level => {
    // if (level === 0) return WORLD_FIRST_LEVEL;

    if (level < 4) return WORLD_JUNGLE;

    if (level < 8) return WORLD_TOWN;

    if (level < 12) return WORLD_DESERT;

    if (level < 16) return WORLD_DEAD;

    if (level < 20) return WORLD_HELL;
};

export const getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const getRandomBool = () => {
    return Math.random() >= 0.5;
};

export const isObjectNotEmpty = obj => {
    return obj && Object.keys(obj).length > 0;
};

export const genRandomID = (length = 5) => {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
};

export const capitalize = (str = '') => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};

export const isObjectEmpty = obj => {
    return Object.keys(obj || {}).length === 0;
};

export const isSmallDevice = () => {
    return CALC_WINDOW_WIDTH < SMALLMOBILE_WIDTH;
};

// private
const isWeb = () => {
    return window.innerWidth > WEB_WIDTH;
};

const isWideWeb = () => {
    return window.innerWidth > WIDE_WEB_WIDTH;
};

// s
// scaling not working for now
// export cons scaleSprite = (sprite, availableSpaceWidth, availableSpaceHeight, padding, scaleMultiplier) => {
//     const scale = getSpriteScale(availableSpaceWidth, availableSpaceHeight, padding);
//     sprite.scale.x = scale * scaleMultiplier;
//     sprite.scale.y = scale * scaleMultiplier;
// };
//
// // inner functions
// const getSpriteScale = (spriteWidth, availableSpaceWidth, availableSpaceHeight, minPadding) => {
//     let ratio = 1;
//     const currentDevicePixelRatio = window.devicePixelRatio;
//     // Sprite needs to fit in either width or height
//     const widthRatio = (currentDevicePixelRatio + 2 * minPadding) / availableSpaceWidth;
//     const heightRatio = (currentDevicePixelRatio + 2 * minPadding) / availableSpaceHeight;
//
//     if (widthRatio > 1 || heightRatio > 1) {
//         ratio = 1 / Math.max(widthRatio, heightRatio);
//     }
//
//     return ratio * currentDevicePixelRatio;
// };
