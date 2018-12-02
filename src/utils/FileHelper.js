import RNFS from 'react-native-fs';
import Container from '../Container';
import { AsyncStorage } from 'react-native';

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
        const existingIndex = recentFiles.indexOf(path);
        if (existingIndex !== -1) {
            recentFiles = recentFiles.splice(existingIndex, 1);
        }

        recentFiles.push(path);
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
                    Container.setItem('recentFiles', json);

                    resolve(json);
                })
                .catch(reject);
        });
    }

    static sizeToKB(size: Number) {
        if (size < 1) {
            return '0 KB';
        }

        const sizeInKB = size / 1024;
        return `${sizeInKB.toFixed(2)} KB`;
    }

    static isEditable(path: String) {
        const parts = path.split('.');
        const extension = parts[parts.length - 1];

        switch (extension) {
            case 'txt':
            case 'php':
            case 'md':
            case 'js':
            case 'css':
            case 'html':
                return true;
        }

        return false;
    }

    static unlink(path: String) {
        RNFS.unlink(path)
            .then(() => {
                updateRecentFiles(path, true);
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
        return RNFS.mkdir(`${path}/${name}`);
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
                .then(resolve)
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
