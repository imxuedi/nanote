/**
 * @author Kuitos
 * @since 2020-04-13
 */
type AppInstance = {
    name: string;
    window: WindowProxy;
};
/**
 * get the app that running tasks at current tick
 */
export declare function getCurrentRunningApp(): AppInstance | null;
export declare function setCurrentRunningApp(appInstance: {
    name: string;
    window: WindowProxy;
} | null): void;
export declare const overwrittenGlobals: string[];
export declare const scopedGlobals: string[];
export declare function getTargetValue(target: any, value: any): any;
export {};
