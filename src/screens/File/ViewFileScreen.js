import React from 'react'
import {Text, StyleSheet, ScrollView} from 'react-native'
import BaseScreen, {LoadingStates} from "../BaseScreen";
import EditFileToolbar, {EditFileToolbarType, EventEditFileToolbarPressed} from "./EditFileToolbar";
import RNFS from 'react-native-fs'
import AppEvent from "../../AppEvent";
import {NavigationActions} from "react-navigation";
import FileHelper from "../../utils/FileHelper";

type Props = {
    navigation: Object
};
export default class ViewFileScreen extends BaseScreen<Props> {
    _doReadFileContents = () => {
        const {navigation} = this.props;
        const item = navigation.getParam('item');

        RNFS.readFile(item.path)
            .then((contents) => this._setLoadingState(LoadingStates.Done, { contents }))
            .catch(() => this._setLoadingState(LoadingStates.Failed));
    };

    _onToolbarPressed = (type) => {
        const {navigation} = this.props;
        const item = navigation.getParam('item');

        switch (type) {
            case EditFileToolbarType.Edit:
                navigation.dispatch(
                    NavigationActions.navigate({
                        routeName: 'EditFile',
                        key: `EditFile_${item.path}`,
                        params: {
                            item: item
                        }
                    })
                );

                break;
            case EditFileToolbarType.Delete:
                FileHelper.unlink(item.path);

                navigation.goBack();
                break;
        }
    };

    _doReload(): void {
        this._doReadFileContents();
    }

    _doRender(): React.ReactNode {
        const {contents} = this.state;

        return (
            <ScrollView style={styles.container}>
                <Text style={styles.textContent}>{contents}</Text>
            </ScrollView>
        );
    }

    constructor(props) {
        super(props);

        this.state = {
            ...this.state,
            contents: ''
        };

        this._didFocus = null;
    }

    componentDidMount(): void {
        const {navigation} = this.props;
        this._didFocus = navigation.addListener('didFocus', () => {
            this._doReadFileContents();
        });

        AppEvent.addListener(EventEditFileToolbarPressed, this._onToolbarPressed);
    }

    componentWillUnmount(): void {
        AppEvent.removeListener(EventEditFileToolbarPressed, this._onToolbarPressed);
        this._didFocus.remove();
    }
}

ViewFileScreen.navigationOptions = ({navigation}) => {
    const item = navigation.getParam('item');

    return {
        title: item.name,
        headerRight: (<EditFileToolbar mode={'view'}/>)
    };
};

const styles = StyleSheet.create({
   container: {
       flex: 1,
       padding: 10
   },

    textContent: {
       fontSize: 18
    }
});