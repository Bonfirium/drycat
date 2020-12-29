import { METHODS, METHODS_DATA } from '../../../../src/ui/settings.ui';
import { Ipc } from './ipc';

const ipc = new Ipc<typeof METHODS, METHODS_DATA>("SETTINGS", METHODS);

