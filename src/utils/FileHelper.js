import RNFS from 'react-native-fs';
import Container from '../Container';
import { AsyncStorage } from 'react-native';
import AppEvent, { AppEventNames } from '../AppEvent';

const updateRecentFiles = (path: string, isDelete: boolean) => {
    let recentFiles = Container.getItem('recentFiles');
    if (!Array.isArray(recentFiles)) {
        recentFiles = [];
    }

    if (isDelete) {
        recentFiles = recentFiles.filter((p) => {
            return p !== path;
        });
    } else {
        recentFiles = recentFiles.filter((p) => p !== path);
        recentFiles.push(path);
    }

    const totalLength = recentFiles.length;
    const maxRecentFiles = 30;

    if (totalLength > maxRecentFiles) {
        recentFiles = recentFiles.splice(totalLength - maxRecentFiles);
    }

    Container.setItem('recentFiles', recentFiles);
    AsyncStorage.setItem('recentFiles', JSON.stringify(recentFiles))
        .then(() => {})
        .catch(() => {});
};

export default class FileHelper {
    static getRecentFiles(): Promise {
        return new Promise((resolve, reject) => {
            AsyncStorage.getItem('recentFiles')
                .then((jsonText) => JSON.parse(jsonText))
                .then((json) => {
                    const items = Array.isArray(json) ? json : [];
                    Container.setItem('recentFiles', items);

                    resolve(items);
                })
                .catch(reject);
        });
    }

    static sizeToKB(size: Number): String {
        if (size < 1) {
            return '0 KB';
        }

        const sizeInKB = size / 1024;
        return `${sizeInKB.toFixed(2)} KB`;
    }

    static sizeToGB(size: Number): String {
        if (size < 1) {
            return '0 GB';
        }

        const sizeInMB = size / (1024 * 1024 * 1024);
        return `${sizeInMB.toFixed(2)} GB`;
    }

    static isEditable(path: String): boolean {
        const parts = path.split('.');
        const extension = parts[parts.length - 1];

        return this.allowAddFileExts().indexOf(extension.toLowerCase()) !== -1;
    }

    static unlink(path: String): void {
        RNFS.unlink(path)
            .then(() => {
                updateRecentFiles(path, true);
                AppEvent.dispatch(AppEventNames.FileSystemChanged);
            })
            .catch(() => {});
    }

    static getContents(path): Promise {
        return new Promise((resolve, reject) => {
            RNFS.readFile(path)
                .then((contents) => {
                    updateRecentFiles(path, false);
                    resolve(contents);
                })
                .catch(reject);
        });
    }

    static makeDirectory(name: String, path: String): Promise {
        return new Promise((resolve, reject) => {
            RNFS.mkdir(`${path}/${name}`)
                .then(() => {
                    AppEvent.dispatch(AppEventNames.FileSystemChanged);
                    resolve();
                })
                .catch(reject);
        });
    }

    static createFile(name: String, path: String): Promise {
        return new Promise((resolve, reject) => {
            if (!name.length) {
                reject(new Error('Invalid file name'));

                return;
            }

            if (name.indexOf('.') === -1) {
                reject(new Error('Invalid file name'));

                return;
            }

            const parts = name.split('.');
            const fileExt = parts[parts.length - 1];

            if (this.allowAddFileExts().indexOf(fileExt.toLowerCase()) === -1) {
                reject(new Error('Disallow file extension'));

                return;
            }

            RNFS.writeFile(`${path}/${name}`, '')
                .then(() => {
                    AppEvent.dispatch(AppEventNames.FileSystemChanged);
                    resolve();
                })
                .catch(reject);
        });
    }

    static renameFile(path: String, toName: String): Promise {
        return new Promise((resolve, reject) => {
            const parts = path.split('/');
            parts.pop();

            const workOnDir = parts.join('/');

            RNFS.copyFile(path, `${workOnDir}/${toName}`)
                .then(() => {
                    this.unlink(path);
                    resolve();
                })
                .catch(reject);
        });
    }

    static allowAddFileExts(): Array {
        return [
            'txt',
            'php',
            'html',
            'js',
            'md',
            'css',
            'log',
            'json',
            'h',
            'm',
            'cpp',
            'swift',
            'sh'
        ];
    }
}
