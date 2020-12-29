import AbstractUi from './abstract.ui';
import AbstractUiWithIpc, { requestable } from './abstract.ipc';
import { resolveUiPath } from '@utils';

const GET_THEME_FOLDER_PATH: 'GET_THEME_FOLDER_PATH' = 'GET_THEME_FOLDER_PATH';

class SettingsUi extends AbstractUiWithIpc {
    path = resolveUiPath('settings');
    url = 'http://localhost:3000'
    size = { width: 800, height: 600 };

    @requestable(GET_THEME_FOLDER_PATH)
    getThemeFolderPath() {
        return 'fuckThemeFolder';
    }
}

export default new SettingsUi();

export type IpcEventData<T extends (...args: any[]) => any> = {
    request: Parameters<T>;
    response: ReturnType<T>;
}

export const METHODS = [GET_THEME_FOLDER_PATH];

export type METHODS_DATA = {
    [GET_THEME_FOLDER_PATH]: IpcEventData<SettingsUi['getThemeFolderPath']>;
}
