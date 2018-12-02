import React from 'react';
import { ActionSheetIOS, FlatList, Dimensions } from 'react-native';
import MessageView from './MessageView';
import ListGridItem from './ListGridItem';
import ListRowItem from './ListRowItem';
import { NavigationActions } from 'react-navigation';
import FileHelper from '../utils/FileHelper';

type Props = {
    navigation: Object,
    isGrid?: boolean,
    itemProps?: Object
};
export default class ItemList extends React.PureComponent<Props> {
    _renderItem = ({ item }) => {
        const { isGrid, itemProps } = this.props;

        const ItemComponent = isGrid ? ListGridItem : ListRowItem;
        return (
            <ItemComponent
                onPress={() => this._onItemPress(item)}
                item={item}
                {...itemProps}
            />
        );
    };

    _onItemPress = (item) => {
        const { navigation } = this.props;

        if (item.isDirectory()) {
            navigation.dispatch(
                NavigationActions.navigate({
                    routeName: 'Finder',
                    key: `Finder_${item.path}`,
                    params: {
                        item: item
                    }
                })
            );

            return;
        }

        const sheetOptions = [
            'Cancel',
            'View file',
            'Delete file',
            'Share file'
        ];
        if (FileHelper.isEditable(item.path)) {
            sheetOptions.push('Edit file');
        }
        sheetOptions.sort();

        ActionSheetIOS.showActionSheetWithOptions(
            {
                options: sheetOptions,
                cancelButtonIndex: 0
            },
            (buttonIndex) => {
                const sheetOptionText = sheetOptions[buttonIndex];
                switch (sheetOptionText) {
                    case 'Delete file':
                        FileHelper.unlink(item.path);
                        this._doLoadData();
                        break;
                    case 'Share file':
                        break;
                    case 'View file':
                        navigation.dispatch(
                            NavigationActions.navigate({
                                routeName: 'ViewFile',
                                key: `ViewFile_${item.path}`,
                                params: {
                                    item: item
                                }
                            })
                        );
                        break;
                    case 'Edit file':
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
                }
            }
        );
    };

    render(): React.ReactNode {
        const { data, isGrid } = this.props;

        const flatListProps = {
            windowSize: Dimensions.get('window').width,
            numColumns: isGrid ? 3 : 1
        };

        const ListEmptyComponent = () => (
            <MessageView message={'There are no directories or files'} />
        );
        if (data.length === 0) {
            flatListProps.contentContainerStyle = {
                justifyContent: 'center',
                alignItems: 'center',
                flex: 1
            };
        }

        return (
            <FlatList
                renderItem={this._renderItem}
                keyExtractor={(item) => item.path}
                ListEmptyComponent={ListEmptyComponent}
                {...flatListProps}
                {...this.props}
            />
        );
    }
}
