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

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width / 3;

type Props = {
    onPress: Function,
    item: Object
};
export default class ListGridItem extends React.PureComponent<Props> {
    render() {
        const { onPress, item } = this.props;

        return (
            <TouchableOpacity onPress={() => onPress()}>
                <View style={styles.container}>
                    <Icon
                        name={item.isFile() ? 'file-text' : 'folder'}
                        size={80}
                        color={'#000'}
                        style={styles.iconStyle}
                    />
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.metaText}>
                        {moment(item.mtime).fromNow()}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        width: ITEM_WIDTH,
        height: 120,
        padding: 5,
        justifyContent: 'center',
        alignItems: 'center'
    },

    iconStyle: {
        opacity: 0.6
    },

    name: {
        textAlign: 'center'
    },

    metaText: {
        fontSize: 11,
        color: 'rgba(0,0,0,0.6)'
    }
});
