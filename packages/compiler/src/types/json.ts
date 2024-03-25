export declare type JSONObject = { [key: string]: JSONValue };

export declare type JSONValue =
    | null
    | void
    | boolean
    | number
    | string
    | Array<JSONValue>
    | JSONObject;
