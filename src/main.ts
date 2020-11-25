import { app, BrowserWindow, screen } from "electron";
import ThemesManager from "./themes";

async function createWindow(htmlPath: string, { x, y, width, height }: Electron.Rectangle) {
  const window = new BrowserWindow({
    x, y, width, height,
    fullscreen: true,
  });
  window.webContents.openDevTools();
  await window.loadFile(htmlPath);
  return window;
}

async function createWindows() {
  const themes = await ThemesManager.parseFolders();
  const themeHtmlPath = ThemesManager.getThemeHtmlPath("default");
	for (const display of screen.getAllDisplays()) {
		createWindow(themeHtmlPath, display.bounds)
	}
}

// TODO: do smth with async?
app.on('ready', async () => {
  try {
    await createWindows();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }

});

app.on('window-all-closed', function () {
	app.quit()
})
