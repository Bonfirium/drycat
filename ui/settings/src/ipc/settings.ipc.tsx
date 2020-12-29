// import { METHODS, CHANNEL } from '../../../../src/ui/settings.ui';
// import { IpcRenderer } from 'electron';
// import { IpcService } from './ipc';

// type A<T extends keyof typeof METHODS> = typeof METHODS[T]

// export const methods = new Proxy(METHODS, {
//     // get<T extends keyof typeof METHODS>(property: T) {
//     get<T extends keyof typeof METHODS>(target: typeof METHODS, property: T) {
//         return (parameters: Parameters<A<T>>) =>
//             IpcService.send<A<T>>(CHANNEL, property, parameters);
//     }
// })

export {}
