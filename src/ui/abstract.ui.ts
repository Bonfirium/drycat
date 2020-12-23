import UIManager from '@managers/ui.manager';
import { ISize, IPosition } from '@interfaces';
import { BrowserWindow } from 'electron';

abstract class AbstractUi {
    abstract path: string;
    abstract size: ISize;
    private _position: IPosition;
    _window: BrowserWindow | undefined;

    get position() {
        if (!this._position) this._position = UIManager.calculateCenterPosition(this.size);
        return this._position
    }

    set position(value: IPosition) {
        this._position = value;
    }

    async show() {
        console.log(this.path);
        if (this._window) this._window.focus();
        else this._window = await UIManager.createWindowFromHtmlPath(this.path, { ...this.position, ...this.size });
    }

    async close() {
        if (this._window) this._window.close();
        else throw new Error('window can not be closed');
    }
}


export default AbstractUi;
