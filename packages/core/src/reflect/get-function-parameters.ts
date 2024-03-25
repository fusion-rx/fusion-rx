import 'reflect-metadata';

export const getFunctionParameters = (target: any, key: string | symbol) =>
    (Reflect.getMetadata('design:paramtypes', target, key) ?? []).map(
        (val: any) => {
            return (val.toString() as string)
                .split(' ')[1]
                .replace('()', '')
                .toLowerCase();
        }
    );
