const _data = {};

export default class Container {
    static addItem(name: String, data: any): void {
        let items = this.getItem(name);
        if (items === null) {
            items = [];
        }

        items.push(data);
        _data[[name]] = items;
    }

    static setItem(name: String, data: any) {
        _data[[name]] = data;
    }

    static hasItem(name: String): boolean {
        return _data.hasOwnProperty(name);
    }

    static getItem(name: String): any {
        if (!this.hasItem(name)) {
            return null;
        }

        return _data[[name]];
    }

    static deleteItem(name: String) {
        if (this.hasItem(name)) {
            delete _data[[name]];
        }
    }

    static getItems(): Object {
        return _data;
    }
}
