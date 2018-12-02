import RNFS from 'react-native-fs'

export default class FileHelper {
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
            .then(() => {})
            .catch(() => {});
    }
}