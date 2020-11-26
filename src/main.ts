import { app } from "electron";
import ThemesManager from "@modules/themes.manager"; // TODO: move to managers (or modules)
import TrayModule from "@modules/tray.module";

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

app.on('window-all-closed', function () {
  app.quit()
})
