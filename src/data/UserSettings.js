import Container from "../Container";
import {AsyncStorage} from 'react-native'
import AppEvent, {AppEventNames} from "../AppEvent";

const USER_SETTINGS_KEY = 'UserSettings';
export default class UserSettings {
    static initialize() {
        const defaultValues = {
            listViewType: 'grid',
            autoSaveInterval: 30
        };

        return new Promise((resolve, reject) => {
            AsyncStorage.getItem(USER_SETTINGS_KEY)
                .then(jsonText => JSON.parse(jsonText))
                .then((json) => {
                    Container.setItem(USER_SETTINGS_KEY, Object.assign(defaultValues, json));

                    resolve();
                })
                .catch(() => {
                    Container.setItem(USER_SETTINGS_KEY, defaultValues);

                    reject();
                })
        });
    }

    static get(name: String) {
        const opts = Container.getItem(USER_SETTINGS_KEY);
        if (opts !== null && opts.hasOwnProperty(name)) {
            return opts[[name]];
        }

        throw new Error(`There are no registered key '${name}'`);
    }

    static set(name: String, value: any) {
        let opts = Container.getItem(USER_SETTINGS_KEY);
        if (opts === null) {
            opts = {};
        }

        opts[[name]] = value;
        Container.setItem(USER_SETTINGS_KEY, opts);
        AsyncStorage.setItem(USER_SETTINGS_KEY, JSON.stringify(opts));

        AppEvent.dispatch(AppEventNames.UserSettingsChanged, {
            name: name,
            value: value
        });
    }
}