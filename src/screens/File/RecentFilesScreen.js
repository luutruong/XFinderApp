import React from 'react'
import BaseScreen, {LoadingStates} from "../BaseScreen";
import FileHelper from "../../utils/FileHelper";
import ItemList from "../../components/ItemList";
import RNFS from 'react-native-fs'
import AppEvent, {AppEventNames} from "../../AppEvent";

export default class RecentFilesScreen extends BaseScreen {
    _doLoadData = () => {
        FileHelper.getRecentFiles()
            .then(results => {
                const rootDir = RNFS.DocumentDirectoryPath;

                const items = results.map((item) => {
                    const parts = item.split('/');

                    return {
                        isFile: () => item.indexOf('.') !== -1,
                        isDirectory: () => false,
                        name: parts[parts.length - 1],
                        path: item,
                        getMetaData: () => {
                            return [
                                item.substr(rootDir.length + 1)
                            ];
                        }
                    };
                });
                items.reverse();

                this._setLoadingState(LoadingStates.Done, { items });
            })
            .catch(() => this._setLoadingState(LoadingStates.Failed));
    };

    _doReload(): void {
        this._doLoadData();
    }

    _doRender(): React.ReactNode {
        const {items} = this.state;
        const itemProps = {
            showModifiedTime: false,
            showFileSize: false
        };

        return (
            <ItemList
                data={items}
                navigation={this.props.navigation}
                isGrid={false}
                itemProps={itemProps}
            />
        );
    }

    constructor(props) {
        super(props);

        this.state = {
            ...this.state,
            items: []
        };

        this._didFocus = null;
    }

    componentDidMount(): void {
        this._doLoadData();

        const {navigation} = this.props;

        this._didFocus = navigation.addListener('didFocus', this._doLoadData);
        AppEvent.addListener(AppEventNames.FileSystemChanged, this._doLoadData);
    }

    componentWillUnmount(): void {
        this._didFocus.remove();
        AppEvent.removeListener(AppEventNames.FileSystemChanged, this._doLoadData);
    }
}

RecentFilesScreen.navigationOptions = () => {
    return {
        title: 'Recent Files'
    }
};