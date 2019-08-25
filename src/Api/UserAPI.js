import axios from 'axios';
import { connection } from '../Config/Settings';

class UserAPI {
    constructor () {
        if (!UserAPI.instance) {
            UserAPI.instance = this;
            this._headers = {
            };

            this._hash = {
                key: 'd',
                value: ''
            };
        }

        return UserAPI.instance;
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

    postApi (data) {
        return Promise.resolve()

        return axios.post(connection.urls().serverUrl + '/api/post-api?' + this.getHashParam(), { data }, {headers: this._headers})
            .then(res => {
                if (!res.data) {
                    return Promise.reject(new Error('no data came back'));
                }

                return Promise.resolve(res.data);
            })
            .catch(err => Promise.reject(err));
    }

    getUpgrades () {
        return axios.get(connection.urls().serverUrl + '/api/get-api?' + this.getHashParam(), {headers: this._headers})
            .then(res => {
                if (!res.data) {
                    return Promise.reject(new Error('no data came back'));
                }

                return Promise.resolve(res.data);
            })
            .catch(err => Promise.reject(err));
    }

    // helpers
    getHashParam () {
        return this._hash.key + '=' + this._hash.value;
    }
}

const instance = new UserAPI();
Object.freeze(instance);

export default instance;
