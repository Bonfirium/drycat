import AbstractUiWithIpc from '../abstract.ipc';
export declare class SettingsUi extends AbstractUiWithIpc {
    path: any;
    url: string;
    size: {
        width: number;
        height: number;
    };
    static methods: {
        getThemeFolderPath(flag: boolean): string;
    };
}
export declare const METHODS: {
    getThemeFolderPath(flag: boolean): string;
};
export declare const CHANNEL: string;
export declare type IpcEventData<T extends (...args: any[]) => any> = {
    request: Parameters<T>;
    response: ReturnType<T>;
};
