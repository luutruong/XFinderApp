import React from 'react'
import {View, StyleSheet, FlatList, Dimensions, AlertIOS, ActionSheetIOS, Alert} from 'react-native'
import ListGridSwitcher from "./ListGridSwitcher";
import AppEvent, {AppEventNames} from "../../AppEvent";
import BaseScreen, {LoadingStates} from "../BaseScreen";
import RNFS from 'react-native-fs'
import ButtonIcon from "../../components/ButtonIcon";
import UserSettings from "../../data/UserSettings";
import ItemList from "../../components/ItemList";
import FileHelper from "../../utils/FileHelper";

const {width} = Dimensions.get('window');

type Props = {
    navigation: Object
};
export default class FinderScreen extends BaseScreen<Props> {
    _listGridDidChanged = (layoutType) => {
        const items = [];
        this._setLoadingState(LoadingStates.Begin, { layoutType });
        setTimeout(this._doLoadData, 500);
    };

    _doLoadData = () => {
        RNFS.readDir(this._getWorkDirectory())
            .then((items) => {
                const filteredItems = items.filter(item => {
                    return item.name.indexOf('RCTAsyncLocalStorage_') !== 0;
                });

                this._setLoadingState(LoadingStates.Done, { items: filteredItems })
            })
            .catch(() => this._setLoadingState(LoadingStates.Failed));
    };

    _showActionSheets = () => {
        const workingOnDir = this._getWorkDirectory();
        const sheetOptions = [
            'Cancel',
            'Create new directory',
            'Create new file'
        ];
        const {navigation} = this.props;

        if (workingOnDir !== RNFS.DocumentDirectoryPath) {
            sheetOptions.push('Delete directory');
        }

        ActionSheetIOS.showActionSheetWithOptions({
            options: sheetOptions,
            cancelButtonIndex: 0
        }, (buttonIndex) => {
            if (buttonIndex === 1 || buttonIndex === 2) {
                const promptTitle = buttonIndex === 1
                    ? 'Enter directory name'
                    : 'Enter file name';
                const message = buttonIndex === 1
                    ? ''
                    : 'File name must be include with extension. Eg: test.txt';

                AlertIOS.prompt(
                    promptTitle,
                    message,
                    text => {
                        if (text.length) {
                            if (buttonIndex === 1) {
                                RNFS.mkdir(`${workingOnDir}/${text}`)
                                    .then(() => this._doLoadData())
                                    .catch(() => {
                                        Alert.alert('Cannot create directory');
                                    })
                            } else {
                                RNFS.writeFile(`${workingOnDir}/${text}`, '')
                                    .then(() => this._doLoadData())
                                    .catch(() => {
                                        Alert.alert('Cannot create file');
                                    });
                            }
                        }
                    }
                );
            } else if (buttonIndex === 3) {
                FileHelper.unlink(workingOnDir);

                navigation.goBack();
            }
        });
    };

    _getWorkDirectory = () => {
        const {navigation} = this.props;
        const item = navigation.getParam('item');

        return item ? item.path : RNFS.DocumentDirectoryPath;
    };

    _doReload(): void {
        this._doLoadData();
    }

    _doRender(): React.ReactNode {
        const {layoutType, items} = this.state;

        return (
            <View style={styles.container}>
                <ItemList
                    data={items}
                    isGrid={layoutType === 'grid'}
                    navigation={this.props.navigation}
                />
                <View style={styles.buttonFloat}>
                    <ButtonIcon
                        name={'box'}
                        color={'#FFF'}
                        style={styles.buttonCircle}
                        onPress={this._showActionSheets}
                    />
                </View>
            </View>
        );
    }

    constructor(props) {
        super(props);

        this.state = {
            ...this.state,
            layoutType: UserSettings.get('listViewType'),
            items: []
        };
    }

    componentDidMount(): void {
        AppEvent.addListener(AppEventNames.LayoutListGridChanged, this._listGridDidChanged);

        this._doLoadData();
    }

    componentWillUnmount(): void {
        AppEvent.removeListener(AppEventNames.LayoutListGridChanged, this._listGridDidChanged);
    }
}

FinderScreen.navigationOptions = ({navigation}) => {
    const item = navigation.getParam('item');
    return {
        title: item ? item.name : 'Finder',
        headerRight: (<ListGridSwitcher/>)
    }  
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    buttonFloat: {
        position: 'absolute',
        bottom: 20,
        right: 20
    },
    buttonCircle: {
        backgroundColor: 'red',
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0},
        shadowRadius: 10,
        shadowOpacity: 0.4
    }
});
