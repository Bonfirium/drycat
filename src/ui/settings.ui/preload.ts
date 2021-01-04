import { contextBridge, ipcRenderer } from 'electron'
import IpcUi from './index';

type Promisify<T extends (...args: any) => any> = (...args: Parameters<T>) => Promise<ReturnType<T>>;
type MethodsMap = typeof IpcUi.methods;
type METHOD = keyof MethodsMap;

const methods = Object.keys(IpcUi.methods) as METHOD[];

function createCall<T extends METHOD>(event: T) {
    return function(...args: Parameters<MethodsMap[T]>): Promise<ReturnType<MethodsMap[T]>> {
        return new Promise<ReturnType<MethodsMap[T]>>((resolve) => {
            // TODO? add some salt?
            ipcRenderer.once(event, (_, result) => { resolve(result); });
            ipcRenderer.send(event, args);
        });
    };
}

type NewMap = {
    [T in METHOD]: Promisify<MethodsMap[T]>;
}

const obj = methods.reduce<NewMap>((proxy, method) => {
    proxy[method as METHOD] = createCall(method) as Promisify<MethodsMap[METHOD]>;
    return proxy;
}, {} as NewMap);

contextBridge.exposeInMainWorld('ipc', obj);
