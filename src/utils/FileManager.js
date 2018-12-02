import FileHelper from './FileHelper';
import { AlertIOS } from 'react-native';
import { NavigationActions } from 'react-navigation';

export default class FileManager {
    static getActions(item: Object): Array {
        const baseActions = ['View file', 'Delete file', 'Rename file'];

        if (item.isFile() && FileHelper.isEditable(item.path)) {
            baseActions.push('Edit file');
        }

        baseActions.sort();
        return baseActions;
    }

    static handleAction(
        actionText: String,
        item: Object,
        navigation: Object
    ): void {
        switch (actionText) {
            case 'Delete file':
                FileHelper.unlink(item.path);
                break;
            case 'Rename file':
                {
                    AlertIOS.prompt('Enter new file name', null, (text) => {
                        if (!text.length) {
                            AlertIOS.alert('Please enter valid file name');

                            return;
                        }

                        FileHelper.renameFile(item.path, text)
                            .then(() => {})
                            .catch(() => AlertIOS.alert('Cannot rename file'));
                    });
                }
                break;
            case 'View file':
                navigation.dispatch(
                    NavigationActions.navigate({
                        routeName: 'ViewFile',
                        key: `ViewFile_${item.path}`,
                        params: {
                            item: item
                        }
                    })
                );
                break;
            case 'Edit file':
                navigation.dispatch(
                    NavigationActions.navigate({
                        routeName: 'EditFile',
                        key: `EditFile_${item.path}`,
                        params: {
                            item: item
                        }
                    })
                );
                break;
        }
    }
}
