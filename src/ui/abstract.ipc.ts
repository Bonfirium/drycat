import { app } from "electron";
import AbstractUi from './abstract.ui';
import { IpcMainEvent, ipcMain } from "electron/main";

interface IEvent {
    name: string
}

type Constructor<T extends AbstractUi> = new (...args: any[]) => Ctor<T>;

type Ctor<T> = {
    new(...args: any[]): T;
    prototype: T
}


function reg() {

}

// export function registerIpc(channelName: string) {
//     return function <T extends Ctor<AbstractUi>>(constructor: Constructor<AbstractUi>) {
//         const instance = class extends constructor {
//             channel = channelName;
//             as = reg();

//             create() {
//                 super
//             }

//             handle(event: Electron.IpcMainEvent, request: unknown) {

//             }
//         }
//     }
// }

// TODO: use constant event
export function requestable<T extends AbstractUiWithIpc>(eventName?: string) {
    return function (
        target: T,
        propertyKey: string,
        descriptor: PropertyDescriptor,
    ) {
        console.log(target, propertyKey, descriptor);
        app.on
    }
}

type Event = { name: string, fn: Function };

export default abstract class AbstractUiWithIpc extends AbstractUi {
    channel: string = 'test';
    private _events: Event[] = [];

    async create() {
        console.log('creation', this.channel);
        await super.create();
        ipcMain.on(this.channel, (event, ...args: any[]) => {
            if (event.sender.id !== this._window.webContents.id) return;
            console.log(args);
        });
        this._window.on('closed', () => ipcMain.removeHandler(this.channel));
    }

    handeIpcEvent(event: Electron.Event, channel: string, ...args: any[]) {

    }
}
