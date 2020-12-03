import ThemesManager from "@managers/themes.manager"; // TODO: move to managers (or modules)
import TrayModule from "@menus/tray.menu";
import HotkeyManager from "@managers/hotkey.manager";
import { app } from "electron";

// TODO: do smth with async?
app.on('ready', async () => {
  try {
    await ThemesManager.parseFolders();
    TrayModule.activate();
    HotkeyManager.registerLockHotkey();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
});

app.on('window-all-closed', () => {
  // do nothing
});
