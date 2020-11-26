import ThemesManager from "@modules/themes.manager";
import IconsManager from "@modules/icons.manager";
import { app, Tray, Menu, MenuItem } from "electron";


// TODO: implement errors catching
class TrayMenu {

    tray: Tray;
    trayMenu: Menu;
    themesMenu: Menu;

    activate() {
        const iconPath = IconsManager.tray.path;
        this.tray = new Tray(iconPath);
        this.trayMenu = new Menu();
        this.trayMenu.append(this.createThemesMenu());
        this.refreshMenu();
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

    refreshMenu() {
        this.tray.setContextMenu(this.trayMenu);
    }

    handleThemeChange(name: string) {
        for (const item of this.themesMenu.items) {
            if (item.label !== name) continue;
            item.checked = true;
            this.refreshMenu();
            break;
        }
    }

    

}

export default new TrayMenu();

