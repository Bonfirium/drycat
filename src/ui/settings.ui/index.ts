import AbstractUi from '../abstract.ui';
import AbstractUiWithIpc, { requestable } from '../abstract.ipc';
import { resolveUiPath } from '@utils';
import { IChlen } from './IChlen'

export default class SettingsUi extends AbstractUiWithIpc {
    path = resolveUiPath('settings');
    url = 'http://localhost:3000'
    size = { width: 800, height: 600 };

    static methods = {
        chlen(t: IChlen): IChlen {
            return { test: true };
        },

        getThemeFolderPath(flag: boolean): string {
            if (flag) return '/app/true.md';
            else return '/home/false.doc';
        }
    }
}

export type Methods = typeof SettingsUi.methods;
