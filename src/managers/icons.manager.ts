import { resolveAssetPath } from "@utils";

// TODO: check platform
// TODO: use .ico on windows
class Icon {
    path: string;

    constructor(fileName: string) {
        this.path = resolveAssetPath(fileName);
    }

}

class IconManager {
    tray = new Icon("cat-icon.png");
}

export default new IconManager();
