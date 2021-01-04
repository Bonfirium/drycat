import UIManager from '@managers/ui.manager';
import { ISize, IPosition } from '@interfaces';
import { BrowserWindow } from 'electron';
import { isProduction } from '@utils';

// TODO: refactor extends
abstract class AbstractUi {
    abstract path: string;
    abstract size: ISize;
    url: string | undefined;
    position?: IPosition | undefined;
    _window: BrowserWindow | undefined;
    webPreferences: Electron.WebPreferences = { nodeIntegration: true };

    constructor() {
        // this.show(); // TODO: unhandled rejections
    }

    async show() {
        if (this._window) this._window.show();
        else await this.create();
    }

    async create() {
        this._window = await this._create({ ...this.position, ...this.size, webPreferences: this.webPreferences });
        this._window.on('closed', () => { this._window = undefined; });
    }

    _create(options: Electron.BrowserWindowConstructorOptions) {
        console.log(isProduction(), this.url, this);
        return isProduction() || !this.url
            ? UIManager.createWindowFromHtmlPath(this.path, options)
            : UIManager.createWindowFromUrl(this.url, options);
    }

    async close() {
        if (this._window) this._window.close();
        else throw new Error('window can not be closed');
    }

}


export default AbstractUi;
