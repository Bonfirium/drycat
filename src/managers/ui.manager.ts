import { BrowserWindow, screen } from "electron";
import { IPosition, ISize } from '@interfaces';

// TODO? rename to ui helper
class UIManager {

    createWindowFromHtmlPath(
        htmlPath: string,
        options: Electron.BrowserWindowConstructorOptions,
    ) {
        return this._create(`file://${htmlPath}`, options);
    }

    createWindowFromUrl(url: string, options: Electron.BrowserWindowConstructorOptions) {
        return this._create(url, options);
    }

    private async _create(
        url: string,
        options: Electron.BrowserWindowConstructorOptions,
    ) {
        if (!options.webPreferences) options.webPreferences = { contextIsolation: true };
        if (!options.x && !options.y) options.center = true;
        options.show = false;
        const window = new BrowserWindow(options);
        await window.loadURL(url);
        window.show();
        return window;
    }

    

}

export default new UIManager();
