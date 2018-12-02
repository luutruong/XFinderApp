import React from 'react'
import {AppContainer} from "./AppRoutes";
import UserSettings from "./data/UserSettings";
import LoadingView from "./components/LoadingView";

export default class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isInitializing: true
        };
    }

    componentDidMount(): void {
        const initialized = () => this.setState({ isInitializing: false });

        UserSettings.initialize()
            .then(initialized)
            .catch(initialized);
    }

    render() {
        const {isInitializing} = this.state;
        if (isInitializing) {
            return <LoadingView/>;
        }

        return <AppContainer />;
    }
}