import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import LoadingView from '../components/LoadingView';
import ErrorView from '../components/ErrorView';

export const LoadingStates = Object.freeze({
    Begin: 'begin',
    Done: 'done',
    Failed: 'failed'
});

export default class BaseScreen extends React.PureComponent {
    state = {
        loadingState: LoadingStates.Begin
    };

    _doRender(): ?React.ReactNode {
        throw new Error('Children must be implemented!');
    }

    _doReload(): void {
        throw new Error('Children must be implemented!');
    }

    _setLoadingState(
        state: LoadingStates.Begin | LoadingStates.Done | LoadingStates.Failed,
        otherStates: Object = {}
    ): void {
        this.setState({
            loadingState: state,
            ...otherStates
        });
    }

    _getLoadingText(): String {
        return 'Loading...';
    }

    render(): React.ReactNode {
        const { loadingState } = this.state;
        let childrenComponent;

        if (loadingState === LoadingStates.Begin) {
            childrenComponent = <LoadingView text={this._getLoadingText()} />;
        } else if (loadingState === LoadingStates.Done) {
            childrenComponent = this._doRender();
        } else if (loadingState === LoadingStates.Failed) {
            childrenComponent = <ErrorView onRetry={() => this._doReload()} />;
        } else {
            throw new Error(`Unknown load state value: ${loadingState}`);
        }

        return (
            <SafeAreaView style={styles.container}>
                {childrenComponent}
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF'
    }
});
