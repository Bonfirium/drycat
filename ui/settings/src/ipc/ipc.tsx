import { IpcRenderer } from 'electron';

export const IpcService = new class IpcService {
    private _ipc?: IpcRenderer;
    get ipc() {
        if (!this._ipc) {
            if (!window || !window.process || !window.require) {
                throw new Error(`Unable to require renderer process`);
            }
            this._ipc = window.require('electron').ipcRenderer;
        }
        return this._ipc;
    }


    public send<T extends (...args: any[]) => any>(channel: string, event: string, params: Parameters<T>): Promise<ReturnType<T>> {
        return new Promise(resolve => {
            // ipcRenderer?.once(
                
            // );
        });
    }

}

