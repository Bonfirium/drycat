import AbstractUi from '../abstract.ui';
import AbstractUiWithIpc, { requestable } from '../abstract.ipc';
import { resolveUiPath } from '@utils';

export default class SettingsUi extends AbstractUiWithIpc {
    path = resolveUiPath('settings');
    url = 'http://localhost:3000'
    size = { width: 800, height: 600 };

    static methods = {
        getThemeFolderPath(flag: boolean): string {
            if (flag) return '/app/true.md';
            else return '/home/false.doc';
        }
    };
}
