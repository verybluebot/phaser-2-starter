/* eslint-disable no-multi-spaces */
// screen

const getRelativeWidth = () => {
    return window.innerWidth / window.innerHeight < 1.4 ? window.innerWidth / 650 : window.innerWidth / 750;
};

export const SCALE_RATIO = window.devicePixelRatio / 3;

export let FULL_SCREEN_WIDTH = window.innerWidth * window.devicePixelRatio;
export let FULL_SCREEN_HEIGHT = window.innerHeight * window.devicePixelRatio;

export const DEVICE_PIXEL_RATIO = window.devicePixelRatio;

export const SMALLMOBILE_WIDTH = 580;
export const WEB_WIDTH = 800;
export const WIDE_WEB_WIDTH = 1200;

export let WORLD_SCALE = window.innerWidth > 1000 ? 1.6 : 0.9;

let relativeWidthValue = getRelativeWidth();
export let MAP_SCALE = relativeWidthValue * SCALE_RATIO * 0.95;

// to ease calculations
export let CALC_MASTER_SCALE_SMALL = WORLD_SCALE * SCALE_RATIO * 0.95;
export let CALC_MASTER_SCALE = WORLD_SCALE * SCALE_RATIO;
export let CALC_WINDOW_WIDTH = window.innerWidth;

// this is for devices not getting window sizes on first boot
export const updateWindowWidthConsts = () => {
    FULL_SCREEN_WIDTH = window.innerWidth * window.devicePixelRatio;
    FULL_SCREEN_HEIGHT = window.innerHeight * window.devicePixelRatio;
    WORLD_SCALE = window.innerWidth > 1000 ? 1.6 : 0.9;

    const relativeWidthValue = getRelativeWidth();
    MAP_SCALE = relativeWidthValue * SCALE_RATIO * 0.95;

    CALC_MASTER_SCALE_SMALL = WORLD_SCALE * SCALE_RATIO * 0.95;
    CALC_MASTER_SCALE = WORLD_SCALE * SCALE_RATIO;
    CALC_WINDOW_WIDTH = window.innerWidth;
};

// texts
export const TEXT_LOADING = 'Loading...';


// FB
export const FB_AD_PLACEMENT_ID                        = '189508218329052_191572931455914';
export const FB_AD_PLACEMENT_INTENTIONS_ID             = '186681675513260_191158691732225';

