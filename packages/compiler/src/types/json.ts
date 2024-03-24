export type JSONObject = { [key: string]: JSONValue };

export type JSONValue =
    | null
    | void
    | boolean
    | number
    | string
    | Array<JSONValue>
    | JSONObject;
