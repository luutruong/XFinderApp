import Container from "./Container";

export const AppEventNames = Object.freeze({
    UserSettingsChanged: 'UserSettingsChanged',
    LayoutListGridChanged: 'LayoutListGridChanged',
    SearchTextChanged: 'SearchTextChanged',
    FileSystemChanged: 'FileSystemChanged'
});

const prepareEventName = (name) => `events_${name}`;

export default class AppEvent {
    static addListener(name: String, callback: Function): void {
        Container.addItem(prepareEventName(name), callback);
    }

    static removeListener(name: String, callback: Function): void {
        const items = Container.getItem(prepareEventName(name));
        if (items === null) {
            return;
        }

        Container.setItem(prepareEventName(name), items.filter((c) => c !== callback));
    }

    static dispatch(name: String, data: any) {
        const events = Container.getItem(prepareEventName(name));
        if (events === null) {
            return;
        }

        events.forEach((c) => c(data));
    }
}
