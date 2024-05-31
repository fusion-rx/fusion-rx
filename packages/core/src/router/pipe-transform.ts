/**
 * Implement interface to transform values in inbound http requests.
 *
 * @publicApi
 */
export interface PipeTransform<T = any> {
    transform(value: string): T;
}
