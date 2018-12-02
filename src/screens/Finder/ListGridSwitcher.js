import React from 'react'
import {} from 'react-native'
import ButtonIcon from "../../components/ButtonIcon";
import AppEvent, {AppEventNames} from "../../AppEvent";
import UserSettings from "../../data/UserSettings";

export default class ListGridSwitcher extends React.PureComponent {
    state = {
        layoutType: UserSettings.get('listViewType')
    };

    _doToggleList = () => {
        const layoutType = this.state.layoutType === 'grid' ? 'list' : 'grid';
        this.setState({ layoutType });

        AppEvent.dispatch(AppEventNames.LayoutListGridChanged, layoutType);
    };

    render(): React.ReactNode {
        const {layoutType} = this.state;
        const style = {marginRight: 10};

        return <ButtonIcon
            name={layoutType === 'list' ? 'grid' : 'list'}
            onPress={this._doToggleList}
            size={27}
            style={style}
        />;
    }
}