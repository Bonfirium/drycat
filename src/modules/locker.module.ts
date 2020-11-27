import ThemesManager from "@managers/themes.manager";
import TrayMenu from "@menus/tray.menu";
import { BrowserWindow, screen } from "electron";
import { exec } from "child_process";

class LockerModule {

    windows: BrowserWindow[] = [];

    private async _createWindow(htmlPath: string, { x, y, width, height }: Electron.Rectangle) {
        const window = new BrowserWindow({
            x, y, width, height,
            fullscreen: true,
            webPreferences: {
                contextIsolation: true
            },
        });
        // window.webContents.openDevTools();
        await window.loadFile(htmlPath);
        return window;
    }

    private async _createWindows() {
        const themeName = ThemesManager.readChoosedTheme(); // TODO: use store?
        const themeHtmlPath = ThemesManager.getThemeHtmlPath(themeName);
        for (const display of screen.getAllDisplays()) {
            this.windows.push(await this._createWindow(themeHtmlPath, display.bounds));
        }
    }

    private _removeWindows() {
        for (const window of this.windows) {
            window.destroy();
        }
    }

    private _useLocker() {
        exec('xtrlock', () => this._handleLockerExit());
    }

    // TODO: implement deactivateLock
    private _handleLockerExit() {
        this._removeWindows();
        TrayMenu.handleLockerActivatorChange(false);
    }

    async activateLock() {
        this._createWindows();
        this._useLocker();
        TrayMenu.handleLockerActivatorChange(true);
    }

}

export default new LockerModule();
