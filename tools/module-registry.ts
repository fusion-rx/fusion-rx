export {};

declare global {
    interface Object {
        defineProperty(
            this: Object,
            property: PropertyKey,
            descriptor: PropertyDescriptor
        ): Object;
        $keys: () => string[];
        $values: <T = any>() => T[];
        $forEach: <T = any>(
            callbackfn: (key: string, value: T, index: number) => void
        ) => void;
        $map: <T = any, U = any>(
            callbackfn: (key: string, value: T, index: number) => U
        ) => U[];
    }
}

global.Object.defineProperty(Object.prototype, '$forEach', {
    value: function (
        callbackfn: (key: string, value: any, index: number) => void
    ) {
        let index = 0;
        for (const [key, value] of Object.entries(this)) {
            callbackfn(key, value, index);
            index++;
        }
    }
});

global.Object.defineProperty(Object.prototype, '$map', {
    value: function (
        callbackfn: (key: string, value: any, index: number) => any
    ): any[] {
        const toReturn: any[] = [];

        let index = 0;
        for (const [key, value] of Object.entries(this)) {
            toReturn.push(callbackfn(key, value, index));
            index++;
        }

        return toReturn;
    }
});

global.Object.defineProperty(Object.prototype, '$keys', {
    value: function (): string[] {
        return Object.keys(this);
    }
});

global.Object.defineProperty(Object.prototype, '$values', {
    value: function (): any[] {
        return Object.values(this);
    }
});
