import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type Props = {
    message: String
};
export default class MessageView extends React.PureComponent<Props> {
    render(): React.ReactNode {
        const { message } = this.props;
        return (
            <View style={styles.container}>
                <Text style={styles.text}>{message}</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    text: {
        fontSize: 18,
        color: '#131313',
        opacity: 0.8
    }
});
