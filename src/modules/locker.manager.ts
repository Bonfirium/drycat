import { app, BrowserWindow, screen, Tray, Menu, MenuItem } from "electron";
import ThemesManager from "@modules/themes.manager";

async function createWindow(htmlPath: string, { x, y, width, height }: Electron.Rectangle) {
    const window = new BrowserWindow({
        x, y, width, height,
        fullscreen: true,
    });
    // window.webContents.openDevTools();
    await window.loadFile(htmlPath);
    return window;
}

async function createWindows() {
    const themeHtmlPath = ThemesManager.getThemeHtmlPath("default");
    for (const display of screen.getAllDisplays()) {
        createWindow(themeHtmlPath, display.bounds)
    }
}
