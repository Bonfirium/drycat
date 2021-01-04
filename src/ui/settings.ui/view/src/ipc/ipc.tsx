import { IpcRenderer } from 'electron';
import type { Methods } from '../../../index';

declare interface Window {
    IPC: Methods;
}
declare const window: Window;


// TODO: User declarations only
// TODO: Create all code in preload

type a = Pick
export const IpcService = new class IpcService {
    private _methods: Methods;
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

    constructor() {
        this._methods = window.IPC;
    }

    call<T extends typeof this>(method: T)

    public send<T extends (...args: any[]) => any>(channel: string, event: string, params: Parameters<T>): Promise<ReturnType<T>> {
        return new Promise(resolve => {
            // ipcRenderer?.once(
                
            // );
        });
    }

}

