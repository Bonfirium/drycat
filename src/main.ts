import { app } from "electron";
import ThemesManager from "@managers/themes.manager"; // TODO: move to managers (or modules)
import TrayModule from "@menus/tray.menu";

// TODO: do smth with async?
app.on('ready', async () => {
  try {
    await ThemesManager.parseFolders();
    TrayModule.activate();
    // await createWindows();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
});
