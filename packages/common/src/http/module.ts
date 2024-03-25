import { FsnModule } from '@fusion-rx/core';
import { FetchBackend } from './fetch';
import { HttpClient } from './client';

// export const HTTP_BACKEND = '__http-backend__';

/**
 * Provides injection context for HttpClient.
 * @publicApi
 */
@FsnModule({
    providers: [HttpClient, FetchBackend],
    exports: [HttpClient]
})
export class HttpClientModule {
    /**
     * TODO
     * Allows for the creation of an HttpClientModule with a custom
     * HttpBackend.
     * @param backend A custom HttpBackend. Defaults to {@link FetchBackend}.
     * @returns An HttpClientModule with a custom HttpBackend
     */
    // forRoot(backend: Provider = FetchBackend): DynamicModule {
    //     return {
    //         module: HttpClientModule,
    //         providers: [
    //             HttpClient,
    //             {
    //                 provide: HTTP_BACKEND,
    //                 useExisting: backend
    //             }
    //         ]
    //     };
    // }
}
