import { IpcRenderer } from 'electron';
import { IpcEventData } from '../../../../src/ui/settings.ui';

const IpcService = new class IpcService {
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


    public send<T>(chanel: string, event: string, params: unknown[]): Promise<T> {
        return new Promise(resolve => {
            // ipcRenderer?.once(
                
            // );
        });
    }

}

type ArrayElement<A> = A extends readonly (infer T)[] ? T : never
type MethodObject<
  T extends string[],
  K extends { [k in ArrayElement<T>]: IpcEventData<(...args: any[]) => any> },
> = Record<ArrayElement<T>, (...args: K[ArrayElement<T>]['request']) => K[ArrayElement<T>]['response']>

export class Ipc<
    T extends string[],
    K extends { [k in ArrayElement<T>]: IpcEventData<(...args: any[]) => any> },
> {
    channel: string;
    private _methods: MethodObject<T, K>;

    call<W extends ArrayElement<T>>(method: W) {
      return this._methods[method] as (...args: K[W]['request']) => K[W]['response'];
    }

    constructor(channel: string, methods: T) {
        this.channel= channel;
        type MD = MethodObject<T, K>;
        this._methods = methods.reduce<MD>((obj: MD, method: string) => {
        obj[method as ArrayElement<T>] = this._handle.bind(this, method as ArrayElement<T>);
        return obj;
        }, {} as MD);
    }

    private _handle<W extends ArrayElement<T>>(method: W, ...args: K[W]['request']): Promise<K[W]['response']> {
        return IpcService.send(this.channel, method, args);
    }

}
