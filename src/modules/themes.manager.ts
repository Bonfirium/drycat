import GlobalStore from "@stores/global.store";
import TrayModule from "@modules/tray.module";
import * as path from "path";
import { promises as fs } from "fs";
import { resolveThemePath } from "@utils";

// TODO: move to types
interface ThemeConfig {
    name: string
}

interface ThemesManagerConfig {
    choosed: string;
}

 // TODO: implement custom errors
 // TODO: implement default theme installation
class ThemesManager {
    private _themes: string[] = [];
    private _themesMap: Map<string, string> = new Map();

    public get themes() {
        if (this._themes.length === 0) throw new Error("Theme was not loaded");
        return this._themes;
    }

    // TODO: save dirent name instead of full path?
    // TODO: use promise.all for theme name fetching
    // TODO: duplicated theme name
    async parseFolders() { 
        for await (const dirent of await fs.opendir("./dist/themes")) {
            if (!dirent.isDirectory()) continue;
            const themePath = resolveThemePath(dirent.name);
            const config = await this.readThemeConfig(themePath);
            this._themes.push(config.name);
            this._themesMap.set(config.name, themePath);
        }
        return this.themes;
    }

    getThemeHtmlPath(name: string) {
        if (!this._themesMap.has(name)) throw new Error("Theme not found");      
        return path.resolve(this._themesMap.get(name), "index.html");
    }

    private async readThemeConfig(themePath: string): Promise<ThemeConfig> {
        const configPath = path.resolve(themePath, "config.json");
        return JSON.parse(await fs.readFile(configPath, "utf8"));
    }

    changeTheme(name: string) {
        this.saveChoosedTheme(name);
        console.log(GlobalStore.store.path);
        TrayModule.handleThemeChange(name);
    }

    saveChoosedTheme(name: string) {
        GlobalStore.store.set("themeChoosed", name); // TODO: use KEY CONSTANTS
    }

    readChoosedTheme() {
        return GlobalStore.store.get("themeChoosed");
    }

}

export default new ThemesManager();
