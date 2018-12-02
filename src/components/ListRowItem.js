import React from 'react';
import {
    View,
    TouchableOpacity,
    StyleSheet,
    Text,
    Dimensions
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import moment from 'moment';
import FileHelper from '../utils/FileHelper';

const { width } = Dimensions.get('window');

type Props = {
    onPress: Function,
    item: Object,
    showModifiedTime?: boolean,
    showFileSize?: boolean
};
export default class ListRowItem extends React.PureComponent<Props> {
    render(): React.ReactNode {
        const { onPress, item, showFileSize, showModifiedTime } = this.props;
        const metaTexts = [];

        if (showModifiedTime) {
            metaTexts.push(moment(item.mtime).fromNow());
        }
        if (showFileSize && item.isFile()) {
            metaTexts.push(FileHelper.sizeToKB(item.size));
        }

        if (
            item.hasOwnProperty('getMetaData') &&
            typeof item.getMetaData === 'function'
        ) {
            item.getMetaData().forEach((metaText) => metaTexts.push(metaText));
        }

        return (
            <TouchableOpacity onPress={() => onPress()}>
                <View style={styles.container}>
                    <Icon
                        name={item.isFile() ? 'file-text' : 'folder'}
                        size={30}
                    />
                    <View style={styles.main}>
                        <Text>{item.name}</Text>
                        <Text style={styles.meta}>{metaTexts.join(' - ')}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}
ListRowItem.defaultProps = {
    showFileSize: true,
    showModifiedTime: true
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: width,
        flexDirection: 'row',
        padding: 10
    },

    main: {
        width: width - 60,
        marginLeft: 10
    },
    meta: {
        fontSize: 11,
        color: 'rgba(0,0,0,.6)'
    }
});
