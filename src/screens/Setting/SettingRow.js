import React from 'react'
import {TouchableHighlight, View, Text, StyleSheet, Dimensions} from 'react-native'
import UserSettings from "../../data/UserSettings";
import AppEvent, {AppEventNames} from "../../AppEvent";

const {width} = Dimensions.get('window');

type Props = {
    item: Object
};
export default class SettingRow extends React.PureComponent<Props> {
    _onDataChanged = (data) => {
        const {item} = this.props;
        if (item.dataKey === data.name) {
            this.setState({ value: data.value });
        }
    };

    state = {
        value: null
    };

    componentDidMount(): void {
        AppEvent.addListener(AppEventNames.UserSettingsChanged, this._onDataChanged);
    }

    componentWillUnmount(): void {
        AppEvent.removeListener(AppEventNames.UserSettingsChanged);
    }

    render(): React.ReactNode {
        const {item} = this.props;
        const {value} = this.state;

        const textHintComponent =
            item.hint ? <Text style={styles.textHint}>{item.hint}</Text> : null;
        let _value = '';
        if (value !== null) {
            _value = value;
        } else if (item.dataKey) {
            _value = UserSettings.get(item.dataKey);
        }

        if (item.dataFormat) {
            _value = item.dataFormat.replace('{value}', _value);
        }

        return (
            <TouchableHighlight
                onPress={() => item.onPress()}
                underlayColor={'#f0f0f0'}
            >
                <View style={styles.item}>
                    <View style={styles.mainTextView}>
                        <Text style={styles.mainText}>{item.title}</Text>
                        {textHintComponent}
                    </View>
                    <Text style={styles.secondText}>{_value}</Text>
                </View>
            </TouchableHighlight>
        );
    }
}

const styles = StyleSheet.create({
    item: {
        padding: 10,
        flexDirection: 'row'
    },

    mainTextView: {
        width: width - 80
    },

    mainText: {
        fontSize: 18
    },
    secondText: {
        fontSize: 16,
        color: 'grey',
        width: 60,
        textAlign: 'right'
    },
    textHint: {
        fontSize: 13,
        color: 'grey'
    }
});