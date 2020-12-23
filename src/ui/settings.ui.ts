import AbstractUi from './abstract.ui';
import { resolveUiPath } from '@utils';

class SettingsUi extends AbstractUi {
    path = resolveUiPath('settings');
    size = { width: 600, height: 800 };
}

export default new SettingsUi();
