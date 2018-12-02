import React from 'react'
import {View, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, Platform, Text} from 'react-native'

type Props = {
    title: String,
    onPress: Function,
    disabled: boolean,
    textColor?: String,
    textStyle?: Array | Object
};
export default class Button extends React.PureComponent<Props> {
    render() {
        const Touchable = Platform.OS === 'ios' ? TouchableOpacity : TouchableWithoutFeedback;
        const {onPress, disabled, title, children, textColor, style, textStyle} = this.props;

        const buttonStyles = [styles.button, style];
        const textStyles = [styles.text, textStyle];
        if (textColor) {
            if (Platform.OS === 'ios') {
                textStyles.push({color: textColor});
            } else {
                buttonStyles.push({backgroundColor: textColor});
            }
        }
        const accessibilityStates = [];
        if (disabled) {
            buttonStyles.push(styles.buttonDisabled);
            textStyles.push(styles.textDisabled);
            accessibilityStates.push('disabled');
        }
        const formattedTitle =
            Platform.OS === 'android' ? title.toUpperCase() : title;
        const titleComponent =
            formattedTitle ? <Text style={textStyles} disabled={disabled}>{formattedTitle}</Text> : null;

        return (
            <Touchable
                onPress={() => onPress()}
                disabled={disabled}
                accessibilityLabel={title}
                accessibilityStates={accessibilityStates}
                accessibilityRole="button"
            >
                <View style={buttonStyles}>
                    {children}
                    {titleComponent}
                </View>
            </Touchable>
        );
    }
}

const styles = StyleSheet.create({
    button: Platform.select({
        ios: {},
        android: {
            elevation: 4,
            // Material design blue from https://material.google.com/style/color.html#color-color-palette
            backgroundColor: '#2196F3',
            borderRadius: 2,
        },
    }),
    text: Platform.select({
        ios: {
            // iOS blue from https://developer.apple.com/ios/human-interface-guidelines/visual-design/color/
            color: '#007AFF',
            textAlign: 'center',
            padding: 8,
            fontSize: 18,
        },
        android: {
            color: 'white',
            textAlign: 'center',
            padding: 8,
            fontWeight: '500',
        },
    }),
    buttonDisabled: Platform.select({
        ios: {},
        android: {
            elevation: 0,
            backgroundColor: '#dfdfdf',
        },
    }),
    textDisabled: Platform.select({
        ios: {
            color: '#cdcdcd',
        },
        android: {
            color: '#a1a1a1',
        },
    }),
});