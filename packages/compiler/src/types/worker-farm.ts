import { FilePath } from './alias';
import { BackendType } from './file-system';

export type FarmOptions = {
    maxConcurrentWorkers: number;
    maxConcurrentCallsPerWorker: number;
    forcedKillTime: number;
    useLocalWorker: boolean;
    warmWorkers: boolean;
    workerPath?: FilePath;
    backend: BackendType;
    shouldPatchConsole?: boolean;
    shouldTrace?: boolean;
};

export declare class WorkerFarm {
    constructor(options: FarmOptions);
    end(): Promise<void>;
}
