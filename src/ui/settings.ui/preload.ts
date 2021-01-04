import AbstractUiWithIpc from '@uis/abstract.ipc';
import { contextBridge, ipcRenderer } from 'electron'

type Promisify<T extends (...args: any) => any> = (...args: Parameters<T>) => Promise<ReturnType<T>>;
type cl = {
    new(): any;
    // prototype: {
        methods: Record<string, (...args: any) => any>;
    // }
}

export function createPreload<T extends Record<string, (...args: any) => any>>(target: T) {
    console.log('process === undefined', process === undefined)
    console.log('!process', !process)
    console.log("process.type === 'renderer'", process.type === 'renderer')
    console.log('-----------')
    const mmm = process === undefined || !process || process.type === 'renderer';
    if (!mmm) return;
    console.log('FUUUUCK');
    // type MethodsMap = T['prototype']['methods'];
    type MethodsMap = T;
    type METHOD = keyof MethodsMap;

    const methods = Object.keys(target) as METHOD[];

    function createCall<K extends METHOD>(event: K) {
        return function(...args: Parameters<MethodsMap[K]>): Promise<ReturnType<MethodsMap[K]>> {
            return new Promise<ReturnType<MethodsMap[K]>>((resolve) => {
                // TODO? add some salt?
                ipcRenderer.once(event as string, (_, result) => { resolve(result); });
                ipcRenderer.send(event as string, args);
            });
        };
    }

    type NewMap = {
        [T in METHOD]: Promisify<MethodsMap[T]>;
    }

    const ipcMethods = methods.reduce<NewMap>((proxy, method) => {
        proxy[method as METHOD] = createCall(method) as Promisify<MethodsMap[METHOD]>;
        return proxy;
    }, {} as NewMap);

    contextBridge.exposeInMainWorld('ipc', ipcMethods);

    return ipcMethods;
}
