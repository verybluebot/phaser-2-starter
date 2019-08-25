import { CLIENT_EVENT_FRIEND_JOINED, CLIENT_EVENT_CAME_FOR_HELP } from '../consts';
import { Game, Player, InLevelScores } from '../Stores';

// modals
import { JoinedFriend } from '../Notifications';

// other
import { masterScale } from '../utils';

class EventListener {
    constructor () {
        if (!EventListener.instance) {
            this._actions = {
                friendJoined: null,
                friendCameBack: null
            };

            EventListener.instance = this;
        }

        console.log('this shit is the event listener');

        return EventListener.instance;
    }

    init () {
        this.handleFriendJoined();
        this.handleFriendCameForHelp();
    }

    handleFriendJoined () {
        document.addEventListener(CLIENT_EVENT_FRIEND_JOINED, data => {
            console.log('got this fucking amazing on join fucking thing', data.detail);

            const game = Game.getGame();
            if (this._actions.friendJoined) return;

            // get updated recruits
            Player.updatePlayerRecruits()
                .then(() => {
                    // pop up the joined friend thingy
                    this._actions.friendJoined = new JoinedFriend({
                        game,
                        x: Game.getGame().world.centerX + game.world.camera.x,
                        y: masterScale(200 + game.world.camera.y),
                        fbID: data.detail.joinedFriendId
                    });

                    game.add.existing(this._actions.friendJoined);
                }).catch(err => console.log(err));
        });
    }

    handleFriendCameForHelp () {
        document.addEventListener(CLIENT_EVENT_CAME_FOR_HELP, data => {
            console.log('got this fucking amazing on helping!! fucking thing', data.detail);

            const game = Game.getGame();
            if (this._actions.friendCameBack || !data.detail) return;

            const payload = data.detail;

            // check if player is in game - if not get the fuck out
            if (!InLevelScores.getLevelNum()) return;

            // getting here `helperUserID` and `boostAmount`
            // pop up the joined friend thingy
            this._actions.friendJoined = new JoinedFriend({
                game,
                x: (window.innerWidth * window.devicePixelRatio) / 2 + game.world.camera.x,
                y: masterScale(200 + game.world.camera.y),
                fbID: payload.helperUserID,
                boostAmount: payload.boostAmount
            });

            game.add.existing(this._actions.friendJoined);

        });
    }

    // TODO: reset friend came for help on each new level
    resetFriendCameBack () {
        this._actions.friendCameBack = null;
    }

}

const instance = new EventListener();
Object.freeze(instance);

export default instance;
