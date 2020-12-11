import LockModule from "@modules/locker.module";
import { globalShortcut } from "electron";

class HotkeyManager {
    register(accelerator: Electron.Accelerator, handler: () => void) {
        globalShortcut.register(accelerator, handler);
    }

    registerLockHotkey() {
        // TODO: fetch from store
        // TODO: use constants
        this.register("ctrl+alt+B", () => LockModule.activateLock());
    }
}

export default new HotkeyManager();
