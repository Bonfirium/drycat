import { BrowserWindow, screen } from "electron";
import { IPosition, ISize } from '@interfaces';

// TODO? rename to ui helper
class UIManager {

    async createWindowFromHtmlPath(
        htmlPath: string,
        // { x, y, width, height,  }: ISize & IPosition,
        options: Electron.BrowserWindowConstructorOptions,
        additionalOptions: {
            devTools: boolean,
        } = {
            devTools: false,
        },
    ) {
        if (!options.webPreferences) options.webPreferences = { contextIsolation: true };
        const window = new BrowserWindow(options);
        if (additionalOptions.devTools) window.webContents.openDevTools();
        await window.loadFile(htmlPath);
        return window;
    }

    // TODO: if size > screenSize
    calculateCenterPosition(uiSize: ISize) {
        const { size: screenSize } = screen.getPrimaryDisplay();
        return {
            x: Math.floor((screenSize.width - uiSize.width) / 2),
            y: Math.floor((screenSize.height - uiSize.height) / 2),
        };
    }

    getDefaultPosition(): IPosition {
        const { size: screenSize } = screen.getPrimaryDisplay();
        return {
            x: Math.floor(screenSize.width * 0.25),
            y: Math.floor(screenSize.height * 0.25),
        };
    }

}

export default new UIManager();
