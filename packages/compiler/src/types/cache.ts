import type { Readable } from 'stream';

export declare interface Cache {
    ensure(): Promise<void>;
    has(key: string): Promise<boolean>;
    get<T>(key: string): Promise<T | null | undefined>;
    set(key: string, value: unknown): Promise<void>;
    getStream(key: string): Readable;
    setStream(key: string, stream: Readable): Promise<void>;
    getBlob(key: string): Promise<Buffer>;
    setBlob(key: string, contents: Buffer | string): Promise<void>;
    hasLargeBlob(key: string): Promise<boolean>;
    getLargeBlob(key: string): Promise<Buffer>;
    setLargeBlob(
        key: string,
        contents: Buffer | string,
        options?: {
            signal?: AbortSignal;
        }
    ): Promise<void>;
    getBuffer(key: string): Promise<Buffer | null | undefined>;

    /**
     * In a multi-threaded environment, where there are potentially multiple Cache
     * instances writing to the cache, ensure that this instance has the latest view
     * of the changes that may have been written to the cache in other threads.
     */
    refresh(): void;
}