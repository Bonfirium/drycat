import AbstractUi from '../abstract.ui';
import AbstractUiWithIpc, { requestable } from '../abstract.ipc';
import { resolveUiPath } from '@utils';
import { IChlen } from './IChlen'
import { createPreload } from './preload';

const methods = {
    chlen(t: IChlen): IChlen {
        console.log('fuck!!')
        return { test: true };
    },

    getThemeFolderPath(flag: boolean): string {
        if (flag) return '/app/true.md';
        else return '/home/false.doc';
    }
};
type Function<P = unknown, R = unknown> = (...args: P[]) => R;
type Promisify<T extends Function> = Function<Parameters<T>, Promise<ReturnType<T>>>
type aaaa<T extends Record<string, Function>> = {
    [k in keyof T]: Promisify<T[k]>;
}
// type NewMap = {
//     [T in METHOD]: Promisify<MethodsMap[T]>;
// }
export type SettingsUiMethods = aaaa<typeof methods>;
class SettingsUi extends AbstractUiWithIpc {
    path = resolveUiPath('settings');
    url = 'http://localhost:3000'
    size = { width: 800, height: 600 };
    methods = methods;
    
}

export default new SettingsUi();

createPreload(methods);

