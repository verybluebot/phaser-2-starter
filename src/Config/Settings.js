/* globals set with webpack:
 GAME_ENV
 */

export const connection = {
    urls: () => {
        switch (GAME_ENV) {
            // TODO: TBD
            case 'production':
            return {
                serverUrl: 'https://apisketchwars.shugostudios.com:4430'
            };
        case 'staging':
            return {
                serverUrl: 'https://stagingapifirstleagion.shugostudios.com:4431'
            };

        case 'development-fb':
            return {
                serverUrl: 'https://stagingapifirstleagion.shugostudios.com:4431'
            };
        case 'development-mobile':
            return {
                serverUrl: 'http://localhost:8000'
                // serverUrl: 'https://apisketchwars.shugostudios.com:4430'

            };

        default:
            return {
                serverUrl: 'https://stagingapifirstleagion.shugostudios.com:4431'
            };
        }
    }
};
