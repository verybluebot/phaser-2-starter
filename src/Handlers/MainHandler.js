/* globals set with webpack:
 GAME_ENV
 */

import {
    getPlatformPlayerID,
    getPlatformPlayerContext,
    getPlatformPlayerName,
    getPlatformPlayerPhoto,
    getPlatformPlayerHash,
    simplePlatformShare,
    switchPlatformToContext,
    invitePlatformNewPlayer,
    updatePlatformPlayerInvite,
    updatePlatformGotReward,
    allPlatformReadyRecruitedPlayer,
    askPlatformFriendForHelp,
    thankPlatformForHelp,
    addPlatformToLaunchScreen,
    sendPlatformLogEvent,
    isPlatformSubscribedToBot,
    subscribePlatformToBot,
    getPlatformEntryPointData,
    setPlatformPlayerHash,

} from './Platforms/mainHandlers.facebook'; // .facebook import will change to .mobile on mobile build

export const RETURN_NEW_RECRUIT = 'RETURN_NEW_RECRUIT';
export const RETURN_HELP_RECRUIT = 'RETURN_HELP_RECRUIT';
export const RETURN_HELPED = 'RETURN_HELPED';

export const isFBInstant = () => {
    return (typeof FBInstant !== 'undefined');
};

export const isAndroid = () => {
    return /(android)/i.test(navigator.userAgent);
};

export const isIOS = () => {
    return /(ipod|iphone|ipad)/i.test(navigator.userAgent);
};

export const getPlayerID = () => {
    return getPlatformPlayerID();
};

export const getPlayerContext = () => {
    return getPlatformPlayerContext();
};

export const getPlayerName = () => {
    return getPlatformPlayerName();
};

export const getPlayerPhoto = () => {
    return getPlatformPlayerPhoto();
};

export const getPlayerHash = () => {
    return getPlatformPlayerHash();
};

export const setPlayerHash = hash => {
    return setPlatformPlayerHash(hash);
};

// TODO: come back to ad service later
export const isFBSupportRewardedVideos = () => {
    if (!isFBInstant()) return;
    return FBInstant.getSupportedAPIs().includes('getRewardedVideoAsync');
};

export const isFBSupportInterstitialVideos = () => {
    if (!isFBInstant()) return;
    return FBInstant.getSupportedAPIs().includes('getInterstitialAdAsync');
};

export const onPauseHandler = game => {
    if (!isFBInstant() || !game) return;

    FBInstant.onPause(game => {
        game.paused = true;
    });
};

export const simpleShare = (userName, score, level) => {
    return simplePlatformShare(userName, score, level);
};

export const switchToContext = contextID => {
    return switchPlatformToContext(contextID);
};

export const inviteNewPlayer = () => {
    return invitePlatformNewPlayer();
};

export const updatePlayerInvite = (name, amount, playerID, playerName) => {
    return updatePlatformPlayerInvite(name, amount, playerID, playerName);
};

export const updateGotReward = (name, amount, recruiterName) => {
    return updatePlatformGotReward(name, amount, recruiterName);
};

export const allReadyRecruitedPlayer = (name, recruiterName) => {
    return allPlatformReadyRecruitedPlayer(name, recruiterName);
};

export const askFriendForHelp = (name, targetUserID) => {
    return askPlatformFriendForHelp(name, targetUserID);
};

export const thankForHelp = (name, helperName) => {
    return thankPlatformForHelp(name, helperName);
};

export const addToLaunchScreen = data => {
    return addPlatformToLaunchScreen(data);
};

export const sendLogEvent = data => {
    return sendPlatformLogEvent(data);
};

export const isSubscribedToBot = () => {
    return isPlatformSubscribedToBot();
};

export const getEntryPointData = () => {
    return getPlatformEntryPointData();
};

/*

canSubscribeBotAsync and .catch(function (e) {
// e.message.contains('already subscribed');
if(e.message.indexOf('already subscribed')>=0)
{
this.bIsSubscribedToBot=true;
_callback(true);
}
 */

export const subscribeToBot = (logEvent = {location: 'generic'}) => {
    return subscribePlatformToBot(logEvent);
};
