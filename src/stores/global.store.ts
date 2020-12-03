import * as Store from "electron-store";

interface IGlobalStore {
    themeChoosed: string;
}

// TODO: stores migrations
// TODO: change app name to save into DryCat folder
// TODO: use abstracts;
// TODO: use KEY CONSTANTS
class GlobalStore {
    store = new Store<IGlobalStore>({
        name: "global",
        schema: {
            themeChoosed: {
                type: "string",
                default: "default",
            },
        },
    });

    
}

export default new GlobalStore();
