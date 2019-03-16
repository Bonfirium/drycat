const { app, BrowserWindow } = require('electron')
const { exec } = require('child_process');
const windows = [];

// FIXME: refactor parameters
function createWindow (rendererPath, { x, y, width, height }) {
	const window = new BrowserWindow({
		x, y, width, height,
		fullscreen: true,
	})
	const index = windows.push(window);
	window.loadFile(rendererPath)

	window.on('closed', () => {
		windows.splice(index, 1);
	})
}

function createWindows() {
	const rendererPath = require('./renderer');
	const { screen } = require('electron');
	for (const display of screen.getAllDisplays()) {
		createWindow(rendererPath, display.bounds)
	}
}

function lockScreen() {
	exec('xtrlock', () => app.quit());
}

app.on('ready', () => {
	lockScreen();
	createWindows();
});

// Quit when all windows are closed.
app.on('window-all-closed', function () {
	app.quit()
})
