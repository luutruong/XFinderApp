import React from 'react'
import {Platform} from 'react-native'
import Icon from 'react-native-vector-icons/Feather';
import Button from "./Button";

type Props = {
    name: String,
    size?: Number,
    color?: String
};
export default class ButtonIcon extends React.PureComponent<Props> {
    render() {
        const {name, size, color, title} = this.props;
        const iconStyle = [];
        if (title) {
            iconStyle.push({
                marginRight: 5
            });
        }

        return (
            <Button title={''} {...this.props}>
                <Icon name={name} size={size} color={color} style={iconStyle} />
            </Button>
        );
    }
}

ButtonIcon.defaultProps = {
    size: 25,
    color: Platform.OS === 'ios' ? '#007AFF' : 'white'
};
