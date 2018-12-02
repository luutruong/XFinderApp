import React from 'react'
import {View, TextInput, StyleSheet, Text} from 'react-native'
import BaseScreen, {LoadingStates} from "../BaseScreen";
import RNFS from 'react-native-fs'
import EditFileToolbar, {EditFileToolbarType, EventEditFileToolbarPressed} from "./EditFileToolbar";
import AppEvent from "../../AppEvent";
import UserSettings from "../../data/UserSettings";
import FileHelper from "../../utils/FileHelper";

type Props = {
    navigation: Object
};
export default class EditFileScreen extends BaseScreen<Props> {
    _doReadFileContent = () => {
        const item = this.props.navigation.getParam('item');

        FileHelper.getContents(item.path)
            .then((contents) => this._setLoadingState(LoadingStates.Done, { contents }))
            .catch(() => this._setLoadingState(LoadingStates.Failed));
    };

    _onChangeText = (text) => this.setState({ contents: text });

    _stopAutoSave = () => {
        if (this._autoSave) {
            clearInterval(this._autoSave);
            this._autoSave = 0;
        }
    };
    _enableAutoSave = () => {
        const autoSaveInterval = UserSettings.get('autoSaveInterval');
        if (autoSaveInterval > 0) {
            this._autoSave = setInterval(() => {
                this._onToolbarEvent(EditFileToolbarType.Save);
            }, autoSaveInterval * 1000);
        }
    };

    _onToolbarEvent = (type: EditFileToolbarType) => {
        const {navigation} = this.props;
        const item = navigation.getParam('item');

        switch (type) {
            case EditFileToolbarType.Save: {
                const {contents} = this.state;
                RNFS.writeFile(item.path, contents);

                this.setState({ isSaved: true });
                setTimeout(() => this.setState({ isSaved: false }), 3000);
            }
                break;
            case EditFileToolbarType.Delete:
                FileHelper.unlink(item.path);
                navigation.goBack();
                break;
        }
    };

    _doReload(): void {
        this._doReadFileContent();
    }

    _doRender(): React.ReactNode {
        const {contents, isSaved} = this.state;
        const savedTextStyles = [styles.savedFloat, {
            bottom: isSaved ? 20 : -50
        }];

        return (
            <View style={styles.container}>
                <TextInput
                    placeholder={'Enter contents...'}
                    autoCapitalize={'none'}
                    multiline={true}
                    autoCorrect={false}
                    autoFocus={true}
                    onChangeText={this._onChangeText}
                    style={styles.input}
                    value={contents}
                />
                <Text style={savedTextStyles}>Saved</Text>
            </View>
        );
    }

    constructor(props) {
        super(props);

        this.state = {
            ...this.state,
            contents: '',
            isSaved: false
        };

        this._didFocus = null;
        this._didBlur = null;
        this._autoSave = 0;
    }

    componentDidMount(): void {
        this._doReadFileContent();
        AppEvent.addListener(EventEditFileToolbarPressed, this._onToolbarEvent);

        const {navigation} = this.props;
        this._didFocus = navigation.addListener('didFocus', () => {
            this._enableAutoSave();
        });
        this._didBlur = navigation.addListener('didBlur', () => {
           this._stopAutoSave();
        });
    }

    componentWillUnmount(): void {
        this._didFocus.remove();
        this._didBlur.remove();

        this._stopAutoSave();

        AppEvent.removeListener(EventEditFileToolbarPressed, this._onToolbarEvent);
    }
}

EditFileScreen.navigationOptions = ({navigation}) => {
    const item = navigation.getParam('item');

    return {
        title: item.name,
        headerRight: (<EditFileToolbar mode={'edit'}/>)
    };
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10
    },

    input: {
        fontSize: 18
    },

    savedFloat: {
        position: 'absolute',
        bottom: -50,
        right: 20,
        backgroundColor: '#000',
        color: '#FFF',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 5,
        overflow: 'hidden'
    }
});