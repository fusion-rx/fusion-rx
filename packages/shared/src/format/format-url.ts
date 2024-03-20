import QueryString from 'qs';

export function formatURL(
    protocol: 'http' | 'https',
    hostname: string,
    path?: string | string[],
    query?: Record<string, any>
): string;

export function formatURL(
    protocol: 'http' | 'https',
    hostname: string,
    port?: number,
    path?: string | string[],
    query?: Record<string, any>
): string;

export function formatURL(
    protocol: 'http' | 'https' | string,
    hostname: string,
    ...args: any[]
) {
    protocol = protocol + '://';

    let port: string = '';
    let path: string = '';
    let query: string = '';

    args.forEach((arg) => {
        switch (typeof arg) {
            case 'string':
                path = arg.startsWith('/') ? arg : '/' + arg;
                break;
            case 'object':
                if (Array.isArray(arg)) {
                    path = '/' + arg.join('/');
                } else {
                    query = '?' + QueryString.stringify(arg);
                }
                break;
            case 'number':
                port = ':' + arg;
        }
    });

    return protocol + hostname + port + path + query;
}
