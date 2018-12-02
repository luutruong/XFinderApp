import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';

type Props = {
    text?: String,
    textSize?: Number,
    textColor?: String,
    style?: Array | Object
};
export default class LoadingView extends React.PureComponent<Props> {
    render(): React.ReactNode {
        const { text, style, textSize, textColor } = this.props;
        const defaultStyle = {
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1
        };

        const textStyles = {
            fontSize: textSize,
            color: textColor
        };

        return (
            <View style={[defaultStyle, style]}>
                <ActivityIndicator size={'large'} />
                <Text style={textStyles}>{text}</Text>
            </View>
        );
    }
}
LoadingView.defaultProps = {
    text: 'Loading...',
    textSize: 18,
    textColor: '#131313'
};
