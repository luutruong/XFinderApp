import React from 'react'
import {View, StyleSheet} from 'react-native'
import ButtonIcon from "../../components/ButtonIcon";
import AppEvent from "../../AppEvent";

export const EventEditFileToolbarPressed = 'EventEditFileToolbarPressed';
export const EditFileToolbarType = Object.freeze({
    Save: 'save',
    Delete: 'delete',
    Edit: 'edit'
});

type EditFileToolbarMode = 'edit' | 'view';
type Props = {
    mode: EditFileToolbarMode
};
export default class EditFileToolbar extends React.PureComponent<Props> {
    _onPress = (type: EditFileToolbarType) => {
        AppEvent.dispatch(EventEditFileToolbarPressed, type);
    };

    render(): React.ReactNode {
        const {mode} = this.props;

        const buttonModes = [];
        if (mode === 'edit') {
            buttonModes.push({
                icon: 'save',
                type: EditFileToolbarType.Save
            });
        } else if (mode === 'view') {
            buttonModes.push({
                icon: 'edit-2',
                type: EditFileToolbarType.Edit
            });
        }

        return (
            <View style={styles.container}>
                {buttonModes.map(item => {
                    return <ButtonIcon key={item.icon} name={item.icon} onPress={() => this._onPress(item.type)}/>
                })}
                <ButtonIcon
                    name={'trash-2'}
                    onPress={() => this._onPress(EditFileToolbarType.Delete)}
                />
            </View>
        );
    }
}
const styles = StyleSheet.create({
     container: {
         marginRight: 10,
         flexDirection: 'row',
         width: 60,
         justifyContent: 'space-between'
     }
});