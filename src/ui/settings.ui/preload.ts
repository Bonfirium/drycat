import { contextBridge, ipcRenderer } from 'electron'
import IpcUi from './index';

type MethodsMap = typeof IpcUi.methods;
type METHOD = keyof MethodsMap;
const methodsKey = ['getThemeFolderPath'];
const methods = Object.keys(IpcUi.methods);

function createCall<T extends METHOD>(event: T) {
    return (...args: Parameters<MethodsMap[T]>) => new Promise<ReturnType<MethodsMap[T]>>((resolve) => {
        // TODO? add some salt?
        ipcRenderer.once(event, (_, result) => { resolve(result); });
        ipcRenderer.send(event, args);
    });
}

type DefaultMethods = Record<PropertyKey, (...args: unknown[]) => unknown>; 
type Obj<T extends DefaultMethods> =
    Record<keyof T, (...args: Parameters<T[keyof T]>) => Promise<ReturnType<T[keyof T]>>>;
type NewMap = {
    [T in METHOD]: (...args: Parameters<MethodsMap[T]>) => Promise<ReturnType<MethodsMap[T]>>;
}
type aaa = Obj<typeof IpcUi.methods>;

const res: Partial<NewMap> = {};
function test<T extends METHOD>(method: T) {
    return createCall(method);
}
for (const method of Object.keys(IpcUi.methods)) {
    const key = method as METHOD;
    res[key] = test<typeof key>(key);
}
const obj = methods.reduce<NewMap>((proxy, method) => {
    proxy[method as METHOD] = createCall(method as METHOD);
    return proxy;
}, {});



// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// USE UI COMPILER
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!



// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
// contextBridge.exposeInMainWorld('ipc', {
//         send: (event: Event, data: IPayload) => {
//             ipcRenderer.send(event, data);
//         },
//         receive: (event: Event, cb: () => void) => {
//             ipcRenderer.on(event, (event, ...args) => func(...args));
//         }
//     }
// );
