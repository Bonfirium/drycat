import ThemesManager from "@managers/themes.manager";
import IconsManager from "@managers/icons.manager";
import LockerModule from "@modules/locker.module";
import { Tray, Menu, MenuItem, app, globalShortcut } from "electron";


// TODO: implement errors catching
class TrayMenu {

    tray: Tray;
    trayMenu: Menu;
    themesMenu: Menu;
    lockerActivator: MenuItem;

    activate() {
        const iconPath = IconsManager.tray.path;
        this.tray = new Tray(iconPath);
        this.trayMenu = new Menu();
        this.trayMenu.append(this.createLockerActivator());
        this.trayMenu.append(this.createThemesMenu());
        this.trayMenu.append(this.createExit());
        this._refreshMenu();
        globalShortcut.register('Alt+Ctrl+B', () => {
            LockerModule.activateLock()
        });
    }

    createLockerActivator() {
        this.lockerActivator = new MenuItem({
            label: "Lock",
            click: () => LockerModule.activateLock(),
            type: "checkbox",
            checked: false,
        });
        return this.lockerActivator;
    }
    // TODO: allow duplicated names, use path to iterate
    // TODO: add preview
    createThemesMenu() {
        this.themesMenu = new Menu();
        const choosedTheme = ThemesManager.readChoosedTheme();
        for (const name of ThemesManager.themes) {
            this.themesMenu.append(new MenuItem({
                label: name,
                click: () => ThemesManager.changeTheme(name),
                type: "radio",
                checked: name === choosedTheme,
            }));
        }
        return new MenuItem({
            label: "Choose a theme",
            submenu: this.themesMenu,
        });
    }

    // TODO: refactor somehow
    createExit() {
        return new MenuItem({
            label: "Exit",
            click: () => app.exit(),
        });
    }

    private _refreshMenu() {
        this.tray.setContextMenu(this.trayMenu);
    }

    handleThemeChange(name: string) {
        for (const item of this.themesMenu.items) {
            if (item.label !== name) continue;
            item.checked = true;
            break;
        }
        this._refreshMenu();
    }

    handleLockerActivatorChange(status: boolean) {
        this.lockerActivator.checked = status;
        this._refreshMenu();
    }

}

export default new TrayMenu();

