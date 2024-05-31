import { FsnRouterError } from './router-error.js';
import { RouteProviderMetadataFacade } from './router-facade-interface.js';
import { FsnRequest, ParamType } from './router-types.js';

/**
 * Extracts arguments from an incoming HTTP request.
 * @param args The arguments for a decorated `@Route` function
 * @param req An incoming express request
 * @returns The arguments extracted from the request
 */
export const extractProvidersFromReq = (
    req: FsnRequest,
    args: RouteProviderMetadataFacade[] = []
) => {
    return args.map((arg) => {
        if (arg.type === 'body') {
            const body = req.body;

            if (!body && !arg.optional) {
                throw new FsnRouterError(
                    'BadRequest',
                    'Expected a body, but did not receive one.'
                );
            }

            return body;
        }

        const paramVal = req[arg.type][arg.urlOrQueryParamName];

        if (!paramVal && !arg.optional) {
            throw new FsnRouterError(
                'BadRequest',
                `Expected ${arg.type} parameter ${arg.urlOrQueryParamName}, received none.`
            );
        }

        if (arg.pipeTransform) {
            try {
                return arg.pipeTransform.transform(<any>paramVal);
            } catch (e) {
                // Should an error be thrown here?
                console.error(
                    'Failed to parse argument with pipeTransform. Falling back to default value.'
                );
            }
        }

        return paramVal;
    });
};

/**
 * Parses a url or query parameters object.
 * @param received The received params object
 * @param expected The expected parameters mapped to their types for parsing
 */
export const parseParams = (
    received: Record<string, any>,
    expected?: Record<string, ParamType>
) => {
    if (!expected) return received;

    /**
     * Parses an params individually.
     * @param type The param's expected type
     * @param value The value to parse
     */
    const parseParamValue = (type: ParamType, value: string) => {
        if (value === null || value === undefined) return undefined;
        switch (type) {
            case 'array':
                return value.split(',');
            case 'string[]':
                return value.split(',');
            case 'number[]':
                return value.split(',').map((val) => Number.parseInt(val));
            case 'boolean[]':
                return value.split(',').map((val) => val === 'true');
            case 'boolean':
                return value === 'true';
            case 'number':
                return Number.parseInt(value);
            default:
                return value;
        }
    };

    const parsed: Record<string, any> = {};

    Object.keys(expected).forEach((paramKey) => {
        const type = expected[paramKey];
        if (type) parsed[paramKey] = parseParamValue(type, received[paramKey]);
    });

    return parsed;
};
