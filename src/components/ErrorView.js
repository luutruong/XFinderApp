import React from 'react';
import { View, Text } from 'react-native';
import Button from './Button';

type Props = {
    onRetry: Function,
    text?: String,
    textSize?: Number,
    textColor?: String,
    style: Array | Object
};
export default class ErrorView extends React.PureComponent<Props> {
    render(): React.ReactNode {
        const { text, style, textSize, textColor, onRetry } = this.props;
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
                <Text style={textStyles}>{text}</Text>
                <Button
                    title={'Try again'}
                    onPress={onRetry}
                    disabled={false}
                />
            </View>
        );
    }
}
ErrorView.defaultProps = {
    text: 'Whoops! Something went wrong.',
    textSize: 18,
    textColor: '#131313'
};
