class Device {
    constructor () {
        if (!Device.instance) {
            this._data = {
                device: {}
            };

            Device.instance = this;
        }

        return Device.instance;
    }

    init (device) {
        if (!device) return;
        this._data.device = device;
    }

    getDeviceData () {
        return this._data.device;
    }

    isNewIphone () {
        if (!this._data.device || Object.keys(this._data.device || {}).length < 1) return;

        return this._data.device.model.includes('iPhone10,6') ||
            this._data.device.model.includes('iPhone11') ||
            this._data.device.model.includes('iPhone12') ||
            this._data.device.model.includes('iPhone13') ||
            this._data.device.model.includes('iPhone14');
    }
}

const instance = new Device();
Object.freeze(instance);

export default instance;
