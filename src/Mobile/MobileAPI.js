import axios from 'axios';
import { connection } from '../Config/Settings';

class MobileAPI {
    constructor () {
        if (!MobileAPI.instance) {
            MobileAPI.instance = this;
            this._headers = {
            };

            this._hash = {
                key: 'd',
                value: ''
            };
        }

        return MobileAPI.instance;
    }

    setHash (value) {
        this._hash.value = value;
    }

    addHeader ({ key, value }) {
        this._headers[key] = value;
    }

    removeHeader (key) {
        this._headers[key] = null;
    }

    getNewHash () {
        return axios.get(connection.urls().serverUrl + '/mobile/init-hash', {headers: this._headers})
            .then(res => {
                if (!res.data || !res.data.hash) {
                    return Promise.reject(new Error('No hash came back from server on hash init'));
                }

                return Promise.resolve(res.data.hash);
            })
            .catch(err => Promise.reject(err));
    }

    // helpers
    getHashParam () {
        return this._hash.key + '=' + this._hash.value;
    }
}

const instance = new MobileAPI();
Object.freeze(instance);

export default instance;
