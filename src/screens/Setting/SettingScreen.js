import React from 'react'
import {View, SectionList, StyleSheet,ActionSheetIOS} from 'react-native'
import UserSettings from "../../data/UserSettings";
import SettingRow from "./SettingRow";

const sections = [
    {
        title: 'General',
        data: [
            {
                title: 'Default list view',
                dataKey: 'listViewType',
                onPress: () => {
                    const sheetOptions = [
                        'Cancel',
                        'List',
                        'Grid'
                    ];
                    ActionSheetIOS.showActionSheetWithOptions({
                        options: sheetOptions,
                        cancelButtonIndex: 0
                    }, buttonIndex => {
                        const listViewType = buttonIndex === 1 ? 'list' : 'grid';
                        UserSettings.set('listViewType', listViewType);
                    });
                }
            },
            {
                title: 'Auto save interval',
                hint: 'The number of seconds to automatically save file while editing',
                dataKey: 'autoSaveInterval',
                dataFormat: '{value}s',
                onPress: () => {
                    const sheetOptions = [
                        'Cancel',
                        '5 seconds',
                        '10 seconds',
                        '15 seconds',
                        '30 seconds',
                        '60 seconds'
                    ];

                    ActionSheetIOS.showActionSheetWithOptions({
                        options: sheetOptions,
                        cancelButtonIndex: 0
                    }, buttonIndex => {
                        let intervalSecs = 30;
                        if (buttonIndex === 1) {
                            intervalSecs = 5;
                        } else if (buttonIndex === 2) {
                            intervalSecs = 10;
                        } else if (buttonIndex === 3) {
                            intervalSecs = 15;
                        } else if (buttonIndex === 5) {
                            intervalSecs = 60;
                        }

                        UserSettings.set('autoSaveInterval', intervalSecs);
                    });
                }
            }
        ]
    },
    {
        title: 'App Info',
        data: [
            {
                title: 'Review app'
            },
            {
                title: 'Tell a friend'
            },
            {
                title: 'Version'
            }
        ]
    }
];

type Props = {
    navigation: Object
};
export default class SettingScreen extends React.Component<Props> {
    _doRenderItem = ({item}) => {
        return <SettingRow item={item}/>
    };

    render() {
        const sectionListProps = {};
        const ItemSeparator = () => <View style={styles.separator}/>;

        return (
            <View style={styles.container}>
                <SectionList
                    sections={sections}
                    renderItem={this._doRenderItem}
                    keyExtractor={(item, index) => item + index}
                    ItemSeparatorComponent={ItemSeparator}
                    {...sectionListProps}
                />
            </View>
        );
    }
}

SettingScreen.navigationOptions = () => {
    return {
        title: 'Settings'
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    },

    separator: {
        width: '100%',
        height:1,
        backgroundColor: '#ddd'
    }
});